
const createScene = function createScene(){
  const canvas = document.getElementById("render-canvas");
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.FreeCamera('camera',
   new BABYLON.Vector3(0,5,-10), scene);

   camera.setTarget(BABYLON.Vector3.Zero());
   camera.attachControl(canvas, false);
   const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
   const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
   const ground = BABYLON.Mesh.CreateGround('ground1', 100,100,2, scene);

   window.addEventListener('resize', ()=> {
     engine.resize();
   });
   engine.runRenderLoop(()=>{
     scene.render();
   });
}

const startGame = function startGame(){
  const scene = createScene();
};
document.addEventListener("DOMContentLoaded", startGame);
