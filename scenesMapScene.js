class MapScene extends Phaser.Scene {
  constructor(){ super({key:'MapScene'}); }

  create(){
    const {width:w,height:h}=this.scale;
    this.w=w; this.h=h;
    this.cameras.main.fadeIn(250,12,40,45);
    this.drawWorld();

    this.temple=this.physics.add.staticSprite(w*0.5,h*0.16,'temple_door').setScale(1.05);
    this.add.text(w*0.5,h*0.245,'封印神殿',{fontFamily:'Microsoft JhengHei',fontSize:'21px',color:'#4b321d',fontStyle:'bold',backgroundColor:'rgba(255,245,215,.78)',padding:{x:12,y:5}}).setOrigin(0.5);

    this.npcs=this.physics.add.staticGroup();
    this.npcElder=this.makeNpc(w*0.22,h*0.43,'npc_elder','elder','石器族長','統一發票',0xffc857);
    this.npcBaby=this.makeNpc(w*0.78,h*0.43,'npc_baby','baby','釋迦寶寶','稅金用途',0x9ccc65);
    this.npcCloud=this.makeNpc(w*0.5,h*0.69,'npc_cloud','cloud','雲端精靈','雲端發票',0x64b5f6);

    this.player=this.physics.add.sprite(w*0.5,h*0.49,'player').setScale(1.05).setDepth(10);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(42,42).setOffset(11,18);

    this.cursors=this.input.keyboard.createCursorKeys();
    this.wasd=this.input.keyboard.addKeys({up:Phaser.Input.Keyboard.KeyCodes.W,down:Phaser.Input.Keyboard.KeyCodes.S,left:Phaser.Input.Keyboard.KeyCodes.A,right:Phaser.Input.Keyboard.KeyCodes.D,space:Phaser.Input.Keyboard.KeyCodes.SPACE});

    this.physics.add.collider(this.player,this.temple,this.handleTempleTouch,null,this);
    this.createHud();

    // 親子與觸控友善：直接點守護者即可互動
    this.npcs.getChildren().forEach(npc=>{
      npc.setInteractive({useHandCursor:true});
      npc.on('pointerdown',()=>this.openQuestion(npc));
    });
    this.temple.setInteractive({useHandCursor:true}).on('pointerdown',()=>this.handleTempleTouch());
  }

  drawWorld(){
    const w=this.w,h=this.h;
    const g=this.add.graphics();
    g.fillGradientStyle(0xb9e3a3,0xb9e3a3,0x70b979,0x5ba46d,1); g.fillRect(0,0,w,h);
    g.fillStyle(0xf2d19b,0.95); g.fillRoundedRect(w*0.46,h*0.22,w*0.08,h*0.48,28); g.fillRoundedRect(w*0.2,h*0.46,w*0.6,h*0.07,28);
    g.fillStyle(0x59b9d0,0.95); g.fillRoundedRect(0,h*0.81,w,h*0.12,18);
    g.lineStyle(4,0xd6f3f9,0.7); for(let x=20;x<w;x+=95) g.lineBetween(x,h*0.855,x+52,h*0.855);

    const trees=[[.07,.18],[.12,.34],[.08,.64],[.16,.78],[.9,.18],[.86,.34],[.93,.63],[.84,.77],[.32,.17],[.68,.17]];
    trees.forEach(p=>this.add.image(w*p[0],h*p[1],'tree').setScale(1.1).setAlpha(.95));
    [[.28,.72],[.72,.72],[.35,.32],[.65,.32]].forEach(p=>this.add.image(w*p[0],h*p[1],'rock').setScale(.75));
    for(let i=0;i<34;i++){
      this.add.circle(Phaser.Math.Between(25,w-25),Phaser.Math.Between(120,h-70),Phaser.Math.Between(2,5),Phaser.Utils.Array.GetRandom([0xffffff,0xffe082,0xff8a80,0x9fa8da]),.85);
    }
  }

  makeNpc(x,y,texture,id,name,topic,color){
    const npc=this.npcs.create(x,y,texture).setScale(1.18).setData({id,name,topic});
    this.tweens.add({targets:npc,y:y-8,duration:900,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    const tag=this.add.graphics(); tag.fillStyle(0xffffff,.94); tag.fillRoundedRect(x-106,y+55,212,64,18); tag.lineStyle(3,color,.9); tag.strokeRoundedRect(x-106,y+55,212,64,18);
    this.add.text(x,y+73,name,{fontFamily:'Microsoft JhengHei',fontSize:'20px',color:'#24363b',fontStyle:'bold'}).setOrigin(.5);
    this.add.text(x,y+99,`考驗：${topic}`,{fontFamily:'Microsoft JhengHei',fontSize:'16px',color:'#4f6467'}).setOrigin(.5);
    return npc;
  }

  createHud(){
    const w=this.w,h=this.h;
    const hud=this.add.graphics().setDepth(50); hud.fillStyle(0x10343b,.9); hud.fillRoundedRect(24,20,350,92,24); hud.lineStyle(2,0xffe49a,.7); hud.strokeRoundedRect(24,20,350,92,24);
    this.uiText=this.add.text(48,40,'',{fontFamily:'Microsoft JhengHei',fontSize:'21px',color:'#ffffff',lineSpacing:8}).setDepth(51);
    this.updateBadgeUI();

    const help=this.add.graphics().setDepth(50); help.fillStyle(0x10343b,.9); help.fillRoundedRect(w*0.22,h-70,w*0.56,50,22);
    this.promptText=this.add.text(w/2,h-45,'方向鍵 / WASD 移動，或直接點選守護者',{fontFamily:'Microsoft JhengHei',fontSize:'19px',color:'#fff5c8',fontStyle:'bold'}).setOrigin(.5).setDepth(51);
  }

  update(){
    const speed=260; this.player.setVelocity(0);
    const left=this.cursors.left.isDown||this.wasd.left.isDown, right=this.cursors.right.isDown||this.wasd.right.isDown, up=this.cursors.up.isDown||this.wasd.up.isDown, down=this.cursors.down.isDown||this.wasd.down.isDown;
    if(left) this.player.setVelocityX(-speed); else if(right) this.player.setVelocityX(speed);
    if(up) this.player.setVelocityY(-speed); else if(down) this.player.setVelocityY(speed);
    if(this.player.body.velocity.length()>0) this.player.body.velocity.normalize().scale(speed);

    let near=null;
    this.npcs.getChildren().forEach(npc=>{if(Phaser.Math.Distance.BetweenPoints(this.player,npc)<86) near=npc;});
    if(near){
      const done=this.game.gameState.badges[near.getData('id')];
      this.promptText.setText(done?`✅ ${near.getData('name')}：這關已完成！`:`按空白鍵，或點選 ${near.getData('name')} 開始考驗`);
      if(!done&&(Phaser.Input.Keyboard.JustDown(this.cursors.space)||Phaser.Input.Keyboard.JustDown(this.wasd.space))) this.openQuestion(near);
    }else this.promptText.setText('方向鍵 / WASD 移動，或直接點選守護者');
  }

  openQuestion(npc){
    const id=npc.getData('id');
    if(this.game.gameState.badges[id]){ this.promptText.setText(`✅ ${npc.getData('name')}：這關已完成！`); return; }
    this.scene.pause(); this.scene.launch('QuestionScene',{npcId:id,npcName:npc.getData('name')});
  }

  updateBadgeUI(){
    const b=this.game.gameState.badges; const n=[b.elder,b.baby,b.cloud].filter(Boolean).length;
    this.uiText.setText(`親子任務進度　${n} / 3\n${b.elder?'📜':'○'} 發票　 ${b.baby?'🍍':'○'} 稅金　 ${b.cloud?'☁️':'○'} 載具`);
  }

  handleTempleTouch(){
    const b=this.game.gameState.badges;
    if(b.elder&&b.baby&&b.cloud) this.scene.start('EndScene');
    else { this.promptText.setText('🔒 還差徽章喔！先完成三位守護者的考驗'); this.cameras.main.shake(120,.003); }
  }
}
