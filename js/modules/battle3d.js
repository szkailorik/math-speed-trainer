// js/modules/battle3d.js - 第三视角战斗系统
// 🐝 math-battle 负责
// 预计时间: 4小时
// 依赖: math-arch (已完成)

const Battle3D = {
  config: {
    heroHP: 100,
    enemyHP: 50,
    timeLimit: 40
  },
  
  state: {
    active: false,
    heroHP: 100,
    enemyHP: 50,
    timeLeft: 40,
    timer: null,
    question: null
  },
  
  // 初始化
  init() {
    console.log('[Battle3D] 初始化');
    this.bindEvents();
    return this;
  },
  
  // 绑定事件
  bindEvents() {
    // 使用事件委托，绑定在document上
    document.addEventListener('click', (e) => {
      if (e.target.matches('#select-battle-mode, #select-battle-mode *')) {
        e.preventDefault();
        e.stopPropagation();
        this.handleBattleClick();
      }
    });
  },
  
  // 处理战斗按钮点击
  handleBattleClick() {
    console.log('[Battle3D] 战斗按钮点击');
    const diff = document.querySelector('.battle-diff-btn.active')?.dataset.diff || 'easy';
    this.start('xiaojiujiu', diff);
  },
  
  // 开始战斗
  start(module, difficulty) {
    console.log('[Battle3D] 开始战斗', module, difficulty);
    this.resetState();
    this.state.active = true;
    this.generateEnemy(difficulty);
    this.render();
    this.nextQuestion();
    this.startTimer();
    
    // 播放音效
    if (window.App?.modules?.audio) {
      App.modules.audio.playBattleBGM();
    }
  },
  
  // 重置状态
  resetState() {
    this.state = {
      active: true,
      heroHP: this.config.heroHP,
      enemyHP: this.config.enemyHP,
      timeLeft: this.config.timeLimit,
      timer: null,
      question: null
    };
  },
  
  // 生成敌人
  generateEnemy(difficulty) {
    const enemies = [
      { emoji: '👹', name: '乘法小妖', hp: 3, type: 'fire' },
      { emoji: '👺', name: '除法鬼怪', hp: 4, type: 'water' },
      { emoji: '🎭', name: '分数幽灵', hp: 5, type: 'dark' },
      { emoji: '🐉', name: '小数神龙', hp: 6, type: 'electric' }
    ];
    let idx = 0;
    if (difficulty === 'normal') idx = Math.floor(Math.random() * 2) + 1;
    if (difficulty === 'hard') idx = Math.floor(Math.random() * 2) + 2;
    this.state.enemy = enemies[idx];
    this.state.enemyHP = this.state.enemy.hp * 10;
  },
  
  // 渲染战斗场景
  render() {
    // 移除旧的战斗场景
    document.getElementById('battle3d-scene')?.remove();
    
    const html = `
      <div id="battle3d-scene">
        <div class="b3-hud">
          <button class="b3-exit" onclick="Battle3D.exit()">✕</button>
          <div class="b3-timer">
            <div class="b3-timer-bar"><div class="b3-timer-fill" style="width:100%"></div></div>
            <span class="b3-timer-text">40秒</span>
          </div>
        </div>
        <div class="b3-arena">
          <div class="b3-hero">
            <div class="b3-sprite">🧙</div>
            <div class="b3-name">勇者</div>
            <div class="b3-hp-bar"><div class="b3-hp-fill" style="width:100%"></div></div>
          </div>
          <div class="b3-vs">VS</div>
          <div class="b3-enemy">
            <div class="b3-sprite">${this.state.enemy.emoji}</div>
            <div class="b3-name">${this.state.enemy.name}</div>
            <div class="b3-hp-bar"><div class="b3-hp-fill" style="width:100%"></div></div>
          </div>
        </div>
        <div class="b3-question-area">
          <div class="b3-question-text">准备战斗！</div>
          <div class="b3-question-timer">限时40秒</div>
          <div class="b3-options"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  },
  
  // 下一题
  nextQuestion() {
    // 生成数学题
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    const answer = a * b;
    
    // 生成干扰项
    const options = [answer];
    while (options.length < 4) {
      const wrong = answer + Math.floor(Math.random() * 10) - 5;
      if (wrong > 0 && wrong !== answer && !options.includes(wrong)) {
        options.push(wrong);
      }
    }
    options.sort(() => Math.random() - 0.5);
    
    this.state.question = { a, b, answer, options };
    this.updateQuestionUI();
  },
  
  // 更新题目UI
  updateQuestionUI() {
    const q = this.state.question;
    const scene = document.getElementById('battle3d-scene');
    if (!scene) return;
    
    scene.querySelector('.b3-question-text').textContent = `${q.a} × ${q.b} = ?`;
    scene.querySelector('.b3-options').innerHTML = q.options.map((opt, i) => 
      `<button class="b3-option" data-answer="${opt}">${opt}</button>`
    ).join('');
    
    // 绑定选项点击
    scene.querySelectorAll('.b3-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleAnswer(parseInt(e.target.dataset.answer));
      });
    });
  },
  
  // 处理答案
  handleAnswer(answer) {
    const correct = answer === this.state.question.answer;
    if (correct) {
      this.heroAttack();
    } else {
      this.enemyAttack();
    }
    
    if (this.state.enemyHP <= 0) {
      this.win();
    } else if (this.state.heroHP <= 0) {
      this.lose();
    } else {
      this.nextQuestion();
    }
  },
  
  // 主角攻击
  heroAttack() {
    this.state.enemyHP -= 10;
    this.updateHP();
    // 播放攻击动画和音效
  },
  
  // 敌人攻击
  enemyAttack() {
    this.state.heroHP -= 10;
    this.updateHP();
    // 播放受击动画和音效
  },
  
  // 更新血条
  updateHP() {
    const scene = document.getElementById('battle3d-scene');
    if (!scene) return;
    
    const heroPercent = (this.state.heroHP / this.config.heroHP) * 100;
    const enemyPercent = (this.state.enemyHP / (this.state.enemy.hp * 10)) * 100;
    
    scene.querySelector('.b3-hero .b3-hp-fill').style.width = heroPercent + '%';
    scene.querySelector('.b3-enemy .b3-hp-fill').style.width = enemyPercent + '%';
  },
  
  // 计时器
  startTimer() {
    this.state.timer = setInterval(() => {
      this.state.timeLeft--;
      this.updateTimer();
      
      if (this.state.timeLeft <= 0) {
        this.enemyAttack();
        if (this.state.heroHP <= 0) {
          this.lose();
        } else {
          this.nextQuestion();
          this.state.timeLeft = this.config.timeLimit;
        }
      }
    }, 1000);
  },
  
  // 更新计时器UI
  updateTimer() {
    const scene = document.getElementById('battle3d-scene');
    if (!scene) return;
    
    const percent = (this.state.timeLeft / this.config.timeLimit) * 100;
    scene.querySelector('.b3-timer-fill').style.width = percent + '%';
    scene.querySelector('.b3-timer-text').textContent = this.state.timeLeft + '秒';
    scene.querySelector('.b3-question-timer').textContent = `限时${this.state.timeLeft}秒`;
  },
  
  // 胜利
  win() {
    clearInterval(this.state.timer);
    alert('胜利！');
    this.exit();
  },
  
  // 失败
  lose() {
    clearInterval(this.state.timer);
    alert('失败！');
    this.exit();
  },
  
  // 退出
  exit() {
    clearInterval(this.state.timer);
    this.state.active = false;
    document.getElementById('battle3d-scene')?.remove();
    showPage('xiaojiujiu-mode');
  }
};

// 自动初始化
Battle3D.init();

// 导出
export default Battle3D;
window.Battle3D = Battle3D;
