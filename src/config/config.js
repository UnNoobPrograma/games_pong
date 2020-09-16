export default {
  type: Phaser.AUTO,
  parent: "game-block",
  width: 640,
  height: 512,
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity : {
        y: 0
      }
    }
  },
  audio: {
    disableWebAudio: true
  }
};