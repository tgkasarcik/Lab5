export var squareVertexBuffer;
export var squareNormalBuffer;
export var squareTexCoordBuffer;
export var cubeVertexBuffer;
export var cubeIndexBuffer;
export var cubeNormalBuffer;
export var cubeTexCoordBuffer;
export var teapotVertexBuffer;
export var teapotIndexBuffer;
export var teapotTexCoordBuffer;
export var teapotNormalBuffer;
export var skyboxVertexBuffer;
var sphereVertexBuffers: Map<[number, number], any>;
var sphereIndexBuffers: Map<[number, number], any>;
var sphereNormalBuffers: Map<[number, number], any>;

export function initBuffers(gl: WebGL2RenderingContext) {
    initSquareBuffer(gl);
    initCubeBuffers(gl);
    initTeapotBuffers(gl);
    initSkyboxBuffers(gl);

    sphereVertexBuffers = new Map();
    sphereIndexBuffers = new Map();
    sphereNormalBuffers = new Map();
}

function initSkyboxBuffers(gl) {
    skyboxVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, skyboxVertexBuffer);
    let verticies = [
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.STATIC_DRAW);
    skyboxVertexBuffer.itemSize = 2;
    skyboxVertexBuffer.numItems = 6;
}

function initSquareBuffer(gl: WebGL2RenderingContext) {
    squareVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
    let squareObj = require("../assets/models/square.json");
    let squareVerticies = squareObj.vertices;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVerticies), gl.STATIC_DRAW);
    squareVertexBuffer.itemSize = 3;
    squareVertexBuffer.numItems = 4;

    squareNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareNormalBuffer);
    let squreNormals = squareObj.normals;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squreNormals), gl.STATIC_DRAW);
    squareNormalBuffer.itemSize = 3;
    squareNormalBuffer.numItems = 4;

    squareTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareTexCoordBuffer);
    let texCoords = squareObj.texCoords;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    squareTexCoordBuffer.itemSize = 2;
    squareTexCoordBuffer.numItems = 4;
}

function initCubeBuffers(gl: WebGL2RenderingContext) {
    // Init cube vertex buffer
    cubeVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    let cubeObj = require("../assets/models/cube.json");
    let cubeVerticies: number[] = cubeObj.vertices;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVerticies), gl.STATIC_DRAW);
    cubeVertexBuffer.itemSize = 3;
    cubeVertexBuffer.numItems = cubeVerticies.length / 3;

    // Init cube index buffer
    let cubeIndices = cubeObj.indices;
    cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
    cubeIndexBuffer.itemSize = 1;
    cubeIndexBuffer.numItems = cubeIndices.length;

    // Init cube normal buffer
    let cubeNormals = cubeObj.normals;
    cubeNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeNormals), gl.STATIC_DRAW);
    cubeNormalBuffer.itemSize = 3;
    cubeNormalBuffer.numItems = cubeNormals.length / 3;

    let texCoords = cubeObj.texCoords;
    cubeTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    cubeTexCoordBuffer.itemSize = 2;
    cubeTexCoordBuffer.numItems = texCoords.length / 2;
}

function initTeapotBuffers(gl: WebGL2RenderingContext) {
    // Init teapot vertex buffer
    teapotVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexBuffer);
    let teapot = require("../assets/models/teapot.json");
    let verticies: number[] = teapot.vertexPositions;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.STATIC_DRAW);
    teapotVertexBuffer.itemSize = 3;
    teapotVertexBuffer.numItems = verticies.length / 3;

    // Init teapot index buffer
    let indices = teapot.indices;
    teapotIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    teapotIndexBuffer.itemSize = 1;
    teapotIndexBuffer.numItems = indices.length;

    // Init cube normal buffer
    let normals = teapot.vertexNormals;
    teapotNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    teapotNormalBuffer.itemSize = 3;
    teapotNormalBuffer.numItems = normals.length / 3;

    let texCoords = teapot.vertexTextureCoords;
    teapotTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    teapotTexCoordBuffer.itemSize = 2;
    teapotTexCoordBuffer.numItems = texCoords.length / 2;
}

/**
 * Get the sphere vertex buffer corresponding to the specified number of slices and stacks, or generate a new one.
 * @param {int} slices 
 * @param {int} stacks 
 */
export function getSphereVertexBuffer(gl: WebGL2RenderingContext, slices: number, stacks: number) {
    let ret;
    if (sphereVertexBuffers.has([slices, stacks])) {
        ret = sphereVertexBuffers.get([slices, stacks]);
    } else {
        ret = generateSphereVertexBuffer(gl, slices, stacks);
        sphereVertexBuffers.set([slices, stacks], ret);
    }
    return ret;
}

function generateSphereVertexBuffer(gl: WebGL2RenderingContext, slices: number, stacks: number) {
    let buffer: any = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    let verticies = [];

    //// NOTE: code for generating verticies here adapted from http://www.songho.ca/glsl/files/js/Sphere.js

    let x, y, z, xy, i, j;
    let sectorStep = 2 * Math.PI / slices;
    let stackStep = Math.PI / stacks;
    let sectorAngle, stackAngle;

    for (i = 0; i <= stacks; ++i) {
        stackAngle = Math.PI / 2 - i * stackStep;   // starting from pi/2 to -pi/2
        xy = 1 * Math.cos(stackAngle);              // r * cos(u)
        z = 1 * Math.sin(stackAngle);               // r * sin(u)

        // add (sectorCount+1) vertices per stack
        // the first and last vertices have same position and normal, but different tex coords
        for (j = 0; j <= slices; ++j) {
            sectorAngle = j * sectorStep;           // starting from 0 to 2pi

            // vertex position
            x = xy * Math.cos(sectorAngle);         // r * cos(u) * cos(v)
            y = xy * Math.sin(sectorAngle);         // r * cos(u) * sin(v)
            verticies.push(x, y, z);
        }
    }

    //// ----------------------------------------------------------------------

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.STATIC_DRAW);
    buffer.itemSize = 3;
    buffer.numItems = verticies.length / 3;

    return buffer;
}

/**
 * Get the sphere index buffer corresponding to the specified number of slices and stacks, or generate a new one.
 * @param {int} slices 
 * @param {int} stacks 
 */
export function getSphereIndexBuffer(gl: WebGL2RenderingContext, slices: number, stacks: number) {
    let ret;
    if (sphereIndexBuffers.has([slices, stacks])) {
        ret = sphereIndexBuffers.get([slices, stacks]);
    } else {
        ret = generateSphereIndexBuffer(gl, slices, stacks);
        sphereIndexBuffers.set([slices, stacks], ret);
    }
    return ret;
}

function generateSphereIndexBuffer(gl: WebGL2RenderingContext, slices: number, stacks: number) {
    let buffer: any = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    let indicies = [];

    //// NOTE: code for generating indicies here adapted from http://www.songho.ca/glsl/files/js/Sphere.js

    // indices
    //  k1--k1+1
    //  |  / |
    //  | /  |
    //  k2--k2+1

    let i, j, k, k1, k2, kk;

    for (i = 0; i < stacks; ++i) {
        k1 = i * (slices + 1);            // beginning of current stack
        k2 = k1 + slices + 1;             // beginning of next stack

        for (j = 0; j < slices; ++j, ++k1, ++k2) {
            // 2 triangles per sector excluding 1st and last stacks
            if (i != 0) {
                //this.addIndices(kk, k1, k2, k1 + 1);  // k1---k2---k1+1
                indicies.push(k1, k2, k1 + 1);
                kk += 3;
            }

            if (i != (stacks - 1)) {
                //this.addIndices(kk, k1 + 1, k2, k2 + 1);// k1+1---k2---k2+1
                indicies.push(k1 + 1, k2, k2 + 1);
                kk += 3;
            }
        }
    }

    //// ----------------------------------------------------------------------

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicies), gl.STATIC_DRAW);
    buffer.itemsize = 1;
    buffer.numItems = indicies.length;

    return buffer;
}

/**
 * Get the sphere vertex buffer corresponding to the specified number of slices and stacks, or generate a new one.
 * @param {int} slices 
 * @param {int} stacks 
 */
export function getSphereNormalBuffer(gl: WebGL2RenderingContext, slices: number, stacks: number) {
    let ret;
    if (sphereNormalBuffers.has([slices, stacks])) {
        ret = sphereNormalBuffers.get([slices, stacks]);
    } else {

        // let verticies = getSphereVertexBuffer(gl, slices, stacks);
        // let indices = getSphereIndexBuffer(gl, slices, stacks);
        // let surfaceNormals = computeSurfaceNormals(verticies, indices);
        // let vertexNormals = computeVertexNormals(verticies, indices, surfaceNormals);
        // let normalBuffer: any = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);
        // normalBuffer.itemsize = 3;
        // normalBuffer.numItems = vertexNormals.length / 3;

        // ret = normalBuffer;
        ret = generateSphereVertexBuffer(gl, slices, stacks);

        // let normals = [];
        // for (let i = 0; i < 256; i++) {
        //     normals.push(0.0, 1.0, 0.0);
        // }
        // ret = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, ret);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        // ret.itemSize = 3;
        // ret.numItems = normals.length / 3;


        sphereNormalBuffers.set([slices, stacks], ret);
    }
    return ret;
}

/**
 * Function copied and modified from https://github.com/hguo/WebGL-tutorial/blob/master/mario.js
 */
function computeSurfaceNormals(verticies: number[], indices: number[]): Float32Array {
    var ret = new Float32Array(indices.length);
    const numVerts = verticies.length / 3;
    const numTris = indices.length / 3;
    for (let i = 0; i < numTris; i++) {
        var tri = [indices[i * 3], indices[i * 3 + 1], indices[i * 3 + 2]];
        var p0 = [verticies[tri[0] * 3], verticies[tri[0] * 3 + 1], verticies[tri[0] * 3 + 2]];
        var p1 = [verticies[tri[1] * 3], verticies[tri[1] * 3 + 1], verticies[tri[1] * 3 + 2]];
        var p2 = [verticies[tri[2] * 3], verticies[tri[2] * 3 + 1], verticies[tri[2] * 3 + 2]];

        var u = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
        var v = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]];

        ret[i * 3] = u[1] * v[2] - u[2] * v[1];
        ret[i * 3 + 1] = u[2] * v[0] - u[0] * v[2];
        ret[i * 3 + 2] = u[0] * v[1] - u[1] * v[0];
    }

    return ret;
}

/**
 * Function copied and modified from https://github.com/hguo/WebGL-tutorial/blob/master/mario.js
 */
function computeVertexNormals(verticies: number[], indices: number[], surfaceNormals: Float32Array): Float32Array {
    let vertexNormals = new Float32Array(indices.length);
    const numVerts = verticies.length / 3;
    const numTris = indices.length / 3;
    for (let i = 0; i < numTris; i++) {
        var tri = [indices[i * 3], indices[i * 3 + 1], indices[i * 3 + 2]];

        for (let t = 0; t < 3; t++) {
            for (let j = 0; j < 3; j++) {
                vertexNormals[tri[t] * 3 + j] = vertexNormals[tri[t] * 3 + j] + surfaceNormals[i * 3 + j];
            }
        }
    }

    for (let i = 0; i < numVerts; i++) {
        var n = [vertexNormals[i * 3], vertexNormals[i * 3 + 1], vertexNormals[i * 3 + 2]];
        var mag = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
        for (var j = 0; j < 3; j++)
            vertexNormals[i * 3 + j] = vertexNormals[i * 3 + j] / mag;
    }

    return vertexNormals;
}