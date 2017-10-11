import Ground from "./ground.js";

const DEFAULT_WALL_THICKNESS = 1;
const DEFAULT_CELL_SIZE = 3.5;
const DEFAULT_CELL_COUNT = 10;
const DEFAULT_WALL_HEIGHT = 3;
const DEFAULT_WALL_WIDTH = 0.6;
const SIDE_WALL_HEIGHT = 6;

export default class Arena{
  constructor(scene, cellSize =DEFAULT_CELL_SIZE, cellCount=DEFAULT_CELL_COUNT,
     wallThickness=DEFAULT_WALL_THICKNESS, wallHeight = DEFAULT_WALL_HEIGHT,
      wallWidth = DEFAULT_WALL_WIDTH, sideWallHeight = SIDE_WALL_HEIGHT){
    this.ground = new Ground(scene, cellSize, cellCount, wallThickness);
    const groundWidth = this.ground.getGroundWidth();
    this._wallMesh = new BABYLON.Mesh.CreateBox("centerWall",
      groundWidth, scene);
    this._wallMesh.scaling.z = wallThickness / groundWidth;
    this._wallMesh.scaling.y = wallHeight/ groundWidth;
    this._wallMesh.scaling.x = wallWidth;
    this._wallMesh.position.y += wallHeight /2;
    window.wallMesh = this._wallMesh;


    // Create side walls
    this._sidewall0 = new BABYLON.Mesh.CreatePlane("sidewall0",
      groundWidth, scene);
    this._sidewall0.scaling.y = sideWallHeight/groundWidth;
    this._sidewall0.position.y += sideWallHeight / 2;
    this._sidewall0.position.z += groundWidth/2 + wallThickness/2;


    this._sidewall1 = this._sidewall0.clone('sidewall1');
    const matrix = BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, Math.PI);
    this._sidewall1.position = BABYLON.Vector3.TransformCoordinates(this._sidewall1.position, matrix);
    this._sidewall1.rotation.y = Math.PI;


    this._sidewall2 = new BABYLON.Mesh.CreatePlane("sidewall2",
      groundWidth, scene);
    this._sidewall2.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);
    this._sidewall2.scaling.y = sideWallHeight/groundWidth;
    this._sidewall2.scaling.x = 1 + wallThickness / groundWidth;
    this._sidewall2.position.y += sideWallHeight / 2;
    this._sidewall2.position.x += groundWidth / 2;
    this._sidewall2.position.z += 0;


    this._sidewall3 = new BABYLON.Mesh.CreatePlane("sidewall3",
      groundWidth, scene);
    this._sidewall3.rotate(BABYLON.Axis.Y, Math.PI*1.5, BABYLON.Space.LOCAL);
    this._sidewall3.scaling.y = sideWallHeight/groundWidth;
    this._sidewall3.scaling.x = 1 + wallThickness / groundWidth;
    this._sidewall3.position.y += sideWallHeight / 2;
    this._sidewall3.position.x += - groundWidth / 2;
    this._sidewall3.position.z += 0;

    this._ceiling = new BABYLON.Mesh.CreatePlane("ceiling",
      groundWidth, scene);
    this._ceiling.position.y += sideWallHeight;
    this._ceiling.rotate(BABYLON.Axis.X, Math.PI * 1.5, BABYLON.Space.WORLD);
  }
}
