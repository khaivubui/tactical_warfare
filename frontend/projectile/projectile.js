import {storeCameraState, restoreCameraState} from '../game_utils/camera_utils';
import {Explosion} from "./explosion";

const BOMB_EXPLOSION_RADIUS_SQUARED = 12;
const BOMB_MASS = 1;
const BOMB_TIME = 5000;
const DEFAULT_BOMB_DAMAGE = 20;

export class Projectile {
  constructor(game, pos, rot){
    this.game = game;
  }
  fire(impulseVector){
    this.impostor.applyImpulse(impulseVector,
        this._mesh.getAbsolutePosition());
  }
}

export class Bomb extends Projectile{
  constructor(game, pos, rot){
    super(game, pos, rot);
    this.game = game;
      this._mesh = game.scene.bombMesh.createInstance(
        `bomb${game.scene.bombsCreatedSinceStart++}`);
      this._mesh.position = pos;
      this._mesh.rotation = rot;
      this._explode = this._explode.bind(this);
    this.impostor = new BABYLON.PhysicsImpostor(this._mesh,
      BABYLON.PhysicsImpostor.SphereImpostor, {mass: BOMB_MASS}, game.scene);
  }
  fire(impulseVector, onDoneCallback){
    const camera = this.game.scene.activeCamera;
    this.previousCameraState = storeCameraState(camera);
    this._setUpProjectileCamera(impulseVector);
    super.fire(impulseVector);
    setTimeout(()=>{
      this._explode(onDoneCallback);
    }, BOMB_TIME);
  }
  _setUpProjectileCamera(impulseVector){
    const camera = this.game.scene.activeCamera;
    camera.radius = BOMB_EXPLOSION_RADIUS_SQUARED;
    camera.lockedTarget = this._mesh;
    camera.alpha = this._initialCameraAlpha(impulseVector);
    camera.beta = Math.PI/2;
  }
  _initialCameraAlpha(impulseVector){
    const impulseNormalized = BABYLON.Vector3.Normalize(impulseVector);
    return -1* Math.acos(BABYLON.Vector3.Dot(impulseNormalized,
      new BABYLON.Vector3.Left()));
  }
  _explode(onDoneCallback){
    let diffVector, magnitudeSquared;
    this._mesh.dispose();
    this.impostor.dispose();
    new Explosion(this.game).start(()=>{
      restoreCameraState(this.game.scene.activeCamera,
        this.previousCameraState);
      onDoneCallback();
    });
    for(let i = 0; i < this.game.players.length; ++i){
      diffVector = this._mesh.position.subtract(
        this.game.players[i].tank.position);
      if(diffVector.lengthSquared() < BOMB_EXPLOSION_RADIUS_SQUARED){
        this.game.players[i].receiveDamage(DEFAULT_BOMB_DAMAGE);
      }
    }
  }
}
