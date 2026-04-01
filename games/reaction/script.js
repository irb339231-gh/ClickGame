// 1. 変数の準備
let startTime = null;
let waitTimer = null;   // setTimeoutの入れ物
let isWaiting = false;  // 緑になるのを待っている状態

// 2. HTML要素の取得
const clickArea = document.getElementById('click-area');
const message = document.getElementById('message');
const result = document.getElementById('result');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

// 3. スタートボタン
startBtn.addEventListener('click', function() {
  message.textContent = '待て...';
  isWaiting = true;

  // ランダムな時間後に緑にする
  waitTimer = setTimeout(function() {
    clickArea.classList.add('active');  // 緑にする
    message.textContent = '今だ！';
    startTime = Date.now();             // 開始時刻を記録
  }, Math.random() * 3000 + 1000);
});

// 4. クリックエリアをクリックしたとき
clickArea.addEventListener('click', function() {
  // 緑になる前にクリックしたら
  if (isWaiting && !clickArea.classList.contains('active')) {
    message.textContent = '早すぎ！もう一度';
    clearTimeout(waitTimer);
    isWaiting = false;
    return;
  }

  // 緑のときにクリックしたら
  if (clickArea.classList.contains('active')) {
    const elapsed = Date.now() - startTime;
    message.textContent = '結果：' + elapsed + 'ms';
    clickArea.classList.remove('active');
    isWaiting = false;

    const name = prompt('名前を入力してください');
    if (name) saveScore(name, elapsed);
    showRanking();
  }
});

// 5. リセットボタン
resetBtn.addEventListener('click', function() {
  clearTimeout(waitTimer);
  isWaiting = false;
  clickArea.classList.remove('active');
  message.textContent = 'スタートを押してください';
  result.textContent = '';
});

// スコアを保存する関数
function saveScore(name, score) {
  // 既存のランキングを取得
  const data = localStorage.getItem('reaction_ranking');
  const ranking = data ? JSON.parse(data) : [];

  // 新しいスコアを追加
  ranking.push({ name: name, score: score });

  // 高い順に並べ替え
  ranking.sort(function(a, b) {
    return a.score - b.score; // 反応速度は速い方が良いので、スコアが小さい順に並べる
  });

  // 上位5件だけ保存
  ranking.splice(5);

  // localStorageに保存
  localStorage.setItem('reaction_ranking', JSON.stringify(ranking));
}

// ランキングを画面に表示する関数
function showRanking() {
  const data = localStorage.getItem('reaction_ranking');
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