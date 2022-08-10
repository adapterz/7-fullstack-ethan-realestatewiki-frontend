import { makeNav } from "../middlewares/nav-maker.js";
document.addEventListener("DOMContentLoaded", makeNav);

import { makeFooter } from "../middlewares/footer-maker.js";
document.addEventListener("DOMContentLoaded", makeFooter);

import {
  URL_FRONTEND_DEV,
  URL_BACKEND_DEV,
  URL_FRONTEND_PROD,
  URL_BACKEND_PROD,
} from "../middlewares/constants.js";
let urlBackend;
let urlFrontend;

urlBackend = URL_BACKEND_DEV;
urlFrontend = URL_FRONTEND_DEV;
if (location.protocol == "https:") {
  urlBackend = URL_BACKEND_PROD;
  urlFrontend = URL_FRONTEND_PROD;
}

// 자유 게시판 페이지
const URL_LOGOUT = `${urlBackend}/users/logout`;
const URL_LOGIN = `${urlFrontend}/login`;
const URL_FREEBOARD = `${urlFrontend}/freeboard`;
const URL_MAKE_POST = `${urlBackend}/posts`;

// 게시글 쓰기

const confirmButton = document.querySelector(".button--confirm");
confirmButton.addEventListener("click", makePost);

async function makePost() {
  const post = {
    title: document.querySelector("#title").value,
    content: document.querySelector("#content").value,
    use_enabled: 1,
    comments_enabled: 1,
  };
  const response = await fetch(URL_MAKE_POST, {
    method: "post", // POST 요청을 보낸다.
    body: JSON.stringify(post), // comment JS 객체를 JSON으로 변경하여 보냄
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response["status"] == 401) {
    LoginRequiredPopUp();
    return;
  }
  if (response["status"] == 201) {
    postSuccessPopUp();
    setTimeout(() => {
      location.href = URL_FREEBOARD;
    }, 1000);
    return;
  }
  postFailPopUp();
  return;
}

const cancelButton = document.querySelector(".button--cancel");
cancelButton.addEventListener("click", goToFreeboard);

function goToFreeboard() {
  location.href = URL_FREEBOARD;
}

function logoutPopUp() {
  Swal.fire({
    text: "로그아웃 되었습니다.",
    timer: 2000,
  });
}

function postSuccessPopUp() {
  Swal.fire({
    text: "게시글이 작성 되었습니다.",
    timer: 2000,
  });
}

function LoginRequiredPopUp() {
  Swal.fire({
    text: "로그인이 필요합니다.",
    timer: 2000,
  });
}

function postFailPopUp() {
  Swal.fire({
    text: "제목과 내용을 올바르게 입력해주세요.",
    timer: 2000,
  });
}
