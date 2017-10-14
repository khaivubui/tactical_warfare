import Arena from "./arena.js";
import {Player, OpponentPlayer, DemoPlayer, LocalPlayer, SocketPlayer} from "./player.js";
import {Bomb} from "./projectile/projectile";
import {socket} from "./websockets";
import { notifyTurn } from './websockets';

const TANK_MASS = 27000; //kg
const BOMB_MASS = 1; //kg
const DEFAULT_FIRING_IMPULSE = 20;
const TANK_CANNON_LENGTH = 1;
const TANK_POS_HEIGHT = 3;

export const createDemoGame = (scene) => {
      const localTank = scene.tankMesh;
      const socketTank = localTank.clone("socketTank");
      socketTank.rotation.y = Math.PI;
      const arena = new Arena(scene);
      const Player1 = new LocalPlayer(localTank, scene, arena);
      const Player2 = new DemoPlayer(socketTank);
      scene.localTank = localTank;
      scene.socketTank = socketTank;
      socketTank.material.specularPower = 300;
      socketTank.material.specularColor = new BABYLON.Color3(0.7,0.7,0.7);
      applyGreenTexture(localTank, scene);
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

const applyGreenTexture = (tank, scene) => {
  const originalMat = tank.material;
  const greenTankMaterial = new BABYLON.StandardMaterial("green");
      greenTankMaterial.specularPower = 300;
      greenTankMaterial.specularColor = new BABYLON.Color3(0.7,0.7,0.7);
      greenTankMaterial.diffuseTexture = scene.greenTankTexture;
      greenTankMaterial.diffuseTexture.hasAlpha = true;
      greenTankMaterial.bumpTexture = originalMat.bumpTexture;
      tank.material = greenTankMaterial;
      const childMeshes = tank.getChildMeshes();
      let name;
      for(let i = 0; i < childMeshes.length; ++i){
        name = childMeshes[i].name.split(".");
        name = name[name.length -1];
        switch(name){
          case "tank_tracks":
            break;
          default:
            childMeshes[i].material = greenTankMaterial;
            break;
        }
      }

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
    this._switchPlayer = this._switchPlayer.bind(this);
    this._startTurn = this._startTurn.bind(this);
    socket.on("switchPlayer", () => {
      this._switchPlayer();
      this._startTurn();
    });
  }
  reset(){
    clearTimeout(this.timeoutID);
    const turnOptions = document.getElementById('turn-options');
    turnOptions.style["max-width"] = 0;
    this.currentPlayerIdx = 0;
    this.initialPositionTanks();
    this.players[0].health = 100;
  }
  _applyGameState(state){
    const statePlayers = [state.activePlayer, state.passivePlayer];
    const playerPhysicsImpostors = state.playerPhysicsImpostors;
    let players;
    if(this.currentPlayerIdx === 0){
      players= this.players;
    }
    else{
      players = [this.players[1], this.players[0]];
    }

    let statePlayersKeys;
    for(let i = 0; i < 2 ; ++i){
      statePlayersKeys = Object.keys(statePlayers[i]);
      statePlayersKeys.forEach(key => {
        players[i][key] = statePlayers[i][key];
      });
    }
    let physicsImpostorsKeys;
    for(let i = 0; i< 2; ++i){
      physicsImpostorsKeys = Object.keys(playerPhysicsImpostors[i]);
      physicsImpostorsKeys.forEach(key => {
        players[i].physicsImpostor[key] = playerPhysicsImpostors[i][key];
      })
    }
  }
  getGameState(){
    const state = {playerPhysicsImpostors: []};
    const activePlayer = this.players[this.currentPlayerIdx];
    const passivePlayer = this.players[this.currentPlayerIdx === 0 ? 1 : 0];
    const players = [activePlayer, passivePlayer];
    const statePlayers = [{},{}];
    for(let i = 0; i < 2; ++i){
      statePlayers[i].health = players[i].health;
      statePlayers[i].position = players[i].position;
      statePlayers[i].rotation = players[i].rotation;
      state.playerPhysicsImpostors[i].linearVelocity =
        players[i].physicsImpostor.getLinearVelocity();
      state.playerPhysicsImpostors[i].angularVelocitu =
        players[i].physicsImpostor[i].getAngularVelocity();
    }
    state.activePlayer = statePlayers[0];
    state.passivePlayer = statePlayers[1];
    return state;
  }
  initialPositionTanks(){
    const midX = Math.floor(this.arena.ground.cellCount / 2);
    const midZ = Math.floor(this.arena.ground.cellCount /4);
    const globalCoordinates = this.arena.ground.cellIndicesToGlobalCoordinates(
      [midX, midZ]
    );

    this.players[this.myPlayerIdx].tank.position = globalCoordinates;
    const otherPlayerIdx = this.myPlayerIdx === 0 ? 1 : 0;
    this.players[this.myPlayerIdx].tank.position.y = TANK_POS_HEIGHT;
    const matrix = BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, Math.PI);
    this.players[otherPlayerIdx].tank.position = BABYLON.Vector3.TransformCoordinates(
      globalCoordinates, matrix
    );
    this.players[otherPlayerIdx].tank.position.y = 0.5;
    for(let i = 0; i < this.players.length; ++i){
      this.players[i].resetCannon();
    }
  }

  startGame(){
    this._startTurn();
  }

  _startTurn() {
    this._startListeningForMoveOptions();
    const otherPlayer = this.currentPlayerIdx === 0 ? 1 : 0;
    if (this.players[otherPlayer] instanceof SocketPlayer) {
      this.timeoutID = setTimeout(() => {
        socket.emit("switchPlayer");
        this._switchPlayer();
        this._startTurn();
      }, 10000);
    }
  }

  _startListeningForMoveOptions(){
    this.players[this.currentPlayerIdx].startListeningForMoveOptions(this._receiveMoveType);
  }
  startListeningForPosition(){
    this.players[this.currentPlayerIdx].startListeningForPosition(
      this.receiveMovePosition, this._startListeningForMoveOptions);
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
    clearTimeout(this.timeoutID);
    this.players[this.currentPlayerIdx].tank.position = position;
    // this.players[this.currentPlayerIdx].tank.rotation = new BABYLON.Vector3.Zero();
    this.players[this.currentPlayerIdx].tank.position.y =
      TANK_POS_HEIGHT;
    this._switchPlayer();
    this._startTurn();
  }

  _switchPlayer(){
    this.players[this.currentPlayerIdx].endTurn();
    const otherPlayer = this.currentPlayerIdx === 0 ? 1 : 0;
    if (!(this.players[otherPlayer] instanceof DemoPlayer)) {
      if (this.currentPlayerIdx === 0) {
        this.currentPlayerIdx = 1;
      } else {
        this.currentPlayerIdx = 0;
      }
      notifyTurn();
    }
  }

  _receiveAttack(matrix){
    clearTimeout(this.timeoutID);
    const bombScale = new BABYLON.Vector3.Zero();
    const bombRot = new BABYLON.Quaternion.Identity();
    const bombPos = new BABYLON.Vector3.Zero();
    matrix.decompose(bombScale, bombRot, bombPos)
    const rotationComponent = matrix.getRotationMatrix();
    const impulseVector = new BABYLON.Vector3.TransformCoordinates(
      new BABYLON.Vector3(0,0, -DEFAULT_FIRING_IMPULSE),
      rotationComponent
    );
    const bomb = new Bomb(this,bombPos,
      bombRot.toEulerAngles());
    bomb.fire(impulseVector, this._receiveAttackFinished);
  }
  _receiveAttackFinished(){
    this._switchPlayer();
    this._startTurn();
  }
}
