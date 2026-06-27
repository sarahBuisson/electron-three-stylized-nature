import * as THREE from "three";

const vertexShader = `
  uniform float time;
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    
    // Add some wind animation
    vec3 pos = position;
    float wind = sin(time * 2.0 + position.x * 0.5) * 0.1 * position.y;
    pos.x += wind;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  
  void main() {
    vec3 color = mix(vec3(0.2, 0.6, 0.1), vec3(0.7, 0.9, 0.2), vUv.y);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const GrassWindMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        time: { value: 0 },
    },
    side: THREE.DoubleSide,
    transparent: true,
});
