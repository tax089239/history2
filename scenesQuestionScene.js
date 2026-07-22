class QuestionScene extends Phaser.Scene {
  constructor(){ super({key:'QuestionScene'}); }
  init(data){ this.npcId=data.npcId; this.npcName=data.npcName; }

  create(){
    const {width:w,height:h}=this.scale; this.w=w; this.h=h;
    const q=this.getQuestionData(this.npcId);
    this.add.rectangle(w/2,h/2,w,h,0x071a20,.78).setInteractive();

    const panel=this.add.graphics(); panel.fillStyle(0xfffbef,1); panel.fillRoundedRect(w*.14,h*.08,w*.72,h*.84,34); panel.lineStyle(5,0xffcf5a,1); panel.strokeRoundedRect(w*.14,h*.08,w*.72,h*.84,34);
    this.add.text(w/2,h*.14,`守護者考驗・${this.npcName}`,{fontFamily:'Microsoft JhengHei',fontSize:'30px',color:'#24505a',fontStyle:'bold'}).setOrigin(.5);
    this.add.text(w/2,h*.245,q.question,{fontFamily:'Microsoft JhengHei',fontSize:'30px',color:'#263b40',fontStyle:'bold',align:'center',wordWrap:{width:w*.61},lineSpacing:10}).setOrigin(.5);

    q.options.forEach((opt,i)=>{
      const y=h*(.43+i*.135);
      const box=this.add.rectangle(w/2,y,w*.58,76,0xffffff,1).setStrokeStyle(3,0x84b8ad).setInteractive({useHandCursor:true});
      const label=this.add.text(w*.25,y,`${String.fromCharCode(65+i)}　${opt}`,{fontFamily:'Microsoft JhengHei',fontSize:'24px',color:'#29474d',fontStyle:'bold'}).setOrigin(0,.5);
      const choose=()=>this.checkAnswer(i,q.answer,q.explanation);
      box.on('pointerdown',choose); label.setInteractive({useHandCursor:true}).on('pointerdown',choose);
      box.on('pointerover',()=>{box.setFillStyle(0xfff2bd); box.setStrokeStyle(4,0xffb703);});
      box.on('pointerout',()=>{box.setFillStyle(0xffffff); box.setStrokeStyle(3,0x84b8ad);});
    });
    this.add.text(w/2,h*.86,'碰到關卡就會自動出題，親子一起選答案！',{fontFamily:'Microsoft JhengHei',fontSize:'19px',color:'#61777b'}).setOrigin(.5);
  }

  getQuestionData(id){
    return {
      elder:{question:'買東西時索取統一發票，有哪些好處？',options:['可以參加定期對獎','可以證明交易並幫助稅收管理','以上皆是'],answer:2,explanation:'發票能證明交易、幫助誠實納稅，也能參加對獎喔！'},
      baby:{question:'大家繳的稅金，主要會用在哪裡？',options:['公園、學校、道路與醫療服務','只拿來買零食','全部藏進神殿寶箱'],answer:0,explanation:'稅金會用在公共建設、教育、醫療等大家共享的服務。'},
      cloud:{question:'使用雲端發票（載具）有什麼優點？',options:['減少紙張，也比較不容易弄丟','系統可以自動幫忙對獎','以上都是'],answer:2,explanation:'雲端發票方便、環保，還能自動對獎！'}
    }[id];
  }

  checkAnswer(selected,correct,explanation){
    if(this.resultShown) return;
    this.resultShown=true;
    const success=selected===correct;
    this.game.recordAnswer(this.npcId,success);
    if(success){
      this.game.gameState.badges[this.npcId]=true;
      this.showResult(true,'答對了！','這個關卡完成，守護者將從迷宮消失！',explanation);
    } else {
      this.showResult(false,'再想一想','這個答案還不對，再討論一次吧！','');
    }
  }

  showResult(success,title,subtitle,explanation){
    const w=this.w,h=this.h;
    this.add.rectangle(w/2,h/2,w,h,0x071a20,.82).setDepth(20).setInteractive();
    const card=this.add.graphics().setDepth(21); card.fillStyle(success?0xeafaf0:0xfff0f0,1); card.fillRoundedRect(w*.27,h*.24,w*.46,h*.5,32); card.lineStyle(5,success?0x4caf78:0xef7c8e,1); card.strokeRoundedRect(w*.27,h*.24,w*.46,h*.5,32);
    this.add.text(w/2,h*.33,success?'🎉':'💡',{fontSize:'62px'}).setOrigin(.5).setDepth(22);
    this.add.text(w/2,h*.43,title,{fontFamily:'Microsoft JhengHei',fontSize:'36px',color:'#27454a',fontStyle:'bold'}).setOrigin(.5).setDepth(22);
    this.add.text(w/2,h*.51,subtitle,{fontFamily:'Microsoft JhengHei',fontSize:'22px',color:'#4b6266'}).setOrigin(.5).setDepth(22);
    if(explanation) this.add.text(w/2,h*.585,explanation,{fontFamily:'Microsoft JhengHei',fontSize:'19px',color:'#4b6266',align:'center',wordWrap:{width:w*.36}}).setOrigin(.5).setDepth(22);
    const btn=this.add.text(w/2,h*.68,success?'繼續走迷宮':'重新作答',{fontFamily:'Microsoft JhengHei',fontSize:'23px',color:'#263238',fontStyle:'bold',backgroundColor:success?'#ffd166':'#ffb5c0',padding:{x:32,y:14}}).setOrigin(.5).setDepth(22).setInteractive({useHandCursor:true});
    btn.on('pointerdown',()=>{
      const map=this.scene.get('MapScene');
      if(success){
        map.completeNpc(this.npcId);
        this.scene.stop();
        this.scene.resume('MapScene');
      } else {
        this.scene.restart({npcId:this.npcId,npcName:this.npcName});
      }
    });
  }
}
