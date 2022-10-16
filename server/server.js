const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const port = 4000;

app.use(cors());

server.listen(port, () => {
  console.log("Server Start..");
});

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

const ROOM = {};

app.get("/", (req, res) => {
  res.send("Helalo");
});

io.on("connection", (socket) => {
  const id = socket.id;

  console.log("소켓 서버 시작", socket.id);

  socket.on("방접속", (방번호) => {
    ROOM[id] = 방번호;
    const COUNT = {};

    Object.values(ROOM).forEach((value) => {
      if (COUNT[value]) {
        COUNT[value]++;
      } else {
        COUNT[value] = 1;
      }
    });

    socket.join(방번호);
    io.emit("인원카운트", COUNT);
    socket.to(방번호).emit("방접속");
  });

  // socket.to("1번 방").emit("client", "1번 방 사람들한테 뿌리기");

  // 나를 제외한 모두한테 보내기
  // socket.broadcast.emit("Hello");

  // 나를 포함한 모두한테 보내기
  // io.emit("Hello");

  // 클라이언트 이벤트 받아서 소켓 이벤투 주기
  socket.on("Hello", () => {
    io.emit("Hello");
  });

  socket.on("disconnect", () => {
    delete ROOM[id];

    console.log("소켓 서버 종료");
  });
});
