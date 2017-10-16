import {Game, createDemoGame, startOnlineGame} from "./game.js";
import authStuff from "./auth_stuff/auth_stuff.js";
import { webSockets, socket } from './websockets';
import liveChat from './ui/live_chat';
import disableMobileScrolling from
'./mobile_friendliness/mobile_scroll';

const createScene = function () {
  const canvas = document.getElementById("render-canvas");
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    // Enable physics engine
    const gravityVector = new BABYLON.Vector3(0,-1.5,0);
    scene.enablePhysics(gravityVector);

    const camera = new BABYLON.ArcRotateCamera(
      "camera1",
      -1,
      1.4,
      25,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    camera.upperRadiusLimit = 45;
    camera.lowerRadiusLimit = 5;
    camera.upperBetaLimit = Math.PI/2 - 0.1;
    camera.attachControl(canvas);
    const light = new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );

    const lightPointSky = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, 1, 0), scene);

    light.intensity = 0.9;
    lightPointSky.intensity = 0.7;

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
      engine.runRenderLoop(() => {
        window.scene = scene;
        scene.render();
      });

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
    bombTask.onSuccess = task => {
      scene.bombMesh = task.loadedMeshes[0];
      scene.bombMesh.setEnabled(false);
    };
  const greenTextureTask = assetsManager.addTextureTask("greenTextureTask",
    "models/tanks/sand_tank/green_baked.png");
    greenTextureTask.onSuccess = task => {
      scene.greenTankTexture = task.texture;
    }
  const boxTask = assetsManager.addTextureTask("boxTexture", "models/arena/box.jpg");
  boxTask.onSuccess = task => {
    scene.boxTask = task.texture;
  };
  const ceilingTask = assetsManager.addTextureTask("ceilingTexture", "models/arena/ceiling6.jpg");
  ceilingTask.onSuccess = task => {
    scene.ceilingTask = task.texture;
  };
  const centerWallTask = assetsManager.addTextureTask("centerWallTexture", "models/arena/centerBrickWall.jpg");
  centerWallTask.onSuccess = task => {
    scene.centerWallTask = task.texture;
  };
  const groundTask = assetsManager.addTextureTask("groundTask", "models/arena/ground2.jpg");
  groundTask.onSuccess = task => {
    scene.groundTask = task.texture;
  };
  const sideWallTask = assetsManager.addTextureTask("sideWallTask", "models/arena/sideWalls.jpg");
  sideWallTask.onSuccess = task => {
    scene.sideWallTask = task.texture;
  };

  const timeBombTask = assetsManager.addBinaryFileTask("timeBombTask", "models/arena/time_bomb_sound.mp3");
  timeBombTask.onSuccess = task => {
    scene.bombSound = new BABYLON.Sound("bomb", task.data, scene);
  };

  return assetsManager;
};

document.addEventListener("DOMContentLoaded", createScene);
document.addEventListener("DOMContentLoaded", authStuff);
document.addEventListener("DOMContentLoaded", webSockets);
document.addEventListener("DOMContentLoaded", liveChat);
document.addEventListener("DOMContentLoaded", disableMobileScrolling);
