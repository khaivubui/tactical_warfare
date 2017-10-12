const BOMB_COLLISION_RADIUS = 1;
const BOMB_EXPLOSION_RADIUS = 2;
const BOMB_MASS = 1;

export class Projectile {
  constructor(scene, pos, rot){

  }
  fire(impulseVector){
    this.impostor.applyImpulse(impulseVector,
        this._mesh.getAbsolutePosition());
  }
}

export class Bomb extends Projectile{
  constructor(scene, pos, rot){
    super(scene, pos, rot);
      if(scene.bombsCreatedSinceStart === undefined){
        scene.bombsCreatedSinceStart = 0;
      }
      else{
        ++scene.bombsCreatedSinceStart;
      }
      this._mesh = scene.bombMesh.createInstance(`bomb${scene.bombsCreatedSinceStart}`);
      this._mesh.position = pos;
      this._mesh.rotation = rot;
    this.impostor = new BABYLON.PhysicsImpostor(this._mesh,
      BABYLON.PhysicsImpostor.SphereImpostor, {mass: BOMB_MASS}, scene);
  }
}
