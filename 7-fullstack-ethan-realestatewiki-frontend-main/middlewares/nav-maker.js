import { logoutPopUp } from "../middlewares/popup.js";

import { getCookie, deleteCookie } from "../middlewares/utils.js";

import { identifyProtocol } from "../middlewares/identifyProtocol.js";
const baseUrl = identifyProtocol();
const urlBackend = baseUrl["urlBackend"];
const urlFrontend = baseUrl["urlFrontend"];

const URL_LOGOUT = `${urlBackend}/users/logout`;
const URL_LOGIN = `${urlFrontend}/login`;
const urlNews = `${urlFrontend}/news`;
const urlFreeboard = `${urlFrontend}/freeboard`;
const urlLogin = `${urlFrontend}/login`;
const urlsignup = `${urlFrontend}/signup`;
const urlMypage = `${urlFrontend}/mypage`;

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
  // 브라우저 쿠키에 "nickname"과 "session"이라는 이름의 쿠키가 저장되어 있다면
  if (getCookie("nickname") && getCookie("session")) {
    upSideNavLogin.textContent = "로그아웃";
    upSideNavLogin.setAttribute("href", "");
    upSideNavLogin.addEventListener("click", logout);
    // 브라우저 쿠키에 "nickname"과 "session"이라는 이름의 쿠키가 저장되어 있지 않다면,
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

async function logout(event) {
  deleteCookie("LoginSession");
  deleteCookie("user_id");
  deleteCookie("nickname");
  deleteCookie("session");
  document.cookie = `session=0; max-age=-1; path=/`;
  document.cookie = `user_id=0; max-age=-1; path=/`;
  document.cookie = `nickname=0; max-age=-1; path=/`;
  // console.log(event.target);
  // event.target.innerHTML = "로그인";
  // event.target.setAttribute("href", URL_LOGIN);
  const response = await fetch(URL_LOGOUT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  logoutPopUp();
  return;
}
