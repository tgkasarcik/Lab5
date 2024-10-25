import { vec4 } from "gl-matrix";
import { uAmbCoef, uDiffCoef, uSpecCoef, uShine, uColor, textureEnabled, uTexture, uCubemap, cubemapEnabled } from "./shaders";
import { cubemapTexture } from "./textures";
import { Skybox } from "./Skybox";

export class Material {

    private color: vec4;
    private texture: WebGLTexture;
    private ambient: vec4;
    private diffuse: vec4;
    private specular: vec4;
    private shine: number;
    private cubemapEnabled: boolean;

    constructor(color?: vec4, texture?: WebGLTexture) {
        if (color !== null) {
            this.color = color;
        }

        if (texture !== null) {
            this.texture = texture;
        }

        // set coeffs to default values, can be changed later if desired
        this.ambient = [0, 0, 0, 1];
        this.diffuse = [1, 1, 1, 1];
        this.specular = [.9, .9, .9, 1];
        this.shine = 50;
        this.cubemapEnabled = false;
    }

    enableCubemap() {
        this.cubemapEnabled = true;
    }

    setAmbient(ambient: vec4) {
        this.ambient = ambient;
    }

    setDiffuse(diffuse: vec4) {
        this.diffuse = diffuse;
    }

    setSpecular(specular: vec4) {
        this.specular = specular;
    }

    setShine(shine: number) {
        this.shine = shine;
    }

    sendShaderData(gl: WebGL2RenderingContext) {
        gl.uniform4f(uAmbCoef, this.ambient[0], this.ambient[1], this.ambient[2], 1.0);
        gl.uniform4f(uDiffCoef, this.diffuse[0], this.diffuse[1], this.diffuse[2], 1.0);
        gl.uniform4f(uSpecCoef, this.specular[0], this.specular[1], this.specular[2], 1.0);
        gl.uniform1f(uShine, this.shine);

        // pass color data for color only materials
        if (this.color !== null && this.texture == null) {
            gl.uniform4fv(uColor, this.color);
            gl.uniform1i(textureEnabled, 0);
        }

        // pass texture data for texture only materials
        else if (this.texture !== null && this.color == null) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(uTexture, 0);
            gl.uniform1i(textureEnabled, 1);
        }

        // pass data for textures that have color and texture
        else {
            gl.uniform4fv(uColor, this.color);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(uTexture, 0);
            gl.uniform1i(textureEnabled, 2);
        }

        gl.activeTexture(gl.TEXTURE5);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
        gl.uniform1i(uCubemap, 5);
        if (this.cubemapEnabled) {
            gl.uniform1i(cubemapEnabled, 1);
        } else {
            gl.uniform1i(cubemapEnabled, 0);
        }
    }
}