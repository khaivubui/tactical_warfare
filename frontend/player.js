const AIMING_CAMERA_ROT_SPEED = 0.05;
const AIMING_CAMERA_RADIUS = 2;
const AIMING_CAMERA_HEIGHT = 1;

const AIMING_MAX_X_ROT = 0.9;
const AIMING_MIN_X_ROT = - 0.5;

export class Player{
  constructor(tank){
    this.tank = tank;
  }
  startListeningForMoveOptions(onDoneCallback){
    onDoneCallback("attack");
  }
  startListeningForAttack(onDoneCallback){
    onDoneCallback(0,0);
  }
}

export class DemoPlayer extends Player{
  constructor(tank){
    super(tank);
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
  startListeningForPosition(onDoneCallback){

    this.arena.ground.startListeningForPosition(onDoneCallback);
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
  startListeningForAttack(onDoneCallback){
    this.scene.activeCamera.inputs.clear();
    const camera = this.scene.activeCamera;

    this.previousCameraTarget = camera.target;
    this.previousCameraRadius = camera.radius;
    camera.radius = AIMING_CAMERA_RADIUS;
    const canvas = document.getElementById("render-canvas");
    const rotationWidget = document.querySelector(".camera-rotation");
    this.originalRotationWidgetMouseDown = rotationWidget.onmousedown;
    rotationWidget.onmousedown  = this.handleAimingMouseDown;
    this._positionAimingCamera();
  }
  stopListeningForAttack(){
    const rotationWidget = document.querySelector(".camera-rotation");
    rotationWidget.onmousedown   = this.originalRotationWidgetMouseDown;
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
}
