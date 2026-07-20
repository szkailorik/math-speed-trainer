# 数学速算训练营 🧮

专为3-4年级小学生设计的数学速算训练工具，帮助孩子快速掌握常用的数学速算技巧。

## 功能特点

### 训练模块
- **乘法速记** - 25×4=100、125×8=1000 等经典速算组合
- **分数小数** - 1/2=0.5、1/8=0.125 等分数小数互换
- **小数规律** - 小数乘除10的变化规律
- **乘法扩展** - 11-25的平方及常用两位数乘法
- **综合训练** - 随机混合所有题型
- **每日挑战** - 限时10题冲刺

### 学习功能
- **速算秘籍** - 先学习再练习，掌握速算技巧
- **错题本** - 自动收集做错的题目，支持重复练习

### 个性化设置
- 选择题/填空题两种答题模式
- 简单/普通/困难三种难度
- 可调节每轮题数（10/20/50题）
- 计时模式开关
- 深色模式支持
- 音效开关

### 激励系统
- 连胜奖励特效
- 成就系统（9种成就）
- 可消费积分商店：外观、武器、防具、连击战技与命中特效
- 三套主题装备组合与 3/5/10 连击战斗演出
- 本地保存学习进度
- GitHub Gist 跨设备同步（使用个人 PAT，私有数据不经过项目服务器）

## 技术栈

- HTML5
- CSS3 (Flexbox, Grid, CSS Variables)
- Vanilla JavaScript (ES6+)
- localStorage 数据持久化
- GitHub Gist 私有云同步（localStorage 保底）
- Web Audio API 音效
- 响应式设计，优先适配 iPad

## 本地运行

1. 克隆仓库
```bash
git clone https://github.com/YOUR_USERNAME/math-speed-trainer.git
```

2. 进入项目目录
```bash
cd math-speed-trainer
```

3. 用任意方式启动本地服务器，例如：
```bash
# Python 3
python -m http.server 8080

# Node.js (需要安装 http-server)
npx http-server

# VS Code Live Server 插件
# 右键 index.html -> Open with Live Server
```

4. 在浏览器打开 `http://localhost:8080`

## 部署到 Cloudflare Pages

1. Fork 或 push 代码到 GitHub
2. 登录 Cloudflare Dashboard
3. 进入 Pages -> Create a project
4. 选择 GitHub 仓库
5. 配置：
   - **构建命令**: 留空（纯静态网站）
   - **输出目录**: `/`（根目录）
6. 点击部署

当前生产站点：`https://math-speed-trainer.pages.dev/`，自定义域名：`https://wp2.kailorik.com/`。

## 跨设备同步

1. 点击页面右下角的“仅本机”按钮。
2. 按引导创建只含 `gist` 权限的 GitHub Token（classic）。
3. 粘贴 Token 并连接；其他设备粘贴同一个 Token 即可双向同步。

Token 只保存在当前浏览器的 localStorage。学习进度、错题、角色、装备、卡牌、章节和题目权重存放在用户自己的私有 Gist 中；离线或 GitHub 暂时不可用时仍可继续使用本机数据，恢复网络后自动合并。

## 项目结构

```
math-speed-trainer/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── data.js         # 题库数据
│   └── app.js          # 应用逻辑
├── .gitignore
└── README.md
```

## 浏览器支持

- Chrome 60+
- Safari 12+
- Firefox 60+
- Edge 79+
- iOS Safari 12+
- Android Chrome 60+

## License

MIT
