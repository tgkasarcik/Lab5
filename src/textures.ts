export var textureCount: number;
export var brickTexture: WebGLTexture;
export var cubemapTexture: WebGLTexture;
export var teapotTexture: WebGLTexture;

export function initTextures(gl: WebGL2RenderingContext): void {
    textureCount = -1;
    brickTexture = gl.createTexture();
    let image: HTMLImageElement = new Image();
    image.src = require("../assets/textures/brick.png");
    image.addEventListener('load', function () {
        handleLoadedTexture(gl, brickTexture, image);
    });

    teapotTexture = gl.createTexture();
    let teapotImage: HTMLImageElement = new Image();
    teapotImage.src = require("../assets/textures/teapot_texture2.png");
    teapotImage.addEventListener('load', function () {
        handleLoadedTexture(gl, teapotTexture, teapotImage);
    });

    cubemapTexture = gl.createTexture();
    initCubemap(gl, cubemapTexture);
    let cubePosX: HTMLImageElement = new Image();   //left
    cubePosX.src = require("../assets/textures/left.png");
    cubePosX.addEventListener('load', function () {
        handleLoadedCubemapTexture(gl, cubemapTexture, cubePosX, gl.TEXTURE_CUBE_MAP_POSITIVE_X);
    });
    let cubeNegX: HTMLImageElement = new Image();   //right
    cubeNegX.src = require("../assets/textures/right.png");
    cubeNegX.addEventListener('load', function () {
        handleLoadedCubemapTexture(gl, cubemapTexture, cubeNegX, gl.TEXTURE_CUBE_MAP_NEGATIVE_X);
    });
    let cubePosY: HTMLImageElement = new Image();   //bottom
    cubePosY.src = require("../assets/textures/bottom.png");
    cubePosY.addEventListener('load', function () {
        handleLoadedCubemapTexture(gl, cubemapTexture, cubePosY, gl.TEXTURE_CUBE_MAP_POSITIVE_Y);
    });
    let cubeNegY: HTMLImageElement = new Image();   //top
    cubeNegY.src = require("../assets/textures/top.png");
    cubeNegY.addEventListener('load', function () {
        handleLoadedCubemapTexture(gl, cubemapTexture, cubeNegY, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y);
    });
    let cubePosZ: HTMLImageElement = new Image();   //behind
    cubePosZ.src = require("../assets/textures/back.png");
    cubePosZ.addEventListener('load', function () {
        handleLoadedCubemapTexture(gl, cubemapTexture, cubePosZ, gl.TEXTURE_CUBE_MAP_POSITIVE_Z);
    });
    let cubeNegZ: HTMLImageElement = new Image();   //in front
    cubeNegZ.src = require("../assets/textures/front.png");
    cubeNegZ.addEventListener('load', function () {
        handleLoadedCubemapTexture(gl, cubemapTexture, cubeNegZ, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z);
    });

}

function handleLoadedTexture(gl: WebGL2RenderingContext, texture: WebGLTexture, image: HTMLImageElement) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
    textureCount++;
}

function initCubemap(gl: WebGL2RenderingContext, texture: WebGLTexture) {
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
}

function handleLoadedCubemapTexture(gl: WebGL2RenderingContext, texture: WebGLTexture, image: HTMLImageElement, target: number) {
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
}