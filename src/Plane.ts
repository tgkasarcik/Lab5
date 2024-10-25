import { mat4, vec3, vec4 } from "gl-matrix";
import { squareVertexBuffer as vertexBuffer} from "./buffers";
import { squareNormalBuffer as normalBuffer} from "./buffers";
import { squareTexCoordBuffer as texCoordBuffer} from "./buffers";
import { ShaderType, mMatrixUniform, mvMatrixUniform, nMatrixUniform, pMatrixUniform, textureEnabled, uCameraPos, uColor, uTexture, useProgram, vMatrixUniform, vertexNormalAttribute, vertexPositionAttribute, vertexTexCoordAttribute } from "./shaders";
import { Camera } from "./Camera";
import { Light } from "./Light";
import { Material } from "./Material";

export class Plane {

    private material: Material;
    private mMatrix: mat4;
    private parent;

    constructor(x: number, y: number, z: number, material: Material) {
        this.material = material;
        this.mMatrix = mat4.create();
        mat4.translate(this.mMatrix, this.mMatrix, [x, y, z]);
        mat4.rotate(this.mMatrix, this.mMatrix, Math.PI / 2, [1, 0, 0]);
    }

    scale(scaleFactor: vec3): void {
        mat4.scale(this.mMatrix, this.mMatrix, scaleFactor);
    }

    draw(gl: WebGL2RenderingContext, camera: Camera, light: Light): void {
        //use correct shader program
        useProgram(gl, ShaderType.Default);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.vertexAttribPointer(vertexNormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.vertexAttribPointer(vertexTexCoordAttribute, texCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        let mvMatrix = mat4.create();
        mat4.multiply(mvMatrix, camera.vMatrix, this.mMatrix);
        gl.uniformMatrix4fv(mMatrixUniform, false, this.mMatrix);
        gl.uniformMatrix4fv(vMatrixUniform, false, camera.vMatrix);
        gl.uniformMatrix4fv(pMatrixUniform, false, camera.pMatrix);
        gl.uniform3fv(uCameraPos, camera.getPosition());

        let nMatrix = mat4.create();
        mat4.invert(nMatrix, mvMatrix);
        mat4.transpose(nMatrix, nMatrix);
        gl.uniformMatrix4fv(nMatrixUniform, false, nMatrix);

        light.sendShaderData(gl);
        this.material.sendShaderData(gl);

        gl.disable(gl.CULL_FACE);
        gl.depthFunc(gl.LESS);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}