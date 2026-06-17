varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying float vDistance;


void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  vUv = uv;

  // Calculate distance from camera for gradient effect
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vDistance = length(worldPosition.xyz - cameraPosition);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

