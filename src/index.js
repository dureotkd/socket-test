import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import qs from "qs";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

function Main() {
  return <div>Main</div>;
}

const KAKAO_API_KEY = "838a366b71c2d8f0d7da68db04147be3";
const REDIRECT_URI = "http://localhost:3000/oauth/kakao/callback";
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
const KAKAO_CLIENT_ID = `641b59c5893a85717a23b8b0bd4a457b`;

function 카카오콜백() {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");

  const getData = async () => {
    const payload = qs.stringify({
      grant_type: "authorization_code",
      client_id: KAKAO_API_KEY,
      redirect_uri: REDIRECT_URI,
      code: code,
      client_secret: KAKAO_CLIENT_ID,
    });

    try {
      const res = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        payload
      );

      console.log(window.Kakao);

      // Kakao Javascript SDK 초기화
      window.Kakao.init(KAKAO_API_KEY);
      // access token 설정
      window.Kakao.Auth.setAccessToken(res.data.access_token);

      // Kakao SDK API를 이용해 사용자 정보 획득
      const { id, kakao_account } = await window.Kakao.API.request({
        url: "/v2/user/me",
      });

      console.log(id, kakao_account);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  return <div>ads</div>;
}

function 카카오() {
  return (
    <div
      style={{
        backgroundColor: "yellow",
        padding: 16,
        width: 220,
        textAlign: "center",
        margin: "20px auto",
        cursor: "pointer",
      }}
      onClick={() => {
        window.location.href = KAKAO_AUTH_URL;
      }}
    >
      카카오 로그인
    </div>
  );
}

function 소셜로그인() {
  return (
    <Routes>
      <Route exact path="/" element={<Main />} />
      <Route exact path="/kakao" element={<카카오 />} />
      <Route exact path="/oauth/kakao/callback" element={<카카오콜백 />} />
    </Routes>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
// eslint-disable-next-line react/jsx-pascal-case
root.render(
  <BrowserRouter>
    <소셜로그인 />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
