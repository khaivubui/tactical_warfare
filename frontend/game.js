import Arena from "./arena.js";
import {Player, DemoPlayer, LocalPlayer, SocketPlayer} from "./player.js";

export const createDemoGame = (scene) => {
  BABYLON.SceneLoader.ImportMesh(
    "tank_body",
    "models/tanks/sand_tank/",
    "sand_tank.babylon",
    scene,
    newMeshes => {
      const tank1 = newMeshes[0];
      const tank2 = tank1.clone("tank2");
      tank2.rotation.y = Math.PI;
      const arena = new Arena(scene);
      const Player1 = new LocalPlayer(tank1, scene, arena);
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
    this.scene = scene;
    this.arena = arena;
    this.receiveMovePosition = this.receiveMovePosition.bind(this);
    this._receiveMoveType = this._receiveMoveType.bind(this);
    this._receiveAttack = this._receiveAttack.bind(this);
    this._startListeningForMoveOptions = this._startListeningForMoveOptions.bind(this);
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
    this._startListeningForMoveOptions();
  }
  _startListeningForMoveOptions(){
    this.players[this.currentPlayerIdx].startListeningForMoveOptions(this._receiveMoveType);
  }
  startListeningForPosition(){
    this.players[this.currentPlayerIdx].startListeningForPosition(
      this.receiveMovePosition, this._startListeningForMoveOptions);
  }
  _stopListeningForPosition(){

  }
  startListeningForAttack(){
    this.players[this.currentPlayerIdx].startListeningForAttack(
      this._receiveAttack, this._startListeningForMoveOptions);
  }
  _receiveMoveType(type){
    switch(type){
      case "position":
        this.startListeningForPosition();
        break;
      case "attack":
        this.startListeningForAttack();
        break;
    }
  }
  receiveMovePosition(position){
    this.players[this.currentPlayerIdx].tank.position = position;
    this._switchPlayer();
    this._startListeningForMoveOptions();
  }
  _receiveAttack(xRot, yRot){
    this._switchPlayer();
    this._startListeningForMoveOptions();
  }
  _startListeningForTrajectory(){

  }

  _switchPlayer(){
    if(++this.currentPlayerIdx > this.players.length -1){
      this.currentPlayerIdx = 0;
    }
  }
}
