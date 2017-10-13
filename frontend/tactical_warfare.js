import {Game, createDemoGame, startOnlineGame} from "./game.js";
import authStuff from "./auth_stuff/auth_stuff.js";
import { webSockets, socket } from './websockets';
import disableMobileScrolling from
'./mobile_friendliness/mobile_scroll';

const createScene = function () {
  const canvas = document.getElementById("render-canvas");
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    // Enable physics engine
    scene.enablePhysics();

    const camera = new BABYLON.ArcRotateCamera(
      "camera1",
      -1,
      0.8,
      15,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    camera.upperBetaLimit = Math.PI/2 - 0.1;
    camera.attachControl(canvas);
    const light = new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );

    const lightPointSky = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, 1, 0), scene);

    light.intensity = 0.8;
    lightPointSky.intensity = 0.5;

    window.addEventListener('resize', () => {
      engine.resize();
    });

    engine.runRenderLoop( () => {
      scene.render();
    });
    scene.socket = socket;

    const assetsManager = setupAssetsManager(scene);
    assetsManager.onFinish = (param) =>{
      engine.hideLoadingUI();
      const game = createDemoGame(scene);
      game.startGame();
      socket.on('startGame', isFirst=>{
          startOnlineGame(game, isFirst);
      });
      engine.runRenderLoop( () => {
        window.scene = scene;
        scene.render();
      });

    }

    assetsManager.load();
};
// const startGame = scene => () =>{
//   const game = OnlineGame();
//   game.startGame();
// }
// const stopGame = game => {
//   game.stopGame();
// }
const setupAssetsManager = function setupAssetsManager(scene){
  const assetsManager = new BABYLON.AssetsManager(scene);
  const tankTask = assetsManager.addMeshTask("tankTask", "tank_body",
    "models/tanks/sand_tank/","sand_tank.babylon");
    tankTask.onSuccess = task => (scene.tankMesh = task.loadedMeshes[0]);
  const bombTask = assetsManager.addMeshTask("bombTask", "bomb",
    "models/projectiles/bomb/", "bomb.babylon");
    bombTask.onSuccess = task => {
      scene.bombMesh = task.loadedMeshes[0];
      scene.bombMesh.setEnabled(false);
    };
  return assetsManager;

}
document.addEventListener("DOMContentLoaded", createScene);
document.addEventListener("DOMContentLoaded", authStuff);
document.addEventListener("DOMContentLoaded", webSockets);
document.addEventListener("DOMContentLoaded", disableMobileScrolling);
