export const combinedVertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying float vDistance;


void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  vUv = uv;
  
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vDistance = length(worldPosition.xyz - cameraPosition);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const combinedFragmentShader = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying float vDistance;

uniform sampler2D uTexture;
uniform vec3 uLightDirection;
uniform float uDistanceMin;
uniform float uDistanceMax;
uniform float uToonLevels;
uniform float uDistanceGradientMix;
uniform float uTextureMix;

void main() {
  vec3 texColor = texture2D(uTexture, vUv).rgb;
  vec3 lightDir = normalize(uLightDirection);
  float dotProduct = max(0.0, dot(vNormal, lightDir));
  float toonShading = floor(dotProduct * uToonLevels) / uToonLevels;
  vec3 litColor = texColor * (0.5 + 0.5 * toonShading);
  float distanceNorm = clamp((vDistance - uDistanceMin) / (uDistanceMax - uDistanceMin), 0.0, 1.0);
  float distanceGradient = 1.0 - distanceNorm;
  vec3 toonResult = litColor;
  vec3 finalColor = mix(toonResult, texColor * distanceGradient, uDistanceGradientMix);
  finalColor = mix(finalColor, texColor, uTextureMix);
  gl_FragColor = vec4(finalColor, 1.0);
}
`

