const socket = io();

const welcome = document.querySelector("#welcome");
const room = document.querySelector("#room");
room.hidden = true;

let roomName;

function handleMsgSubmit(e) {
  e.preventDefault();
  const input = room.querySelector("#msg input");
  let value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}
function handleNicknameSubmit(e) {
  e.preventDefault();
  const input = room.querySelector("#nickname input");
  socket.emit("nickname", input.value);
}

function showMessage() {
  room.hidden = false;
  welcome.hidden = true;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room : ${roomName}`;
  const msgForm = room.querySelector("#msg");
  const nicknameForm = room.querySelector("#nickname");
  msgForm.addEventListener("submit", handleMsgSubmit);
  nicknameForm.addEventListener("submit", handleNicknameSubmit);
}

const form = welcome.querySelector("form");

const handleRoomSubmit = (e) => {
  e.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showMessage);
  roomName = input.value;
  input.value = "";
};

form.addEventListener("submit", handleRoomSubmit);

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

socket.on("welcome", (user) => {
  addMessage(`${user} Joined`);
});
socket.on("bye", (user) => {
  addMessage(`${user} left`);
});

socket.on("new_message", addMessage);
