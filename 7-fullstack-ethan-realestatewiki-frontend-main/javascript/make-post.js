// 자유 게시판 페이지
const URL_LOGOUT = "https://api.realestatewiki.kr/users/logout";
const URL_LOGIN = `https://realestatewiki.kr/login`;
const URL_FREEBOARD = "https://realestatewiki.kr/freeboard";
const URL_MAKE_POST = "https://api.realestatewiki.kr/posts";

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
