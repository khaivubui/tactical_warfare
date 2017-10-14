let cameraRotationStyle;

document.addEventListener('DOMContentLoaded', () => {
  cameraRotationStyle = document.querySelector('.camera-rotation').style;
});

export const hideCameraRotation = () => {
  cameraRotationStyle['z-index'] = '-100';
};

export const showCameraRotation = () => {
  cameraRotationStyle['z-index'] = '100';
};
