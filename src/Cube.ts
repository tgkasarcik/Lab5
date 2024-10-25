import { mat4, vec3, vec4 } from "gl-matrix";
import { cubeIndexBuffer as indexBuffer } from "./buffers";
import { cubeVertexBuffer as vertexBuffer } from "./buffers";
import { cubeNormalBuffer as normalBuffer } from "./buffers";
import { cubeTexCoordBuffer as texCoordBuffer } from "./buffers";
import { ShaderType, mMatrixUniform, mvMatrixUniform, nMatrixUniform, pMatrixUniform, uAmbCoef, uCameraPos, uColor, uCubemap, uDiffCoef, uLightAmb, uLightDiff, uLightPos, uLightSpec, uShine, uSpecCoef, useProgram, vMatrixUniform, vertexNormalAttribute, vertexPositionAttribute, vertexTexCoordAttribute } from "./shaders";
import { Camera } from "./Camera";
import { Light } from "./Light";
import { Material } from "./Material";

export class Cube {

    private material: Material;
    private mMatrix: mat4;
    private parent;

    constructor(x: number, y: number, z: number, material: Material) {
        this.material = material;
        this.mMatrix = mat4.create();
        mat4.translate(this.mMatrix, this.mMatrix, [x, y, z]);
        //mat4.rotate(this.mMatrix, this.mMatrix, Math.PI / 2, [1, 0, 0]);
    }

    setParent(parent): void {
        this.parent = parent;
    }

    getMMatrix(): mat4 {
        let ret: mat4;
        if (this.parent != null) {
            ret = mat4.create();
            mat4.multiply(ret, this.parent.getMMatrix(), this.mMatrix);
        } else {
            ret = this.mMatrix;
        }
        return ret;
    }

    scale(scaleFactor: vec3): void {
        mat4.scale(this.mMatrix, this.mMatrix, scaleFactor);
    }

    rotateZ(radians: number) {
        mat4.rotateZ(this.mMatrix, this.mMatrix, radians);
    }

    rotateY(radians: number) {
        mat4.rotateY(this.mMatrix, this.mMatrix, radians);
    }

    draw(gl: WebGL2RenderingContext, camera: Camera, light: Light): void {
        // use correct shader program
        useProgram(gl, ShaderType.Default);

        // bind buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.vertexAttribPointer(vertexNormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.vertexAttribPointer(vertexTexCoordAttribute, texCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // pass data to shaders
        let mvMatrix = mat4.create();
        if (this.parent != null) {
            let compositeMMatrix = mat4.create();
            mat4.multiply(compositeMMatrix, this.parent.getMMatrix(), this.mMatrix);
            mat4.multiply(mvMatrix, camera.vMatrix, compositeMMatrix);
            gl.uniformMatrix4fv(mMatrixUniform, false, compositeMMatrix);
        } else {
            mat4.multiply(mvMatrix, camera.vMatrix, this.mMatrix);
            gl.uniformMatrix4fv(mMatrixUniform, false, this.mMatrix);
        }
        gl.uniformMatrix4fv(vMatrixUniform, false, camera.vMatrix);
        gl.uniformMatrix4fv(pMatrixUniform, false, camera.pMatrix);
        gl.uniform3fv(uCameraPos, camera.getPosition());

        let nMatrix = mat4.create();
        mat4.invert(nMatrix, mvMatrix);
        mat4.transpose(nMatrix, nMatrix);
        gl.uniformMatrix4fv(nMatrixUniform, false, nMatrix);

        light.sendShaderData(gl);
        this.material.sendShaderData(gl);

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);

        gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}