import Ground from "./ground.js";

const DEFAULT_WALL_THICKNESS = 2;
const DEFAULT_CELL_SIZE = 1.5;
const DEFAULT_CELL_COUNT = 8;
export default class Arena{
  constructor(scene, cellSize =DEFAULT_CELL_SIZE, cellCount=DEFAULT_CELL_COUNT,
     wallThickness=DEFAULT_WALL_THICKNESS){
    this.ground = new Ground(scene, cellSize, cellCount, wallThickness);
  }
}
