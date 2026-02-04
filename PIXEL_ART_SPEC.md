# VPS Kairosoft 像素藝術素材規格

## 技術規格
- **畫布大小**: 32x32 像素
- **色彩模式**: RGB（透明背景）
- **格式**: PNG（支持透明度）
- **風格**: Kairosoft 經典像素風格

---

## 優先級素材清單

### 1. 開發者角色（Developer Character）
**檔案名**: `developer-idle.png`, `developer-working.png`

**Idle 動畫**（2幀）:
- 幀1: 站立，雙手自然垂下
- 幀2: 輕微晃動

**Working 動畫**（4幀）:
- 幀1-2: 打字動作（手臂上下）
- 幀3-4: 思考動作（手摸下巴）

**顏色方案**:
- 頭髮: #4A4A4A（深灰）
- 皮膚: #FFDBAC（淺膚色）
- 衣服: #4A90E2（藍色襯衫）
- 褲子: #2C3E50（深藍）

---

### 2. 資料庫伺服器（Database Server）
**檔案名**: `server-database.png`

**設計元素**:
- 主體: 直立式機櫃（黑色）
- 指示燈: 3個小點（綠/黃/紅）
- 特徵: 資料庫圖示（圓柱體）

**顏色方案**:
- 機櫃: #2C3E50（深藍黑）
- 前面板: #34495E（灰藍）
- 指示燈: #27AE60（綠）、#F39C12（黃）、#E74C3C（紅）
- 圖示: #F5A623（橘色）

---

### 3. Web 伺服器（Web Server）
**檔案名**: `server-web.png`

**設計元素**:
- 主體: 直立式機櫃（黑色）
- 指示燈: 3個小點
- 特徵: WWW 或地球圖示

**顏色方案**:
- 機櫃: #2C3E50
- 前面板: #34495E
- 指示燈: 同資料庫伺服器
- 圖示: #7ED321（綠色地球）

---

### 4. 螢幕物件（Monitor）
**檔案名**: `object-monitor.png`

**設計元素**:
- 顯示器: 16x12px 矩形
- 螢幕: 14x10px 內框（藍色發光）
- 底座: 8x4px

**顏色方案**:
- 外框: #2C3E50（深灰）
- 螢幕: #3498DB（藍色發光）
- 底座: #34495E

---

### 5. 鍵盤物件（Keyboard）
**檔案名**: `object-keyboard.png`

**設計元素**:
- 主體: 20x6px 矩形
- 按鍵: 3x3 網格的小方塊

**顏色方案**:
- 主體: #2C3E50
- 按鍵: #ECF0F1（淺灰）
- 間隙: #34495E

---

### 6. 地板磚貼圖（Floor Tile）
**檔案名**: `floor-tile.png`

**設計元素**:
- 等距菱形: 32x16px
- 網格線: 1px
- 可無縫拼接

**顏色方案**:
- 主色: #BDC3C7（淺灰）
- 網格線: #95A5A6（深灰）
- 高光: #ECF0F1

---

## 動畫幀命名規則

```
{name}-{state}-{frame}.png

例如:
developer-idle-1.png
developer-idle-2.png
developer-working-1.png
developer-working-2.png
developer-working-3.png
developer-working-4.png
```

---

## 儲存路徑

```
/root/vps-kairosoft/public/sprites/
├── characters/
│   ├── developer-idle-1.png
│   ├── developer-idle-2.png
│   ├── developer-working-1.png
│   ├── developer-working-2.png
│   ├── developer-working-3.png
│   └── developer-working-4.png
├── servers/
│   ├── server-database.png
│   ├── server-web.png
│   └── server-generic.png
├── objects/
│   ├── object-monitor.png
│   └── object-keyboard.png
└── tiles/
    └── floor-tile.png
```

---

## 技術實現

### ImageMagick 生成範例

```bash
# 創建 32x32 透明畫布
convert -size 32x32 xc:none output.png

# 繪製矩形
convert output.png -fill "#4A90E2" -draw "rectangle 8,8 24,24" output.png

# 繪製圓形
convert output.png -fill "#27AE60" -draw "circle 16,16 16,20" output.png
```

### Pixi.js 載入

```typescript
import { Sprite, Texture } from 'pixi.js';

const texture = await Texture.fromURL('/sprites/characters/developer-idle-1.png');
const sprite = new Sprite(texture);
sprite.scale.set(2, 2); // 放大2倍顯示
```

---

## 開發階段

**Phase 1: 靜態圖 (立即)**
- 先創建靜態版本
- 驗證尺寸和顏色
- 測試載入和顯示

**Phase 2: 動畫 (Day 2-3)**
- 添加動畫幀
- 實現幀動畫系統
- 調整幀速率

**Phase 3: 精緻化 (Day 4-7)**
- 細節打磨
- 陰影和高光
- 額外動畫效果
