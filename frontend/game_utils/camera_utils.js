export const storeCameraState = camera =>({
  inputs: { attachedElement: camera.inputs.attachedElement },
  target: camera.target,
  radius: camera.radius,
  alpha: camera.alpha,
  beta: camera.beta,
  lockedTarget: camera.lockedTarget,
  lowerAlphaLimit: camera.lowerAlphaLimit,
  upperAlphaLimit: camera.upperAlphaLimit,
  lowerBetaLimit: camera.lowerBetaLimit,
  upperBetaLimit: camera.upperBetaLimit,
  lowerRadiusLimit: camera.lowerRadiusLimit,
  upperRadiusLimit: camera.upperRadiusLimit
});

export const restoreCameraState = (camera, state) => {
  camera.target = state.target;
  camera.radius = state.radius;
  camera.alpha = state.alpha;
  camera.beta = state.beta;
  camera.lockedTarget = state.lockedTarget;
  camera.upperAlphaLimit = state.upperAlphaLimit;
  camera.lowerAlphaLimit = state.lowerAlphaLimit;
  camera.lowerBetaLimit = state.lowerBetaLimit;
  camera.upperBetaLimit = state.upperBetaLimit;
  camera.lowerRadiusLimit = state.lowerRadiusLimit;
  camera.upperRadiusLimit = state.upperRadiusLimit;
}
