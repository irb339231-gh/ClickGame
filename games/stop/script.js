// 1. 変数の準備
let startTime = null;   // 開始時刻
let timer = null;       // setIntervalの入れ物
let isRunning = false;  // 動いているかどうか

// 2. HTML要素の取得
const secondsEl = document.getElementById('seconds');
const millisecondsEl = document.getElementById('milliseconds');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');

// 3. スタートボタン
startBtn.addEventListener('click', function() {
    if (isRunning) return; // すでに動いている場合は無視
    startTime = Date.now(); // 開始時刻を記録
    isRunning = true;      // 動いている状態に
    timer = setInterval(function() {
        const elapsed = Date.now() - startTime; // 経過時間を計算
        const seconds = Math.floor(elapsed / 1000); // 秒部分
        const milliseconds = elapsed % 1000; // ミリ秒部分
        secondsEl.textContent = String(seconds).padStart(2, '0'); // 秒を表示
        millisecondsEl.textContent = String(milliseconds).padStart(3, '0'); // ミリ秒を表示
    }, 10); // 10msごとに更新
});

// 4. ストップボタン
stopBtn.addEventListener('click', function() {
  if (!isRunning) return; // 動いていない場合は無視
  clearInterval(timer);  // タイマー停止
  isRunning = false;     // 動いていない状態に
  
  const elapsed = Date.now() - startTime; // 経過時間を計算
  const name = prompt('名前を入力してください'); // 名前を入力してもらう
  if (name) {
    saveScore(name, elapsed); // スコアを保存
  } 
    showRanking(); // ランキングを表示
});

// 5. リセットボタン
resetBtn.addEventListener('click', function() {
    clearInterval(timer);
    isRunning = false;
    secondsEl.textContent = '00';
    millisecondsEl.textContent = '000';
});

// スコアを保存する関数
function saveScore(name, score) {
  // 既存のランキングを取得
  const data = localStorage.getItem('stop_ranking');
  const ranking = data ? JSON.parse(data) : [];

  // 新しいスコアを追加
  ranking.push({ name: name, score: score });

  // 高い順に並べ替え
  ranking.sort(function(a, b) {
    return Math.abs(a.score - 10000) - Math.abs(b.score - 10000);
  });

  // 上位5件だけ保存
  ranking.splice(5);

  // localStorageに保存
  localStorage.setItem('stop_ranking', JSON.stringify(ranking));
}

// ランキングを画面に表示する関数
function showRanking() {
  const data = localStorage.getItem('stop_ranking');
  const ranking = data ? JSON.parse(data) : [];
  const rankingEl = document.getElementById('ranking');

  // ランキングが空の場合
  if (ranking.length === 0) {
    rankingEl.innerHTML = '<li>まだ記録がありません</li>';
    return;
  }

  // ランキングをHTMLに変換して表示
  rankingEl.innerHTML = ranking.map(function(entry, index) {
    const sec = Math.floor(entry.score / 1000);
    const ms = entry.score % 1000;
    return '<li>' + (index + 1) + '位 ' + entry.name + '：' +
    String(sec).padStart(2, '0') + '秒' +
    String(ms).padStart(3, '0') + '</li>';
  }).join('');
}

// ページ読み込み時にランキングを表示
showRanking();