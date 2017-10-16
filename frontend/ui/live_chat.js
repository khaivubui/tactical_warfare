import { socket } from "../websockets";

export default () => {
  const chatForm = document.querySelector(".chat-form");
  const chatInput = document.querySelector(".chat-input");
  chatForm.addEventListener("submit", e => {
    e.preventDefault();
    socket.emit("chatMessage", chatInput.value);
    chatInput.value = "";
  });
};
