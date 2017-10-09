import Cursor from "./cursor.js";
export default class Ground{
  constructor(scene,
              cellSize,
              cellCount,
              wallThickness){
    this.scene = scene;
    this.cellSize = cellSize;
    this.cellCount = cellCount;
    this.wallThickness = wallThickness;
    this.mesh = this._createGroundMesh();
    this._handleConfirmPosition = this._handleConfirmPosition.bind(this);
    this._handleListeningForPosition = this._handleListeningForPosition.bind(this);
  }
  _createGroundMesh(){
    return BABYLON.Mesh.CreateGround("ground", this.cellSize*
    this.cellCount * 2,
    this.cellSize*this.cellCount* this.cellCount + this.wallThickness,
    2, this.scene);
  }
  startListeningForPosition(onDoneCallback){
    document.getElementById('render-canvas').addEventListener("mousemove",
      this._handleListeningForPosition);
    document.getElementById("render-canvas").onClick =
      this._handleConfirmPosition(onDoneCallback);
  }
  _getCellCenteredCoordinates(globalCoordinates){
    const x = Math.floor(globalCoordinates.x / this.cellSize)*this.cellSize +
      this.cellSize/2;
    const z = Math.floor(globalCoordinates.z / this.cellSize)*this.cellSize+
      this.cellSize/2;

    return new BABYLON.Vector3(x, 0, z);
  }
  _createCursor(){
    this.cursor = new Cursor(this.scene, this.cellSize);
  }
  _handleListeningForPosition(e){
    if(!this.cursor){
      this._createCursor();
    }
    const pickResult = this.scene.pick(e.clientX, e.clientY, mesh => {
      return this.mesh.name ===mesh.name;
    });
    if(pickResult.hit){
      this.cursor.setDisplayPosition(
        this._getCellCenteredCoordinates(pickResult.pickedPoint)
      );
    }
  }
  _handleConfirmPosition(onDoneCallback){
    return e=>{
      document.getElementById('render-canvas').removeEventListener("mousemove",
        this._handleListeningForPosition);
      document.getElementById('render-canvas').onClick = null;
      this.cursor.dispose();
      this.cursor = null;
      onDoneCallback(this.cursor.gridPostion());
    }
  }
}
