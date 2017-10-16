export default () => {
  [
    document.querySelector("html"),
    document.querySelector("body")
  ].forEach(domEl =>
    domEl.addEventListener("touchmove", e => e.preventDefault())
  );
};
