// 等待 HTML 解析完成后，初始化按钮和页面交互。

// 手机屏幕上的导航菜单。
const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

function closeMenu() {
  mainNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "打开导航菜单");
}

menuToggle.addEventListener("click", function () {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "打开导航菜单" : "关闭导航菜单");
  mainNav.classList.toggle("is-open", !isOpen);
});

mainNav.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeMenu();
  }
});

// 切换浅色和深色外观，并把这次选择记在浏览器里。
const themeToggle = document.querySelector("#themeToggle");
const themeLabel = themeToggle.querySelector(".theme-label");
const themeIcon = themeToggle.querySelector(".theme-icon");

function syncThemeToggle(isDark) {
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "切换到浅色模式" : "切换到深色模式");
  themeLabel.textContent = isDark ? "浅色" : "深色";
  themeIcon.textContent = isDark ? "☀" : "☾";
}

themeToggle.addEventListener("click", function () {
  const isDark = document.documentElement.dataset.theme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  document.documentElement.dataset.theme = nextTheme;
  syncThemeToggle(!isDark);

  try {
    localStorage.setItem("theme", nextTheme);
  } catch (error) {
    // 隐私模式下 localStorage 可能不可用，忽略即可。
  }
});

syncThemeToggle(document.documentElement.dataset.theme === "dark");

// 点击首页按钮时，让问候语在两句话之间切换。
const helloButton = document.querySelector("#helloButton");
const greetingMessage = document.querySelector("#greetingMessage");
let greetingCount = 0;

helloButton.addEventListener("click", function () {
  greetingCount++;

  if (greetingCount % 2 === 1) {
    greetingMessage.textContent = "你好！欢迎来到我的技术空间。";
  } else {
    greetingMessage.textContent = "你又回来啦，继续一起探索吧！";
  }
});

// 项目分类按钮会显示匹配的卡片。
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const filterEmpty = document.querySelector("#filterEmpty");

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const selectedFilter = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach(function (item) {
      const isSelected = item === button;
      item.classList.toggle("is-active", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });

    projectCards.forEach(function (card) {
      const shouldShow = selectedFilter === "all" || card.dataset.category === selectedFilter;
      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount++;
      }
    });

    filterEmpty.hidden = visibleCount > 0;
  });
});

// 自动更新页脚年份。
document.querySelector("#currentYear").textContent = new Date().getFullYear();


/* 注册 Service Worker：只有 http(s) 下才有效，file:// 打开会被忽略。 */
if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  });
}
