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
        const tank_mesh = BABYLON.SceneLoader.ImportMesh("Cube.001", "models/tanks/sand_tank/",
             "sand_tank.babylon", scene,
            function (newMeshes) {
                //  Set the target of the camera to the first imported mesh
                 camera.lockedTarget = newMeshes[0];
             });
    return scene;

};

const startGame = function startGame(){
  const scene = createScene();
  window.scene = scene;
  const game = new createDemoGame(scene);
  game.startGame();

  //const tank_mesh = new sand_tank.Cube_001("tank1",scene, "");
};
document.addEventListener("DOMContentLoaded", startGame);
