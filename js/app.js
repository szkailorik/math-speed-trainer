// js/app.js - 核心应用 (v14.0 极简架构)
// 🐝 math-arch 负责维护

// 全局应用对象
const App = {
  version: '14.0',
  currentPage: 'home',
  
  // 模块引用（由各个蜂群填充）
  modules: {},
  
  // 初始化
  init() {
    console.log('[App] 数学魔法学院 v14.0 启动');
    this.bindEvents();
    this.loadModules();
  },
  
  // 加载所有模块
  async loadModules() {
    console.log('[App] 加载模块...');
    // 动态加载各模块
    const modules = ['battle3d', 'cards', 'audio', 'bg'];
    for (const name of modules) {
      try {
        const module = await import(`./modules/${name}.js`);
        this.modules[name] = module.default;
        console.log(`[App] 模块加载成功: ${name}`);
      } catch (e) {
        console.warn(`[App] 模块加载失败: ${name}`, e.message);
      }
    }
  },
  
  // 绑定事件
  bindEvents() {
    // 模块按钮点击
    document.querySelectorAll('.module-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const module = e.target.dataset.module;
        this.enterModule(module);
      });
    });
  },
  
  // 进入模块
  enterModule(module) {
    console.log('[App] 进入模块:', module);
    if (module === 'xiaojiujiu') {
      showPage('xiaojiujiu-mode');
    }
  },
  
  // 开始战斗（供按钮调用）
  startBattle(module, mode) {
    console.log('[App] 开始战斗:', module, mode);
    if (this.modules.battle3d) {
      this.modules.battle3d.start(module, 'easy');
    } else {
      console.error('[App] 战斗模块未加载');
      alert('战斗系统加载中，请稍后再试');
    }
  }
};

// 页面切换
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(pageId + '-page') || document.getElementById(pageId);
  if (page) page.classList.add('active');
  App.currentPage = pageId;
}

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => App.init());

// 导出全局函数
window.showPage = showPage;
window.App = App;
