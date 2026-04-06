// 変数の準備
let count = 0;  // クリック数
let gameActive = false;  // ゲーム中かどうか

// HTML の要素を取得する
const countEl = document.getElementById('count');
const timerEl = document.getElementById('timer');
const clickBtn = document.getElementById('click-btn');
const startBtn = document.getElementById('start-btn');

// クリックボタンを押したとき
clickBtn.addEventListener('click', function() {
  if (!gameActive) return;  // ゲーム中でなければ何もしない

  count++;                          // カウントを1増やす
  countEl.textContent = count;      // 画面に反映する
});

// スタートボタンを押したとき
startBtn.addEventListener('click', function() {
  // ゲームをリセット
  count = 0;
  countEl.textContent = 0;
  timerEl.textContent = 10;
  gameActive = true;

  // スタートボタンを無効化
  startBtn.disabled = true;

  // タイマー開始
  let timeLeft = 10;

  const timer = setInterval(function() {
    timeLeft--;                      // 残り時間を1減らす
    timerEl.textContent = timeLeft;  // 画面に反映

    // 時間切れ
    if (timeLeft === 0) {
      clearInterval(timer);  // タイマーを止める
      gameActive = false;    // ゲーム終了
      startBtn.disabled = false;  // スタートボタンを戻す
    
      // 名前を入力してもらう
      const name = prompt('名前を入力してください');
      if (name) {
         saveScore(name, count);  // スコアを保存
      }
      showRanking();  // ランキングを表示
      }
  }, 1000);  // 1000ms = 1秒ごとに実行
});

// スコアを保存する関数
function saveScore(name, score) {
  // 既存のランキングを取得
  const data = localStorage.getItem('ranking');
  const ranking = data ? JSON.parse(data) : [];

  // 新しいスコアを追加
  ranking.push({ name: name, score: score });

  // 高い順に並べ替え
  ranking.sort((a, b) => b.score - a.score); // スコアが高い順に並べる

  // 上位5件だけ保存
  ranking.splice(5);

  // localStorageに保存
  localStorage.setItem('ranking', JSON.stringify(ranking));
}

// ランキングを画面に表示する関数
function showRanking() {
  const data = localStorage.getItem('ranking');
  const ranking = data ? JSON.parse(data) : [];
  const rankingEl = document.getElementById('ranking');

  // ランキングが空の場合
  if (ranking.length === 0) {
    rankingEl.innerHTML = '<li>まだ記録がありません</li>';
    return;
  }

  // ランキングをHTMLに変換して表示
  rankingEl.innerHTML = ranking.map(function(entry, index) {
    return '<li>' + (index + 1) + '位 ' + entry.name + '：' + entry.score + '回</li>';
  }).join('');
}

// ページ読み込み時にランキングを表示
showRanking();