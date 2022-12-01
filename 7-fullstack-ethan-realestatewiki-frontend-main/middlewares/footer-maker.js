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

export function makeFooter() {
  const footer = document.querySelector("footer");
  console.log(footer);
  const firstNav = document.createElement("nav");
  firstNav.className = "footer-info";
  const firstNavHome = document.createElement("a");
  firstNavHome.setAttribute("href", urlFrontend);
  const firstNavHomeSpan = document.createElement("span");
  firstNavHomeSpan.textContent = "홈 |";
  const firstNavLogin = document.createElement("a");
  firstNavLogin.setAttribute("href", urlLogin);
  const firstNavLoginSpan = document.createElement("span");
  firstNavLoginSpan.textContent = "로그인 |";
  const firstNavSignup = document.createElement("a");
  firstNavSignup.setAttribute("href", urlsignup);
  const firstNavSignupSpan = document.createElement("span");
  firstNavSignupSpan.textContent = "회원가입";
  const secondNav = document.createElement("nav");
  secondNav.className = "footer-info";
  const secondNavUsePolicy = document.createElement("a");
  const secondNavUsePolicySpan = document.createElement("span");
  secondNavUsePolicySpan.textContent = "이용약관";
  const secondNavPrivatePolicy = document.createElement("a");
  const secondNavPrivatePolicySpan = document.createElement("span");
  secondNavPrivatePolicySpan.textContent = "개인정보처리방침";
  const secondNavCustomerCenter = document.createElement("a");
  const secondNavCustomerCenterSpan = document.createElement("span");
  secondNavCustomerCenterSpan.textContent = "고객센터";
  const address = document.createElement("address");
  address.className = "footer-info";
  const addressLink = document.createElement("a");
  addressLink.setAttribute("href", "");
  const addressLinkSpan = document.createElement("span");
  addressLinkSpan.textContent = "ethandeveloper2@gmail.com";
  footer.appendChild(firstNav);
  firstNav.appendChild(firstNavHome);
  firstNavHome.appendChild(firstNavHomeSpan);
  firstNav.appendChild(firstNavLogin);
  firstNavLogin.appendChild(firstNavLoginSpan);
  firstNav.appendChild(firstNavSignup);
  firstNavSignup.appendChild(firstNavSignupSpan);
  footer.appendChild(secondNav);
  secondNav.appendChild(secondNavUsePolicy);
  secondNavUsePolicy.appendChild(secondNavUsePolicySpan);
  secondNav.appendChild(secondNavPrivatePolicy);
  secondNavPrivatePolicy.appendChild(secondNavPrivatePolicySpan);
  secondNav.appendChild(secondNavCustomerCenter);
  secondNavCustomerCenter.appendChild(secondNavCustomerCenterSpan);
  footer.appendChild(address);
  address.appendChild(addressLink);
  addressLink.appendChild(addressLinkSpan);
}
