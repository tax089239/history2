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

const STORAGE_KEY = 'prehistoricTaxGameStatsV2';

game.gameState = {
  badges: { elder: false, baby: false, cloud: false },
  currentSession: null
};

game.getStats = function () {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data && Array.isArray(data.sessions)) return data;
  } catch (error) {
    console.warn('讀取統計資料失敗：', error);
  }
  return { sessions: [] };
};

game.saveStats = function (stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

game.startSession = function () {
  const now = new Date();
  game.gameState.currentSession = {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    startedAt: now.toISOString(),
    firstAnsweredAt: '',
    completedAt: '',
    answeredQuestions: [],
    correctAnswers: 0,
    attempts: 0,
    completed: false,
    saved: false
  };
};

game.recordAnswer = function (questionId, isCorrect) {
  const session = game.gameState.currentSession;
  if (!session) return;
  if (!session.firstAnsweredAt) session.firstAnsweredAt = new Date().toISOString();
  session.attempts += 1;
  if (isCorrect) {
    session.correctAnswers += 1;
    if (!session.answeredQuestions.includes(questionId)) session.answeredQuestions.push(questionId);
  }
  const stats = game.getStats();
  const index = stats.sessions.findIndex(item => item.id === session.id);
  const snapshot = { ...session };
  if (index >= 0) stats.sessions[index] = snapshot;
  else stats.sessions.push(snapshot);
  game.saveStats(stats);
};

game.finishSession = function () {
  const session = game.gameState.currentSession;
  if (!session || session.saved) return;
  session.completed = true;
  session.completedAt = new Date().toISOString();
  session.saved = true;
  const stats = game.getStats();
  const index = stats.sessions.findIndex(item => item.id === session.id);
  const snapshot = { ...session };
  if (index >= 0) stats.sessions[index] = snapshot;
  else stats.sessions.push(snapshot);
  game.saveStats(stats);
};

game.exportStatsToExcel = function () {
  const stats = game.getStats();
  const answered = stats.sessions.filter(s => s.firstAnsweredAt).length;
  const completed = stats.sessions.filter(s => s.completed).length;
  const attempts = stats.sessions.reduce((sum, s) => sum + (s.attempts || 0), 0);

  const summary = [
    { 項目: '答題人數', 數值: answered },
    { 項目: '完成闖關人數', 數值: completed },
    { 項目: '總作答次數', 數值: attempts },
    { 項目: '匯出時間', 數值: new Date().toLocaleString('zh-TW') }
  ];

  const records = stats.sessions.map((s, index) => ({
    編號: index + 1,
    工作階段ID: s.id,
    開始時間: s.startedAt ? new Date(s.startedAt).toLocaleString('zh-TW') : '',
    首次答題時間: s.firstAnsweredAt ? new Date(s.firstAnsweredAt).toLocaleString('zh-TW') : '',
    完成時間: s.completedAt ? new Date(s.completedAt).toLocaleString('zh-TW') : '',
    是否完成: s.completed ? '是' : '否',
    完成關卡數: Array.isArray(s.answeredQuestions) ? s.answeredQuestions.length : 0,
    答對次數: s.correctAnswers || 0,
    作答次數: s.attempts || 0
  }));

  if (window.XLSX) {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summary), '統計摘要');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(records), '答題紀錄');
    XLSX.writeFile(workbook, `史前稅遊記_答題統計_${new Date().toISOString().slice(0, 10)}.xlsx`);
    return true;
  }

  console.error('Excel 匯出元件尚未載入');
  return false;
};

window.addEventListener('resize', () => game.scale.refresh());
