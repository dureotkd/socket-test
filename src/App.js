import React from "react";
import { io } from "socket.io-client";
import "./App.css";

function App() {
  const [socketObj, setSocketObj] = React.useState();

  const [room, setRoom] = React.useState([
    {
      name: "1번방",
      value: 1,
      active: false,
      참여자: 0,
    },
    {
      name: "2번방",
      value: 2,
      active: false,
      참여자: 0,
    },
    {
      name: "3번방",
      value: 3,
      active: false,
      참여자: 0,
    },
    {
      name: "4번방",
      value: 4,
      active: false,
      참여자: 0,
    },
  ]);

  React.useEffect(() => {
    const socket = io("http://localhost:4000");
    setSocketObj(socket);

    // Client 에서 서버 Socket Event 받기
    // socket.on("Hello", () => {
    //   alert("반가워요 ㅎㅎ");
    // });

    socket.on("인원카운트", (count) => {
      const newRoom = [...room].map((item) => {
        item.참여자 = count[item.value] ? count[item.value] : 0;
        return item;
      });

      setRoom(newRoom);
    });

    socket.on("방접속", () => {});
  }, []);

  return (
    <div className="App">
      <h1>소켓 IO 방 목록</h1>
      <ul style={{ padding: 30 }}>
        {room &&
          room.map((item, index) => {
            return (
              <li
                onClick={() => {
                  const newRoom = [...room].map((_item, _index) => {
                    _item.active = _index === index ? true : false;
                    return _item;
                  });
                  setRoom(newRoom);
                  socketObj.emit("방접속", item.value);
                }}
                style={{
                  margin: 12,
                  cursor: "pointer",
                  color: item.active ? "red" : "black",
                  backgroundColor: "aliceblue",
                  display: "inline-block",
                  padding: 12,
                  borderRadius: 6,
                }}
                key={item.value}
              >
                {item.name} {item.참여자}
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default App;
