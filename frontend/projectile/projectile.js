import {storeCameraState, restoreCameraState} from '../game_utils/camera_utils';
import {Explosion} from "./explosion";

const BOMB_EXPLOSION_RADIUS_SQUARED = 64;
const BOMB_MASS = 1;
const BOMB_TIME = 5000;
const DEFAULT_BOMB_DAMAGE = 20;

export class Projectile {
  constructor(game, pos, rot){
    this.game = game;
  }
  fire(impulseVector){
    this.physicsImpostor.applyImpulse(impulseVector,
        this.mesh.getAbsolutePosition());
  }
}

export class Bomb extends Projectile{
  constructor(game, pos, rot){
    super(game, pos, rot);
    this.game = game;
    this.mesh = game.scene.bombMesh.createInstance(
      `bomb${game.scene.bombsCreatedSinceStart++}`);
    this.mesh.position = pos;
    this.mesh.rotation = rot;
    this._explode = this._explode.bind(this);
    this.physicsImpostor = new BABYLON.PhysicsImpostor(this.mesh,
      BABYLON.PhysicsImpostor.SphereImpostor, {mass: BOMB_MASS, restitution: 0.8, friction: 0.8}, game.scene);
    this.mesh.scaling.x = 0.6;
    this.mesh.scaling.y = 0.6;
    this.mesh.scaling.z = 0.6;
  }

  fire(impulseVector, onDoneCallback){
    const camera = this.game.scene.activeCamera;
    const aimArrow = document.querySelector(".camera-rotation");
    aimArrow.style.visibility = "hidden";
    this.previousCameraState = storeCameraState(camera);
    this._setUpProjectileCamera(impulseVector);
    super.fire(impulseVector);
    const bombSound = new BABYLON.Sound("bomb", "http://res.cloudinary.com/foolishhunger/video/upload/v1507789642/time_bomb_sound_h1twf8.mp3", this.game.scene, () => {
      bombSound.play();
    }
    );
    setTimeout(()=>{
      this._explode( () => {
        aimArrow.style.visibility = "visible";
        onDoneCallback();
      });
    }, BOMB_TIME);
  }
  _setUpProjectileCamera(impulseVector){
    const camera = this.game.scene.activeCamera;
    camera.radius = 12;
    camera.lockedTarget = this.mesh;
    camera.alpha = this._initialCameraAlpha(impulseVector);
    camera.beta = Math.PI/4;
  }
  _initialCameraAlpha(impulseVector){
    const impulseNormalized = BABYLON.Vector3.Normalize(impulseVector);
    const crossProduct = BABYLON.Vector3.Cross(impulseVector,
       BABYLON.Vector3.Left());
    const signFlip = (crossProduct.y > 0) ? 1 : -1;
    console.log(signFlip);
    return signFlip * Math.acos(BABYLON.Vector3.Dot(impulseNormalized,
      new BABYLON.Vector3.Left()));
  }
  _explode(onDoneCallback){
    let diffVector, magnitudeSquared;
    new Explosion(this.game, this.mesh.position).start(()=>{
      restoreCameraState(this.game.scene.activeCamera,
        this.previousCameraState);
      onDoneCallback();
    });
    for(let i = 0; i < this.game.players.length; ++i){
      diffVector = this.mesh.position.subtract(
        this.game.players[i].tank.position);
      if(diffVector.lengthSquared() < BOMB_EXPLOSION_RADIUS_SQUARED){
        this.game.players[i].receiveDamage(DEFAULT_BOMB_DAMAGE);
      }
    }
    this.mesh.dispose();
    this.mesh = null
    this.physicsImpostor.dispose();
    this.physicsImpostor = null;
  }
}
