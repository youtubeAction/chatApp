let username = prompt("아이디를 입력하세요");
let roomNum = prompt("채팅방 번호를 입력하세요");

document.querySelector("#username").innerHTML = username;

// const eventSource = new EventSource(
//   "http://localhost:8080/sender/ssar/receiver/cos"
// );

// SSE 연결하기
const eventSource = new EventSource(
  `http://localhost:8080/chat/roomNum/${roomNum}`
);
eventSource.onmessage = (event) => {
  // console.log(1, event);
  const data = JSON.parse(event.data);
  // console.log(2, data);
  if (data.sender === username) {
    //로그인한 유저가 보낸 메시지
    // 파란박스
    initMyMessage(data);
  } else {
    // 회식박스
    initYourMessage(data);
  }

  initMessage(data);
};

// 파란 박스 만들기
function getSendMsgBox(data) {
  let md = data.createdAt.substring(5, 10);
  let tm = data.createdAt.substring(11, 16);
  convertTime = tm + " | " + md;

  return `<div class="sent_msg">
    <p>
      ${data.msg}
    </p>
    <span class="time_date"> ${convertTime} / <b>${data.sender}</b></span>
  </div>`;
}

// 회색 박스 만들기
function getReceiveMsgBox(data) {
  let md = data.createdAt.substring(5, 10);
  let tm = data.createdAt.substring(11, 16);
  convertTime = tm + " | " + md;
  return `<div class="received_withd_msg">
    <p>
      ${data.msg}
    </p>
    <span class="time_date"> ${convertTime} / <b>${data.sender}</b></span>
  </div>`;
}

// addMessage() 함수 호출시 DB에 insert 되고 그 데이터가 자동으로 흘러들어온다,(SSE)
// 파란박스 초기화 하기
function initMyMessage(data) {
  let chatBox = document.querySelector("#chat-box");
  //let msgInput = document.querySelector("#chat-outgoing-msg");

  let sendBox = document.createElement("div");
  sendBox.className = "outgoing_msg";

  sendBox.innerHTML = getSendMsgBox(data);

  chatBox.append(sendBox);
  document.documentElement.scrollTop = document.body.scrollHeight;

  //msgInput.value = "";
}

// 회색박스 초기화 하기
function initYourMessage(data) {
  let chatBox = document.querySelector("#chat-box");

  let receivedBox = document.createElement("div");
  receivedBox.className = "received_msg";

  receivedBox.innerHTML = getReceiveMsgBox(data);

  chatBox.append(receivedBox);
  document.documentElement.scrollTop = document.body.scrollHeight;
}

// AJAX 채팅메시지 전송
async function addMessage() {
  //let chatBox = document.querySelector("#chat-box");
  let msgInput = document.querySelector("#chat-outgoing-msg");

  if (msgInput.value != "") {
    let chatOutGoingBox = document.createElement("div");
    chatOutGoingBox.className = "outgoing_msg";

    //let date = new Date();
    // let now =
    //   date.getHours() +
    //   ":" +
    //   date.getMinutes() +
    //   "|" +
    //   date.getMonth() +
    //   "/" +
    //   date.getDate();

    let chat = {
      sender: username,
      roomNum: roomNum,
      //receiver: "cos",
      msg: msgInput.value,
    };

    let response = await fetch("http://localhost:8080/chat", {
      method: "post",
      body: JSON.stringify(chat), // JS -> JSON
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    // let parseResponse = await response.json();

    // chatOutGoingBox.innerHTML = getSendMsgBox(msgInput.value, now);
    // chatBox.append(chatOutGoingBox);
    msgInput.value = "";
  }
}

// 버튼 클릭 메시지 전송
document.querySelector("#chat-send").addEventListener("click", () => {
  addMessage();
});

// 엔터 입력시 메시지 전송
document
  .querySelector("#chat-outgoing-msg")
  .addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
      addMessage();
    }
  });
