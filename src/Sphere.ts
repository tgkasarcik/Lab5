import { mat4, vec3, vec4 } from "gl-matrix";
import { getSphereIndexBuffer, getSphereNormalBuffer, getSphereVertexBuffer } from "./buffers";
import { ShaderType, mMatrixUniform, mvMatrixUniform, nMatrixUniform, pMatrixUniform, uAmbCoef, uCameraPos, uColor, uDiffCoef, uLightAmb, uLightDiff, uLightPos, uLightSpec, uShine, uSpecCoef, useProgram, vMatrixUniform, vertexNormalAttribute, vertexPositionAttribute, vertexTexCoordAttribute } from "./shaders";
import { Camera } from "./Camera";
import { Light } from "./Light";
import { Material } from "./Material";

export class Sphere {

    private mMatrix: mat4;
    private radius: number;
    private slices: number;
    private stacks: number;
    private material: Material;
    private parent;

    constructor(position: vec3, radius: number, slices: number, stacks: number, material: Material) {
        this.mMatrix = mat4.create();
        mat4.identity(this.mMatrix);
        mat4.translate(this.mMatrix, this.mMatrix, position);
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;
        this.material = material;
        this.scale([radius, radius, radius]);
    }

    setParent(parent): void {
        this.parent = parent;
    }

    getMMatrix(): mat4 {
        return this.mMatrix;
    }

    scale(scaleFactor: vec3): void {
        mat4.scale(this.mMatrix, this.mMatrix, scaleFactor);
    }

    rotateZ(radians: number): void {
        mat4.rotateZ(this.mMatrix, this.mMatrix, radians);
    }

    updatePosition(delta: vec3): void {
        mat4.translate(this.mMatrix, this.mMatrix, delta);
    }

    setPosition(newPosition: vec3): void {
        mat4.identity(this.mMatrix);
        mat4.translate(this.mMatrix, this.mMatrix, newPosition);
        this.scale([this.radius, this.radius, this.radius]);
    }

    draw(gl: WebGL2RenderingContext, camera: Camera, light: Light) {
        // use correct shader program
        useProgram(gl, ShaderType.Default);

        //mat4.rotate(this.mMatrix, this.mMatrix, Math.PI / 2, [1.0, 0.0, 0.0]); // rotate generated verticies to that "poles" are on top and bottom
        let vertexBuffer = getSphereVertexBuffer(gl, this.slices, this.stacks);
        let indexBuffer = getSphereIndexBuffer(gl, this.slices, this.stacks);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.vertexAttribPointer(vertexTexCoordAttribute, 3, gl.FLOAT, false, 0, 0);  // temporary to allow sphere to be drawn using default shader
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        let normalBuffer = getSphereNormalBuffer(gl, this.slices, this.stacks);
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

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

        if (light != null) {
            light.sendShaderData(gl);
        }
        this.material.sendShaderData(gl);
        
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);

        gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        //gl.drawArrays(gl.POINTS, 0, vertexBuffer.numItems);
        gl.disable(gl.CULL_FACE);
    }
}