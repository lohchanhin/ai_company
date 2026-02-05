# 🎮 VPS Kairosoft

**開羅遊戲風格的 VPS 可視化管理工具**

像素藝術 + 等距視角 + 真實數據 = 好看又實用的伺服器管理工具

---

## 🎯 核心特色

### 視覺風格
- ✅ **像素藝術**：開羅遊戲經典像素風格
- ✅ **等距視角**：Isometric 3D 效果
- ✅ **可愛動畫**：工作、休息、過載狀態動畫
- ✅ **直覺互動**：拖拽操作、即時反饋

### 真實功能
- ✅ **SSH 連線**：真實連接到 VPS
- ✅ **即時監控**：CPU/RAM/Disk 使用率
- ✅ **命令執行**：拖拽任務到伺服器執行
- ✅ **日誌查看**：即時查看執行日誌

---

## 🚀 快速開始

### 安裝依賴
```bash
npm install
```

### 啟動開發伺服器
```bash
npm run dev
```

訪問 http://localhost:3000

### 啟動說明（MVP 施工版）
1. 確認本機已安裝 Node.js 18+ 與 npm。
2. 執行 `npm install` 安裝依賴。
3. 執行 `npm run dev` 啟動開發伺服器。
4. 進入 http://localhost:3000 查看畫面。
5. 若遇到啟動失敗，先執行 `npm run lint` 檢查程式碼規範，再重試啟動。

### 建置生產版本
```bash
npm run build
npm start
```

---

## 📦 技術棧

### 前端
- **Next.js 14** - React 框架
- **TypeScript** - 類型安全
- **Tailwind CSS** - 樣式系統
- **Pixi.js 8** - 2D 渲染引擎

### 後端（計畫中）
- **Node.js** - JavaScript 運行環境
- **node-ssh** - SSH 連線管理
- **Socket.io** - 即時通訊

---

## 🎨 專案結構

```
vps-kairosoft/
├── app/                      # Next.js 頁面
│   ├── page.tsx             # 主頁面
│   ├── layout.tsx           # 全局佈局
│   └── globals.css          # 全局樣式
│
├── components/              # React 組件
│   ├── IsometricCanvas/    # 等距畫布
│   │   ├── index.tsx       # 主組件
│   │   └── ServerSprite.ts # 伺服器精靈類
│   ├── ServerCard/         # 伺服器資訊卡
│   └── TaskQueue/          # 任務佇列
│
├── lib/                     # 工具庫
│   ├── pixi/               # Pixi.js 工具
│   ├── ssh/                # SSH 管理
│   └── isometric/          # 等距座標轉換
│
├── types/                   # TypeScript 類型定義
│   └── index.ts
│
├── public/                  # 靜態資源
│   └── sprites/            # 像素藝術資產
│       ├── characters/     # 角色
│       ├── objects/        # 物件
│       ├── effects/        # 特效
│       └── tiles/          # 地板磚
│
└── package.json
```

---

## 🎮 核心概念

### 等距座標系統

地板磚尺寸: **64x32 px**

```
2D 座標 (x, y)
    ↓ 轉換
Isometric 座標 (isoX, isoY)
```

### 伺服器類型

| 類型 | 顏色 | 用途 |
|------|------|------|
| 👨‍💻 Developer | 藍色 | 開發機 |
| 🗄️ Database | 橘色 | 資料庫 |
| 🌐 Web | 綠色 | Web 伺服器 |
| 🖥️ Generic | 灰色 | 通用伺服器 |

### 狀態系統

| 狀態 | 圖示 | 條件 |
|------|------|------|
| Online | 🟢 | 正常運行 |
| Busy | 🟢 | 執行任務中 |
| Overload | 🔴 | CPU/RAM > 90% |
| Offline | ⚫ | 離線 |

---

## 📊 Week 1 進度

### Day 1: 基礎架構 ✅
- [x] Next.js 專案初始化
- [x] Pixi.js 整合
- [x] 等距座標轉換
- [x] 伺服器精靈類
- [x] 基礎動畫
- [x] 模擬數據

### Day 2-3: SSH 整合（進行中）
- [ ] 後端 SSH 管理器
- [ ] 真實資源監控
- [ ] 命令執行
- [ ] 日誌顯示

### Day 4-5: 任務系統
- [ ] 任務佇列組件
- [ ] 拖拽功能
- [ ] 任務執行動畫
- [ ] 完成通知

### Day 6-7: 視覺優化
- [ ] 真實像素藝術資產
- [ ] 工作動畫（8 幀）
- [ ] 完成特效
- [ ] UI 打磨

---

## 🎨 像素藝術資產

### 臨時方案
目前使用**彩色方塊**代替像素圖片，Week 1 結束後會替換成真實的像素藝術。

### 製作工具
- **Aseprite** (推薦) - 專業像素藝術工具
- **Piskel** - 免費線上工具
- **Photoshop** - 像素模式

### 資產規格
- 角色: 32x32 px
- 物件: 16x16 或 32x32 px
- 地板磚: 64x32 px (等距)
- 動畫幀率: 8-12 FPS

---

## 🛠️ 開發指南

### 開發來源白名單（Next.js dev）

`next.config.ts` 的 `experimental.allowedDevOrigins` 用於允許哪些來源可以存取開發伺服器。當你需要從**非本機**的 IP/網域存取 dev server（例如遠端開發機、內部跳板機、VPN、反向代理或臨時的 tunneling 服務）時，請新增對應來源；若不再使用也要移除，避免誤開放。更新後請重新啟動開發伺服器讓設定生效。

### 新增伺服器類型

1. 在 `types/index.ts` 新增類型：
```typescript
visual: {
  type: "developer" | "database" | "web" | "your_type";
}
```

2. 在 `ServerSprite.ts` 新增顏色：
```typescript
const colors = {
  your_type: 0xFF0000, // 紅色
  // ...
};
```

### 自訂動畫

在 `ServerSprite.ts` 的 `update()` 方法中實現：
```typescript
update(delta: number) {
  // 你的動畫邏輯
}
```

---

## 📝 待辦事項

### 高優先級
- [ ] SSH 連線功能
- [ ] 真實資源監控
- [ ] 任務拖拽系統
- [ ] 日誌面板

### 中優先級
- [ ] 像素藝術資產
- [ ] 音效系統
- [ ] 設定持久化
- [ ] 多使用者支持

### 低優先級
- [ ] 成就系統
- [ ] 排行榜
- [ ] 匯出報告
- [ ] 移動端適配

---

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

## 📄 授權

MIT License

---

## 📮 聯絡

有問題或建議？歡迎聯絡！

---

**一起打造好看又好用的 VPS 管理工具！** 🎮✨
