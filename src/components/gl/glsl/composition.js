import { fxaa, noise } from './utils'

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
  ${noise}

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
    // mouse following trail
    vec4 displacementTexture = texture2D(uRipples, vUv);

    // update displace uv
    float theta = displacementTexture.r * 2.0 * PI;
    vec2 direction = vec2(sin(theta), cos(theta));

    vec2 uv = vUv + direction * displacementTexture.r * 0.025;
    // vec2 fragCoord = uv * uResolution;   

    vec2 displacementUv = uv;
    // rgb shift world
    vec4 displacementWorld = texture2D(uTexture, displacementUv);

    displacementUv.x += 0.0035;
    displacementUv.y += 0.0035;
    displacementWorld.g = texture2D(uTexture, displacementUv).g;

    displacementUv.x -= 0.007;
    displacementUv.y -= 0.007;
    displacementWorld.b = texture2D(uTexture, displacementUv).b;
    
    // basic render texture 
    vec4 basicWorld = texture2D(uTexture, uv);
    // vec4 basicWorld = fxaa(uTexture, fragCoord, uResolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
  
    // harden smoothness of displacement
    float step = smoothstep(0.0, 0.25, displacementTexture.r);
    
    // final composition
    vec4 finalColor = mix(basicWorld, displacementWorld, step);

    // add mouse following air to texture
    finalColor.rgb += displacementTexture.rgb / 7.5;

    // float f = noise(fract(uv) * 10.0);  

    gl_FragColor = finalColor;
    // gl_FragColor = vec4(vec3(step), 1.0);
  }
`

export { vertexShaderComposition, fragmentShaderComposition }
