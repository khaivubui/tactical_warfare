import {Game, createDemoGame} from "./game.js";
const createScene = function () {
  const canvas = document.getElementById("render-canvas");
    const engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -20), scene);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    window.addEventListener('resize', ()=> {
          engine.resize();
        });
        engine.runRenderLoop(()=>{
          scene.render();
        });
    return scene;

};

const startGame = function startGame(){
  const scene = createScene();
  window.scene = scene;
  createDemoGame(scene);
  //const tank_mesh = new sand_tank.Cube_001("tank1",scene, "");
};
document.addEventListener("DOMContentLoaded", startGame);
