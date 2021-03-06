import {
  storeCameraState,
  restoreCameraState
} from "./game_utils/camera_utils";
import { socket } from "./websockets";
import { hideCameraRotation, showCameraRotation } from "./ui/camera_rotation";

const AIMING_CAMERA_ROT_SPEED = 0.035;
const AIMING_CAMERA_RADIUS = 2;
const AIMING_CAMERA_HEIGHT = 1;

const AIMING_MAX_X_ROT = 0.9;
const AIMING_MIN_X_ROT = -0.5;

const TANK_OPTIONS_WIDTH = 200;
const TANK_CANNON_LENGTH = 1.8;

export class Player {
  constructor(tank) {
    this.tank = tank;
    this.health = 100;

    const childMeshes = this.tank.getChildMeshes();
    this._rotXMesh = null;
    this._rotYMesh = null;
    let name;
    for (let i = 0; i < childMeshes.length; ++i) {
      name = childMeshes[i].name;
      name = name.split(".");
      name = name[name.length - 1];
      if (name === "tank_rot_x") {
        this._rotXMesh = childMeshes[i];
      } else if (name === "tank_rot_y") {
        this._rotYMesh = childMeshes[i];
      }
    }
  }
  startListeningForAttack(onDoneCallback) {
    onDoneCallback(new BABYLON.Matrix.Identity());
  }
  receiveDamage(amount) {
    this.health -= amount;
  }

  resetCannon() {
    this._rotXMesh.rotation.x = 0;
    this._rotYMesh.rotation.y = 0;
  }
}

export class DemoPlayer extends Player {
  constructor(tank) {
    super(tank);
  }

  startListeningForMoveOptions(onDoneCallback) {
    onDoneCallback("position");
  }
  setUpright(){
    if(this.tank.rotationQuaternion){
      BABYLON.Quaternion.RotationAxisToRef(BABYLON.Vector3.Up(),
        Math.PI, this.tank.rotationQuaternion);
    }
    else{
      this.tank.rotation.x = 0;
      this.tank.rotation.y = Math.PI;
      this.tank.rotation.z = 0;
    }
  }

  startListeningForPosition(onDoneCallback) {
    onDoneCallback(this.tank.position);
  }
  endTurn() {}
}

export class SocketPlayer extends Player {
  constructor(tank) {
    super(tank);
    this._rotateOpponentPos = this._rotateOpponentPos.bind(this);
    this._rotateOpponentAttack = this._rotateOpponentAttack.bind(this);
    this.stopListeningForPosition = this.stopListeningForPosition.bind(this);
    this.stopListeningForMoveOptions = this.stopListeningForMoveOptions.bind(
      this
    );
    this.stopListeningForAttack = this.stopListeningForAttack.bind(this);
  }

  setUpright(){
    if(this.tank.rotationQuaternion){
      BABYLON.Quaternion.RotationAxisToRef(BABYLON.Vector3.Up(),
        Math.PI, this.tank.rotationQuaternion);
    }
    else{
      this.tank.rotation.x = 0;
      this.tank.rotation.y = Math.PI;
      this.tank.rotation.z = 0;
    }
  }

  startListeningForPosition(onDoneCallback, onCancelledCallback){
    socket.on("position", pos =>{
      this.setUpright();
      onDoneCallback(this._rotateOpponentPos(pos));
      this.stopListeningForPosition();
    });
    socket.on("cancel", () => {
      onCancelledCallback();
      this.stopListeningForPosition();
    });
  }
  // Turn off socket when LocalPlayer is emitting positions
  stopListeningForPosition() {
    socket.off("position");
    socket.off("cancel");
  }
  // Socket player listens for opponent's move options
  startListeningForMoveOptions(onDoneCallback) {
    socket.on("moveType", type => {
      onDoneCallback(type);
      this.stopListeningForMoveOptions();
    });
  }

  // Turn off socket when LocalPlayer is emitting initial move choices
  stopListeningForMoveOptions() {
    socket.off("moveType");
  }

  startListeningForAttack(onDoneCallback, onCancelledCallback){
    this.setUpright();
    socket.on("attack", matrix=> {
      onDoneCallback(this._rotateOpponentAttack(matrix));
      this.stopListeningForAttack();
    });
    socket.on("cancel", () => {
      onCancelledCallback();
      this.stopListeningForAttack();
    });
  }

  stopListeningForAttack() {
    socket.off("attack");
    socket.off("cancel");
  }

  _rotateOpponentPos(pos) {
    return BABYLON.Vector3.TransformCoordinates(
      pos,
      BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, Math.PI)
    );
  }
  _rotateOpponentAttack(matrix) {
    const mat = new BABYLON.Matrix.Identity();
    mat.m = matrix.m;
    return mat.multiply(BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, Math.PI));
  }

  endTurn() {
    this.stopListeningForMoveOptions();
    this.stopListeningForAttack();
    this.stopListeningForPosition();
  }
}

export class LocalPlayer extends Player {
  constructor(tank, scene, arena) {
    super(tank);
    this.arena = arena;
    this.scene = scene;
    this.handleAimingMouseDrag = this.handleAimingMouseDrag.bind(this);
    this._stopListeningForPosition = this._stopListeningForPosition.bind(this);
    this._handleZoomIn = this._handleZoomIn.bind(this);
    this._handleZoomOut = this._handleZoomOut.bind(this);
    this._lockChangeAlert = this._lockChangeAlert.bind(this);
  }
  setUpright(){
    if(this.tank.rotationQuaternion){
      this.tank.rotationQuaternion = new BABYLON.Quaternion.Identity();
    }
    else{
      this.tank.rotation.x = 0;
      this.tank.rotation.y = 0;
      this.tank.rotation.z  = 0;
    }
  }
  _handleMoveOption(onDoneCallback){
    return type => e => {
      this._stopListeningForMoveOptions();
      socket.emit("moveType", type);
      onDoneCallback(type);
    };
  }

  _stopListeningForMoveOptions() {
    const turnOptions = document.getElementById("turn-options");
    const attack = document.getElementById("attack-button");
    const move = document.getElementById("move-button");
    const forfeit = document.getElementById("forfeit-button");
    turnOptions.style["max-width"] = "0";
    attack.onclick = null;
    move.onClick = null;
    forfeit.onClick = null;
  }

  startListeningForMoveOptions(onDoneCallback) {
    this._maximizeTankOptions("turn-options");
    const attack = document.getElementById("attack-button");
    const move = document.getElementById("move-button");
    const forfeit = document.getElementById("forfeit-button");
    const zoomin = document.querySelector(".zoom-in");
    const zoomout = document.querySelector(".zoom-out");
    attack.onclick = this._handleMoveOption(onDoneCallback)("attack");
    move.onclick = this._handleMoveOption(onDoneCallback)("position");
    forfeit.onclick = this._handleMoveOption(onDoneCallback)("forfeit");
    zoomin.onclick = this._handleZoomIn();
    zoomout.onclick = this._handleZoomOut();
  }

  _handleConfirmPosition(onDoneCallback) {
    return position => {
      this.setUpright();
      this._stopListeningForPosition();
      socket.emit("position", position);
      onDoneCallback(position);
    };
  }

  _stopListeningForPosition() {
    this._minimizeTankOptions("position-options");
    this.arena.ground.cancelListeningForPosition();
  }

  startListeningForPosition(onDoneCallback, onCancelledCallback) {
    this._maximizeTankOptions("position-options");
    const cancel = document.querySelector("#position-options .cancel-button");
    cancel.onclick = () => {
      this._stopListeningForPosition();
      this.arena.ground.cancelListeningForPosition();
      socket.emit("cancel");
      onCancelledCallback();
    };
    this.arena.ground.startListeningForPosition(
      this._handleConfirmPosition(onDoneCallback)
    );
  }
  _positionAimingCamera() {
    const camera = this.scene.activeCamera;
    const cameraTarget = this._rotXMesh.getAbsolutePosition().clone();
    cameraTarget.y += AIMING_CAMERA_HEIGHT;
    camera.target = cameraTarget;
    camera.radius = AIMING_CAMERA_RADIUS;
    camera.alpha = -1 * this._rotYMesh.rotation.y - Math.PI / 2;
    camera.beta = this._rotXMesh.rotation.x + Math.PI / 2;
  }
  _maximizeTankOptions(id) {
    const options = document.getElementById(id);
    options.style["max-width"] = `${TANK_OPTIONS_WIDTH}px`;
  }
  _minimizeTankOptions(id) {
    const options = document.getElementById(id);
    options.style["max-width"] = "0";
  }
  _lockChangeAlert(attackCancelledCallback){
    return e => {
      const canvas = document.getElementById("render-canvas");
      if(document.pointerLockElement !== canvas){
        this._stopListeningForAttack();
        attackCancelledCallback();
      }
    };
  }
  startListeningForAttack(onDoneCallback, onCancelledCallback) {
    this.setUpright();
    showCameraRotation();
    //this._maximizeTankOptions("attack-options");
    const camera = this.scene.activeCamera;
    const canvas = document.getElementById("render-canvas");
    const rotationWidget = document.querySelector(".camera-rotation");
    const fire = document.getElementById("fire-button");
    const cancel = document.querySelector("#attack-options .cancel-button");
    canvas.requestPointerLock();
    canvas.onmousemove = this.handleAimingMouseDrag;
    document.onpointerlockchange = this._lockChangeAlert(onCancelledCallback);
    canvas.onclick = e => {
      this._stopListeningForAttack();
      document.onpointerlockchange = undefined;
      document.exitPointerLock();
      const projectileMatrix = this._calculateProjectileMatrix();
      socket.emit("attack", projectileMatrix);
      onDoneCallback(projectileMatrix);
    };
    this.originalRotationWidgetMouseDown = rotationWidget.onmousedown;
    //rotationWidget.onmousedown = this.handleAimingMouseDown;
    this._storeCameraState();
    this._setUpAimingCamera();
    this._positionAimingCamera();
  }
  _calculateProjectileMatrix() {
    const tankCannonMatrix = this._rotXMesh.worldMatrixFromCache;
    const bombOffsetLocal = new BABYLON.Matrix.Translation(
      0,
      0,
      -TANK_CANNON_LENGTH
    );
    return bombOffsetLocal.multiply(tankCannonMatrix);
  }
  _stopListeningForAttack() {
    const canvas = document.getElementById("render-canvas");
    hideCameraRotation();
    this._restoreCameraState();
    this._minimizeTankOptions("attack-options");
    const rotationWidget = document.querySelector(".camera-rotation");
    rotationWidget.onmousedown = this.originalRotationWidgetMouseDown;
    canvas.onmousemove = undefined;
    canvas.onclick = undefined;
  }

  _setUpAimingCamera() {
    const camera = this.scene.activeCamera;
    camera.lowerAlphaLimit = null;
    camera.upperAlphaLimit = null;
    camera.lowerBetaLimit = null;
    camera.upperBetaLimit = null;
    camera.lowerRadiusLimit = 0;
    camera.radius = AIMING_CAMERA_RADIUS;
    camera.detachControl(this.previousCameraState.inputs.attachedElement);
  }
  _storeCameraState() {
    const camera = this.scene.activeCamera;
    this.previousCameraState = storeCameraState(camera);
  }
  _restoreCameraState() {
    const camera = this.scene.activeCamera;
    if (this.previousCameraState) {
      restoreCameraState(camera, this.previousCameraState);
      camera.attachControl(this.previousCameraState.inputs.attachedElement);
    }
    // const canvas = document.getElementById("render-canvas");
  }
  handleAimingMouseDrag(e) {
    this._rotYMesh.rotation.y += e.movementX * AIMING_CAMERA_ROT_SPEED;
    this._rotXMesh.rotation.x -= e.movementY * AIMING_CAMERA_ROT_SPEED;
    if (this._rotXMesh.rotation.x > AIMING_MAX_X_ROT) {
      this._rotXMesh.rotation.x = AIMING_MAX_X_ROT;
    }
    if (this._rotXMesh.rotation.x < AIMING_MIN_X_ROT) {
      this._rotXMesh.rotation.x = AIMING_MIN_X_ROT;
    }
    this._positionAimingCamera();
  }
  // Zoom in button on the left
  _handleZoomIn() {
    return e => {
      if (this.scene.activeCamera.radius > 0) {
        this.scene.activeCamera.radius -= 3;
      }
    };
  }
  // Zoom out button on the left
  _handleZoomOut() {
    return e => {
      this.scene.activeCamera.radius += 3;
    };
  }

  // For end turn, turn off all socket player sockets
  endTurn() {
    this._stopListeningForMoveOptions();
    this._stopListeningForAttack();
    this._stopListeningForPosition();
  }

  receiveDamage(amount) {
    super.receiveDamage(amount);
    const health = document.querySelector("#health");
    health.innerHTML = this.health;
  }
  // hide "forfeit" button in Demo game
  hideForfeitButton() {
    const forfeitWrapper = document.getElementById("forfeit-wrapper");
    forfeitWrapper.style["max-height"] = "0px";
  }
  // show "forfeit" button in Online game
  showForfeitButton() {
    const forfeitWrapper = document.getElementById("forfeit-wrapper");
    forfeitWrapper.style["max-height"] = "140px";
  }
}
