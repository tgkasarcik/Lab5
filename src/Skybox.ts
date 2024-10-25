import { mat4 } from "gl-matrix";
import { Camera } from "./Camera";
import { skyboxVertexBuffer as vertexBuffer } from "./buffers";
import { ShaderType, mvMatrixUniform, uCubemap, useProgram, vertexPositionAttribute } from "./shaders";

export class Skybox {

    private texture: WebGLTexture;

    constructor(texture: WebGLTexture) {
        this.texture = texture;
    }

    getTexture(): WebGLTexture {
        return this.texture;
    }

    draw(gl: WebGL2RenderingContext, camera: Camera) {
        // use correct shader program
        useProgram(gl, ShaderType.Skybox);

        // let localVMatrix: mat4 = camera.vMatrix;
        let localVMatrix: mat4 = mat4.create();
        mat4.invert(localVMatrix, camera.vMatrix);
        // remove translation component of vMatrix
        localVMatrix[12] = 0;
        localVMatrix[13] = 0;
        localVMatrix[14] = 0;

        mat4.multiply(localVMatrix, camera.pMatrix, localVMatrix);
        mat4.invert(localVMatrix, localVMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(mvMatrixUniform, false, localVMatrix);
        gl.activeTexture(gl.TEXTURE10);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
        gl.uniform1i(uCubemap, 10);

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);
    }
}