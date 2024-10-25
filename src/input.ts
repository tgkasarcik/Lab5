import { Camera } from "./Camera";
import { Light } from "./Light";
import { drawScene, setRotationState } from "./main";

let DELTA_PITCH = 0.1;
let DELTA_YAW = 0.1;
let DELTA_ROLL = Math.PI / 64;

export function handleKeyboardInput(key: string, camera: Camera, light: Light) {
    switch (key) {
        case "ArrowUp":
            event.preventDefault();
            //camera.updatePosition([0.0, 0.25, 0.0]);
            light.updatePosition([0.0, -0.25, 0.0]);
            //drawScene();
            break;
        case "ArrowDown":
            event.preventDefault();
            //camera.updatePosition([0.0, -0.25, 0.0]);
            light.updatePosition([0.0, 0.25, 0.0]);
            break;
        case "w":
            light.updatePosition([0.0, 0.0, -0.25]);
            break;
        case "s":
            light.updatePosition([0.0, 0.0, 0.25]);
            break;
        case "a":
            light.updatePosition([0.25, 0.0, 0.0]);
            break;
        case "d":
            light.updatePosition([-0.25, 0.0, 0.0]);
            break;

        // Pitch controls
        case "P":   // pitch up
            camera.updatePitch(DELTA_PITCH);
            break;
        case "p":   // pitch down
            camera.updatePitch(-DELTA_PITCH);
            break;

        // Yaw controls
        case "Y":   // increase yaw (rotate left)
            camera.updateYaw(DELTA_YAW);
            break;
        case "y":   // decrease yaw (rotate right)
            camera.updateYaw(-DELTA_YAW);
            break;

        // Roll controls
        case "R":   // increase roll (rotate left)
            camera.updateRoll(DELTA_ROLL);
            break;
        case "r":   // decrease roll (rotate right)
            camera.updateRoll(-DELTA_ROLL);
            break;

        case "+":   // start rotation
            setRotationState(true);
            break;
        case "-":   // stop rotation
            setRotationState(false);
            break;
    }
}