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

const URL_LOGOUT = `${urlBackend}/users/logout`;
const URL_LOGIN = `${urlFrontend}/login`;
const urlNews = `${urlFrontend}/news`;
const urlFreeboard = `${urlFrontend}/freeboard`;
const urlLogin = `${urlFrontend}/login`;
const urlsignup = `${urlFrontend}/signup`;
const urlMypage = `${urlFrontend}/mypage`;
console.log(`urlNews : ${urlLogin}`);

export function makeNav() {
  const nav = document.querySelector("#wrapper > header");
  const upSideNav = document.createElement("nav");
  const upSideNavLogo = document.createElement("img");
  upSideNavLogo.src = "../images/main/logo_simple.png";
  const upSideNavNews = document.createElement("a");
  upSideNavNews.textContent = "부동산뉴스";
  upSideNavNews.setAttribute("href", urlNews);
  const upSideNavFreeboard = document.createElement("a");
  upSideNavFreeboard.textContent = "자유게시판";
  upSideNavFreeboard.setAttribute("href", urlFreeboard);
  const upSideNavLogin = document.createElement("a");
  if (getCookie("nickname") && getCookie("session")) {
    upSideNavLogin.textContent = "로그아웃";
    upSideNavLogin.setAttribute("href", "");
    upSideNavLogin.addEventListener("click", logout);
  } else {
    upSideNavLogin.textContent = "로그인";
    upSideNavLogin.setAttribute("href", urlLogin);
  }
  const upSideNavSignup = document.createElement("a");
  upSideNavSignup.textContent = "회원가입";
  upSideNavSignup.setAttribute("href", urlsignup);
  const upSideNavMypage = document.createElement("a");
  upSideNavMypage.textContent = "마이페이지";
  upSideNavMypage.setAttribute("href", urlMypage);
  nav.appendChild(upSideNav);
  upSideNav.appendChild(upSideNavLogo);
  upSideNav.appendChild(upSideNavNews);
  upSideNav.appendChild(upSideNavFreeboard);
  upSideNav.appendChild(upSideNavLogin);
  upSideNav.appendChild(upSideNavSignup);
  upSideNav.appendChild(upSideNavMypage);

  const downSideNav = document.createElement("nav");
  const downSideNavLogo = document.createElement("a");
  downSideNavLogo.setAttribute("href", urlFrontend);
  const downSideNavLogoImage = document.createElement("img");
  downSideNavLogoImage.src = "../images/main/logo_korean.png";
  const downSideNavIcon = document.createElement("a");
  const downSideNavIconPicture = document.createElement("i");
  downSideNavIconPicture.className = "fa-solid fa-bars";
  nav.appendChild(downSideNav);
  downSideNav.appendChild(downSideNavLogo);
  downSideNav.appendChild(downSideNavIcon);
  downSideNavLogo.appendChild(downSideNavLogoImage);
  downSideNavIcon.appendChild(downSideNavIconPicture);
}

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

async function logout(event) {
  event.target.innerHTML = "로그인";
  const response = await fetch(URL_LOGOUT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response);
  deleteCookie("LoginSession");
  deleteCookie("session");
  deleteCookie("user_id");
  deleteCookie("nickname");
  logoutPopUp();
  loginNav.setAttribute("href", URL_LOGIN);
  return;
}

function logoutPopUp() {
  Swal.fire({
    text: "로그아웃 되었습니다.",
    timer: 2000,
  });
}
