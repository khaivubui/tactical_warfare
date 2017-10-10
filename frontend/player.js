export class Player{
  constructor(tank){
    this.tank = tank;
  }
  startListeningForMoveOptions(onDoneCallback){
    onDoneCallback("position");
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
}

export class LocalPlayer extends Player{
  constructor(tank, arena){
    super(tank);
    this.arena = arena;
  }
  startListeningForPosition(onDoneCallback){
    this.arena.ground.startListeningForPosition(onDoneCallback);
  }
}
