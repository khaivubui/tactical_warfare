import io from 'socket.io-client';

export default () => {
  window.socket = io();
};
