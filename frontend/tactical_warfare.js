
const createScene = function createScene(){
  const canvas = document.getElementById("render-canvas");
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera('camera', 0,0.8, 5,
   new BABYLON.Vector3.Zero(), scene);
   camera.attachControl(canvas, false);
   const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
   //const sphere = BABYLON.Mesh.    window.tank_mesh = tank_mesh;CreateSphere('sphere1', 16, 2, scene);
   //const ground = BABYLON.Mesh.CreateGround('ground1', 100,100,2, scene);

   window.addEventListener('resize', ()=> {
     engine.resize();
   });
   engine.runRenderLoop(()=>{
     scene.render();
   });

   const tank_mesh = BABYLON.SceneLoader.ImportMesh("Cube.001", "models/tanks/sand_tank/",
    "sand_tank.babylon", scene,
   function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        camera.target = newMeshes[0];
    });

   return scene;
}

const startGame = function startGame(){
  const scene = createScene();

  //const tank_mesh = new sand_tank.Cube_001("tank1",scene, "");
};
document.addEventListener("DOMContentLoaded", startGame);
