precision mediump float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aVertexTexCoords;

uniform vec4 uColor;
uniform vec3 u_cameraPos;

uniform mat4 mMatrix;
uniform mat4 vMatrix;
uniform mat4 pMatrix;
uniform mat4 nMatrix;

uniform vec4 light_pos;
uniform vec4 ambient_coef;
uniform vec4 diffuse_coef;
uniform vec4 specular_coef;
uniform float shininess;

uniform vec4 light_ambient;
uniform vec4 light_diffuse;
uniform vec4 light_specular;

varying vec2 texCoord;
varying vec4 eye_pos;
varying vec3 v_normal;
varying vec4 vColor;
varying vec3 v_worldPos;
varying vec3 v_worldNormal;

void main(void) {
    gl_PointSize = 10.0;

    // transform vertex position to eye space
    eye_pos = vMatrix * mMatrix * vec4(aVertexPosition, 1.0);
    texCoord = aVertexTexCoords;

    v_normal = normalize(vec3(nMatrix * vec4(aVertexNormal, 0.0)));
    //v_normal = normalize(aVertexPosition.xyz);
    gl_Position = pMatrix * vMatrix * mMatrix *vec4(aVertexPosition, 1.0);
    vColor = uColor;

    // send world view position to fragment shader
    v_worldPos = (mMatrix * vec4(aVertexPosition, 1.0)).xyz;

    v_worldNormal = mat3(mMatrix) * aVertexNormal;
}