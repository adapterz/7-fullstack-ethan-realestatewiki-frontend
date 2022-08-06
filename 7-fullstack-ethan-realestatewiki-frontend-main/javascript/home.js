// function getParamMap(queryString) {
//   let splited = queryString.replace("?", "").split(/[=?&]/);
//   let param = {};
//   for (let i = 0; i < splited.length; i++) {
//     param[splited[i]] = splited[++i];
//   }
//   return param;
// }

// const paramObj = getParamMap(decodeURI(location.search));
// console.log(paramObj.keyword);
// console.log(paramObj.page);

// 페이지 중앙 검색 기능
const searchBarButton = document.querySelector(".search-bar__button");
searchBarButton.addEventListener("click", search);
const URL_SEARCH_APT_INFO = "http://localhost:8080/aptinfos/aptname/?";

async function search() {
  const keyword = document.querySelector("#keyword").value;
  const pageNumber = 1;
  const URL_SEARCH_RESULT = `http://localhost:443/search-result/?keyword=${encodeURIComponent(
    keyword
  )}&page=${encodeURIComponent(pageNumber)}`;
  location.href = URL_SEARCH_RESULT;
}

const URL_GET_POPULAR_POST = "http://localhost:8080/posts/popular";
const URL_GET_POPULAR_APT = "http://localhost:8080/aptinfos/popular";
const URL_GET_POST = `http://localhost:8080/posts/`;
const URL_GET_POST_DETAIL = `http://localhost:443/post/`;
const URL_GET_APT = `http://localhost:8080/aptinfos/`;
const URL_LOGOUT = "http://localhost:8080/users/logout";
const URL_LOGIN = `http://localhost:443/login`;
const URL_APT = `http://localhost:443/info/`;
const URL_APT_PRICE = `http://localhost:8080/aptTransaction/recent-price/?`;

// 홈 페이지가 로드되면 getApt(), getPost()을 실행한다.
document.addEventListener("DOMContentLoaded", getApt());
document.addEventListener("DOMContentLoaded", getPost());

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
  console.log(loginNav);
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
  deleteCookie("nickname");
  console.log(response);
  logoutPopUp();
  loginNav.setAttribute("href", URL_LOGIN);
  return;
}

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
  console.log(data[0]["id"]);
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
    recomended.textContent = ` / 추천수 : ${data[i]["recommended_number"]}`;
    popularPost.appendChild(li);
    li.appendChild(a);
    li.appendChild(div);
    div.appendChild(nickname);
    div.appendChild(view);
    div.appendChild(recomended);
  }
  // for (let i = 3; i < 10; i++) {
  //   const li = document.createElement("li");
  //   const a = document.createElement("a");
  //   a.textContent = data[i]["title"];
  //   a.setAttribute("href", `${URL_GET_POST_DETAIL}${data[i]["id"]}`);
  //   popularPost.appendChild(li);
  //   li.appendChild(a);
  // }
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
  console.log(data);
  console.log(`price : ${data[0]["거래금액"]}`);
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
  console.log(data);
  for (let i = 0; i < 3; i++) {
    // TODO : 변수명 변경, 다른 사람들이 봐도 이해할 수 있게 만들기
    const li = document.createElement("li");
    const a = document.createElement("a");
    const div = document.createElement("div");
    const address = document.createElement("span");
    const price = document.createElement("span");
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
