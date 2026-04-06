// 1. 変数の準備
let winStreak = 0;
let maxStreak = 0;
let isPlaying = false;

// 2. HTML要素の取得
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

// 絵文字に変換する関数
function toEmoji(choice) {
  if (choice === 'rock')     return '✊';
  if (choice === 'paper')    return '✋';
  if (choice === 'scissors') return '✌️';
}

// 3. スタートボタン
startBtn.addEventListener('click', function() {
  isPlaying = true;
  startBtn.disabled = true;
  document.getElementById('result').textContent = 'じゃんけんを選んでください！';
  document.getElementById('result').className = '';
});

// 4. グー・チョキ・パーのボタンを押したとき
document.querySelectorAll('.choice').forEach(function(btn) {
  btn.addEventListener('click', function() {
    if (!isPlaying) return;

    const playerChoice = this.dataset.choice;

    // CPUがランダムに選ぶ
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];

    // 勝敗判定
    const resultText = judge(playerChoice, computerChoice);

    // CPUの選択を表示
    document.getElementById('computer-choice').textContent = toEmoji(computerChoice);

    // 結果によって処理を分ける
    if (resultText === 'win') {
      winStreak++;
      if (winStreak > maxStreak) maxStreak = winStreak;
      document.getElementById('result').textContent = '勝ち！🎉 ' + winStreak + '連勝中';
      document.getElementById('result').className = 'win';
      document.getElementById('win-streak').textContent = '連勝数: ' + winStreak;
    }

    if (resultText === 'lose') {
      isPlaying = false;
      startBtn.disabled = false;
      document.getElementById('result').textContent = '負け😢 連勝数: ' + winStreak;
      document.getElementById('result').className = 'lose';
      document.getElementById('win-streak').textContent = '連勝数: 0';
      const name = prompt('名前を入力してください');
      if (name) saveScore(name, winStreak);
      showRanking();
      winStreak = 0;
    }

    if (resultText === 'draw') {
      document.getElementById('result').textContent = 'あいこ🤝';
      document.getElementById('result').className = 'draw';
    }
  });
});

// 5. 勝敗判定関数
function judge(player, computer) {
  if (player === computer) return 'draw';
  if (
    (player === 'rock'     && computer === 'scissors') ||
    (player === 'scissors' && computer === 'paper')   ||
    (player === 'paper'    && computer === 'rock')
  ) return 'win';
  return 'lose';
}

// 6. リセットボタン
resetBtn.addEventListener('click', function() {
  isPlaying = false;
  winStreak = 0;
  maxStreak = 0;
  startBtn.disabled = false;
  document.getElementById('computer-choice').textContent = '-';
  document.getElementById('result').textContent = '';
  document.getElementById('result').className = '';
  document.getElementById('win-streak').textContent = '連勝数: 0';
});

// スコアを保存する関数
function saveScore(name, score) {
  const data = localStorage.getItem('janken_ranking');
  const ranking = data ? JSON.parse(data) : [];

  ranking.push({ name: name, score: score });

  ranking.sort((a, b) => b.score - a.score);

  ranking.splice(5);

  localStorage.setItem('janken_ranking', JSON.stringify(ranking));
}

// ランキングを画面に表示する関数
function showRanking() {
  const data = localStorage.getItem('janken_ranking');
  const ranking = data ? JSON.parse(data) : [];
  const rankingEl = document.getElementById('ranking');

  if (ranking.length === 0) {
    rankingEl.innerHTML = '<li>まだ記録がありません</li>';
    return;
  }

  rankingEl.innerHTML = ranking.map(function(entry, index) {
    return '<li>' + (index + 1) + '位 ' + entry.name + '：' + entry.score + '連勝</li>';
  }).join('');
}

// ページ読み込み時にランキングを表示
showRanking();