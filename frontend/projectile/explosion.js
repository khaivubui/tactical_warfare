const EXPLOSION_MAX_RADIUS = 8;
const GREEN_DECREASE_MULTIPLIER = 0.95;
const BLUE_DECREASE_MULTIPLIER = 0.4;
const RED_DECREASE_MULTIPLIER = 0.98;
const ALPHA_DECREASE_MULTIPLIER = 0.99;

export class Explosion {
  constructor(game, position) {
    this._mesh = new BABYLON.Mesh.CreateSphere(
      `explosion${game.explosionsCreatedSinceStart++}`,
      16,
      1,
      scene
    );
    this.scene = game.scene;
    this._mesh.position = position;
    this._mesh.material = new BABYLON.StandardMaterial("explosion", game.scene);
    this._mesh.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    this._mesh.material.alpha = 1;
    this._increaseRadiusStep = this._increaseRadiusStep.bind(this);
    this._decreaseBrightnessStep = this._decreaseBrightnessStep.bind(this);
  }
  start(onDoneCallback) {
    for(let i = 0; i < this.scene.lights.length; ++i){
      this.scene.lights[i].intensity = 200;
    }
    const updateStep = setInterval(() => {
      this._increaseRadiusStep();
      this._decreaseBrightnessStep();
      this._decreaseOpacityStep();
    }, 1 / 60);

    setTimeout(() => {
      clearInterval(updateStep);
      this._mesh.material.dispose();
      this._mesh.dispose();
      onDoneCallback();
      for(let i = 0; i < this.scene.lights.length; ++i){
        this.scene.lights[i].intensity =1;
      }
    }, 1000);
  }
  _increaseRadiusStep() {
    const scale = this._mesh.scaling;
    scale.x = (scale.x * 3 + EXPLOSION_MAX_RADIUS) / 4;
    scale.y = (scale.x * 3 + EXPLOSION_MAX_RADIUS) / 4;
    scale.z = (scale.x * 3 + EXPLOSION_MAX_RADIUS) / 4;
  }
  _decreaseBrightnessStep() {
    for(let i = 0; i < this.scene.lights.length; ++i){
      this.scene.lights[i].intensity *=3;
      this.scene.lights[i].intensity +=1;
      this.scene.lights[i].intensity = this.scene.lights[i].intensity/4;
    }
    const col = this._mesh.material.emissiveColor;
    col.g *= GREEN_DECREASE_MULTIPLIER;
    col.r *= RED_DECREASE_MULTIPLIER;
    col.b *= BLUE_DECREASE_MULTIPLIER;
  }
  _decreaseOpacityStep() {
    this._mesh.material.alpha *= ALPHA_DECREASE_MULTIPLIER;
  }
}
