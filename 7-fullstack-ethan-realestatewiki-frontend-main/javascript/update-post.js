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

// 게시글 아이디 확인
const href = window.location.href;
const parts = href.split("/");
const id = parts.pop().replace("?", "");
const URL_GET_POST = `${urlBackend}/posts/${id}`;
const URL_FREEBOARD = `${urlFrontend}/freeboard`;

document.addEventListener("DOMContentLoaded", getPost);

const updateButton = document.querySelector(".button--confirm");
updateButton.addEventListener("click", updatePost);
const cancelButton = document.querySelector(".button--cancel");
cancelButton.addEventListener("click", goToFreeboard);

async function getPost() {
  const postTitle = document.querySelector("#title");
  const postContent = document.querySelector("#content");
  const response = await fetch(URL_GET_POST, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await response.json();
  postTitle.value = data[0]["title"];
  postContent.value = data[0]["content"];
}

async function updatePost() {
  const post = {
    title: document.querySelector("#title").value,
    content: document.querySelector("#content").value,
    use_enabled: 1,
    comments_enabled: 1,
  };
  const response = await fetch(URL_GET_POST, {
    method: "PUT", // POST 요청을 보낸다.
    body: JSON.stringify(post), // comment JS 객체를 JSON으로 변경하여 보냄
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response["status"] == 201) {
    postSuccessPopUp();
    setTimeout(() => {
      location.href = URL_FREEBOARD;
    }, 1000);
    return;
  }
  if (response["status"] == 401) {
    LoginRequiredPopUp();
    return;
  }
  if (response["status"] == 204) {
    noChangePopUp();
    return;
  }
  postFailPopUp();
  return;
}

function goToFreeboard() {
  location.href = URL_FREEBOARD;
}

function postSuccessPopUp() {
  Swal.fire({
    text: "게시글이 수정 되었습니다.",
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

function noChangePopUp() {
  Swal.fire({
    text: "수정된 사항이 없습니다.",
    timer: 2000,
  });
}
