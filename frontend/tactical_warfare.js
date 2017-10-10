import io from 'socket.io-client';

import {Game, createDemoGame} from "./game.js";
import authStuff from "./auth_stuff/auth_stuff.js";
import webSockets from './websockets';

const socket = io();

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

    engine.runRenderLoop( () => {
      scene.render();
    });
    scene.socket = socket;
    
    return scene;
};

const startGame = function startGame(){
  const scene = createScene();
  window.scene = scene;
  createDemoGame(scene);
  //const tank_mesh = new sand_tank.Cube_001("tank1",scene, "");
};
document.addEventListener("DOMContentLoaded", startGame);
document.addEventListener("DOMContentLoaded", authStuff);
document.addEventListener("DOMContentLoaded", webSockets);
