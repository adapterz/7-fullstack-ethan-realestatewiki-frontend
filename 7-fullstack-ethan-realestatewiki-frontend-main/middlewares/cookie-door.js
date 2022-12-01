import { getCookie, deleteCookie } from "./utils.js";

import { loginRequiredPopUp, alreadyLoginPopUp } from "./popup.js";

import { identifyProtocol } from "../middlewares/identifyProtocol.js";
const baseUrl = identifyProtocol();
const urlBackend = baseUrl["urlBackend"];
const urlFrontend = baseUrl["urlFrontend"];

// 페이지 입장 시, 쿠키가 없다면 되돌아가게 하는 역할
export function cookieDoor() {
  // 로그인에 필요한 쿠키가 없다면 홈으로 되돌아간다.
  if (
    !(getCookie("nickname") && getCookie("session") && getCookie("user_id"))
  ) {
    loginRequiredPopUp();
    location.href = urlFrontend;
  }
}

export function reverseCookieDoor() {
  // 로그인에 필요한 쿠키가 없다면 홈으로 되돌아간다.
  if (getCookie("nickname") && getCookie("session") && getCookie("user_id")) {
    alreadyLoginPopUp();
    location.href = urlFrontend;
  }
}
