import { makeNav } from "../middlewares/nav-maker.js";
document.addEventListener("DOMContentLoaded", makeNav);

import { makeFooter } from "../middlewares/footer-maker.js";
document.addEventListener("DOMContentLoaded", makeFooter);

import { identifyProtocol } from "../middlewares/identifyProtocol.js";
const baseUrl = identifyProtocol();
const urlBackend = baseUrl["urlBackend"];
const urlFrontend = baseUrl["urlFrontend"];

import {
  updatePostSuccessPopUp,
  updatePostFailPopUp,
  loginRequiredPopUp,
  noChangePopUp,
} from "../middlewares/popup.js";

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
    updatePostSuccessPopUp();
    setTimeout(() => {
      location.href = URL_FREEBOARD;
    }, 1000);
    return;
  }
  if (response["status"] == 401) {
    loginRequiredPopUp();
    return;
  }
  if (response["status"] == 204) {
    noChangePopUp();
    return;
  }
  updatePostFailPopUp();
  return;
}

function goToFreeboard() {
  location.href = URL_FREEBOARD;
}
