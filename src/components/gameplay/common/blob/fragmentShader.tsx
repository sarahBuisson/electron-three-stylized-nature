const fragmentShader = `
uniform float u_intensity;
uniform float u_time;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
varying vec3 vNormal;
varying vec2 vUv;
varying float vDisplacement;

void main() {

    float distort = 2.0 * vDisplacement * u_intensity * sin(vUv.y * 10.0 + u_time);
    vec3 color = vec3(abs(vUv - 0.5) * 2.0  * (1.0 - distort), 1.0) ;
 
    vec3 normalColor = normalize(vNormal) * 0.5 + 0.5;
    vec3 blendedColor = mix(uColor1, uColor2, normalColor.x);
    blendedColor = mix(blendedColor, uColor3, normalColor.y);
    gl_FragColor = vec4(blendedColor, 1.0);
}

`;

export default fragmentShader;
