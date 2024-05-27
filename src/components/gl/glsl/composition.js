import { fxaa } from './utils'

const vertexShaderComposition = `
  #ifdef GL_ES
    precision highp float;
  #endif

  varying vec2 vUv;
  varying vec2 v_rgbNW;
  varying vec2 v_rgbNE;
  varying vec2 v_rgbSW;
  varying vec2 v_rgbSE;
  varying vec2 v_rgbM;

  uniform vec2 uResolution;

  void main() {
    vUv = uv;

    vec2 fragCoord = uv * uResolution;
    vec2 inverseVP = 1.0 / uResolution.xy;

    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;
    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;
    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;
    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;
    v_rgbM = vec2(fragCoord * inverseVP);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShaderComposition = `
  #ifdef GL_ES
    precision highp float;
  #endif

  float PI = 3.1415926535897932384626433832795;

  varying vec2 vUv;
  varying vec2 v_rgbNW;
  varying vec2 v_rgbNE;
  varying vec2 v_rgbSW;
  varying vec2 v_rgbSE;
  varying vec2 v_rgbM;
  
  uniform sampler2D uTexture;
  uniform sampler2D uRipples;
  uniform vec2 uResolution;
  uniform vec3 uLevels;

  ${fxaa}

  vec3 gammaCorrect(vec3 color, float gamma) {
    return pow(color, vec3(1.0 / gamma));
  }

  vec3 levelRange(vec3 color, float minInput, float maxInput) {
    return min(max(color - vec3(minInput), vec3(0.0)) / (vec3(maxInput) - vec3(minInput)), vec3(1.0));
  }

  vec3 levels(vec3 color, float minInput, float gamma, float maxInput) {
    return gammaCorrect(levelRange(color, minInput, maxInput), gamma);
  } 

  void main() {    
    vec4 displacement = texture2D(uRipples, vUv);

    float theta = displacement.r * 2.0 * PI;

    vec2 direction = vec2(sin(theta), cos(theta));
    vec2 uv = vUv + direction * displacement.r * 0.05;

    vec2 fragCoord = uv * uResolution;   

    vec4 worldColor = fxaa(uTexture, fragCoord, uResolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);

    worldColor.rgb -= displacement.rgb / 5.0;

    gl_FragColor = worldColor;
  }
`

export { vertexShaderComposition, fragmentShaderComposition }
