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
uniform sampler2D uTexture;
uniform vec3 color;

void main() {
  vec4 tex = texture2D(uTexture, vUv);
  if (tex.a < 0.01) discard;
   vec3 finalColor = tex.rgb + color;
  gl_FragColor = vec4( finalColor , tex.a);
}
`;

export const GrassSpriteWindMaterial= new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0xe004422) },
        uTexture: { value: new THREE.TextureLoader().load('./level/drawing/grass.png') },
    },
    side: THREE.DoubleSide,
    transparent: true,
});
