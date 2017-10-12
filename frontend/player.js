const AIMING_CAMERA_ROT_SPEED = 0.05;
const AIMING_CAMERA_RADIUS = 2;
const AIMING_CAMERA_HEIGHT = 1;

const AIMING_MAX_X_ROT = 0.9;
const AIMING_MIN_X_ROT = - 0.5;

const TANK_OPTIONS_WIDTH = 200;

export class Player{
  constructor(tank){
    this.tank = tank;
  }
  startListeningForAttack(onDoneCallback){
    onDoneCallback(0,0);
  }
}

export class DemoPlayer extends Player{
  constructor(tank){
    super(tank);
  }

  startListeningForMoveOptions(onDoneCallback){
    onDoneCallback("attack");
  }

  startListeningForPosition(onDoneCallback){
    onDoneCallback(this.tank.position);
  }
};

export class SocketPlayer extends Player{
  constructor(tank){
    super(tank);
  }
  startListeningForPosition(onDoneCallback){
    //socket.on
  }
}

export class LocalPlayer extends Player{
  constructor(tank, scene, arena){
    super(tank);
    this.arena = arena;
    this.scene = scene;
    this.previousMouseX = null;
    this.previousMouseY = null;
    this.handleAimingMouseDrag = this.handleAimingMouseDrag.bind(this);
    this.handleAimingMouseDown = this.handleAimingMouseDown.bind(this);
    this.handleAimingMouseUp = this.handleAimingMouseUp.bind(this);
    this._stopListeningForPosition = this._stopListeningForPosition.bind(this);
    this._handleZoomIn = this._handleZoomIn.bind(this);
    this._handleZoomOut = this._handleZoomOut.bind(this);

    const childMeshes = this.tank.getChildMeshes();
    this._rotXMesh = null;
    this._rotYMesh = null;
    for(let i = 0; i < childMeshes.length; ++i){
      if(childMeshes[i].name === "tank_rot_x"){
        this._rotXMesh = childMeshes[i];
      }
      else if (childMeshes[i].name === "tank_rot_y"){
        this._rotYMesh = childMeshes[i];
      }
    }
  }

  _handleMoveOption(onDoneCallback){
    return type => e => {
      this._stopListeningForMoveOptions();
      onDoneCallback(type);
    }
  }

  _stopListeningForMoveOptions(){
    const turnOptions = document.getElementById('turn-options');
    const attack = document.getElementById('attack-button');
    const move = document.getElementById('move-button');
    const forfeit = document.getElementById('forfeit-button');
    turnOptions.style['max-width'] = '0';
    attack.onclick = null;
    move.onClick = null;
    forfeit.onClick = null;
  }

  startListeningForMoveOptions(onDoneCallback){
    this._maximizeTankOptions('turn-options');
    const attack = document.getElementById('attack-button');
    const move = document.getElementById('move-button');
    const forfeit = document.getElementById('forfeit-button');
    const zoomin = document.querySelector(".zoom-in");
    const zoomout = document.querySelector(".zoom-out");
    attack.onclick = this._handleMoveOption(onDoneCallback)("attack");
    move.onclick = this._handleMoveOption(onDoneCallback)("position");
    forfeit.onclick = this._handleMoveOption(onDoneCallback)("forfeit");
    zoomin.onclick = this._handleZoomIn();
    zoomout.onclick = this._handleZoomOut();
  }

  _handleConfirmPosition(onDoneCallback){
    return position =>{
      this._stopListeningForPosition();
      onDoneCallback(position);
    }
  }
  _stopListeningForPosition(){
    this._minimizeTankOptions('position-options');
  }
  startListeningForPosition(onDoneCallback, onCancelledCallback){
    this._maximizeTankOptions('position-options');
    const cancel = document.querySelector("#position-options .cancel-button");
    cancel.onclick =()=>{
      this._stopListeningForPosition();
      this.arena.ground.cancelListeningForPosition();
      onCancelledCallback();
    }
    this.arena.ground.startListeningForPosition(this._handleConfirmPosition(
      onDoneCallback));
    //socket.emit
  }
  _positionAimingCamera(){
    const camera = this.scene.activeCamera;
    const cameraTarget = this._rotXMesh.getAbsolutePosition().clone();
    cameraTarget.y += AIMING_CAMERA_HEIGHT;
    camera.target = cameraTarget;
    camera.radius = AIMING_CAMERA_RADIUS;
    camera.alpha = -1 *this._rotYMesh.rotation.y + Math.PI/2;
    camera.beta = this._rotXMesh.rotation.x + Math.PI/2;
  }
  _maximizeTankOptions(id){
    const options = document.getElementById(id);
    options.style['max-width'] = `${TANK_OPTIONS_WIDTH}px`;
  }
  _minimizeTankOptions(id){
    const options = document.getElementById(id);
    options.style['max-width'] = '0';
  }
  startListeningForAttack(onDoneCallback, onCancelledCallback){
    this._maximizeTankOptions('attack-options');
    const camera = this.scene.activeCamera;
    const canvas = document.getElementById("render-canvas");
    const rotationWidget = document.querySelector(".camera-rotation");
    const cancel = document.querySelector("#attack-options .cancel-button");
    cancel.onclick = ()=>{
      this._stopListeningForAttack();
       onCancelledCallback();
     }
    this.originalRotationWidgetMouseDown = rotationWidget.onmousedown;
    rotationWidget.onmousedown  = this.handleAimingMouseDown;
    this._storeCameraState();
    this._positionAimingCamera();

  }
  _stopListeningForAttack(){
    this._restoreCameraState();
    this._minimizeTankOptions('attack-options');
    const rotationWidget = document.querySelector(".camera-rotation");
      rotationWidget.onmousedown   = this.originalRotationWidgetMouseDown;
  }
  _storeCameraState(){
    const camera = this.scene.activeCamera;
    this.storedCameraAttachedElement = camera.inputs.attachedElement;
    this.storedCameraTarget = camera.target;
    this.storedCameraRadius = camera.radius;
    this.storedCameraAlpha = camera.alpha;
    this.storedCameraBeta = camera.beta;
    camera.radius = AIMING_CAMERA_RADIUS;
    camera.detachControl(this.storedCameraAttachedElement);
  }
  _restoreCameraState(){
    const camera = this.scene.activeCamera;
    camera.target = this.storedCameraTarget;
    camera.radius = this.storedCameraRadius;
    camera.alpha = this.storedCameraAlpha;
    camera.beta = this.storedCameraBeta;
    const canvas = document.getElementById("render-canvas");
    camera.attachControl(this.storedCameraAttachedElement);
  }
  handleAimingMouseDrag(e){
    const deltaX = e.screenX - this.previousMouseX;
    const deltaY = e.screenY - this.previousMouseY;
    this._rotYMesh.rotation.y += deltaX * AIMING_CAMERA_ROT_SPEED;
    this._rotXMesh.rotation.x -= deltaY * AIMING_CAMERA_ROT_SPEED;
    this.previousMouseX = e.screenX;
    this.previousMouseY = e.screenY;
    if(this._rotXMesh.rotation.x > AIMING_MAX_X_ROT){
      this._rotXMesh.rotation.x = AIMING_MAX_X_ROT;
    }
    if(this._rotXMesh.rotation.x < AIMING_MIN_X_ROT){
      this._rotXMesh.rotation.x = AIMING_MIN_X_ROT;
    }
    this._positionAimingCamera();
  }
  handleAimingMouseDown(e){
    this.previousMouseX = e.screenX;
    this.previousMouseY = e.screenY;
    window.onmousemove = this.handleAimingMouseDrag;
    window.onmouseup = this.handleAimingMouseUp;
  }
  handleAimingMouseUp(e){
    window.onmousemove = null;
    window.onmouseup = null;
  }

  _handleZoomIn(){
    return e => {
      if (this.scene.activeCamera.radius > 0) {
        this.scene.activeCamera.radius -= 3;
      }
    };
  }

  _handleZoomOut(){
    return e => {
      this.scene.activeCamera.radius += 3;
    };
  }

}
