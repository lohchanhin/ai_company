# VPS Kairosoft 常見問題解決方案

## 問題 1: 完全空白（白屏）

### 可能原因：
- JavaScript 未載入
- 瀏覽器不支持 WebGL
- Canvas 初始化失敗

### 解決方案：
```bash
# 清除瀏覽器緩存
Ctrl+Shift+R (強制刷新)

# 檢查瀏覽器支持
# 訪問: https://get.webgl.org/
# 應該看到旋轉的立方體
```

---

## 問題 2: 只有標題，中間灰色區域空白

### 可能原因：
- Canvas 未渲染
- Pixi.js 初始化失敗
- ServerSprite 未創建

### 解決方案：
```bash
# 檢查控制台錯誤
F12 -> Console

# 查看是否有 Canvas 元素
F12 -> Elements -> 搜尋 "canvas"
```

---

## 問題 3: 看到彩色方塊，但太簡陋

### 這是正常的！
Day 1 原型使用臨時彩色方塊：
- 🟦 藍色 = Developer 伺服器
- 🟧 橘色 = Database 伺服器  
- 🟩 綠色 = Web 伺服器
- ⬜ 灰色 = Generic 伺服器

### 升級方案：
需要創建真正的像素藝術資產（Week 1 Day 4-7）

---

## 問題 4: 彩色方塊位置不對

### 調整方案：
修改 `toIsometric()` 函數的座標轉換

---

## 問題 5: Canvas 太小/太大

### 解決方案：
```typescript
// 調整 dimensions
const [dimensions, setDimensions] = useState({ 
  width: 1200,  // 增加寬度
  height: 800   // 增加高度
});
```

---

## 立即診斷命令

```bash
# 1. 開發伺服器狀態
ps aux | grep "next dev"

# 2. HTTP 響應
curl -I http://localhost:3100

# 3. 頁面內容
curl -s http://localhost:3100 | wc -l

# 4. JavaScript 文件數
curl -s http://localhost:3100 | grep -c ".js"

# 5. Canvas 元素
curl -s http://localhost:3100 | grep -c "canvas"

# 6. Playwright 測試
cd /root/vps-kairosoft && node check-console-errors.js
```
