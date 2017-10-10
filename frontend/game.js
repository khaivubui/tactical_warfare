import Arena from "./arena.js";
import {Player, DemoPlayer, LocalPlayer, SocketPlayer} from "./player.js";
export const createDemoGame = (scene)=>{
  BABYLON.SceneLoader.ImportMesh("Cube.001", "models/tanks/sand_tank/",
       "sand_tank.babylon", scene, newMeshes=>{
        const tank1 = newMeshes[0];
        const tank2 = tank1.createInstance("tank2");
        const arena = new Arena(scene);
        const Player1 = new LocalPlayer(tank1, arena);
        const Player2 = new DemoPlayer(tank2);

        const game = new Game(scene, [Player1, Player2], arena );

        game.startGame();

       });
};
export class Game{
  constructor(scene, players, arena ){
    this.players = players;
    this.currentPlayerIdx = 0;
    this.myPlayerIdx = 0;
    this.arena = arena;
    this.receiveMovePosition = this.receiveMovePosition.bind(this);
    this.receiveMoveType = this.receiveMoveType.bind(this);
    this.initialPositionTanks();
  }
  initialPositionTanks(){
    const midX = Math.floor(this.arena.ground.cellCount / 2);
    const midZ = Math.floor(this.arena.ground.cellCount /4);
    const globalCoordinates = this.arena.ground.cellIndicesToGlobalCoordinates(
      [midX, midZ]
    );

    this.players[this.myPlayerIdx].tank.position = globalCoordinates;

    const otherPlayerIdx = this.myPlayerIdx === 0 ? 1 : 0;
    const matrix = BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, Math.PI);
    this.players[otherPlayerIdx].tank.position = BABYLON.Vector3.TransformCoordinates(
      globalCoordinates, matrix
    );
  }
  startGame(){
    this.startListeningForMoveOptions();
  }
  startListeningForMoveOptions(){
    this.players[this.currentPlayerIdx].startListeningForMoveOptions(this.receiveMoveType);
  }
  stopListeningForMoveOptions(){

  }
  startListeningForPosition(){
    this.players[this.currentPlayerIdx].startListeningForPosition(
      this.receiveMovePosition);
  }
  receiveMoveType(type){
    switch(type){
      case "position":
        this.startListeningForPosition();
        break;
    }
  }
  receiveMovePosition(position){
    this.players[this.currentPlayerIdx].tank.position = position;
    this.switchPlayer();
    this.startListeningForMoveOptions();
  }
  startListeningForTrajectory(){

  }
  stopListeningForTrajectory(){

  }

  switchPlayer(){
    if(++this.currentPlayerIdx > this.players.length -1){
      this.currentPlayerIdx = 0;
    }
  }
}
