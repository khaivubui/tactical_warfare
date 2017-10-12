import {Game, createDemoGame} from "./game.js";
import authStuff from "./auth_stuff/auth_stuff.js";
import webSockets from './websockets';

const createScene = function () {
  const canvas = document.getElementById("render-canvas");
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera(
      "camera1",
      -1,
      0.8,
      15,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    camera.attachControl(canvas);
    const light = new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );

    light.intensity = 0.7;

    window.addEventListener('resize', () => {
      engine.resize();
    });



    const assetsManager = setupAssetsManager(scene);
    assetsManager.onFinish = (param) =>{
      engine.hideLoadingUI();
      
      engine.runRenderLoop( () => {
        window.scene = scene;
        scene.render();
      });
        const game = createDemoGame(scene);
        game.startGame();
    }
    assetsManager.load();
};
const setupAssetsManager = function setupAssetsManager(scene){
  const assetsManager = new BABYLON.AssetsManager(scene);
  const tankTask = assetsManager.addMeshTask("tankTask", "tank_body",
    "models/tanks/sand_tank/","sand_tank.babylon");
    tankTask.onSuccess = task => (scene.tankMesh = task.loadedMeshes[0]);
  const bombTask = assetsManager.addMeshTask("bombTask", "bomb",
    "models/projectiles/bomb/", "bomb.babylon");
    bombTask.onSuccess = task => (scene.bombMesh = task.loadedMeshes[0]);
  return assetsManager;

}
document.addEventListener("DOMContentLoaded", createScene);
document.addEventListener("DOMContentLoaded", authStuff);
document.addEventListener("DOMContentLoaded", webSockets);
