const { chromium } = require('playwright');

(async () => {
  console.log('🚀 啟動瀏覽器檢查...\n');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // 收集所有錯誤
  const errors = [];
  const warnings = [];
  const logs = [];
  
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    
    if (type === 'error') {
      errors.push(text);
      console.log('❌ ERROR:', text);
    } else if (type === 'warning') {
      warnings.push(text);
      console.log('⚠️  WARNING:', text);
    } else if (type === 'log') {
      logs.push(text);
    }
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
    console.log('💥 PAGE ERROR:', error.message);
    console.log('Stack:', error.stack);
  });
  
  try {
    console.log('📡 訪問 http://localhost:3100 ...\n');
    await page.goto('http://localhost:3100', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // 等待頁面完全載入
    await page.waitForTimeout(3000);
    
    console.log('\n=== 測試結果 ===\n');
    console.log(`❌ 錯誤數: ${errors.length}`);
    console.log(`⚠️  警告數: ${warnings.length}`);
    console.log(`📝 日誌數: ${logs.length}`);
    
    if (errors.length > 0) {
      console.log('\n=== 詳細錯誤 ===\n');
      errors.forEach((err, i) => {
        console.log(`${i + 1}. ${err}\n`);
      });
    }
    
    if (warnings.length > 0) {
      console.log('\n=== 詳細警告 ===\n');
      warnings.forEach((warn, i) => {
        console.log(`${i + 1}. ${warn}\n`);
      });
    }
    
    // 檢查頁面標題
    const title = await page.title();
    console.log(`\n📄 頁面標題: ${title}`);
    
    // 檢查是否有 canvas
    const hasCanvas = await page.evaluate(() => {
      return document.querySelector('canvas') !== null;
    });
    console.log(`🎨 Canvas 存在: ${hasCanvas ? '✅' : '❌'}`);
    
    // 截圖
    await page.screenshot({ path: '/tmp/vps-kairosoft-screenshot.png' });
    console.log('\n📸 截圖已保存: /tmp/vps-kairosoft-screenshot.png');
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
  } finally {
    await browser.close();
    
    // 返回退出碼
    process.exit(errors.length > 0 ? 1 : 0);
  }
})();
