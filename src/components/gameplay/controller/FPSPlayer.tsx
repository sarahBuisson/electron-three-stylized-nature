import { PointerLockControls, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, useRapier, type RapierRigidBody } from "@react-three/rapier";
import React, { useEffect, useImperativeHandle, useRef } from "react";
import * as RAIPER from "@dimforge/rapier3d-compat";
import * as THREE from "three";
import { Euler, PointLightHelper, Vector3 } from "three";
import type { PointerLockControlsProps } from '@react-three/drei/core/PointerLockControls';

const SPEED = 3;
const direction = new THREE.Vector3(0, 0, 0);

export type FPSPlayerHandle = {
    moveTo: (position: Vector3, yaw?: number) => void;
};

export const FPSPlayer = ({ ref, ...props }: { position?: Vector3, rotation?: Euler, ref?: React.Ref<FPSPlayerHandle> })=>
{
    const position = props.position || new Vector3(0, 15, 0);
    const rotation = props.rotation || new Euler(0, 0, 0);
    const bodyRef = useRef<RapierRigidBody>(null);
    const controlRef = useRef<PointerLockControlsProps>(null);
    const playerCapsuleColliderRef = useRef<RAIPER.Collider>(null);
    const [, get] = useKeyboardControls();
    const rapier = useRapier();
    const camera = useThree((state) => state.camera);
    useImperativeHandle(ref, () => ({
        moveTo(position, yaw) {
            const body = bodyRef.current;
            if (!body) {
                throw new Error("Cannot move the player before its physics body is ready.");
            }
            body.setTranslation(position, true);
            body.setLinvel({ x: 0, y: 0, z: 0 }, true);
            camera.position.copy(position);
            if (yaw !== undefined) camera.rotation.set(0, yaw, 0, 'YXZ');
        }
    }), [camera]);
    useEffect(() => {
        if(controlRef.current?.camera)
        controlRef.current.camera.rotation.set(props.rotation?.x || 0, props.rotation?.y || 0, props.rotation?.z || 0);
    }, [controlRef]);

    useFrame((state, delta) => {
        const {forward, backward, left, right, jump, sprint} = get();
        const body = bodyRef.current;
        if (!body) return;
        // update camera position
        const bodyPos = body.translation();
        state.camera.position.set(bodyPos.x, bodyPos.y, bodyPos.z);

        // movement
        const speed = sprint ? SPEED * 3 : SPEED;
        const sideDir = Number(right) - Number(left);
        const frontDir = Number(backward) - Number(forward);
        direction
            .set(sideDir, 0, frontDir)
            .normalize()
            .multiplyScalar(speed)
            .applyEuler(state.camera.rotation);
        const velocity = body.linvel();
        body.setLinvel({x: direction.x, y: velocity.y, z: direction.z}, true);

        const maxToiColliderToGround = 1.5;
        const ray = new RAIPER.Ray(body.translation(), {x: 0, y: -1, z: 0});
        const hit = rapier.world.castRay(
            ray,
            maxToiColliderToGround,
            true,
            undefined,
            undefined,
            // filter out player capsule collider
            playerCapsuleColliderRef.current!
        );

        if (jump && hit) {
            body.applyImpulse(new THREE.Vector3(0, 9, 0), true);
        }
    });

    return (
        <>
            <PointerLockControls ref={controlRef}/>
            <RigidBody
                ref={bodyRef}
                colliders={false}
                mass={1}
                type="dynamic"
                position={position}
                rotation={rotation}
                enabledRotations={[false, false, false]}
            >
                <CapsuleCollider args={[0.75, 0.5]} ref={playerCapsuleColliderRef}/>
                <mesh>
                    <boxGeometry args={[1, 1.5, 1]}/>
                    <meshStandardMaterial color="blue"/>
                </mesh>
            </RigidBody>

        </>
    );
}
