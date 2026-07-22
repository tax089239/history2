class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
  this.load.image('frontpage', 'frontpage.png');
  this.load.image('instructions', 'instructions.png');
}

  create() {
    this.createTextures();
    this.scene.start('MenuScene');
  }

  createTextures() {
    const g = this.add.graphics();

    g.clear();
    g.fillStyle(0x2f855a); g.fillRoundedRect(10, 26, 44, 34, 14);
    g.fillStyle(0xf4c78e); g.fillCircle(32, 24, 17);
    g.fillStyle(0x4a2f2a); g.fillCircle(26, 22, 2); g.fillCircle(38, 22, 2);
    g.lineStyle(2, 0x4a2f2a); g.beginPath(); g.arc(32, 27, 7, 0.2, Math.PI - 0.2); g.strokePath();
    g.fillStyle(0xffd166); g.fillRoundedRect(14, 4, 36, 12, 6); g.fillRect(21, 13, 22, 6);
    g.fillStyle(0xffffff); g.fillCircle(48, 44, 7); g.fillCircle(16, 44, 7);
    g.generateTexture('player', 64, 64);

    g.clear();
    g.fillStyle(0x8d6e63); g.fillCircle(32, 34, 25);
    g.fillStyle(0xf1c7a2); g.fillCircle(32, 26, 17);
    g.fillStyle(0xffffff); g.fillCircle(25, 25, 4); g.fillCircle(39, 25, 4);
    g.fillStyle(0x3e2723); g.fillCircle(25, 25, 2); g.fillCircle(39, 25, 2);
    g.fillStyle(0xffffff); g.fillTriangle(20, 38, 32, 57, 44, 38);
    g.fillStyle(0xffca5c); g.fillTriangle(10, 16, 22, 1, 27, 18); g.fillTriangle(37, 18, 44, 1, 56, 16);
    g.generateTexture('npc_elder', 64, 64);

    g.clear();
    g.fillStyle(0x8bc34a); g.fillCircle(32, 34, 25);
    g.fillStyle(0xb7dc7b);
    [[21,23],[32,18],[43,23],[18,35],[32,32],[46,35],[23,47],[39,47]].forEach(p => g.fillCircle(p[0],p[1],6));
    g.fillStyle(0x263238); g.fillCircle(27,31,2.5); g.fillCircle(38,31,2.5);
    g.lineStyle(2,0x263238); g.beginPath(); g.arc(32,36,7,0.2,Math.PI-0.2); g.strokePath();
    g.fillStyle(0x4f7f25); g.fillTriangle(22,12,32,0,35,14); g.fillTriangle(31,13,47,4,42,18);
    g.generateTexture('npc_baby',64,64);

    g.clear();
    g.fillStyle(0xe7f6ff); g.fillCircle(22,36,16); g.fillCircle(37,28,20); g.fillCircle(52,37,15); g.fillRoundedRect(10,34,54,22,11);
    g.fillStyle(0x1565c0); g.fillCircle(31,37,2.5); g.fillCircle(44,37,2.5);
    g.lineStyle(2,0x1565c0); g.beginPath(); g.arc(38,42,7,0.2,Math.PI-0.2); g.strokePath();
    g.generateTexture('npc_cloud',72,64);

    g.clear();
    g.fillStyle(0x5d4037); g.fillRoundedRect(0,24,128,70,12);
    g.fillStyle(0x7b5b4a); g.fillTriangle(0,28,64,0,128,28);
    g.fillStyle(0xffd166); g.fillRoundedRect(45,42,38,52,10);
    g.fillStyle(0x6d4c41); g.fillCircle(72,68,4);
    g.lineStyle(4,0xffefad); g.strokeRoundedRect(45,42,38,52,10);
    g.generateTexture('temple_door',128,96);

    g.destroy();
  }
}
