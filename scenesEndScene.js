class EndScene extends Phaser.Scene {
  constructor(){ super({key:'EndScene'}); }

  create(){
    const {width:w,height:h}=this.scale;
    const bg=this.add.graphics(); bg.fillGradientStyle(0x173f46,0x173f46,0x64b98a,0xf4d77c,1); bg.fillRect(0,0,w,h);
    for(let i=0;i<80;i++){
      const p=this.add.circle(Phaser.Math.Between(40,w-40),Phaser.Math.Between(20,h-40),Phaser.Math.Between(3,8),Phaser.Utils.Array.GetRandom([0xffd166,0x66d9a6,0x64b5f6,0xff8a9a]),.8);
      this.tweens.add({targets:p,y:p.y+Phaser.Math.Between(50,160),alpha:0,duration:Phaser.Math.Between(1200,2600),delay:Phaser.Math.Between(0,1000),repeat:-1});
    }
    const panel=this.add.graphics(); panel.fillStyle(0x102f36,.9); panel.fillRoundedRect(w*.16,h*.08,w*.68,h*.82,40); panel.lineStyle(5,0xffe49a,.95); panel.strokeRoundedRect(w*.16,h*.08,w*.68,h*.82,40);
    this.add.image(w/2,h*.23,'temple_door').setScale(1.3);
    this.add.text(w/2,h*.39,'神殿封印解除！',{fontFamily:'Microsoft JhengHei',fontSize:'52px',color:'#fff2bd',fontStyle:'bold',stroke:'#5a3a18',strokeThickness:7}).setOrigin(.5);
    this.add.text(w/2,h*.49,'恭喜大朋友、小朋友完成三項租稅任務',{fontFamily:'Microsoft JhengHei',fontSize:'27px',color:'#ffffff'}).setOrigin(.5);
    this.add.text(w/2,h*.59,'🏆 親子租稅小勇者 🏆',{fontFamily:'Microsoft JhengHei',fontSize:'38px',color:'#74e0aa',fontStyle:'bold'}).setOrigin(.5);
    this.add.text(w/2,h*.67,'📜 認識發票　　🍍 了解稅金　　☁️ 學會載具',{fontFamily:'Microsoft JhengHei',fontSize:'23px',color:'#ffffff'}).setOrigin(.5);
    const btn=this.add.text(w/2,h*.79,'再玩一次  ↻',{fontFamily:'Microsoft JhengHei',fontSize:'25px',color:'#263238',fontStyle:'bold',backgroundColor:'#ffd166',padding:{x:38,y:16}}).setOrigin(.5).setInteractive({useHandCursor:true});
    btn.on('pointerover',()=>btn.setScale(1.05)); btn.on('pointerout',()=>btn.setScale(1));
    btn.on('pointerdown',()=>{this.game.gameState.badges={elder:false,baby:false,cloud:false}; this.game.gameState.currentSession=null; this.scene.start('MenuScene');});
  }
}
