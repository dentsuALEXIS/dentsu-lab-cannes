const vertexShader = `
  #ifdef GL_ES
    precision highp float;
  #endif

  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  #ifdef GL_ES
    precision highp float;
  #endif
  
  varying vec2 vUv;

  uniform sampler2D uTexture;

  void main () {
    #ifdef GL_ES
      precision highp float;
    #endif

    gl_FragColor = texture2D(uTexture, vUv);
  }
`

export { vertexShader, fragmentShader }
