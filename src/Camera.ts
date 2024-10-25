import { mat4, vec3 } from "gl-matrix";

export class Camera {
    private static FOV = 80;
    private static ASPECT_RATIO = 16.0/9.0;
    private static NEAR_CLIP = 0.1;
    private static FAR_CLIP = 100.0;

    public vMatrix: mat4;
    public pMatrix: mat4;

    private position;
    private direction;
    private coi;
    private up;
    private pitch;
    private yaw;
    private roll;

    constructor(position: vec3, coi: vec3, up: vec3) {
        this.position = position;
        this.coi = coi;
        this.up = up;

        // direction vector = coi - position
        this.direction = vec3.create();
        vec3.subtract(this.direction, coi, position);
        vec3.normalize(this.direction, this.direction);

        this.pitch = Math.asin(this.direction[1]);
        this.yaw = Math.atan2(this.direction[2], this.direction[0]);
        this.roll = 0; // FIXME this assumes y axis is up vector

        this.createVMatrix();
        this.createPMatrix();
    }

    getPosition(): vec3 {
        return this.position;
    }

    /**
    * Add the specified values to the Camera's current position and calculate a new vMatrix accordingly
    * @param {vec3} delta vec3 containing amount to update positon in each axial direction 
    */
    updatePosition(delta: vec3): void {
        vec3.add(this.position, this.position, delta);
        console.log("camera position: " + this.position);
        this.createVMatrix();
    }

    /**
     * Update the pitch of the camera by the specified amount of radians
     * @param {float} radians 
     */
    updatePitch(radians: number): void {
        this.pitch += radians;
        this.direction[1] = Math.sin(this.pitch);
        this.createVMatrix();
    }

    /**
     * Update the yaw of the camera by the specified amount of radians
     * @param {float} radians 
     */
    updateYaw(radians: number): void {
        this.yaw += radians;
        this.direction[0] = Math.cos(this.pitch) * Math.cos(this.yaw);
        this.direction[2] = Math.cos(this.pitch) * Math.sin(this.yaw);
        this.createVMatrix();
    }

    /**
     * Update the roll of the camera by the specified amount of radians
     * @param {float} radians 
     */
    updateRoll(radians: number): void {
        this.roll += radians;
        // construct rotation matrix to rotate up vector roll radians around the direction vector
        let rotationMatrix = mat4.create();
        rotationMatrix = mat4.identity(rotationMatrix);
        mat4.rotate(rotationMatrix, rotationMatrix, this.roll, this.direction);
        vec3.transformMat4(this.up, this.up, rotationMatrix);
        this.createVMatrix();
    }

    /**
    * Create a vMatrix for this camera using its current properties
    */
    private createVMatrix(): void {
        this.vMatrix = mat4.create();
        mat4.identity(this.vMatrix);
        // mat4.lookAt(this.vMatrix, this.position, vec3.add(vec3.create(), this.position, this.direction), this.up);
        let temp: vec3 = vec3.create();
        vec3.add(temp, this.position, this.direction)
        mat4.lookAt(this.vMatrix, this.position, temp, this.up);
        // mat4.rotateX(this.vMatrix, this.vMatrix, Math.PI);
        //mat4.scale(this.vMatrix, this.vMatrix, [1, -1, 1]);
    }

    /**
     * Create a pMatrix using predefined constants
     */
    private createPMatrix(): void {
        this.pMatrix = mat4.create();
        mat4.identity(this.pMatrix);
        mat4.perspective(this.pMatrix, Camera.FOV, Camera.ASPECT_RATIO, Camera.NEAR_CLIP, Camera.FAR_CLIP);
    }
}