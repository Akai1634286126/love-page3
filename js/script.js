(() => {
  "use strict";

  // 获取页面元素
  const music = document.getElementById("background-music");
  const musicToggle = document.getElementById("music-toggle");
  const musicLabel = document.getElementById("music-label");
  const musicIcon = document.getElementById("music-icon");

  const wishButton = document.getElementById("wish-button");
  const wishResult = document.getElementById("wish-result");
  const heartsLayer = document.getElementById("floating-hearts");

  let musicStarted = false;
  let wishOpened = false;

  // ============================
  // 1. 音乐状态与按钮显示
  // ============================

  function showMusicPlaying() {
    musicStarted = true;

    musicToggle.classList.add("playing");
    musicToggle.setAttribute("aria-label", "暂停背景音乐");

    musicIcon.textContent = "♫";
    musicLabel.textContent = "暂停这首心动";
  }

  function showMusicPaused() {
    musicToggle.classList.remove("playing");
    musicToggle.setAttribute("aria-label", "播放背景音乐");

    musicIcon.textContent = "♫";
    musicLabel.textContent = "播放这首心动";
  }

  // ============================
  // 2. 网页打开后尝试自动播放
  // ============================

  async function tryAutoplay() {
    if (!music) return;

    musicLabel.textContent = "正在播放心动旋律…";

    try {
      // 由浏览器决定是否允许自动播放。
      // 即使被拒绝，也不会影响网页其他功能。
      await music.play();

      showMusicPlaying();
    } catch (error) {
      showMusicPaused();

      musicLabel.textContent = "点击播放音乐 ♡";

      console.info(
        "浏览器暂不允许自动播放，请点击音乐按钮。",
        error
      );
    }
  }

  // 页面 DOM 已经准备好后执行。
  // defer 确保 HTML 元素先被解析。
  tryAutoplay();

  // ============================
  // 3. 音乐播放与暂停按钮
  // ============================

  musicToggle.addEventListener("click", async () => {
    if (!music) return;

    if (!music.paused) {
      music.pause();
      showMusicPaused();
      return;
    }

    try {
      await music.play();
      showMusicPlaying();
    } catch (error) {
      musicLabel.textContent = "播放失败，请检查音乐文件";

      console.error(
        "音乐播放失败，请检查 music/love.mp3 是否存在。",
        error
      );
    }
  });

  // 处理音频实际播放状态，保证按钮显示准确。
  music.addEventListener("play", showMusicPlaying);
  music.addEventListener("pause", showMusicPaused);

  music.addEventListener("error", () => {
    musicLabel.textContent = "请检查 music/love.mp3";
    console.error("音乐文件加载失败，请检查路径及文件格式。");
  });

  // ============================
  // 4. 点亮最后的心愿
  // ============================

  wishButton.addEventListener("click", () => {
    if (wishOpened) {
      wishResult.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      return;
    }

    wishOpened = true;

    wishResult.hidden = false;

    wishButton.innerHTML =
      '<span>♥</span> 心愿已经点亮';

    wishButton.setAttribute("aria-expanded", "true");

    // 触发一阵轻柔的爱心雨
    createHearts(22);

    // 等待卡片显示后，再平滑滚动到心愿区域
    window.setTimeout(() => {
      wishResult.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 180);
  });

  // ============================
  // 5. 创建漂浮爱心
  // ============================

  function createHearts(count) {
    if (!heartsLayer) return;

    // 尊重用户减少动态效果的系统设置
    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    for (let i = 0; i < count; i += 1) {
      const heart = document.createElement("span");

      heart.className = "floating-heart";

      heart.textContent =
        Math.random() > 0.45 ? "♡" : "♥";

      // 随机水平位置
      heart.style.left =
        `${4 + Math.random() * 92}%`;

      // 随机出现时间
      heart.style.animationDelay =
        `${Math.random() * 1.4}s`;

      // 随机上升速度
      heart.style.animationDuration =
        `${3.4 + Math.random() * 2.4}s`;

      // 随机大小
      heart.style.fontSize =
        `${12 + Math.random() * 20}px`;

      heartsLayer.appendChild(heart);

      // 动画结束后删除节点，避免不断积累
      heart.addEventListener(
        "animationend",
        () => heart.remove(),
        { once: true }
      );
    }
  }

  // ============================
  // 6. 照片加载失败时的处理
  // ============================

  document.querySelectorAll(".gallery-item img")
    .forEach((img) => {
      img.addEventListener("error", () => {
        img.alt = "请检查 images 文件夹中的照片文件名";

        // 保留布局，避免损坏图片图标影响视觉
        img.style.opacity = "0.15";
      });
    });

})();