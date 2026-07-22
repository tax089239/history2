class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  create() {
    const { width: w, height: h } = this.scale;
    this.add.image(w / 2, h / 2, 'frontpage').setDisplaySize(w, h);

    const startZone = this.add.zone(w / 2, h * 0.855, w * 0.37, h * 0.16)
      .setInteractive({ useHandCursor: true });
    startZone.on('pointerdown', () => this.showInstructions());

    this.input.keyboard.once('keydown-ENTER', () => this.showInstructions());
  }

  showInstructions() {
    if (this.instructionLayer) return;
    const { width: w, height: h } = this.scale;
    this.instructionLayer = this.add.container(0, 0).setDepth(100);

    const shade = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.42).setInteractive();
    const page = this.add.image(w / 2, h / 2, 'instructions').setDisplaySize(w, h);
    const startZone = this.add.zone(w / 2, h * 0.86, w * 0.38, h * 0.16)
      .setInteractive({ useHandCursor: true });
    const closeZone = this.add.zone(w * 0.686, h * 0.352, 90, 90)
      .setInteractive({ useHandCursor: true });

    startZone.on('pointerdown', () => this.startGame());
    closeZone.on('pointerdown', () => {
      this.instructionLayer.destroy(true);
      this.instructionLayer = null;
    });

    this.instructionLayer.add([shade, page, startZone, closeZone]);
  }

  startGame() {
    this.game.gameState.badges = { elder: false, baby: false, cloud: false };
    this.cameras.main.fadeOut(250, 18, 50, 58);
    this.time.delayedCall(250, () => this.scene.start('MapScene'));
  }
}
