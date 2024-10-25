//NOTE: inspired by https://webglfundamentals.org/webgl/lessons/webgl-skybox.html
precision mediump float;

attribute vec3 aVertexPosition;
varying vec4 v_position;

void main() {
    v_position = vec4(aVertexPosition, 1.0);
    gl_Position = vec4(aVertexPosition.x, aVertexPosition.y, 1.0, 1.0);
}