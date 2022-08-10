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

const URL_GET_POPULAR_POST = `${urlBackend}/posts/popular`;
const URL_GET_POPULAR_APT = `${urlBackend}/aptinfos/popular`;
const URL_GET_POST = `${urlBackend}/posts/`;
const URL_GET_POST_DETAIL = `${urlFrontend}/post/`;
const URL_GET_APT = `${urlBackend}/aptinfos/`;
const URL_LOGOUT = `${urlBackend}/users/logout`;
const URL_LOGIN = `${urlFrontend}/login`;
const URL_APT = `${urlFrontend}/info/`;
const URL_APT_PRICE = `${urlBackend}/aptTransaction/recent-price/?`;
const URL_SEARCH_APT_INFO = `${urlBackend}/aptinfos/aptname/?`;
const URL_SEARCH_RESULT = `${urlFrontend}/search-result/?keyword=`;

// 페이지 중앙 검색 기능
const searchBarButton = document.querySelector(".search-bar__button");
searchBarButton.addEventListener("click", search);

async function search() {
  const keyword = document.querySelector("#keyword").value;
  const pageNumber = 1;
  const searchUrl = `${URL_SEARCH_RESULT}${encodeURIComponent(
    keyword
  )}&page=${encodeURIComponent(pageNumber)}`;
  location.href = searchUrl;
}

// 홈 페이지가 로드되면 getApt(), getPost()을 실행한다.
document.addEventListener("DOMContentLoaded", getApt());
document.addEventListener("DOMContentLoaded", getPost());

// // 쿠키 생성
// function getCookie(cName) {
//   cName = cName + "=";
//   var cookieData = document.cookie;
//   var start = cookieData.indexOf(cName);
//   var cValue = "";
//   if (start != -1) {
//     start += cName.length;
//     var end = cookieData.indexOf(";", start);
//     if (end == -1) end = cookieData.length;
//     cValue = cookieData.substring(start, end);
//   }
//   return unescape(cValue);
// }

// // 쿠키 삭제
// function deleteCookie(name) {
//   document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
// }

// // home 화면 띄우기 전, 쿠키 확인 후, 로그인 처리
// const loginNav = document.querySelector(
//   "header > nav:nth-child(1) > a:nth-child(4)"
// );
// if (getCookie("nickname") && getCookie("LoginSession")) {
//   loginNav.innerHTML = "로그아웃";
//   loginNav.setAttribute("href", `#`);
//   loginNav.addEventListener("click", logout);
// }

// async function logout() {
//   loginNav.innerHTML = "로그인";
//   const response = await fetch(URL_LOGOUT, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   deleteCookie("LoginSession");
//   deleteCookie("user_id");
//   deleteCookie("nickname");
//   logoutPopUp();
//   loginNav.setAttribute("href", URL_LOGIN);
//   return;
// }

// 게시글 정보 가져오기
async function getPost() {
  const popularPost = document.querySelector(".popular-post");
  const response = await fetch(URL_GET_POPULAR_POST, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  for (let i = 0; i < data.length; i++) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const div = document.createElement("div");
    const nickname = document.createElement("span");
    const view = document.createElement("span");
    const recomended = document.createElement("span");
    a.textContent = data[i]["title"];
    // TODO : 상수값으로 URL 만들어놓기
    a.setAttribute("href", `${URL_GET_POST_DETAIL}${data[i]["id"]}`);
    nickname.textContent = data[i]["user_id"];
    view.textContent = ` / 조회수 : ${data[i]["views"]}`;
    // recomended.textContent = ` / 추천수 : ${data[i]["recommended_number"]}`;
    popularPost.appendChild(li);
    li.appendChild(a);
    li.appendChild(div);
    div.appendChild(nickname);
    div.appendChild(view);
    div.appendChild(recomended);
  }
}

// 아파트별 가격 정보 데이터 가져오기
async function getAptPrice(aptName, dong) {
  const response = await fetch(
    `${URL_APT_PRICE}aptName=${encodeURIComponent(
      aptName
    )}&dong=${encodeURIComponent(dong)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response["status"] == 404) {
    return 0;
  }
  const data = await response.json();
  return data[0]["거래금액"];
  // return `${parseInt(data[0]["거래금액"]) / 10}억원`;
}

// 아파트 정보 가져오기
async function getApt() {
  const popularApt = document.querySelector(".popular-apt");
  //TODO : 시간될때 response를 하나의 함수로 바꿀수 있다. method 인자값을 주고, 중복 줄이는 방식으로 구현.
  const response = await fetch(URL_GET_POPULAR_APT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  for (let i = 0; i < 3; i++) {
    // TODO : 변수명 변경, 다른 사람들이 봐도 이해할 수 있게 만들기
    const li = document.createElement("li");
    const a = document.createElement("a");
    const div = document.createElement("div");
    const address = document.createElement("div");
    const price = document.createElement("div");
    a.textContent = data[i]["name"];
    a.setAttribute("href", `${URL_APT}${data[i]["id"]}`);
    address.textContent = `${data[i]["address"]}`;
    let recentPrice = await getAptPrice(
      data[i]["name"],
      data[i]["adress_dong"]
    );
    price.textContent = ` / 최근 실거래가 : ${parseInt(recentPrice) / 10}억원`;
    if (recentPrice == 0) {
      price.textContent = ` / 최근 거래 내역 없음`;
    }
    popularApt.appendChild(li);
    li.appendChild(a);
    li.appendChild(div);
    div.appendChild(address);
    div.appendChild(price);
  }
  for (let i = 3; i < 10; i++) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = data[i]["name"];
    a.setAttribute("href", `${URL_APT}${data[i]["id"]}`);
    popularApt.appendChild(li);
    li.appendChild(a);
  }
}

function logoutPopUp() {
  Swal.fire({
    text: "로그아웃 되었습니다.",
    timer: 2000,
  });
}
