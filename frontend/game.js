import Arena from "./arena.js";
import { Player, DemoPlayer, LocalPlayer, SocketPlayer } from "./player.js";
import { Bomb } from "./projectile/projectile";
import { socket } from "./websockets";
import { notifyTurn, showActiveSocketsWidgetToggle } from "./websockets";
import { unhideAuthWidgetToggle } from "./auth_stuff/auth_stuff";
import { renderTimer, clearTimer } from "./ui/timer";

const TANK_MASS = 27000; //kg
const BOMB_MASS = 1; //kg
const DEFAULT_FIRING_IMPULSE = 20;
const TANK_CANNON_LENGTH = 1;
const TANK_POS_HEIGHT = 3;
const GAME_STATE_SEND_INTERVAL = 100;
const TURN_TIME = 15000;

export const createDemoGame = scene => {
  const localTank = scene.tankMesh;
  const socketTank = localTank.clone("socketTank");
  socketTank.rotation.y = Math.PI;
  const arena = new Arena(scene);
  const Player1 = new LocalPlayer(localTank, scene, arena);
  const Player2 = new DemoPlayer(socketTank);
  Player1.hideForfeitButton();
  scene.localTank = localTank;
  scene.socketTank = socketTank;
  socketTank.material.specularPower = 300;
  socketTank.material.specularColor = new BABYLON.Color3(0.7, 0.7, 0.7);
  applyGreenTexture(localTank, scene);
  localTank.physicsImpostor = new BABYLON.PhysicsImpostor(
    localTank,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 2, restitution: 0 },
    scene
  );
  localTank.scaling.y = 0.9;
  localTank.scaling.x = 0.9;
  localTank.scaling.z = 0.9;

  socketTank.physicsImpostor = new BABYLON.PhysicsImpostor(
    socketTank,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 2, restitution: 0 },
    scene
  );
  socketTank.scaling.y = 0.9;
  socketTank.scaling.x = 0.9;
  socketTank.scaling.z = 0.9;
  const game = new Game(scene, [Player1, Player2], arena);

  return game;
};

const applyGreenTexture = (tank, scene) => {
  const originalMat = tank.material;
  const greenTankMaterial = new BABYLON.StandardMaterial("green");
  greenTankMaterial.specularPower = 300;
  greenTankMaterial.specularColor = new BABYLON.Color3(0.7, 0.7, 0.7);
  greenTankMaterial.diffuseTexture = scene.greenTankTexture;
  greenTankMaterial.diffuseTexture.hasAlpha = true;
  greenTankMaterial.bumpTexture = originalMat.bumpTexture;
  tank.material = greenTankMaterial;
  const childMeshes = tank.getChildMeshes();
  let name;
  for (let i = 0; i < childMeshes.length; ++i) {
    name = childMeshes[i].name.split(".");
    name = name[name.length - 1];
    switch (name) {
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
  if (isFirst) {
    game.players[0] = new LocalPlayer(
      game.scene.localTank,
      game.scene,
      game.arena
    );
    game.players[1] = new SocketPlayer(game.scene.socketTank);
    game.players[0].showForfeitButton();
  } else {
    game.players[0] = new SocketPlayer(game.scene.socketTank);
    game.players[1] = new LocalPlayer(
      game.scene.localTank,
      game.scene,
      game.arena
    );
    game.players[1].showForfeitButton();
  }
  game.startGame();
};

export class Game {
  constructor(scene, players, arena) {
    this.players = players;
    window.game = this;
    this.currentPlayerIdx = 0;
    this.myPlayerIdx = 0;
    this.scene = scene;
    this.arena = arena;
    this.receiveMovePosition = this.receiveMovePosition.bind(this);
    this._receiveMoveType = this._receiveMoveType.bind(this);
    this._receiveAttack = this._receiveAttack.bind(this);
    this._startListeningForMoveOptions = this._startListeningForMoveOptions.bind(
      this
    );
    this._receiveAttackFinished = this._receiveAttackFinished.bind(this);
    this.initialPositionTanks();
    this.bombsCreatedSinceStart = 0;
    this.explosionsCreatedSinceStart = 0;
    this._switchPlayer = this._switchPlayer.bind(this);
    this._startTurn = this._startTurn.bind(this);
    this._gameOver = this._gameOver.bind(this);
    this.restartGame = this.restartGame.bind(this);
    socket.on("switchPlayer", () => {
      this._switchPlayer();
      this._startTurn();
    });
    socket.on("turnResult", state => {
      this._applyGameState(state);
      this._switchPlayer();
      this._startTurn();
    });
    socket.on("gameState", state => {
      this._applyGameState(state);
    });
    this.bombs = [];

    socket.on("resetGame", () => this.restartGame());
  }
  notifyTurn(){
    const turnNotification = document.querySelector(".turn-notification");
    turnNotification.innerHTML =
      this.players[this.currentPlayerIdx] instanceof LocalPlayer ?
      "YOUR MOVE" : "ENEMY MOVE";
    turnNotification.style["max-width"] = "300px";
    window.setTimeout(() => {
      turnNotification.style["max-width"] = "0";
    }, 1000);
  }
  // Restart a Demo game for both players after one player lost
  restartGame() {
    for(let i = 0; i < this.players.length; ++i){
      this.players[i].endTurn();
    }
    const socketPlayer = this.findOpponentPlayer();
    this.players[0] = new LocalPlayer(
      this.findLocalPlayer().tank,
      this.scene,
      this.arena
    );
    if (socketPlayer) {
      this.players[1] = new DemoPlayer(socketPlayer.tank);
    }
    const chatWidget = document.querySelector(".chat-widget");
    chatWidget.style["max-height"] = "0px";
    this.players[0].hideForfeitButton();
    unhideAuthWidgetToggle();
    this.reset();
    this.startGame();
    showActiveSocketsWidgetToggle();
  }
  // Find the current Local player helper method
  findLocalPlayer() {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i] instanceof LocalPlayer) {
        return this.players[i];
      }
    }
  }
  //Find the current Socket player helper method
  findOpponentPlayer() {
    for (let i = 0; i < this.players.length; i++) {
      if (! (this.players[i] instanceof LocalPlayer)) {
        return this.players[i];
      }
    }
  }

  reset() {
    clearTimeout(this.timeoutID);
    clearInterval(this.gameStateTimerID);
    clearTimer();
    const turnOptions = document.getElementById("turn-options");
    turnOptions.style["max-width"] = 0;
    this.currentPlayerIdx = 0;
    this.initialPositionTanks();
    this.players[0].health = 100;
    this.players[1].health = 100;
    const health = document.querySelector("#health");
    health.innerHTML = 100;
  }
  _applyGameState(state) {
    const worldRotYmatrix = BABYLON.Matrix.RotationAxis(
      BABYLON.Axis.Y,
      Math.PI
    );
    const statePlayers = [state.activePlayer, state.passivePlayer];
    const playerPhysicsImpostors = state.playerPhysicsImpostors;
    let players;
    if (this.currentPlayerIdx === 0) {
      players = this.players;
    } else {
      players = [this.players[1], this.players[0]];
    }
    let statePlayersKeys;
    for (let i = 0; i < 2; ++i) {
      statePlayersKeys = Object.keys(statePlayers[i]);
      statePlayersKeys.forEach(key => {
        players[i][key] = statePlayers[i][key];
      });
    }
    for (let i = 0; i < 2; ++i) {
      if (state.tanks[i].cannonX !== undefined) {
        players[i]._rotXMesh.rotation.x = state.tanks[i].cannonX;
      }
      if (state.tanks[i].cannonY !== undefined) {
        players[i]._rotYMesh.rotation.y = state.tanks[i].cannonY;
      }
      if (state.tanks[i].position) {
        BABYLON.Vector3.TransformCoordinatesToRef(
          state.tanks[i].position,
          worldRotYmatrix,
          players[i].tank.position
        );
      }
      if (state.tanks[i].rotation) {
        BABYLON.Quaternion
          .FromRotationMatrix(worldRotYmatrix)
          .multiplyToRef(
            state.tanks[i].rotation,
            players[i].tank.rotationQuaternion
          );
      }
      if (state.playerPhysicsImpostors[i].angularVelocity) {
        players[i].tank.physicsImpostor.setAngularVelocity(
          new BABYLON.Quaternion(
            state.playerPhysicsImpostors[i].angularVelocity.x,
            state.playerPhysicsImpostors[i].angularVelocity.y,
            state.playerPhysicsImpostors[i].angularVelocity.z,
            state.playerPhysicsImpostors[i].angularVelocity.w
          )
        );
      }
      if (state.playerPhysicsImpostors[i].linearVelocity) {
        players[i].tank.physicsImpostor.setLinearVelocity(
          BABYLON.Vector3.TransformCoordinates(
            state.playerPhysicsImpostors[i].linearVelocity,
            worldRotYmatrix
          )
        );
      }
    }

    for (let i = 0; i < state.bombs.length; ++i) {
      if (this.bombs[i].mesh) {
        BABYLON.Vector3.TransformCoordinatesToRef(
          state.bombs[i].position,
          worldRotYmatrix,
          this.bombs[i].mesh.position
        );
        BABYLON.Quaternion.FromRotationMatrixToRef(
          this.bombs[i].mesh.worldMatrixFromCache.multiply(worldRotYmatrix),
          this.bombs[i].mesh.rotationQuaternion
        );
        this.bombs[i].physicsImpostor.setLinearVelocity(
          BABYLON.Vector3.TransformCoordinates(
            state.bombs[i].linearVelocity,
            worldRotYmatrix
          )
        );
        this.bombs[i].physicsImpostor.setAngularVelocity(
          new BABYLON.Quaternion(
            state.bombs[i].angularVelocity.x,
            state.bombs[i].angularVelocity.y,
            state.bombs[i].angularVelocity.z,
            state.bombs[i].angularVelocity.w
          )
        );
      }
    }
  }
  getGameState() {
    const state = {
      playerPhysicsImpostors: [{}, {}],
      bombs: []
    };
    const activePlayer = this.players[this.currentPlayerIdx];
    const passivePlayer = this.players[this.currentPlayerIdx === 0 ? 1 : 0];
    const players = [activePlayer, passivePlayer];
    const statePlayers = [{}, {}];
    const stateTanks = [{}, {}];
    for (let i = 0; i < 2; ++i) {
      statePlayers[i].health = players[i].health;
      stateTanks[i].position = players[i].tank.position;
      stateTanks[i].rotation = players[i].tank.rotationQuaternion;
      stateTanks[i].cannonX = players[i]._rotXMesh.rotation.x;
      stateTanks[i].cannonY = players[i]._rotYMesh.rotation.y;
      state.playerPhysicsImpostors[i].linearVelocity = players[
        i
      ].tank.physicsImpostor.getLinearVelocity();
      state.playerPhysicsImpostors[i].angularVelocity = players[
        i
      ].tank.physicsImpostor.getAngularVelocity();
    }
    let bombState;
    for (let i = 0; i < this.bombs.length; ++i) {
      bombState = {};
      if (this.bombs[i].mesh) {
        bombState.position = this.bombs[i].mesh.position;
        bombState.rotation = this.bombs[i].mesh.rotationQuaterion;
        if (this.bombs[i].physicsImpostor) {
          bombState.linearVelocity = this.bombs[
            i
          ].physicsImpostor.getLinearVelocity();
          bombState.angularVelocity = this.bombs[
            i
          ].physicsImpostor.getAngularVelocity();
        }
        state.bombs.push(bombState);
      }
    }
    state.activePlayer = statePlayers[0];
    state.passivePlayer = statePlayers[1];
    state.tanks = stateTanks;
    return state;
  }

  initialPositionTanks(){
    const localPlayer = this.findLocalPlayer();
    const opponentPlayer = this.findOpponentPlayer();
    const midX = Math.floor(this.arena.ground.cellCount / 2);
    const midZ = Math.floor(this.arena.ground.cellCount / 4);
    const globalCoordinates = this.arena.ground.cellIndicesToGlobalCoordinates([
      midX,
      midZ
    ]);

    localPlayer.tank.position = globalCoordinates;
    const otherPlayerIdx = this.myPlayerIdx === 0 ? 1 : 0;
    localPlayer.tank.position.y = TANK_POS_HEIGHT;
    const matrix = BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, Math.PI);
    opponentPlayer.tank.position = BABYLON.Vector3.TransformCoordinates(
      globalCoordinates,
      matrix
    );
    opponentPlayer.tank.position.y = 0.5;
    for (let i = 0; i < this.players.length; ++i) {
      this.players[i].resetCannon();
    }
    opponentPlayer.setUpright();
    localPlayer.setUpright();
  }
  // Start new Online game
  startGame() {
    this.notifyTurn();
    this._startTurn();
  }

  _startTurn() {

    const otherPlayer = this.currentPlayerIdx === 0 ? 1 : 0;
    if (this.players[this.currentPlayerIdx].health <= 0) {
      return this._gameOver(this.players[this.currentPlayerIdx]);
    } else if (this.players[otherPlayer].health <= 0) {
      return this._gameOver(this.players[otherPlayer]);
    }

    //this.players[this.currentPlayerIdx].setUpright();
    this._startListeningForMoveOptions();
    if (this.players[otherPlayer] instanceof SocketPlayer) {
      setTimeout(()=>{
        renderTimer(TURN_TIME);
      }, 5000);
      this.timeoutID = setTimeout(() => {
        socket.emit("switchPlayer");
        this._switchPlayer();
        this._startTurn();
      }, TURN_TIME);
      this.gameStateTimerID = setInterval(() => {
        socket.emit("gameState", this.getGameState());
      }, GAME_STATE_SEND_INTERVAL);
    }
  }

  _gameOver(loser) {
    if (loser instanceof LocalPlayer) {
      const gameoverNotification = document.querySelector(".turn-notification");
      gameoverNotification.innerHTML = "Defeat!";
    } else if (loser instanceof SocketPlayer) {
      const gameoverNotification = document.querySelector(".turn-notification");
      gameoverNotification.innerHTML = "Victory!";
    }
    this.restartGame();
  }

  _startListeningForMoveOptions() {
    this.players[this.currentPlayerIdx].startListeningForMoveOptions(
      this._receiveMoveType
    );
  }
  startListeningForPosition() {
    this.players[this.currentPlayerIdx].startListeningForPosition(
      this.receiveMovePosition,
      this._startListeningForMoveOptions
    );
  }

  startListeningForAttack() {
    this.players[this.currentPlayerIdx].startListeningForAttack(
      this._receiveAttack,
      this._startListeningForMoveOptions
    );
  }
  _receiveMoveType(type) {
    switch (type) {
      case "position":
        this.startListeningForPosition();
        break;
      case "attack":
        this.startListeningForAttack();
        break;
      case "forfeit":
        this._gameOver(this.players[this.currentPlayerIdx]);
        break;
    }
  }
  receiveMovePosition(position) {
    clearTimeout(this.timeoutID);
    clearTimer();
    this.players[this.currentPlayerIdx].tank.position = position;
    this.players[this.currentPlayerIdx].tank.position.y = TANK_POS_HEIGHT;
    this._switchPlayer();
    this._startTurn();
  }

  _switchPlayer() {
    this.players[this.currentPlayerIdx].endTurn();
    clearInterval(this.gameStateTimerID);
    const otherPlayer = this.currentPlayerIdx === 0 ? 1 : 0;
    if (!(this.players[otherPlayer] instanceof DemoPlayer)) {
      if (this.currentPlayerIdx === 0) {
        this.currentPlayerIdx = 1;
      } else {
        this.currentPlayerIdx = 0;
      }
      this.notifyTurn();
      setTimeout(()=> {
        notifyTurn();
      }, 5000);
    }
  }

  _receiveAttack(matrix) {
    clearTimeout(this.timeoutID);
    clearTimer();
    const bombScale = new BABYLON.Vector3.Zero();
    const bombRot = new BABYLON.Quaternion.Identity();
    const bombPos = new BABYLON.Vector3.Zero();
    matrix.decompose(bombScale, bombRot, bombPos);
    const rotationComponent = matrix.getRotationMatrix();
    const impulseVector = new BABYLON.Vector3.TransformCoordinates(
      new BABYLON.Vector3(0, 0, -DEFAULT_FIRING_IMPULSE),
      rotationComponent
    );
    const bomb = new Bomb(this, bombPos, bombRot.toEulerAngles());
    let bombDoneCallback;
    if (this.players[this.currentPlayerIdx] instanceof LocalPlayer) {
      bombDoneCallback = this._receiveAttackFinished;
    } else {
      bombDoneCallback = () => {};
    }
    bomb.fire(impulseVector, () => {
      this.bombs.shift();
      bombDoneCallback();
    });
    this.bombs.push(bomb);
  }
  _receiveAttackFinished(){
    const otherPlayer = this.findOpponentPlayer();
    if(this.players[this.currentPlayerIdx]){
      if(otherPlayer  instanceof SocketPlayer){
        socket.emit("turnResult", this.getGameState());
        this._switchPlayer();
      }
      this._startTurn();
    }
  }
}
