const CURSOR_Y_POSITION = 0.02;


export default class Cursor{
  constructor(scene, size){
    this._displayPosition = new BABYLON.Vector3.Zero();
    this._mesh = new BABYLON.Mesh.CreatePlane("cursor", size, scene);
    this._mesh.material = new BABYLON.StandardMaterial("mat1", scene);
    this._mesh.material.diffuseColor = new BABYLON.Color3(
      0.15, 0.68, 0.376
    );
    this._mesh.material.alpha = 0.9;
    this._mesh.rotation.x = Math.PI/2
  }
  setDisplayPosition(globalCoordinates){
    this._mesh.position = globalCoordinates;
    this._mesh.position.y = CURSOR_Y_POSITION;
  }
  gridPosition(){
    const gridPosition = this._mesh.position.clone();
    gridPosition.y = 0;
    return gridPosition;
  }
  dispose(){
    this._mesh.dispose();
  }
}
