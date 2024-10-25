import { Material } from "./Material";
import { brickTexture, teapotTexture } from "./textures";

export var BRICK_MATERIAL: Material;
export var LIGHT_BLUE_METAL_MATERIAL: Material;
export var ORANGE_METAL_MAT: Material;
export var GREEN_BRICK_MAT: Material;
export var METAL_MAT: Material;
export var TEAPOT_MAT: Material;
export var LIGHT_MAT: Material;

export function generateMaterials() {
    BRICK_MATERIAL = new Material(null, brickTexture);
    BRICK_MATERIAL.setSpecular([0.1, 0.1, 0.1, 1.0]);
    BRICK_MATERIAL.setShine(5);

    LIGHT_BLUE_METAL_MATERIAL = new Material([0.0, 1.0, 1.0, 1.0], null);
    LIGHT_BLUE_METAL_MATERIAL.setSpecular([0.95, 0.95, 0.95, 1.0]);
    LIGHT_BLUE_METAL_MATERIAL.setShine(100);
    LIGHT_BLUE_METAL_MATERIAL.enableCubemap();

    ORANGE_METAL_MAT = new Material([242/255, 77/255, 27/255, 1.0], null);
    ORANGE_METAL_MAT.setSpecular([0.95, 0.95, 0.95, 1.0]);
    ORANGE_METAL_MAT.setShine(100);
    ORANGE_METAL_MAT.enableCubemap();

    METAL_MAT = new Material([0.0, 0.0, 0.0, 1.0], null);
    METAL_MAT.setSpecular([0.95, 0.95, 0.95, 1.0]);
    METAL_MAT.setShine(100);
    METAL_MAT.enableCubemap();

    GREEN_BRICK_MAT = new Material([0.0, 1.0, 0.0, 1.0], brickTexture);

    TEAPOT_MAT = new Material(null, teapotTexture);
    TEAPOT_MAT.enableCubemap();

    LIGHT_MAT = new Material([1.0, 1.0, 1.0, 1.0], null);
    LIGHT_MAT.setSpecular([0.0, 0.0, 0.0, 0.0]);
}