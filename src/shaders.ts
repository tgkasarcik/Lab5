export var vertexPositionAttribute: number;
export var vertexNormalAttribute: number;
export var vertexTexCoordAttribute: number;
export var mvMatrixUniform: WebGLUniformLocation;
export var mMatrixUniform: WebGLUniformLocation;
export var vMatrixUniform: WebGLUniformLocation;
export var pMatrixUniform: WebGLUniformLocation;
export var nMatrixUniform: WebGLUniformLocation;
export var uColor, uLightPos, uAmbCoef, uDiffCoef, uSpecCoef, uShine, uLightAmb, uLightDiff, uLightSpec, uTexture, textureEnabled, cubemapEnabled, uCubemap, uCameraPos: WebGLUniformLocation;
var defaultProgram, skyboxProgram: WebGLProgram;

export enum ShaderType {
    UniformColor,
    Texture,
    Skybox,
    Default
}

export function initShaders(gl: WebGL2RenderingContext): void {
    //initDefaultShaders(gl);
    skyboxProgram = createShaderProgram(
        gl,
        require("./shaders/skybox_vertex.glsl"),
        require("./shaders/skybox_fragment.glsl"),
        initSkyboxProgramLocations);

    defaultProgram = createShaderProgram(
        gl, 
        require("./shaders/default_vertex.glsl"),
        require("./shaders/default_fragment.glsl"),
        initSkyboxProgramLocations);
}

export function useProgram(gl: WebGL2RenderingContext,type: ShaderType) {
    switch (type) {
        case ShaderType.Skybox:
            gl.useProgram(skyboxProgram);
            initSkyboxProgramLocations(gl, skyboxProgram);
            break;
        case ShaderType.Default:
            gl.useProgram(defaultProgram);
            initDefaultProgramLocations(gl, defaultProgram);
            break;
    }
}

function createShader(gl: WebGL2RenderingContext, type: GLenum, source: string): WebGLShader {
    let shader: WebGLShader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

function createShaderProgram(gl: WebGL2RenderingContext, vertexShaderSource: string,
    fragmentShaderSource: string, initFunction: (gl: WebGL2RenderingContext, program: WebGLProgram) => any): WebGLProgram {
    let program: WebGLProgram = gl.createProgram();

    // Create the shaders
    let vertexShader: WebGLShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader: WebGLShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Link the shaders
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    initFunction(gl, program);

    return program;
}

function initSkyboxProgramLocations(gl: WebGL2RenderingContext, program: WebGLProgram) {
    vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    mvMatrixUniform = gl.getUniformLocation(program, "mvMatrix");
    uCubemap = gl.getUniformLocation(program, "cubemap");
}

function initDefaultProgramLocations(gl: WebGL2RenderingContext, program: WebGLProgram) {
    vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    vertexNormalAttribute = gl.getAttribLocation(program, "aVertexNormal");
    gl.enableVertexAttribArray(vertexNormalAttribute);
    vertexTexCoordAttribute = gl.getAttribLocation(program, "aVertexTexCoords");
    gl.enableVertexAttribArray(vertexTexCoordAttribute);

    mMatrixUniform = gl.getUniformLocation(program, "mMatrix");
    vMatrixUniform = gl.getUniformLocation(program, "vMatrix");
    pMatrixUniform = gl.getUniformLocation(program, "pMatrix");
    nMatrixUniform = gl.getUniformLocation(program, "nMatrix");

    uLightPos = gl.getUniformLocation(program, "light_pos");
    uAmbCoef = gl.getUniformLocation(program, "ambient_coef");
    uDiffCoef = gl.getUniformLocation(program, "diffuse_coef");
    uSpecCoef = gl.getUniformLocation(program, "specular_coef");
    uShine = gl.getUniformLocation(program, "shininess");

    uLightAmb = gl.getUniformLocation(program, "light_ambient");
    uLightDiff = gl.getUniformLocation(program, "light_diffuse");
    uLightSpec = gl.getUniformLocation(program, "light_specular");

    uColor = gl.getUniformLocation(program, "uColor");
    uTexture = gl.getUniformLocation(program, "uTexture");
    textureEnabled = gl.getUniformLocation(program, "textureEnabled");
    cubemapEnabled = gl.getUniformLocation(program, "cubemapEnabled");
    uCubemap = gl.getUniformLocation(program, "cubemap");
    uCameraPos = gl.getUniformLocation(program, "u_cameraPos");
}



// Deprecated
function initDefaultShaders(gl: WebGL2RenderingContext) {
    defaultProgram = gl.createProgram();

    // Load the shaders
    let vertexShaderSource: string = require("./shaders/skybox_vertex.glsl");
    let fragmentShaderSource: string = require("./shaders/skybox_fragment.glsl");

    // Create the shaders
    let vertexShader: WebGLShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader: WebGLShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Link the shaders
    gl.attachShader(defaultProgram, vertexShader);
    gl.attachShader(defaultProgram, fragmentShader);
    gl.linkProgram(defaultProgram);

    //useDefaultProgram(gl);
}