precision mediump float;

uniform mat4 mvMatrix;
uniform mat4 pMatrix;
uniform mat4 nMatrix;

uniform vec4 uColor;
uniform sampler2D uTexture;
uniform int textureEnabled;
uniform int cubemapEnabled;
uniform samplerCube cubemap;
uniform vec3 u_cameraPos;

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

    vec4 light_pos_in_eye_space = light_pos;

    // light vector L = l-p
    vec3 light_vector = normalize(vec3(light_pos_in_eye_space - eye_pos));

    // // eye vector V = e-p
    vec3 eye_vector = normalize(-vec3(eye_pos));

    vec4 ambient = ambient_coef * light_ambient;
    float ndotl = max(dot(v_normal, light_vector), 0.0);

    vec4 diffuse = diffuse_coef * light_diffuse * ndotl;

    vec3 R = normalize(vec3(reflect(-light_vector, v_normal)));
    float rdotv = max(dot(R, eye_vector), 0.0);

    vec4 specular;
    if(ndotl > 0.0) {
        specular = specular_coef * light_specular * pow(rdotv, shininess);
    } else {
        specular = vec4(0, 0, 0, 1);
    }

    vec4 cubemapColor;
    if(cubemapEnabled == 1) {
        vec3 worldNormal = normalize(v_worldNormal);
        vec3 eyeToSurfaceDir = normalize(v_worldPos - u_cameraPos);
        vec3 direction = reflect(eyeToSurfaceDir, worldNormal);
        cubemapColor = textureCube(cubemap, direction);
    }

    if(textureEnabled > 0) {
        vec4 texColor = texture2D(uTexture, texCoord);

        // texture only
        if(textureEnabled == 1) {
            if(cubemapEnabled == 1) {
                gl_FragColor = (ambient + diffuse) * (cubemapColor + (0.8 * texColor)) + specular;
            } else {
                gl_FragColor = (ambient + diffuse) * texColor + specular;
            }
        } 
        // texture and color
        else if(textureEnabled == 2) {
            if(cubemapEnabled == 1) {
                gl_FragColor = cubemapColor + (0.25 * vColor) + (0.25 * texColor) + specular;
            } else {
                gl_FragColor = (ambient + diffuse) * ((0.4 * vColor) + texColor) + specular;
            }
        }

    // color only
    } else {
        if (cubemapEnabled == 1) {
            gl_FragColor = (0.25 * vColor) + cubemapColor + specular;
        } else {
            gl_FragColor = (ambient + diffuse) * vColor + specular;
        }
    }
}