const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1280,
  height: 720,
  backgroundColor: '#173f46',
  antialias: true,
  pixelArt: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: [BootScene, MenuScene, MapScene, QuestionScene, EndScene]
};

const game = new Phaser.Game(config);

game.gameState = {
  badges: { elder: false, baby: false, cloud: false }
};

window.addEventListener('resize', () => game.scale.refresh());
