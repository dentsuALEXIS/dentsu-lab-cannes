const vertexShader = `
  precision mediump float;

  varying vec2 vUv;

  void main () {
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  precision mediump float;

  uniform vec2 uMeshSize;
  uniform vec2 uImageSize;

  uniform sampler2D uTexture;

  varying vec2 vUv;

  vec2 uvCover (vec2 uv, vec2 size, vec2 resolution) {
    vec2 coverUv = uv;
    vec2 s = resolution; // Screen
    vec2 i = size; // Image

    float rs = s.x / s.y;
    float ri = i.x / i.y;
    vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
    vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
    
    coverUv = coverUv * s / new + offset;

    return coverUv;
  }

  void main() {
    vec2 ratio = vec2(min((uMeshSize.x / uMeshSize.y) / (uImageSize.x / uImageSize.y), 1.0), min((uMeshSize.y / uMeshSize.x) / (uImageSize.y / uImageSize.x), 1.0));
    vec2 uvScale = vec2(vUv.x * ratio.x + (1.0 - ratio.x) * 0.5, vUv.y * ratio.y + (1.0 - ratio.y) * 0.5);

    vec2 texCenter = vec2(0.5);
    vec2 texScale = (uvScale - texCenter) * 1.0 + texCenter;
    
    vec4 color = texture2D(uTexture, texScale);

    gl_FragColor = color;
  }
`

export { vertexShader, fragmentShader }
