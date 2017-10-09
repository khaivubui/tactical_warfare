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
    this.cellCount,
    this.cellSize*this.cellCount+ this.wallThickness,
    2, this.scene);
  }
  startListeningForPosition(onDoneCallback){
    document.getElementById('render-canvas').addEventListener("mousemove",
      this._handleListeningForPosition);
    document.getElementById("render-canvas").onClick =
      this._handleConfirmPosition(onDoneCallback);
  }
  _getCellIndices(globalCoordinates){
    const xIndex = Math.floor(
      (globalCoordinates.x +
        (this.cellCount * this.cellSize/2)
      ) / this.cellSize
    );

    let zIndex =  Math.floor(
      (globalCoordinates.z + this.wallThickness /2

      ) / this.cellSize * -1
    );
    if(zIndex < 0)
      zIndex = 0;
    console.log((globalCoordinates.z + this.wallThickness /2

    ) / this.cellSize);
    return [xIndex, zIndex];

  }
  getGroundWidth(){
    return this.cellSize * this.cellCount;
  }
  _getCellCenteredCoordinates(globalCoordinates){
    let indices = this._getCellIndices(globalCoordinates);
    let x = indices[0] * this.cellSize + this.cellSize/2 - this.getGroundWidth()/2;
    let z = -1 * (indices[1] * this.cellSize + this.cellSize/2 + this.wallThickness/2);
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