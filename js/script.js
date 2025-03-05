// JavaScript部分 - 處理Dock App連結的點擊和阻止模擬器行為
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
    const dockAppId = dockApp.id;
    
    // 完全阻止模擬器事件
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

  // 點擊Home按鈕返回主屏幕
  document.querySelector('.home-button').addEventListener('click', function() {
    const screen = document.querySelector('.screen');
    const activeApp = document.querySelector('.app-view.active');
    
    if (activeApp) {
      // 移除active類以關閉App
      activeApp.classList.remove('active');
      
      // 移除app-open類恢復背景亮度和其他元素
      screen.classList.remove('app-open');
    }
    
    // 添加按下動畫
    this.classList.add('pressed');
    setTimeout(() => {
      this.classList.remove('pressed');
    }, 150);
  });

  // 為Home按鈕添加點擊效果
  const homeButton = document.querySelector('.home-button');
  homeButton.addEventListener('mousedown', function() {
    this.style.backgroundColor = '#eee';
  });

  homeButton.addEventListener('mouseup', function() {
    this.style.backgroundColor = '#fff';
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

  // 設置正確的時間(僅示範)
  function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? '下午' : '上午';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 應該顯示為 12
    
    document.querySelector('.time').textContent = `${ampm} ${hours}:${minutes}`;
  }

  // 更新時間
  updateTime();
  // 每分鐘更新一次時間
  setInterval(updateTime, 60000);
});
