import Ground from "./ground.js";

const DEFAULT_WALL_THICKNESS = 1;
const DEFAULT_CELL_SIZE = 1.5;
const DEFAULT_CELL_COUNT = 8;
const DEFAULT_WALL_HEIGHT = 3;
const DEFAULT_WALL_WIDTH = 0.6;

export default class Arena{
  constructor(scene, cellSize =DEFAULT_CELL_SIZE, cellCount=DEFAULT_CELL_COUNT,
     wallThickness=DEFAULT_WALL_THICKNESS, wallHeight = DEFAULT_WALL_HEIGHT,
      wallWidth = DEFAULT_WALL_WIDTH){
    this.ground = new Ground(scene, cellSize, cellCount, wallThickness);
    const groundWidth = this.ground.getGroundWidth();
    this._wallMesh = new BABYLON.Mesh.CreateBox("centerWall",
      groundWidth, scene);
    this._wallMesh.scaling.z = wallThickness / groundWidth;
    this._wallMesh.scaling.y = wallHeight/ groundWidth;
    this._wallMesh.scaling.x = wallWidth;
    this._wallMesh.position.y += wallHeight /2;
    window.wallMesh = this._wallMesh;
  }
}
