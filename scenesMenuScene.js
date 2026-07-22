class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  create() {
    const { width: w, height: h } = this.scale;
    this.add.image(w / 2, h / 2, 'frontpage').setDisplaySize(w, h);

    const gearZone = this.add.zone(w * 0.043, h * 0.065, 95, 95)
      .setInteractive({ useHandCursor: true });
    gearZone.on('pointerdown', () => this.openPasswordPanel());

    const startZone = this.add.zone(w / 2, h * 0.855, w * 0.37, h * 0.16)
      .setInteractive({ useHandCursor: true });
    startZone.on('pointerdown', () => this.showInstructions());

    this.input.keyboard.once('keydown-ENTER', () => this.showInstructions());
  }

  showInstructions() {
    if (this.instructionLayer || this.adminLayer) return;
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

  openPasswordPanel() {
    if (this.adminLayer || this.instructionLayer) return;
    const { width: w, height: h } = this.scale;
    this.adminLayer = this.add.container(0, 0).setDepth(200);

    const shade = this.add.rectangle(w / 2, h / 2, w, h, 0x071a20, 0.76).setInteractive();
    const card = this.add.graphics();
    card.fillStyle(0xfffbef, 1);
    card.fillRoundedRect(w * 0.31, h * 0.22, w * 0.38, h * 0.52, 30);
    card.lineStyle(5, 0xffb703, 1);
    card.strokeRoundedRect(w * 0.31, h * 0.22, w * 0.38, h * 0.52, 30);

    const title = this.add.text(w / 2, h * 0.30, '後台管理登入', {
      fontFamily: 'Microsoft JhengHei', fontSize: '34px', color: '#27454a', fontStyle: 'bold'
    }).setOrigin(0.5);

    const hint = this.add.text(w / 2, h * 0.39, '請輸入 6 位數密碼', {
      fontFamily: 'Microsoft JhengHei', fontSize: '22px', color: '#5d7074'
    }).setOrigin(0.5);

    const displayBox = this.add.rectangle(w / 2, h * 0.49, 300, 68, 0xffffff, 1).setStrokeStyle(3, 0x84b8ad);
    const display = this.add.text(w / 2, h * 0.49, '', {
      fontFamily: 'Microsoft JhengHei', fontSize: '34px', color: '#263b40', letterSpacing: 10
    }).setOrigin(0.5);

    let password = '';
    const updateDisplay = () => display.setText('●'.repeat(password.length));
    const keyHandler = event => {
      if (/^[0-9]$/.test(event.key) && password.length < 6) {
        password += event.key;
        updateDisplay();
      } else if (event.key === 'Backspace') {
        password = password.slice(0, -1);
        updateDisplay();
      } else if (event.key === 'Enter') {
        submit();
      } else if (event.key === 'Escape') {
        close();
      }
    };

    const message = this.add.text(w / 2, h * 0.57, '', {
      fontFamily: 'Microsoft JhengHei', fontSize: '19px', color: '#d64545', fontStyle: 'bold'
    }).setOrigin(0.5);

    const submitButton = this.makeButton(w / 2 - 100, h * 0.66, 180, 58, '登入', 0xffd166, () => submit());
    const closeButton = this.makeButton(w / 2 + 100, h * 0.66, 180, 58, '取消', 0xdfe8e8, () => close());

    const submit = () => {
      if (password === '231600') {
        window.removeEventListener('keydown', keyHandler);
        this.adminLayer.destroy(true);
        this.adminLayer = null;
        this.showAdminDashboard();
      } else {
        message.setText('密碼錯誤，請重新輸入');
        password = '';
        updateDisplay();
      }
    };

    const close = () => {
      window.removeEventListener('keydown', keyHandler);
      this.adminLayer.destroy(true);
      this.adminLayer = null;
    };

    window.addEventListener('keydown', keyHandler);
    this.adminLayer.add([shade, card, title, hint, displayBox, display, message, ...submitButton, ...closeButton]);
  }

  showAdminDashboard() {
    const { width: w, height: h } = this.scale;
    this.adminLayer = this.add.container(0, 0).setDepth(210);
    const stats = this.game.getStats();
    const answered = stats.sessions.filter(s => s.firstAnsweredAt).length;
    const completed = stats.sessions.filter(s => s.completed).length;
    const attempts = stats.sessions.reduce((sum, s) => sum + (s.attempts || 0), 0);

    const shade = this.add.rectangle(w / 2, h / 2, w, h, 0x071a20, 0.80).setInteractive();
    const card = this.add.graphics();
    card.fillStyle(0xfffbef, 1);
    card.fillRoundedRect(w * 0.19, h * 0.11, w * 0.62, h * 0.78, 34);
    card.lineStyle(5, 0xffb703, 1);
    card.strokeRoundedRect(w * 0.19, h * 0.11, w * 0.62, h * 0.78, 34);

    const title = this.add.text(w / 2, h * 0.18, '後台管理設定', {
      fontFamily: 'Microsoft JhengHei', fontSize: '38px', color: '#27454a', fontStyle: 'bold'
    }).setOrigin(0.5);

    const cards = [
      ['答題人數', answered, w * 0.34],
      ['完成闖關', completed, w * 0.50],
      ['總作答次數', attempts, w * 0.66]
    ];
    const items = [];
    cards.forEach(([label, value, x]) => {
      const box = this.add.rectangle(x, h * 0.38, 180, 130, 0xffffff, 1).setStrokeStyle(3, 0x84b8ad);
      const num = this.add.text(x, h * 0.35, String(value), {
        fontFamily: 'Microsoft JhengHei', fontSize: '42px', color: '#e46a1a', fontStyle: 'bold'
      }).setOrigin(0.5);
      const txt = this.add.text(x, h * 0.43, label, {
        fontFamily: 'Microsoft JhengHei', fontSize: '20px', color: '#425b60', fontStyle: 'bold'
      }).setOrigin(0.5);
      items.push(box, num, txt);
    });

    const note = this.add.text(w / 2, h * 0.55,
      '統計資料儲存在目前使用的瀏覽器中\n適合在同一台電腦或平板作為活動闖關機使用', {
        fontFamily: 'Microsoft JhengHei', fontSize: '20px', color: '#5d7074', align: 'center', lineSpacing: 8
      }).setOrigin(0.5);

    const exportBtn = this.makeButton(w / 2 - 165, h * 0.70, 280, 66, '匯出 Excel', 0xffd166, () => {
      const ok = this.game.exportStatsToExcel();
      status.setText(ok ? 'Excel 已開始下載' : 'Excel 元件尚未載入，請重新整理後再試');
    });
    const closeBtn = this.makeButton(w / 2 + 165, h * 0.70, 220, 66, '關閉', 0xdfe8e8, () => {
      this.adminLayer.destroy(true);
      this.adminLayer = null;
    });

    const status = this.add.text(w / 2, h * 0.80, '', {
      fontFamily: 'Microsoft JhengHei', fontSize: '18px', color: '#2f855a', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.adminLayer.add([shade, card, title, ...items, note, ...exportBtn, ...closeBtn, status]);
  }

  makeButton(x, y, width, height, text, color, callback) {
    const box = this.add.rectangle(x, y, width, height, color, 1)
      .setStrokeStyle(3, 0x8a6d2f)
      .setInteractive({ useHandCursor: true });
    const label = this.add.text(x, y, text, {
      fontFamily: 'Microsoft JhengHei', fontSize: '23px', color: '#263238', fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    box.on('pointerdown', callback);
    label.on('pointerdown', callback);
    return [box, label];
  }

  startGame() {
    this.game.gameState.badges = { elder: false, baby: false, cloud: false };
    this.game.startSession();
    this.cameras.main.fadeOut(250, 18, 50, 58);
    this.time.delayedCall(250, () => this.scene.start('MapScene'));
  }
}
