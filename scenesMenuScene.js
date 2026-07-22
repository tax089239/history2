class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  create() {
    const { width: w, height: h } = this.scale;
    this.cameras.main.setBackgroundColor('#184e56');

    const bg = this.add.graphics();
    bg.fillGradientStyle(0x174b53,0x174b53,0x9cd9bd,0xf6d98a,1);
    bg.fillRect(0,0,w,h);

    // 山丘與雲朵
    bg.fillStyle(0x337b62,0.8); bg.fillEllipse(w*0.2,h*0.72,w*0.65,h*0.46); bg.fillEllipse(w*0.82,h*0.76,w*0.8,h*0.5);
    bg.fillStyle(0xf6f2dc,0.75); bg.fillCircle(w*0.15,h*0.17,34); bg.fillCircle(w*0.19,h*0.15,48); bg.fillCircle(w*0.24,h*0.18,32);
    bg.fillCircle(w*0.78,h*0.13,28); bg.fillCircle(w*0.82,h*0.11,42); bg.fillCircle(w*0.87,h*0.14,28);

    const panel = this.add.graphics();
    panel.fillStyle(0x102d34,0.88); panel.fillRoundedRect(w*0.12,h*0.09,w*0.76,h*0.78,36);
    panel.lineStyle(3,0xffe49a,0.9); panel.strokeRoundedRect(w*0.12,h*0.09,w*0.76,h*0.78,36);

    this.add.text(w/2,h*0.14,'臺東縣稅務局・親子租稅互動遊戲',{fontFamily:'Microsoft JhengHei',fontSize:'22px',color:'#d9fff3'}).setOrigin(0.5);
    this.add.image(w/2,h*0.27,'temple_door').setScale(1.15);
    this.add.text(w/2,h*0.41,'史前稅務神殿大冒險',{fontFamily:'Microsoft JhengHei',fontSize:'54px',color:'#fff3c4',fontStyle:'bold',stroke:'#5a3a18',strokeThickness:7}).setOrigin(0.5);
    this.add.text(w/2,h*0.49,'大手牽小手，一起找到三枚租稅徽章！',{fontFamily:'Microsoft JhengHei',fontSize:'25px',color:'#ffffff'}).setOrigin(0.5);

    const chips=[['📜','認識發票'],['🍍','了解稅金'],['☁️','學會載具']];
    chips.forEach((item,i)=>{
      const x=w*(0.29+i*0.21), y=h*0.59;
      const c=this.add.graphics(); c.fillStyle(0xffffff,0.12); c.fillRoundedRect(x-105,y-42,210,84,22); c.lineStyle(2,0xffffff,0.18); c.strokeRoundedRect(x-105,y-42,210,84,22);
      this.add.text(x-52,y,item[0],{fontSize:'34px'}).setOrigin(0.5);
      this.add.text(x+24,y,item[1],{fontFamily:'Microsoft JhengHei',fontSize:'20px',color:'#ffffff',fontStyle:'bold'}).setOrigin(0.5);
    });

    const button=this.add.rectangle(w/2,h*0.74,390,78,0xffd166,1).setStrokeStyle(4,0xffefad).setInteractive({useHandCursor:true});
    const label=this.add.text(w/2,h*0.74,'開始親子冒險  ▶',{fontFamily:'Microsoft JhengHei',fontSize:'28px',color:'#25343b',fontStyle:'bold'}).setOrigin(0.5);
    [button,label].forEach(o=>o.setInteractive({useHandCursor:true}).on('pointerdown',()=>this.startGame()));
    button.on('pointerover',()=>this.tweens.add({targets:[button,label],scale:1.04,duration:120}));
    button.on('pointerout',()=>this.tweens.add({targets:[button,label],scale:1,duration:120}));

    this.add.text(w/2,h*0.83,'電腦：方向鍵 / WASD　｜　平板與手機：點選守護者',{fontFamily:'Microsoft JhengHei',fontSize:'18px',color:'#c9eee4'}).setOrigin(0.5);
    this.input.keyboard.once('keydown-ENTER',()=>this.startGame());
  }

  startGame(){
    this.cameras.main.fadeOut(250,18,50,58);
    this.time.delayedCall(250,()=>this.scene.start('MapScene'));
  }
}
