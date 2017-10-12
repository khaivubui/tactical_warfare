const EXPLOSION_MAX_RADIUS = 4;

export class Explosion{
  constructor(game, position){
    this._mesh = new BABYLON.Mesh.CreateSphere(
      `explosion${game.explosionsCreatedSinceStart++}`
    )
  }
  start(onDoneCallback){
    setTimeout(onDoneCallback, 2000);
  }
  _increaseRadiusStep(){
    this._mesh.scale = (this._mesh.scale + EXPLOSION_MAX_RADIUS)/2;
  }
  _decreaseBrightnessStep(){

  }
}
