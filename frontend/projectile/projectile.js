const BOMB_COLLISION_RADIUS = 1;
const BOMB_EXPLOSION_RADIUS = 2;
const BOMB_MASS = 1;
const BOMB_TIME = 7000;

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
      this._mesh = game.scene.bombMesh.createInstance(`bomb${scene.bombsCreatedSinceStart}`);
      this._mesh.position = pos;
      this._mesh.rotation = rot;
      this._explode = this._explode.bind(this);
    this.impostor = new BABYLON.PhysicsImpostor(this._mesh,
      BABYLON.PhysicsImpostor.SphereImpostor, {mass: BOMB_MASS}, game.scene);
  }
  fire(impulseVector, onDoneCallback){
    super.fire(impulseVector);
    setTimeout(()=>{
      this._explode();
      onDoneCallback();
    }, BOMB_TIME);
  }
  _explode(){

  }
}
