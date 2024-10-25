import { Camera } from "./Camera";
import { Cube } from "./Cube";
import { Light } from "./Light";
import { BRICK_MATERIAL, GREEN_BRICK_MAT, LIGHT_BLUE_METAL_MATERIAL, METAL_MAT, ORANGE_METAL_MAT, TEAPOT_MAT, generateMaterials } from "./MaterialFactory";
import { Plane } from "./Plane";
import { Skybox } from "./Skybox";
import { Sphere } from "./Sphere";
import { Teapot } from "./Teapot";
import { initBuffers } from "./buffers";
import { handleKeyboardInput } from "./input";
import { initShaders } from "./shaders";
import { cubemapTexture, initTextures } from "./textures";

let BACKGROUND_COLOR = [102 / 255, 102 / 255, 102 / 255, 1.0];
var camera: Camera;
var cube: Cube;
var childCube: Cube;
var sphere: Sphere;
var light: Light;
var teapot: Teapot;
var skybox: Skybox;

// Initialize the WebGL context.
const canvas: HTMLCanvasElement = document.getElementById("webgl-canvas") as HTMLCanvasElement;
export const gl: WebGL2RenderingContext = canvas.getContext("webgl2");
var rotating: boolean = true;
let viewportWidth = canvas.width;
let viewportHeight = canvas.height;
let rotaionSpeed = 1;
let rotationRad = 0;
var then = 0;

main();

function createBuffer(gl: WebGL2RenderingContext, data: number[]): WebGLBuffer {
    let buffer: WebGLBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return buffer;
}

export function setRotationState(enabled: boolean) {
    rotating = enabled;
}

function setupScene(): void {
    camera = new Camera([0, -2, 2], [0, 0, 0], [0, 1, 0]);
    light = new Light([0, -2, 2], camera);

    cube = new Cube(-1, -0.5, 0, LIGHT_BLUE_METAL_MATERIAL);
    cube.rotateY(Math.PI / 4);
    childCube = new Cube(0, -1.5, 0, ORANGE_METAL_MAT);
    childCube.scale([0.6, 0.6, 0.6]);
    childCube.setParent(cube);

    sphere = new Sphere([0, 0, 2], 0.5, 30, 30, METAL_MAT);
    sphere.setParent(childCube);

    teapot = new Teapot(1, -1, 1, TEAPOT_MAT);
    teapot.scale([0.5, 0.5, 0.5]);

    skybox = new Skybox(cubemapTexture);
}

/**
 * NOTE: animation logic inspired by https://webgl2fundamentals.org/webgl/lessons/webgl-animation.html
 */
export function drawScene(now: number): void {
    // convert time to seconds
    now *= 0.001;
    // subtract previous time from current time to calculate delta time
    let deltaTime = now - then;
    // save current time for next frame
    then = now;

    // Clear the canvas.
    gl.viewport(0, 0, viewportWidth, viewportHeight);
    gl.clearColor(BACKGROUND_COLOR[0], BACKGROUND_COLOR[1], BACKGROUND_COLOR[2], BACKGROUND_COLOR[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw all objects
    cube.draw(gl, camera, light);
    childCube.draw(gl, camera, light);
    sphere.draw(gl, camera, light);
    teapot.draw(gl, camera, light);
    skybox.draw(gl, camera);

    // Update objects for next frame as needed
    if (rotating) {
        rotationRad = rotaionSpeed * deltaTime;
        cube.rotateZ(rotationRad / 5);
        cube.rotateY(rotationRad / 5);
        childCube.rotateY(rotationRad / 3);
        teapot.rotateY(rotationRad);
    }

    // Draw the next frame
    requestAnimationFrame(drawScene);
}

/**
 * Make sure the WebGL context has been initialized, then clear the canvas.
 */
function main(): void {
    // Validate the rendering context.
    if (gl === null) {
        console.error("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    initShaders(gl);
    initBuffers(gl);
    initTextures(gl);
    generateMaterials();
    setupScene();
    requestAnimationFrame(drawScene);

    // Listen for keyboard input
    window.addEventListener('keydown', (event) => {
        handleKeyboardInput(event.key, camera, light);
    });
}