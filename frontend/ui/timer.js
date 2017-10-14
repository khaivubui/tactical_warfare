let timerWidget;

document.addEventListener("DOMContentLoaded", () => {
  timerWidget = document.querySelector('.timer-widget');
});

export const renderTimer = timerDuration => {
  timerWidget.innerHTML = Math.floor(timerDuration / 1000);
  if (timerDuration <= 0) {
    timerWidget.innerHTML = '';
    return;
  }
  window.setTimeout(
    () => renderTimer(timerDuration - 1000),
    1000
  );
};
