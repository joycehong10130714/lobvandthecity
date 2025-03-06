// JavaScript部分 - 實現iPhone風格的App打開動畫和整體縮放
document.addEventListener('DOMContentLoaded', function() {
  // 點擊App開啟對應視圖，帶有從App圖標放大的動畫
  document.querySelectorAll('.app:not(.app-link .app)').forEach(app => {
    app.addEventListener('click', function() {
      const appId = this.id;
      const appView = document.getElementById(`${appId}-view`);
      const screen = document.querySelector('.screen');
      
      if (!appView) return; // 如果找不到對應的視圖則退出
      
      // 計算App圖標在屏幕上的位置
      const appRect = this.getBoundingClientRect();
      const screenRect = screen.getBoundingClientRect();
      
      // 計算App相對於屏幕的位置(百分比)
      const relativeLeft = (appRect.left + appRect.width/2 - screenRect.left) / screenRect.width * 100;
      const relativeTop = (appRect.top + appRect.height/2 - screenRect.top) / screenRect.height * 100;
      
      // 設置變形原點為App圖標的中心位置
      appView.style.transformOrigin = `${relativeLeft}% ${relativeTop}%`;
      
      // 添加active類開始動畫
      appView.classList.add('active');
      
      // 給屏幕添加app-open類來暗化背景和隱藏其他元素
      screen.classList.add('app-open');
    });
  });

  // Dock中App連結的特殊處理
  const appLink = document.querySelector('.app-link');
  if (appLink) {
    const dockApp = appLink.querySelector('.app');
    const dockAppId = dockApp ? dockApp.id : null;
    
    // 完全阻止模擬器事件
    if (dockApp) {
      dockApp.addEventListener('click', function(event) {
        // 阻止事件傳播，但不阻止默認行為(允許連結跳轉)
        event.stopPropagation();
        
        // 確保不顯示對應的App視圖
        const appView = document.getElementById(`${dockAppId}-view`);
        if (appView) {
          // 確保App視圖不會顯示
          setTimeout(() => {
            appView.classList.remove('active');
          }, 10);
        }
      });
    }
  }

  // 點擊Home按鈕返回主屏幕
  const homeButton = document.querySelector('.home-button');
  if (homeButton) {
    homeButton.addEventListener('click', function() {
      const screen = document.querySelector('.screen');
      const activeApp = document.querySelector('.app-view.active');
      
      if (activeApp) {
        // 移除active類以關閉App
        activeApp.classList.remove('active');
        
        // 移除app-open類恢復背景亮度和其他元素
        if (screen) screen.classList.remove('app-open');
      }
      
      // 添加按下動畫
      this.classList.add('pressed');
      setTimeout(() => {
        this.classList.remove('pressed');
      }, 150);
    });

    // 為Home按鈕添加點擊效果
    homeButton.addEventListener('mousedown', function() {
      this.style.backgroundColor = '#eee';
    });

    homeButton.addEventListener('mouseup', function() {
      this.style.backgroundColor = '#ooo';
    });

    homeButton.addEventListener('mouseleave', function() {
      this.style.backgroundColor = '#fff';
    });

    // 添加觸控效果
    homeButton.addEventListener('touchstart', function() {
      this.style.backgroundColor = '#eee';
    });

    homeButton.addEventListener('touchend', function() {
      this.style.backgroundColor = '#fff';
    });
  }

  // 設置正確的時間(僅示範)
  function updateTime() {
    const timeElement = document.querySelector('.time');
    if (!timeElement) return;
    
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? '下午' : '上午';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 應該顯示為 12
    
    timeElement.textContent = `${ampm} ${hours}:${minutes}`;
  }

  // 更新時間
  updateTime();
  // 每分鐘更新一次時間
  setInterval(updateTime, 60000);
  
  // 處理整體縮放的函數
  function updateScale() {
    const iphone = document.querySelector('.iphone');
    if (!iphone) return;
    
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const iphoneHeight = 715; // 原始高度
    const iphoneWidth = 330; // 原始寬度
    
    // 計算縮放因子 - 選擇較小的值確保完全顯示
    let scaleFactor = Math.min(
      (viewportHeight * 0.9) / iphoneHeight,
      (viewportWidth * 0.9) / iphoneWidth
    );
    
    // 限制最大和最小縮放
    scaleFactor = Math.min(Math.max(scaleFactor, 0.5), 1.2);
    
    // 應用縮放
    document.documentElement.style.setProperty('--scale-factor', scaleFactor);
  }

  // 初始化和窗口調整時更新縮放
  updateScale();
  window.addEventListener('resize', updateScale);
});

// 解鎖畫面功能
document.addEventListener('DOMContentLoaded', function() {
  const lockScreen = document.querySelector('.lock-screen');
  
  if (lockScreen) {
    // 點擊或觸摸任何地方解鎖
    lockScreen.addEventListener('click', unlockPhone);
    lockScreen.addEventListener('touchend', unlockPhone);
    
    // 向上滑動解鎖
    let startY;
    
    lockScreen.addEventListener('touchstart', function(e) {
      startY = e.touches[0].clientY;
    });
    
    lockScreen.addEventListener('touchmove', function(e) {
      if (!startY) return;
      
      const moveY = e.touches[0].clientY;
      const diff = startY - moveY;
      
      // 如果向上滑動超過50px，則解鎖
      if (diff > 50) {
        unlockPhone();
        startY = null;
      }
    });
    
    function unlockPhone() {
      lockScreen.classList.add('unlocked');
      // 播放解鎖聲音（可選）
      // const unlockSound = new Audio('unlock-sound.mp3');
      // unlockSound.play();
    }
  }
});

// 更新鎖定畫面時間
function updateLockScreenTime() {
  const lockClock = document.querySelector('.lock-clock');
  if (!lockClock) return;
  
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  
  // 24小時制
  lockClock.textContent = `${hours}:${minutes}`;
}

// 初始化時更新時間，然後每分鐘更新一次
updateLockScreenTime();
setInterval(updateLockScreenTime, 60000);
