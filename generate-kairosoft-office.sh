#!/bin/bash

# 開羅風格辦公室完整素材生成腳本
# 生成日期: 2026-02-04
# 風格: Kairosoft Office Tycoon

OUTPUT_DIR="/root/vps-kairosoft/public/sprites"

# 創建目錄
mkdir -p "$OUTPUT_DIR/characters"
mkdir -p "$OUTPUT_DIR/furniture"
mkdir -p "$OUTPUT_DIR/floors"

echo "🎨 開始生成開羅風格辦公室素材..."

# ===== 員工角色系列（10+ 個）=====
echo "👥 生成員工角色..."

# 1. 程式設計師（藍色）
convert -size 32x32 xc:transparent \
  -fill "#4A90E2" -draw "rectangle 14,12 18,20" \
  -fill "#FFD700" -draw "rectangle 14,20 18,28" \
  -fill "#FFC0CB" -draw "rectangle 15,8 17,12" \
  -fill "#8B4513" -draw "rectangle 15,6 17,8" \
  -fill "#000000" -draw "point 15,9 point 17,9" \
  -fill "#4A90E2" -draw "rectangle 12,14 14,22 rectangle 18,14 20,22" \
  -scale 200% "$OUTPUT_DIR/characters/programmer.png"

# 2. 設計師（紫色）
convert -size 32x32 xc:transparent \
  -fill "#9B59B6" -draw "rectangle 14,12 18,20" \
  -fill "#34495E" -draw "rectangle 14,20 18,28" \
  -fill "#FFC0CB" -draw "rectangle 15,8 17,12" \
  -fill "#FF69B4" -draw "rectangle 15,6 17,8" \
  -fill "#000000" -draw "point 15,9 point 17,9" \
  -fill "#9B59B6" -draw "rectangle 12,14 14,22 rectangle 18,14 20,22" \
  -scale 200% "$OUTPUT_DIR/characters/designer.png"

# 3. 專案經理（紅色）
convert -size 32x32 xc:transparent \
  -fill "#E74C3C" -draw "rectangle 14,12 18,20" \
  -fill "#2C3E50" -draw "rectangle 14,20 18,28" \
  -fill "#FFC0CB" -draw "rectangle 15,8 17,12" \
  -fill "#8B4513" -draw "rectangle 15,6 17,8" \
  -fill "#000000" -draw "point 15,9 point 17,9" \
  -fill "#E74C3C" -draw "rectangle 12,14 14,22 rectangle 18,14 20,22" \
  -fill "#FFD700" -draw "rectangle 15,11 17,12" \
  -scale 200% "$OUTPUT_DIR/characters/manager.png"

# 4. QA 測試員（綠色）
convert -size 32x32 xc:transparent \
  -fill "#27AE60" -draw "rectangle 14,12 18,20" \
  -fill "#2C3E50" -draw "rectangle 14,20 18,28" \
  -fill "#FFC0CB" -draw "rectangle 15,8 17,12" \
  -fill "#000000" -draw "rectangle 14,8 18,10" \
  -fill "#000000" -draw "point 15,9 point 17,9" \
  -fill "#27AE60" -draw "rectangle 12,14 14,22 rectangle 18,14 20,22" \
  -scale 200% "$OUTPUT_DIR/characters/qa-tester.png"

# 5. UI/UX 設計師（橘色）
convert -size 32x32 xc:transparent \
  -fill "#F39C12" -draw "rectangle 14,12 18,20" \
  -fill "#34495E" -draw "rectangle 14,20 18,28" \
  -fill "#FFC0CB" -draw "rectangle 15,8 17,12" \
  -fill "#FFD700" -draw "rectangle 14,6 18,8" \
  -fill "#000000" -draw "point 15,9 point 17,9" \
  -fill "#F39C12" -draw "rectangle 12,14 14,22 rectangle 18,14 20,22" \
  -scale 200% "$OUTPUT_DIR/characters/ux-designer.png"

# 6. DevOps 工程師（青色）
convert -size 32x32 xc:transparent \
  -fill "#16A085" -draw "rectangle 14,12 18,20" \
  -fill "#2C3E50" -draw "rectangle 14,20 18,28" \
  -fill "#FFC0CB" -draw "rectangle 15,8 17,12" \
  -fill "#8B4513" -draw "rectangle 15,6 17,8" \
  -fill "#000000" -draw "point 15,9 point 17,9" \
  -fill "#16A085" -draw "rectangle 12,14 14,22 rectangle 18,14 20,22" \
  -scale 200% "$OUTPUT_DIR/characters/devops.png"

# 7. 資料科學家（深藍）
convert -size 32x32 xc:transparent \
  -fill "#2980B9" -draw "rectangle 14,12 18,20" \
  -fill "#34495E" -draw "rectangle 14,20 18,28" \
  -fill "#FFC0CB" -draw "rectangle 15,8 17,12" \
  -fill "#000000" -draw "rectangle 14,6 18,8" \
  -fill "#FFFFFF" -draw "rectangle 14,7 15,8 rectangle 17,7 18,8" \
  -fill "#000000" -draw "point 15,9 point 17,9" \
  -fill "#2980B9" -draw "rectangle 12,14 14,22 rectangle 18,14 20,22" \
  -scale 200% "$OUTPUT_DIR/characters/data-scientist.png"

# 8. 行銷專員（粉色）
convert -size 32x32 xc:transparent \
  -fill "#E91E63" -draw "rectangle 14,12 18,20" \
  -fill "#34495E" -draw "rectangle 14,20 18,28" \
  -fill "#FFC0CB" -draw "rectangle 15,8 17,12" \
  -fill "#FFD700" -draw "rectangle 14,6 18,8" \
  -fill "#000000" -draw "point 15,9 point 17,9" \
  -fill "#E91E63" -draw "rectangle 12,14 14,22 rectangle 18,14 20,22" \
  -scale 200% "$OUTPUT_DIR/characters/marketer.png"

# 9. 人資專員（淺藍）
convert -size 32x32 xc:transparent \
  -fill "#3498DB" -draw "rectangle 14,12 18,20" \
  -fill "#2C3E50" -draw "rectangle 14,20 18,28" \
  -fill "#FFC0CB" -draw "rectangle 15,8 17,12" \
  -fill "#8B4513" -draw "rectangle 14,6 18,8" \
  -fill "#000000" -draw "point 15,9 point 17,9" \
  -fill "#3498DB" -draw "rectangle 12,14 14,22 rectangle 18,14 20,22" \
  -scale 200% "$OUTPUT_DIR/characters/hr.png"

# 10. CEO（金色西裝）
convert -size 32x32 xc:transparent \
  -fill "#F1C40F" -draw "rectangle 14,12 18,20" \
  -fill "#2C3E50" -draw "rectangle 14,20 18,28" \
  -fill "#FFC0CB" -draw "rectangle 15,8 17,12" \
  -fill "#8B4513" -draw "rectangle 15,6 17,8" \
  -fill "#000000" -draw "point 15,9 point 17,9" \
  -fill "#E74C3C" -draw "rectangle 16,12 16,16" \
  -fill "#F1C40F" -draw "rectangle 12,14 14,22 rectangle 18,14 20,22" \
  -scale 200% "$OUTPUT_DIR/characters/ceo.png"

# 11. 實習生（灰色）
convert -size 32x32 xc:transparent \
  -fill "#95A5A6" -draw "rectangle 14,12 18,20" \
  -fill "#34495E" -draw "rectangle 14,20 18,28" \
  -fill "#FFC0CB" -draw "rectangle 15,8 17,12" \
  -fill "#8B4513" -draw "rectangle 15,6 17,8" \
  -fill "#000000" -draw "point 15,9 point 17,9" \
  -fill "#95A5A6" -draw "rectangle 12,14 14,22 rectangle 18,14 20,22" \
  -scale 200% "$OUTPUT_DIR/characters/intern.png"

# 12. 安全專家（黑色）
convert -size 32x32 xc:transparent \
  -fill "#2C3E50" -draw "rectangle 14,12 18,20" \
  -fill "#34495E" -draw "rectangle 14,20 18,28" \
  -fill "#FFC0CB" -draw "rectangle 15,8 17,12" \
  -fill "#000000" -draw "rectangle 14,6 18,8" \
  -fill "#000000" -draw "point 15,9 point 17,9" \
  -fill "#2C3E50" -draw "rectangle 12,14 14,22 rectangle 18,14 20,22" \
  -scale 200% "$OUTPUT_DIR/characters/security.png"

echo "✅ 生成 12 個員工角色"

# ===== 辦公家具系列 =====
echo "🪑 生成辦公家具..."

# 辦公桌（棕色）
convert -size 32x32 xc:transparent \
  -fill "#8B4513" -draw "rectangle 8,16 24,18" \
  -fill "#A0522D" -draw "rectangle 8,14 24,16" \
  -fill "#654321" -draw "rectangle 10,18 12,26 rectangle 20,18 22,26" \
  -scale 200% "$OUTPUT_DIR/furniture/desk.png"

# 辦公椅（黑色）
convert -size 32x32 xc:transparent \
  -fill "#2C3E50" -draw "rectangle 14,14 18,20" \
  -fill "#34495E" -draw "rectangle 13,12 19,14" \
  -fill "#2C3E50" -draw "rectangle 15,20 17,24" \
  -fill "#7F8C8D" -draw "circle 16,25 16,26" \
  -scale 200% "$OUTPUT_DIR/furniture/chair.png"

# 會議桌（大桌子）
convert -size 32x32 xc:transparent \
  -fill "#8B4513" -draw "rectangle 4,14 28,18" \
  -fill "#A0522D" -draw "rectangle 4,12 28,14" \
  -fill "#654321" -draw "rectangle 6,18 8,26 rectangle 24,18 26,26" \
  -scale 200% "$OUTPUT_DIR/furniture/meeting-table.png"

# 檔案櫃（灰色）
convert -size 32x32 xc:transparent \
  -fill "#7F8C8D" -draw "rectangle 12,8 20,26" \
  -fill "#95A5A6" -draw "rectangle 12,8 20,10 rectangle 12,16 20,18" \
  -fill "#2C3E50" -draw "rectangle 15,10 17,12 rectangle 15,18 17,20" \
  -scale 200% "$OUTPUT_DIR/furniture/file-cabinet.png"

# 書架（木色）
convert -size 32x32 xc:transparent \
  -fill "#8B4513" -draw "rectangle 10,6 22,28" \
  -fill "#A0522D" -draw "rectangle 10,12 22,14 rectangle 10,20 22,22" \
  -fill "#E74C3C" -draw "rectangle 12,8 13,12 rectangle 19,8 20,12" \
  -fill "#3498DB" -draw "rectangle 14,8 15,12 rectangle 17,8 18,12" \
  -fill "#27AE60" -draw "rectangle 12,14 13,20 rectangle 15,14 16,20" \
  -fill "#F39C12" -draw "rectangle 18,14 19,20" \
  -scale 200% "$OUTPUT_DIR/furniture/bookshelf.png"

# 飲水機
convert -size 32x32 xc:transparent \
  -fill "#3498DB" -draw "rectangle 14,10 18,22" \
  -fill "#2980B9" -draw "rectangle 14,10 18,12" \
  -fill "#FFFFFF" -draw "circle 16,15 16,17" \
  -fill "#E74C3C" -draw "rectangle 13,18 14,20" \
  -fill "#3498DB" -draw "rectangle 18,18 19,20" \
  -scale 200% "$OUTPUT_DIR/furniture/water-dispenser.png"

# 影印機
convert -size 32x32 xc:transparent \
  -fill "#ECF0F1" -draw "rectangle 10,14 22,26" \
  -fill "#BDC3C7" -draw "rectangle 10,14 22,16" \
  -fill "#3498DB" -draw "rectangle 14,16 18,18" \
  -fill "#27AE60" -draw "point 12,17 point 20,17" \
  -scale 200% "$OUTPUT_DIR/furniture/printer.png"

echo "✅ 生成 7 個辦公家具"

# ===== 地板/地毯系列 =====
echo "🟫 生成地板地毯..."

# 木質地板
convert -size 32x32 xc:"#D2B48C" \
  -fill "#C19A6B" -draw "rectangle 0,8 32,10 rectangle 0,16 32,18 rectangle 0,24 32,26" \
  -scale 200% "$OUTPUT_DIR/floors/wood-floor.png"

# 灰色地毯
convert -size 32x32 xc:"#95A5A6" \
  -fill "#7F8C8D" -draw "rectangle 2,2 30,30" \
  -scale 200% "$OUTPUT_DIR/floors/gray-carpet.png"

# 藍色地毯
convert -size 32x32 xc:"#3498DB" \
  -fill "#2980B9" -draw "rectangle 2,2 30,30" \
  -scale 200% "$OUTPUT_DIR/floors/blue-carpet.png"

# 綠色地毯
convert -size 32x32 xc:"#27AE60" \
  -fill "#229954" -draw "rectangle 2,2 30,30" \
  -scale 200% "$OUTPUT_DIR/floors/green-carpet.png"

# 紅色地毯
convert -size 32x32 xc:"#E74C3C" \
  -fill "#C0392B" -draw "rectangle 2,2 30,30" \
  -scale 200% "$OUTPUT_DIR/floors/red-carpet.png"

echo "✅ 生成 5 種地板/地毯"

# 統計檔案數量
CHARACTER_COUNT=$(ls -1 "$OUTPUT_DIR/characters" | wc -l)
FURNITURE_COUNT=$(ls -1 "$OUTPUT_DIR/furniture" | wc -l)
FLOOR_COUNT=$(ls -1 "$OUTPUT_DIR/floors" | wc -l)
TOTAL=$((CHARACTER_COUNT + FURNITURE_COUNT + FLOOR_COUNT))

echo ""
echo "========================================="
echo "✅ 開羅風格辦公室素材生成完成！"
echo "========================================="
echo "👥 員工角色: $CHARACTER_COUNT 個"
echo "🪑 辦公家具: $FURNITURE_COUNT 個"
echo "🟫 地板地毯: $FLOOR_COUNT 個"
echo "📦 總素材數: $TOTAL 個"
echo "========================================="
echo "輸出目錄: $OUTPUT_DIR"
echo "========================================="
