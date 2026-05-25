# Tab Organizer

一键整理浏览器标签页 — **去重、按域名分组、合并窗口**。

## 功能

| 功能 | 说明 |
|------|------|
| 去重 | 检测相同 URL 的标签页，保留最近访问的，关闭其他重复项 |
| 分组 | 按域名自动分组，自动命名和分配颜色 |
| 合并窗口 | 将多个窗口的标签页合并到当前窗口，关闭空窗口 |

同域名标签页按打开时间排序，最早打开的排最前。

## 安装

### Edge / Chrome

1. 打开 `edge://extensions/` 或 `chrome://extensions/`
2. 打开**开发者模式**
3. 点击**加载解压缩的扩展** → 选择 `dist` 目录

### 从源代码构建

```bash
git clone https://github.com/lynnblur/tab-organizer.git
cd tab-organizer
npm install
npm run build
```

然后加载 `dist` 目录到浏览器。

## 使用

- 点击工具栏图标 → 弹出窗口 → 点击**一键整理**
- 快捷键：`Ctrl+Shift+O`（Windows）/ `Cmd+Shift+O`（Mac）

整理完成后会通知显示结果。

## 技术栈

- 浏览器扩展 Manifest V3
- TypeScript
- Vite

## 许可证

MIT
