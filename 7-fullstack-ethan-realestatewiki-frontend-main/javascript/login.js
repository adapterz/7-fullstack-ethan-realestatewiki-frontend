import { identifyProtocol } from "../middlewares/identifyProtocol.js";
const baseUrl = identifyProtocol();
const urlBackend = baseUrl["urlBackend"];
const urlFrontend = baseUrl["urlFrontend"];

import {
  loginSuccessPopUp,
  loginFailurePopUp,
  alreadyLoginPopUp,
} from "../middlewares/popup.js";

const URL_SINGIN = `${urlBackend}/users/signin`;
const URL_SIGNUP = `${urlFrontend}/signup`;
const URL_HOME = `${urlFrontend}`;

const loginbutton = document.querySelector("#loginButton");
const signupButton = document.querySelector("#signupButton");

// 로그인 버튼을 클릭하면 login 함수가 실행된다.
loginbutton.addEventListener("click", login);
signupButton.addEventListener("click", goToSignupPage);

// 회원가입 페이지로 가기
function goToSignupPage() {
  location.href = URL_SIGNUP;
}

// login 함수
function login() {
  // 유저에게 입력 받은 id, pw의 값을 가져와서 변수에 담는다.
  const userId = document.querySelector("#user_id").value;
  const userPw = document.querySelector("#user_pw").value;
  // // 유저에게 입력 받은 id, pw와 json파일 내 id, pw 데이터를 비교해서 로그인을 해준다.
  checkUser(userId, userPw);
}

async function checkUser(userId, userPw) {
  const user = {
    user_id: userId,
    user_pw: userPw,
  };
  const response = await fetch(URL_SINGIN, {
    method: "POST",
    body: JSON.stringify(user), // comment JS 객체를 JSON문자열으로 변경하여 보냄
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const forCookie = await response.json();
  if (response["status"] == 403) {
    alreadyLoginPopUp();
    setTimeout(() => {
      location.href = URL_HOME;
    }, 1000);
    return;
  }
  if (response["status"] == 200) {
    console.log("쿠키를 생성합니다. ");
    document.cookie = `session=${forCookie[0]["Loginsession"]}; max-age=3600`;
    document.cookie = `user_id=${forCookie[1]["user_id"]}; max-age=3600`;
    document.cookie = `nickname=${forCookie[2]["nickname"]}; max-age=3600`;
    loginSuccessPopUp();
    setTimeout(() => {
      location.href = URL_HOME;
    }, 1000);
    return;
  }
  loginFailurePopUp();
  return;
}
