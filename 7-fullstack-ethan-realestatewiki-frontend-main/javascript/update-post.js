// 게시글 아이디 확인
const href = window.location.href;
const parts = href.split("/");
const id = parts.pop().replace("?", "");
const URL_GET_POST = `https://api.realestatewiki.kr/posts/${id}`;
const URL_FREEBOARD = `https://realestatewiki.kr/freeboard`;

// 쿠키 생성
function getCookie(cName) {
  cName = cName + "=";
  var cookieData = document.cookie;
  var start = cookieData.indexOf(cName);
  var cValue = "";
  if (start != -1) {
    start += cName.length;
    var end = cookieData.indexOf(";", start);
    if (end == -1) end = cookieData.length;
    cValue = cookieData.substring(start, end);
  }
  return unescape(cValue);
}

// 쿠키 삭제
function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

// home 화면 띄우기 전, 쿠키 확인 후, 로그인 처리
const loginNav = document.querySelector(
  "header > nav:nth-child(1) > a:nth-child(4)"
);
if (getCookie("nickname") && getCookie("LoginSession")) {
  loginNav.innerHTML = "로그아웃";
  loginNav.setAttribute("href", `#`);
  loginNav.addEventListener("click", logout);
}

async function logout() {
  loginNav.innerHTML = "로그인";
  const response = await fetch(URL_LOGOUT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  deleteCookie("LoginSession");
  deleteCookie("user_id");
  deleteCookie("nickname");
  logoutPopUp();
  loginNav.setAttribute("href", URL_LOGIN);
  return;
}

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
