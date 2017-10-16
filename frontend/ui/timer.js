let timerWidget;

document.addEventListener("DOMContentLoaded", () => {
  timerWidget = document.querySelector(".timer-widget");
});

let timerTimeout;

export const renderTimer = timerDuration => {
  timerWidget.innerHTML = Math.floor(timerDuration / 1000);
  if (timerDuration <= 0) {
    timerWidget.innerHTML = "";
    return;
  }
  timerTimeout = window.setTimeout(
    () => renderTimer(timerDuration - 1000),
    1000
  );
};

export const clearTimer = () => {
  timerWidget.innerHTML = "";
  window.clearTimeout(timerTimeout);
};
