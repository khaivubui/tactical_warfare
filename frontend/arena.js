import Ground from "./ground.js";

const DEFAULT_WALL_THICKNESS = 1;
const DEFAULT_CELL_SIZE = 3.5;
const DEFAULT_CELL_COUNT = 10;
const DEFAULT_WALL_HEIGHT = 3;
const DEFAULT_WALL_WIDTH = 0.6;
const SIDE_WALL_HEIGHT = 6;

export default class Arena{
  constructor(scene, cellSize =DEFAULT_CELL_SIZE, cellCount=DEFAULT_CELL_COUNT,
     wallThickness=DEFAULT_WALL_THICKNESS, wallHeight = DEFAULT_WALL_HEIGHT,
      wallWidth = DEFAULT_WALL_WIDTH, sideWallHeight = SIDE_WALL_HEIGHT){
    this.ground = new Ground(scene, cellSize, cellCount, wallThickness);
    const groundWidth = this.ground.getGroundWidth();

    // Ground material
    this.ground.mesh.material = new BABYLON.StandardMaterial("texture1", scene);
    this.ground.mesh.material.diffuseTexture = new BABYLON.Texture("http://res.cloudinary.com/foolishhunger/image/upload/c_scale,w_361/v1507915046/ground2_wkrjnw.jpg", scene);
    this.ground.mesh.material.diffuseTexture.uScale = 5.0;
    this.ground.mesh.material.diffuseTexture.vScale = 5.0;
    this.ground.mesh.material.specularColor = new BABYLON.Color3(0.1,0.1,0.1);

    this._wallMesh = new BABYLON.Mesh.CreateBox("centerWall",
      groundWidth, scene);
    this._wallMesh.scaling.z = wallThickness / groundWidth;
    this._wallMesh.scaling.y = wallHeight/ groundWidth;
    this._wallMesh.scaling.x = wallWidth;
    this._wallMesh.position.y += wallHeight /2;
    window.wallMesh = this._wallMesh;

    // CenterWall material
    this._wallMesh.material = new BABYLON.StandardMaterial("texture1", scene);
    this._wallMesh.material.diffuseTexture = new BABYLON.Texture("http://res.cloudinary.com/foolishhunger/image/upload/v1507740979/centerBrickWall_gbn3su.png", scene)
    this._wallMesh.material.diffuseTexture.uScale = 10.0;
    this._wallMesh.material.diffuseTexture.vScale = 2.0;


    // Create side walls
    this._sidewall0 = new BABYLON.Mesh.CreatePlane("sidewall0",
      groundWidth, scene);
    this._sidewall0.scaling.y = sideWallHeight/groundWidth;
    this._sidewall0.position.y += sideWallHeight / 2;
    this._sidewall0.position.z += groundWidth/2 + wallThickness/2;


    this._sidewall1 = this._sidewall0.clone('sidewall1');
    const matrix = BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, Math.PI);
    this._sidewall1.position = BABYLON.Vector3.TransformCoordinates(this._sidewall1.position, matrix);
    this._sidewall1.rotation.y = Math.PI;


    this._sidewall2 = new BABYLON.Mesh.CreatePlane("sidewall2",
      groundWidth, scene);
    this._sidewall2.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.WORLD);
    this._sidewall2.scaling.y = sideWallHeight/groundWidth;
    this._sidewall2.scaling.x = 1 + wallThickness / groundWidth;
    this._sidewall2.position.y += sideWallHeight / 2;
    this._sidewall2.position.x += groundWidth / 2;
    this._sidewall2.position.z += 0;


    this._sidewall3 = new BABYLON.Mesh.CreatePlane("sidewall3",
      groundWidth, scene);
    this._sidewall3.rotate(BABYLON.Axis.Y, Math.PI*1.5, BABYLON.Space.LOCAL);
    this._sidewall3.scaling.y = sideWallHeight/groundWidth;
    this._sidewall3.scaling.x = 1 + wallThickness / groundWidth;
    this._sidewall3.position.y += sideWallHeight / 2;
    this._sidewall3.position.x += - groundWidth / 2;
    this._sidewall3.position.z += 0;


    // SideWall material
    const materialSideWalls = new BABYLON.StandardMaterial("texture2", scene);
    this._sidewall0.material = materialSideWalls
    this._sidewall1.material = materialSideWalls;
    this._sidewall2.material = materialSideWalls;
    this._sidewall3.material = materialSideWalls;

    this._sidewall0.material.diffuseTexture = new BABYLON.Texture("http://res.cloudinary.com/foolishhunger/image/upload/v1507741682/sideWalls_nkckv9.jpg", scene);
    this._sidewall1.material.diffuseTexture = new BABYLON.Texture("http://res.cloudinary.com/foolishhunger/image/upload/v1507741682/sideWalls_nkckv9.jpg", scene);
    this._sidewall2.material.diffuseTexture = new BABYLON.Texture("http://res.cloudinary.com/foolishhunger/image/upload/v1507741682/sideWalls_nkckv9.jpg", scene);
    this._sidewall3.material.diffuseTexture = new BABYLON.Texture("http://res.cloudinary.com/foolishhunger/image/upload/v1507741682/sideWalls_nkckv9.jpg", scene);

    this._sidewall0.material.diffuseTexture.uScale = 10.0;
    this._sidewall0.material.diffuseTexture.vScale = 2.0;

    this._ceiling = new BABYLON.Mesh.CreatePlane("ceiling",
      groundWidth, scene);
    this._ceiling.position.y += sideWallHeight;
    this._ceiling.rotate(BABYLON.Axis.X, Math.PI * 1.5, BABYLON.Space.WORLD);
    this._ceiling.scaling.y = 1 + wallThickness / groundWidth;

    // Sky material
    this._ceiling.material = new BABYLON.StandardMaterial("texture3", scene);
    this._ceiling.material.diffuseTexture = new BABYLON.Texture("http://res.cloudinary.com/foolishhunger/image/upload/v1507779445/ceiling6_fwju0g.jpg", scene);

    this._ceiling.material.diffuseTexture.uScale = 10.0;
    this._ceiling.material.diffuseTexture.vScale = 10.0;

    // Fun Objects
    setTimeout(()=> {
      const box = new BABYLON.Mesh.CreateBox("box",2.5, scene);
      box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, friction: 0.4, restitution: 0}, scene);
      box.position.x = -8.5;
      box.position.z = -9.5;
      box.position.y = 1;
      const box1 = new BABYLON.Mesh.CreateBox("box1",2.5, scene);
      box1.physicsImpostor = new BABYLON.PhysicsImpostor(box1, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, friction: 0.4, restitution: 0}, scene);
      box1.position.x = 8.5;
      box1.position.z = 9.5;
      box1.position.y = 1;
      const box2 = new BABYLON.Mesh.CreateBox("box2",2.5, scene);
      box2.physicsImpostor = new BABYLON.PhysicsImpostor(box2, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, friction: 0.4, restitution: 0}, scene);
      box2.position.x = 5.5;
      box2.position.z = -5.5;
      box2.position.y = 1;
      const box3 = new BABYLON.Mesh.CreateBox("box3",2.5, scene);
      box3.physicsImpostor = new BABYLON.PhysicsImpostor(box3, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, friction: 0.4, restitution: 0}, scene);
      box3.position.x = -5.5;
      box3.position.z = 5.5;
      box3.position.y = 1;

      box.material = new BABYLON.StandardMaterial("box", scene);
      box1.material = new BABYLON.StandardMaterial("box1", scene);
      box2.material = new BABYLON.StandardMaterial("box2", scene);
      box3.material = new BABYLON.StandardMaterial("box3", scene);

      box.material.diffuseTexture = new BABYLON.Texture(scene.box, scene);
      box1.material.diffuseTexture = new BABYLON.Texture(scene.box, scene);
      box2.material.diffuseTexture = new BABYLON.Texture(scene.box, scene);
      box3.material.diffuseTexture = new BABYLON.Texture(scene.box, scene);


    }, 100);


    // Physics Engine
    this.ground.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground.mesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, friction: 1, restitution: 0.8}, scene);

    this._wallMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this._wallMesh,
    BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, friction: 0.5, restitution: 0.8}, scene);

    this._sidewall0.physicsImpostor = new BABYLON.PhysicsImpostor(this._sidewall0, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, friction: 0.8, restitution: 0.8}, scene);

    this._sidewall1.physicsImpostor = new BABYLON.PhysicsImpostor(this._sidewall1, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, friction: 0.8, restitution: 0.8}, scene);

    this._sidewall2.physicsImpostor = new BABYLON.PhysicsImpostor(this._sidewall2, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, friction: 0.8, restitution: 0.8}, scene);

    this._sidewall3.physicsImpostor = new BABYLON.PhysicsImpostor(this._sidewall3, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, friction: 0.8, restitution: 0.8}, scene);

    this._ceiling.physicsImpostor = new BABYLON.PhysicsImpostor(this._ceiling, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, friction: 0.8, restitution: 0.8}, scene);
  }
}
