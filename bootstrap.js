// bootstrap.js — GitHub Pages 환경에서 안전하게 초기화하는 부트스트랩
// 인라인 스크립트는 GitHub Pages CSP에 막힐 수 있어 외부 파일로 분리

// 1) 기존 Service Worker 구버전 강제 갱신
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (regs) {
    regs.forEach(function (r) { r.update(); });
  }).catch(function () {});
}

// 2) 전역 에러 캡처 — 화면 상단 빨간 배너로 즉시 표시
window.addEventListener("error", function (event) {
  showBootError((event.error && event.error.message) || event.message || "알 수 없는 에러",
    event.filename ? event.filename.split("/").pop() + ":" + (event.lineno || "?") : "");
});

window.addEventListener("unhandledrejection", function (event) {
  var msg = event.reason && (event.reason.message || String(event.reason));
  showBootError(msg || "처리되지 않은 Promise 에러", "promise");
});

function showBootError(message, where) {
  if (document.getElementById("bootError")) return;
  var banner = document.createElement("div");
  banner.id = "bootError";
  banner.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:99999;padding:10px 12px;background:#c0392b;color:#fff;font:600 12px/1.5 system-ui,sans-serif;white-space:pre-wrap;word-break:break-all;box-shadow:0 2px 8px rgba(0,0,0,.4)";
  banner.textContent = "⚠ LANE LAB 로딩 에러\n" + message + (where ? "\n(" + where + ")" : "");
  document.body.appendChild(banner);
  // 에러 발생 시 로딩 오버레이도 제거 (겹침 방지)
  removeBootLoading();
}
window.showBootError = showBootError;

// 3) 로딩 오버레이 제거 — DOM 준비 즉시, 그리고 안전 타임아웃
function removeBootLoading() {
  var indicator = document.getElementById("bootLoading");
  if (indicator) indicator.remove();
}

// DOM이 준비되면 즉시 로딩 제거 (모델 로드 기다리지 않음)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", removeBootLoading);
} else {
  removeBootLoading();
}
// 안전 타임아웃: 어떤 경우든 2초 후에는 제거
setTimeout(removeBootLoading, 2000);
