import Arena from "./arena.js";
import {Player, OpponentPlayer, DemoPlayer, LocalPlayer, SocketPlayer} from "./player.js";
import {Bomb} from "./projectile/projectile";
const TANK_MASS = 27000; //kg
const BOMB_MASS = 1; //kg
const DEFAULT_FIRING_IMPULSE = 20;
const TANK_CANNON_LENGTH = 1;
export const createDemoGame = (scene) => {
      const localTank = scene.tankMesh;
      const socketTank = localTank.clone("socketTank");
      socketTank.rotation.y = Math.PI;
      const arena = new Arena(scene);
      const Player1 = new LocalPlayer(localTank, scene, arena);
      const Player2 = new DemoPlayer(socketTank);
      scene.localTank = localTank;
      scene.socketTank = socketTank;

      localTank.physicsImpostor = new BABYLON.PhysicsImpostor(localTank,
         BABYLON.PhysicsImpostor.BoxImpostor, {mass: 2, restitution: 0},
          scene);
      localTank.scaling.y = 0.9;
      localTank.scaling.x = 0.9;
      localTank.scaling.z = 0.9;

      socketTank.physicsImpostor = new BABYLON.PhysicsImpostor(socketTank,
         BABYLON.PhysicsImpostor.BoxImpostor, {mass: 2, restitution: 0},
         scene);
      socketTank.scaling.y = 0.9;
      socketTank.scaling.x = 0.9;
      socketTank.scaling.z = 0.9;
      const game = new Game(scene, [Player1, Player2], arena );

      return game;
};

export const startOnlineGame = (game, isFirst) => {
  game.reset();
  if(isFirst){
    game.players[0] = new LocalPlayer(game.scene.localTank,game.scene, game.arena);
    game.players[1] = new SocketPlayer(game.scene.socketTank);
  }
  else{
    game.players[0] = new SocketPlayer(game.scene.socketTank);
    game.players[1] =  new LocalPlayer(game.scene.localTank,game.scene, game.arena);
  }
  game.startGame();
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
    this._receiveAttackFinished = this._receiveAttackFinished.bind(this);
    this.initialPositionTanks();
    this.bombsCreatedSinceStart = 0;
    this.explosionsCreatedSinceStart = 0;

  }
  reset(){
    this.currentPlayerIdx = 0;
    this.initialPositionTanks();
    this.players[0].health = 100;
  }
  initialPositionTanks(){
    const midX = Math.floor(this.arena.ground.cellCount / 2);
    const midZ = Math.floor(this.arena.ground.cellCount /4);
    const globalCoordinates = this.arena.ground.cellIndicesToGlobalCoordinates(
      [midX, midZ]
    );



    this.players[this.myPlayerIdx].tank.position = globalCoordinates;
    this.players[this.myPlayerIdx].tank.position.y += 0.1;
    const otherPlayerIdx = this.myPlayerIdx === 0 ? 1 : 0;
    const matrix = BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, Math.PI);
    this.players[otherPlayerIdx].tank.position = BABYLON.Vector3.TransformCoordinates(
      globalCoordinates, matrix
    );
    this.players[otherPlayerIdx].tank.position.y += 0.1;
    for(let i = 0; i < this.players.length; ++i){
      this.players[i].resetCannon();
    }
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

  _switchPlayer(){
    if (this.currentPlayerIdx === 0) {
      this.currentPlayerIdx = 1;
    } else {
      this.currentPlayerIdx = 0;
    }
  }

  _receiveAttack(matrix){
    const bombScale = new BABYLON.Vector3.Zero();
    const bombRot = new BABYLON.Quaternion.Identity();
    const bombPos = new BABYLON.Vector3.Zero();
    matrix.decompose(bombScale, bombRot, bombPos)
    const rotationComponent = matrix.getRotationMatrix();
    const impulseVector = new BABYLON.Vector3.TransformCoordinates(
      new BABYLON.Vector3(0,0, -DEFAULT_FIRING_IMPULSE),
      rotationComponent
    );
    //vector3 TransformCoordinates(ve, mat)
    const bomb = new Bomb(this,bombPos,
      bombRot.toEulerAngles());
    bomb.fire(impulseVector, this._receiveAttackFinished);
  }
  _receiveAttackFinished(){
    this._switchPlayer();
    this._startListeningForMoveOptions();
  }
}
