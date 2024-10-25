import { mat4, vec3, vec4 } from "gl-matrix";
import { Camera } from "./Camera";
import { Sphere } from "./Sphere";
import { uLightPos, uLightAmb, uLightDiff, uLightSpec } from "./shaders";
import { LIGHT_MAT } from "./MaterialFactory";

export class Light {

    private light_ambient: vec4;
    private light_diffuse: vec4;
    private light_specular: vec4;
    private light_pos_eye: vec3;   // eye space position 
    private light_pos_world: vec3;

    private sphere: Sphere;
    private camera: Camera;

    constructor(worldPos: vec3, camera: Camera) {
        // set all properties to default values
        this.light_ambient = [0, 0, 0, 1];
        this.light_diffuse = [.8, .8, .8, 1];
        this.light_specular = [1, 1, 1, 1];
        this.light_pos_eye = this.worldToEyePos(worldPos, camera); // eye space position 
        this.light_pos_world = worldPos;

        this.sphere = new Sphere(worldPos, 0.25, 15, 15, LIGHT_MAT);
        this.camera = camera;
    }

    updatePosition(delta: vec3) {
        vec3.add(this.light_pos_world, this.light_pos_world, delta);
        console.log("world pos: " + this.light_pos_world);
        this.sphere.updatePosition(delta);
    }

    setSpecular(specular: vec4) {
        this.light_specular = specular;
    }

    setDiffuse(diffuse: vec4) {
        this.light_diffuse = diffuse;
    }

    sendShaderData(gl: WebGL2RenderingContext): void {
        this.light_pos_eye = this.worldToEyePos(this.light_pos_world, this.camera);
        gl.uniform4f(uLightPos, this.light_pos_eye[0], this.light_pos_eye[1], this.light_pos_eye[2], 1);
        gl.uniform4f(uLightAmb, this.light_ambient[0], this.light_ambient[1], this.light_ambient[2], 1.0);
        gl.uniform4f(uLightDiff, this.light_diffuse[0], this.light_diffuse[1], this.light_diffuse[2], 1.0);
        gl.uniform4f(uLightSpec, this.light_specular[0], this.light_specular[1], this.light_specular[2], 1.0);
    }

    draw(gl: WebGL2RenderingContext, camera: Camera, light: Light) {
        this.sphere.draw(gl, camera, this);
    }

    private eyeToWorldPos(eyePos: vec3, camera: Camera): vec3 {
        let ret: vec3 = vec3.create();
        let invVMatrix: mat4 = mat4.create();
        mat4.invert(invVMatrix, camera.vMatrix);
        vec3.transformMat4(ret, eyePos, invVMatrix);
        return ret;
    }

    private worldToEyePos(worldPos: vec3, camera: Camera): vec3 {
        let ret: vec3 = vec3.create();
        vec3.transformMat4(ret, worldPos, camera.vMatrix);
        return ret;
    }
}