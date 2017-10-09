import Arena from "./arena.js";
import Player from "./player.js";

export const createDemoGame = (scene)=>{
  return new Game(scene, [], new Arena(scene));
};
export class Game{
  constructor(scene, players, arena ){
    this.players = players;
    this.currentPlayerIdx = 0;
    this.myPlayerIdx = 0;
    this.arena = arena;
    this.recieveMovePosition = this.recieveMovePosition.bind(this);
  }
  startGame(){
    this.startListeningForPosition();
  }
  startListeningForMoveOptions(){

  }
  stopListeningForMoveOptions(){

  }
  startListeningForPosition(){
    this.arena.ground.startListeningForPosition();
  }
  recieveMovePosition(position){

  }
  startListeningForTrajectory(){

  }
  stopListeningForTrajectory(){

  }

  switchPlayer(){
    if(++this.currentPlayerIdx > this.players.length -1){
      this.currentPlayerIdx = 0;
    }
  }
}
