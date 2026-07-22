class MapScene extends Phaser.Scene {
  constructor(){ super({key:'MapScene'}); }

  create(){
    const {width:w,height:h}=this.scale;
    this.w=w; this.h=h;
    this.cols=17; this.rows=9; this.cell=58;
    this.offsetX=(w-this.cols*this.cell)/2;
    this.offsetY=128;
    this.cameras.main.fadeIn(250,12,40,45);

    this.drawBackground();
    this.maze=this.generateMaze(this.cols,this.rows);
    this.drawMaze();

    const start=this.cellCenter(0,this.rows-1);
    const finish=this.cellCenter(this.cols-1,0);

    this.exit=this.physics.add.staticSprite(finish.x,finish.y,'temple_door').setScale(.58).setDepth(4);
    this.add.text(finish.x,finish.y+42,'終點',{fontFamily:'Microsoft JhengHei',fontSize:'17px',color:'#4b321d',fontStyle:'bold',backgroundColor:'rgba(255,245,215,.9)',padding:{x:9,y:3}}).setOrigin(.5).setDepth(5);

    this.npcs=this.physics.add.staticGroup();
    const npcCells=this.pickRandomCells(3, [{c:0,r:this.rows-1},{c:this.cols-1,r:0}]);
    const npcDefs=[
      ['npc_elder','elder','石器族長','統一發票',0xffc857],
      ['npc_baby','baby','釋迦寶寶','稅金用途',0x9ccc65],
      ['npc_cloud','cloud','雲端精靈','雲端發票',0x64b5f6]
    ];
    npcDefs.forEach((d,i)=>{
      const p=this.cellCenter(npcCells[i].c,npcCells[i].r);
      this.makeNpc(p.x,p.y,d[0],d[1],d[2],d[3],d[4]);
    });

    this.player=this.physics.add.sprite(start.x,start.y,'player').setScale(.82).setDepth(10);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(38,38).setOffset(13,20);

    this.cursors=this.input.keyboard.createCursorKeys();
    this.wasd=this.input.keyboard.addKeys({up:Phaser.Input.Keyboard.KeyCodes.W,down:Phaser.Input.Keyboard.KeyCodes.S,left:Phaser.Input.Keyboard.KeyCodes.A,right:Phaser.Input.Keyboard.KeyCodes.D,space:Phaser.Input.Keyboard.KeyCodes.SPACE});

    this.physics.add.collider(this.player,this.walls);
    this.physics.add.overlap(this.player,this.exit,this.handleExit,null,this);
    this.createHud();
  }

  drawBackground(){
    const g=this.add.graphics();
    g.fillGradientStyle(0x7ecf74,0x7ecf74,0x4fae6d,0x2f7d50,1);
    g.fillRect(0,0,this.w,this.h);
    g.fillStyle(0x4ca8c9,.95); g.fillRect(0,this.h-42,this.w,42);
    for(let i=0;i<70;i++){
      this.add.circle(Phaser.Math.Between(0,this.w),Phaser.Math.Between(100,this.h-45),Phaser.Math.Between(2,4),Phaser.Utils.Array.GetRandom([0xffffff,0xffe082,0xff8a80]),.7);
    }
  }

  generateMaze(cols,rows){
    const grid=[];
    for(let r=0;r<rows;r++){
      const row=[];
      for(let c=0;c<cols;c++) row.push({c,r,visited:false,walls:{top:true,right:true,bottom:true,left:true}});
      grid.push(row);
    }
    const stack=[];
    let current=grid[rows-1][0]; current.visited=true;
    let visited=1;
    while(visited<cols*rows){
      const neighbors=[];
      const {c,r}=current;
      if(r>0&&!grid[r-1][c].visited) neighbors.push(['top',grid[r-1][c],'bottom']);
      if(c<cols-1&&!grid[r][c+1].visited) neighbors.push(['right',grid[r][c+1],'left']);
      if(r<rows-1&&!grid[r+1][c].visited) neighbors.push(['bottom',grid[r+1][c],'top']);
      if(c>0&&!grid[r][c-1].visited) neighbors.push(['left',grid[r][c-1],'right']);
      if(neighbors.length){
        const [dir,next,opposite]=Phaser.Utils.Array.GetRandom(neighbors);
        current.walls[dir]=false; next.walls[opposite]=false;
        stack.push(current); current=next; current.visited=true; visited++;
      }else current=stack.pop();
    }
    return grid;
  }

  drawMaze(){
    this.walls=this.physics.add.staticGroup();
    const wallThickness=8, wallColor=0x6b4423;
    const floor=this.add.graphics();
    floor.fillStyle(0xf2d19b,.98);
    floor.fillRoundedRect(this.offsetX-5,this.offsetY-5,this.cols*this.cell+10,this.rows*this.cell+10,18);

    const addWall=(x,y,width,height)=>{
      const wall=this.add.rectangle(x,y,width,height,wallColor,1).setDepth(3);
      this.physics.add.existing(wall,true); this.walls.add(wall);
    };

    for(let r=0;r<this.rows;r++){
      for(let c=0;c<this.cols;c++){
        const cell=this.maze[r][c];
        const x=this.offsetX+c*this.cell, y=this.offsetY+r*this.cell;
        if(cell.walls.top) addWall(x+this.cell/2,y,this.cell+wallThickness,wallThickness);
        if(cell.walls.left) addWall(x,y+this.cell/2,wallThickness,this.cell+wallThickness);
        if(r===this.rows-1&&cell.walls.bottom) addWall(x+this.cell/2,y+this.cell,this.cell+wallThickness,wallThickness);
        if(c===this.cols-1&&cell.walls.right) addWall(x+this.cell,y+this.cell/2,wallThickness,this.cell+wallThickness);
      }
    }
  }

  cellCenter(c,r){
    return {x:this.offsetX+c*this.cell+this.cell/2,y:this.offsetY+r*this.cell+this.cell/2};
  }

  pickRandomCells(count,excluded){
    const excludedKeys=new Set(excluded.map(p=>`${p.c},${p.r}`));
    const all=[];
    for(let r=0;r<this.rows;r++) for(let c=0;c<this.cols;c++) if(!excludedKeys.has(`${c},${r}`)) all.push({c,r});
    Phaser.Utils.Array.Shuffle(all);
    return all.slice(0,count);
  }

  makeNpc(x,y,texture,id,name,topic,color){
    const npc=this.npcs.create(x,y,texture).setScale(.78).setDepth(7).setData({id,name,topic});
    this.tweens.add({targets:npc,y:y-5,duration:850,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    const ring=this.add.circle(x,y,31,color,.18).setStrokeStyle(3,color,.95).setDepth(6);
    this.tweens.add({targets:ring,scale:1.18,alpha:.05,duration:900,yoyo:true,repeat:-1});
    return npc;
  }

  createHud(){
    const hud=this.add.graphics().setDepth(50);
    hud.fillStyle(0x10343b,.94); hud.fillRoundedRect(18,16,390,96,22);
    hud.lineStyle(3,0xffe49a,.8); hud.strokeRoundedRect(18,16,390,96,22);
    this.uiText=this.add.text(38,32,'',{fontFamily:'Microsoft JhengHei',fontSize:'20px',color:'#ffffff',lineSpacing:7}).setDepth(51);
    this.updateBadgeUI();

    const title=this.add.text(this.w/2,48,'簡易迷宮・尋找三個租稅關卡',{fontFamily:'Microsoft JhengHei',fontSize:'25px',color:'#fff4bf',fontStyle:'bold',stroke:'#4b321d',strokeThickness:5}).setOrigin(.5).setDepth(51);
    this.promptText=this.add.text(this.w/2,this.h-23,'方向鍵 / WASD 移動；靠近守護者按空白鍵',{fontFamily:'Microsoft JhengHei',fontSize:'18px',color:'#ffffff',fontStyle:'bold',backgroundColor:'rgba(16,52,59,.9)',padding:{x:18,y:8}}).setOrigin(.5).setDepth(51);
  }

  update(){
    const speed=210; this.player.setVelocity(0);
    const left=this.cursors.left.isDown||this.wasd.left.isDown;
    const right=this.cursors.right.isDown||this.wasd.right.isDown;
    const up=this.cursors.up.isDown||this.wasd.up.isDown;
    const down=this.cursors.down.isDown||this.wasd.down.isDown;
    if(left) this.player.setVelocityX(-speed); else if(right) this.player.setVelocityX(speed);
    if(up) this.player.setVelocityY(-speed); else if(down) this.player.setVelocityY(speed);
    if(this.player.body.velocity.length()>0) this.player.body.velocity.normalize().scale(speed);

    let near=null;
    this.npcs.getChildren().forEach(npc=>{ if(Phaser.Math.Distance.BetweenPoints(this.player,npc)<54) near=npc; });
    if(near){
      const done=this.game.gameState.badges[near.getData('id')];
      this.promptText.setText(done?`✅ ${near.getData('name')}：這關已完成！`:`按空白鍵挑戰 ${near.getData('name')}：${near.getData('topic')}`);
      if(!done&&(Phaser.Input.Keyboard.JustDown(this.cursors.space)||Phaser.Input.Keyboard.JustDown(this.wasd.space))) this.openQuestion(near);
    }else this.promptText.setText('方向鍵 / WASD 移動；找到三位守護者，最後走到右上角終點');
  }

  openQuestion(npc){
    const id=npc.getData('id');
    if(this.game.gameState.badges[id]) return;
    this.scene.pause();
    this.scene.launch('QuestionScene',{npcId:id,npcName:npc.getData('name')});
  }

  updateBadgeUI(){
    const b=this.game.gameState.badges; const n=[b.elder,b.baby,b.cloud].filter(Boolean).length;
    this.uiText.setText(`租稅任務進度　${n} / 3\n${b.elder?'📜':'○'} 發票　 ${b.baby?'🍍':'○'} 稅金　 ${b.cloud?'☁️':'○'} 載具`);
  }

  handleExit(){
    if(this.exitLocked) return;
    const b=this.game.gameState.badges;
    if(b.elder&&b.baby&&b.cloud){
      this.exitLocked=true;
      this.player.setVelocity(0);
      this.scene.start('EndScene');
    }else{
      this.exitLocked=true;
      this.promptText.setText('🔒 終點尚未開啟：請先完成迷宮中的三個關卡！');
      this.cameras.main.shake(160,.004);
      this.time.delayedCall(650,()=>{this.exitLocked=false;});
    }
  }
}
