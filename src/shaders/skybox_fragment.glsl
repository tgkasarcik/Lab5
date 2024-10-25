// NOTE: inspired by https://webglfundamentals.org/webgl/lessons/webgl-skybox.html
precision mediump float;
 
uniform samplerCube cubemap;
uniform mat4 mvMatrix;
 
varying vec4 v_position;

void main() {
  vec4 t = mvMatrix * v_position;
  gl_FragColor = textureCube(cubemap, normalize(t.xyz / t.w));
}