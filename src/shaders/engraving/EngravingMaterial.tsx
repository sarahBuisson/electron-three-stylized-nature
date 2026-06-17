import { useRef } from 'react';
import { shaderMaterial, useTexture } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex Shader
const vertexShader = /* glsl */ `
varying vec3 vNormal;
varying vec2 vUv;
varying float depth;
varying vec3 vPosition;
varying float nDotVP;
varying vec3 pos;

uniform vec2 repeat;
uniform vec3 lightPosition;
uniform float showOutline;

void main() {
    float w = 1.;
    vec3 posInc = vec3( 0. );
    if( showOutline == 1. ) posInc = w * normal;

    vUv = repeat * uv;

    vec4 mvPosition = modelViewMatrix * vec4( position + posInc, 1.0 );
    vPosition = mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
    pos = gl_Position.xyz;

    vNormal = normalMatrix * normal;
    depth = ( length( position.xyz ) / 90. );
    depth = .5 + .5 * depth;

    nDotVP = max( 0., dot( vNormal, normalize( vec3( lightPosition ) ) ) );
}
`;

// Fragment Shader
const fragmentShader = /* glsl */ `

    uniform sampler2D hatch1;
    uniform sampler2D hatch2;
    uniform sampler2D hatch3;
    uniform sampler2D hatch4;
    uniform sampler2D hatch5;
    uniform sampler2D hatch6;
    uniform sampler2D paper;
    uniform vec2 resolution;
    uniform vec2 bkgResolution;
    uniform vec3 lightPosition;

    vec3 color = vec3( 1., 0., 1. );
    vec3 lightColor = vec3( 1. );

    varying vec2 vUv;
    varying vec3 vNormal;
    varying float depth;
    varying vec3 vPosition;
    varying float nDotVP;
    varying vec3 pos;

    uniform float ambientWeight;
    uniform float diffuseWeight;
    uniform float rimWeight;
    uniform float specularWeight;
    uniform float shininess;
    uniform int invertRim;
    uniform int solidRender;
    uniform float showOutline;
    uniform vec4 inkColor;

    vec4 shade() {

        float diffuse = nDotVP;
        float specular = 0.;
        float ambient = 1.;

        vec3 n = normalize( vNormal );

        vec3 r = -reflect(lightPosition, n);
        r = normalize(r);
        vec3 v = -vPosition.xyz;
        v = normalize(v);
        float nDotHV = max( 0., dot( r, v ) );

        if( nDotVP != 0. ) specular = pow ( nDotHV, shininess );
        float rim = max( 0., abs( dot( n, normalize( -vPosition.xyz ) ) ) );
        if( invertRim == 1 ) rim = 1. - rim;

        float shading = ambientWeight * ambient + diffuseWeight * diffuse + rimWeight * rim + specularWeight * specular;

        if( solidRender == 1 ) return vec4( shading );

        vec4 c;
        float step = 1. / 6.;
        if( shading <= step ){
            c = mix( texture2D( hatch6, vUv ), texture2D( hatch5, vUv ), 6. * shading );
        }
        if( shading > step && shading <= 2. * step ){
            c = mix( texture2D( hatch5, vUv ), texture2D( hatch4, vUv) , 6. * ( shading - step ) );
        }
        if( shading > 2. * step && shading <= 3. * step ){
            c = mix( texture2D( hatch4, vUv ), texture2D( hatch3, vUv ), 6. * ( shading - 2. * step ) );
        }
        if( shading > 3. * step && shading <= 4. * step ){
            c = mix( texture2D( hatch3, vUv ), texture2D( hatch2, vUv ), 6. * ( shading - 3. * step ) );
        }
        if( shading > 4. * step && shading <= 5. * step ){
            c = mix( texture2D( hatch2, vUv ), texture2D( hatch1, vUv ), 6. * ( shading - 4. * step ) );
        }
        if( shading > 5. * step ){
            c = mix( texture2D( hatch1, vUv ), vec4( 1. ), 6. * ( shading - 5. * step ) );
        }

        vec4 src = mix( mix( inkColor, vec4( 1. ), c.r ), c, .5 );
        //c = 1. - ( 1. - src ) * ( 1. - dst );
        //c = vec4( min( src.r, dst.r ), min( src.g, dst.g ), min( src.b, dst.b ), 1. );

        //c = vec4( gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y, 0., 1. );

        return src;
    }

    void main() {

        vec2 nUV = vec2( mod( gl_FragCoord.x, bkgResolution.x ) / bkgResolution.x, mod( gl_FragCoord.y, bkgResolution.y ) / bkgResolution.y );
        vec4 dst = vec4( texture2D( paper, nUV ).rgb, 1. );
        vec4 src;

        //if( showOutline == 1 ) src = .5 * inkColor;
        //else src = shade();
        src = ( .5 * inkColor ) * vec4( showOutline ) + vec4( 1. - showOutline ) * shade();

        vec4 c = src ;

        gl_FragColor = vec4( c.rgb, 1. );
    }

`;

// Create the shader material
const EngravingShaderMaterial = shaderMaterial(
  // Uniforms
  {
    showOutline: 0,
    ambientWeight: 0.08,
    diffuseWeight: 1.0,
    rimWeight: 0.46,
    specularWeight: 1.0,
    shininess: 49.0,
    invertRim: 0,
    inkColor: new THREE.Vector4(72 / 255, 72 / 255, 164 / 255, 1),
    solidRender: 0,
    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    bkgResolution: new THREE.Vector2(512, 512),
    lightPosition: new THREE.Vector3(-100, 100, 0),
    hatch1: null,
    hatch2: null,
    hatch3: null,
    hatch4: null,
    hatch5: null,
    hatch6: null,
    paper: null,
    repeat: new THREE.Vector2(1, 1),
  },
  // Vertex Shader
  vertexShader,
  // Fragment Shader
  fragmentShader
);

// Extend so we can use it in JSX
extend({ EngravingShaderMaterial });

// TypeScript declarations for JSX
declare module '@react-three/fiber' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface ThreeElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    engravingShaderMaterial: any;
  }
}

export interface EngravingMaterialProps {
  ambientWeight?: number;
  diffuseWeight?: number;
  rimWeight?: number;
  specularWeight?: number;
  shininess?: number;
  invertRim?: boolean;
  displayOutline?: boolean;
  solidRender?: boolean;
  inkColor?: [number, number, number];
  lightPosition?: [number, number, number];
  repeat?: [number, number];
  hatchTextures?: THREE.Texture[];
  paperTexture?: THREE.Texture;
}

/**
 * EngravingMaterial - A cross-hatching shader material for stylized rendering
 * Based on Microsoft Research "Real-Time Hatching" paper with Blinn-Phong shading and rim lighting
 *
 * @example
 * ```tsx
 * <mesh>
 *   <boxGeometry />
 *   <EngravingMaterial
 *     ambientWeight={0.08}
 *     diffuseWeight={1.0}
 *     rimWeight={0.46}
 *     inkColor={[72, 72, 164]}
 *   />
 * </mesh>
 * ```
 */
export const EngravingMaterial: React.FC<EngravingMaterialProps> = ({
  ambientWeight = 0.08,
  diffuseWeight = 1.0,
  rimWeight = 0.46,
  specularWeight = 1.0,
  shininess = 49.0,
  invertRim = false,
  displayOutline = false,
  solidRender = false,
  inkColor = [72, 72, 164],
  lightPosition = [-100, 100, 0],
  repeat = [1, 1],
  hatchTextures,
  paperTexture,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null);

  // Update uniforms on frame if needed
  useFrame(({ size }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.resolution.value.set(size.width, size.height);
    }
  });

  hatchTextures=
     [
         useTexture( './level/engraving/ray_0.jpg' ) ,
      useTexture( './level/engraving/ray_1.jpg'),
      useTexture( './level/engraving/ray_2.jpg'),
      useTexture( './level/engraving/ray_3.jpg'),
      useTexture( './level/engraving/ray_4.jpg'),
      useTexture( './level/engraving/ray_5.jpg'),]
    paperTexture =useTexture( './level/engraving/paper.jpg')

    return (
    <engravingShaderMaterial
      ref={materialRef}
      ambientWeight={ambientWeight}
      diffuseWeight={diffuseWeight}
      rimWeight={rimWeight}
      specularWeight={specularWeight}
      shininess={shininess}
      invertRim={invertRim ? 1 : 0}
      solidRender={solidRender ? 1 : 0}
      showOutline={displayOutline ? 1 : 0}
      inkColor={new THREE.Vector4(inkColor[0] / 255, inkColor[1] / 255, inkColor[2] / 255, 1)}
      lightPosition={new THREE.Vector3(lightPosition[0], lightPosition[1], lightPosition[2])}
      repeat={new THREE.Vector2(repeat[0], repeat[1])}
      hatch1={hatchTextures?.[0] || null}
      hatch2={hatchTextures?.[1] || null}
      hatch3={hatchTextures?.[2] || null}
      hatch4={hatchTextures?.[3] || null}
      hatch5={hatchTextures?.[4] || null}
      hatch6={hatchTextures?.[5] || null}
      paper={paperTexture || null}
    />
  );
};











