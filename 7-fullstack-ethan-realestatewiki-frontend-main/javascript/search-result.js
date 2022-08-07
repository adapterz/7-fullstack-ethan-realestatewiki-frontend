const URL_LOGOUT = "https://api.realestatewiki.kr/users/logout";
const URL_LOGIN = `https://realestatewiki.kr/login`;
const URL_SEARCH_APT_INFO = "https://api.realestatewiki.kr/aptinfos/aptname/?";
const URL_SEARCH_APT_INFO_COUNT =
  "https://api.realestatewiki.kr/aptinfos/aptnamecount/?";
const URL_APT = `https://realestatewiki.kr/info/`;
const URL_SEARCH_RESULT = `https://realestatewiki.kr/search-result/?keyword=`;

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
  deleteCookie("user_id");
  deleteCookie("nickname");
  console.log(response);
  logoutPopUp();
  loginNav.setAttribute("href", URL_LOGIN);
  return;
}

//href를 분석해서, 그에 맞는 페이지를 로드한다.
function getParamMap(queryString) {
  let splited = queryString.replace("?", "").split(/[=?&]/);
  let param = {};
  for (let i = 0; i < splited.length; i++) {
    param[splited[i]] = splited[++i];
  }
  return param;
}
const paramObj = getParamMap(decodeURI(location.search));
const keyword = paramObj.keyword;
const page = paramObj.page;

// 페이지가 로드 되면, 키워드와 page를 이용해서 결과를 가져온다.
document.addEventListener("DOMContentLoaded", makeSearchResult(keyword, page));
// 페이지가 로드 되면, 키워드와 page를 이용해서 페이지네이션을 가져온다.
document.addEventListener("DOMContentLoaded", makePagination(keyword, page));

async function makeSearchResult(keyword, pageNumber) {
  const board = document.querySelector(".board__content");
  while (board.hasChildNodes()) {
    board.removeChild(board.firstChild);
  }
  const boardTitle = document.querySelector(".board__title>a");
  boardTitle.textContent = `"${keyword}" 검색결과`;
  const response = await fetch(
    `${URL_SEARCH_APT_INFO}aptName=${encodeURIComponent(
      keyword
    )}&page=${encodeURIComponent(pageNumber)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response["status"] == 404) {
    const item = document.createElement("li");
    const aptInfo = document.createElement("div");
    const aptInfoTitle = document.createElement("div");
    aptInfoTitle.className = "board__content-title";
    const aptInfoTitleName = document.createElement("a");
    aptInfoTitleName.textContent = "검색결과가 없습니다...";
    board.appendChild(item);
    item.appendChild(aptInfo);
    aptInfo.appendChild(aptInfoTitle);
    aptInfoTitle.appendChild(aptInfoTitleName);
  }
  const data = await response.json();
  console.log(data);
  console.log(data[0]["id"]);
  console.log(data[0]["name"]);
  console.log(data[1]["number_searched"]);
  for (let i = 0; i < data.length; i++) {
    const item = document.createElement("li");
    const aptInfo = document.createElement("div");
    const aptInfoTitle = document.createElement("div");
    aptInfoTitle.className = "board__content-title";
    const aptInfoTitleName = document.createElement("a");
    aptInfoTitleName.textContent = data[i]["name"];
    aptInfoTitleName.setAttribute("href", `${URL_APT}${data[i]["id"]}`);
    const aptInfoDetail = document.createElement("div");
    aptInfoDetail.className = "board__content-info";
    const aptInfoDetailAddress = document.createElement("span");
    aptInfoDetailAddress.textContent = data[i]["address"];
    const aptLikes = document.createElement("div");
    aptLikes.className = "board__content-likes";
    const aptLikesNumber = document.createElement("span");
    aptLikesNumber.textContent = data[i]["number_searched"];
    board.appendChild(item);
    item.appendChild(aptInfo);
    aptInfo.appendChild(aptInfoTitle);
    aptInfoTitle.appendChild(aptInfoTitleName);
    aptInfo.appendChild(aptInfoDetail);
    aptInfoDetail.appendChild(aptInfoDetailAddress);
    item.appendChild(aptLikes);
    aptLikes.appendChild(aptLikesNumber);
  }
}

const searchBarButton = document.querySelector(".search-bar__button");
let pageNumber = 1;
searchBarButton.addEventListener("click", search);

async function search() {
  const board = document.querySelector(".board__content");
  while (board.hasChildNodes()) {
    board.removeChild(board.firstChild);
  }
  const keyword = document.querySelector("#keyword").value;
  const page = 1;
  console.log(`searchKeyword: ${keyword}`);
  goToPage(keyword, page);
  // makeSearchResult(keyword, page);
}

// 검색 내역 전체 개수 파악
async function getSearchResultCount(keyword) {
  console.log(URL_SEARCH_APT_INFO_COUNT);
  console.log(
    `${URL_SEARCH_APT_INFO_COUNT}aptName=${encodeURIComponent(keyword)}`
  );
  console.log(
    `${URL_SEARCH_APT_INFO_COUNT}aptName=${decodeURIComponent(keyword)}`
  );
  const response = await fetch(
    `${URL_SEARCH_APT_INFO_COUNT}aptName=${encodeURIComponent(keyword)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  console.log(response);
  console.log(data);
  return data;
}

//페이지네이션 생성
async function makePagination(keyword, page) {
  // 활성화해야할 페이지
  let activePageNumber = page;
  console.log(`activePageNumber : ${activePageNumber}`);
  // 표시해야하는 페이지네이션의 첫번쨰 페이지를 나타낸다.
  let firstPageNumber = page;
  if (!page) {
    firstPageNumber = 1;
  }
  if (page % 5 == 1) {
    firstPageNumber = page;
  }
  if (page % 5 == 2) {
    firstPageNumber = page - 1;
  }
  if (page % 5 == 3) {
    firstPageNumber = page - 2;
  }
  if (page % 5 == 4) {
    firstPageNumber = page - 3;
  }
  if (page % 5 == 0) {
    firstPageNumber = page - 4;
  }

  // 페이지그룹을 결정한다.
  const pageGroup = Math.ceil(firstPageNumber / 5);

  // 페이지네이션 클래스 선택
  const pagination = document.querySelector(".pagenation");
  // 전체 검색 결과 개수 가져오기
  const data = await getSearchResultCount(keyword);
  // 만약 총 게시글이 10개 이하이면 페이지 네이션을 만들지 않는다.
  //   if (data.length < 10) {
  //     return;
  //   }
  console.log(`총 검색결과 : ${data.length}개`);
  const arrowPprev = document.createElement("a");
  arrowPprev.className = "arrow pprev";
  // arrowPprev.setAttribute("href", "#");
  const arrowPprevIcon = document.createElement("i");
  arrowPprevIcon.className = "fa-solid fa-angles-left";
  const arrowPrev = document.createElement("a");
  arrowPrev.className = "arrow prev";
  // arrowPrev.setAttribute("href", "#");
  const arrowPrevIcon = document.createElement("i");
  arrowPrevIcon.className = "fa-solid fa-angle-left";
  pagination.appendChild(arrowPprev);
  arrowPprev.appendChild(arrowPprevIcon);
  pagination.appendChild(arrowPrev);
  arrowPrev.appendChild(arrowPrevIcon);
  console.log(`페이지 수 : ${Math.ceil(data.length / 10)}`);
  // 전체 페이지를 totalPage 변수에 넣는다.
  const totalPage = Math.ceil(data.length / 10);
  // 요청한 페이지의 pageGroup
  console.log(`pageGroup : ${pageGroup}`);
  // 요청한 페이지 그룹에서 처음으로 표시되어야 할 페이지
  console.log(`firstPageNumber : ${firstPageNumber}`);
  // 요청한 페이지
  console.log(`activePageNumber : ${activePageNumber}`);

  // 자신의 페이지 그룹 * 5 <= totalPage 일 때
  if (pageGroup * 5 <= totalPage) {
    console.log(`pageGroup : ${pageGroup}`);
    console.log(`totalPage : ${totalPage}`);
    console.log("새로운 규칙");
    for (let i = 0; i < 5; i++) {
      const a = document.createElement("a");
      a.textContent = i + parseInt(firstPageNumber);
      // a.setAttribute("href", `#`);
      a.classList.add("page");
      a.classList.add(`page${i + parseInt(firstPageNumber)}`);
      pagination.appendChild(a);
    }
    console.log(`.page${activePageNumber}`);
    const activePage = document.querySelector(`.page${activePageNumber}`);
    console.log(activePage);
    activePage.classList.add("active");
  }

  // 자신의 페이지 그룹 * 5 > totalPage 일 때
  if (pageGroup * 5 > totalPage) {
    console.log("두번째 규칙");
    for (let i = 0; i < totalPage - (pageGroup - 1) * 5; i++) {
      const a = document.createElement("a");
      a.textContent = i + parseInt(firstPageNumber);
      // a.setAttribute("href", `#`);
      a.classList.add("page");
      a.classList.add(`page${i + parseInt(firstPageNumber)}`);
      pagination.appendChild(a);
    }
    console.log(`.page${activePageNumber}`);
    const activePage = document.querySelector(`.page${activePageNumber}`);
    activePage.classList.add("active");
  }
  const arrowNext = document.createElement("a");
  arrowNext.className = "arrow next";
  // arrowNext.setAttribute("href", "#");
  const arrowNextIcon = document.createElement("i");
  arrowNextIcon.className = "fa-solid fa-angle-right";
  const arrowNnext = document.createElement("a");
  arrowNnext.className = "arrow nnext";
  // arrowNnext.setAttribute("href", "#");
  const arrowNnextIcon = document.createElement("i");
  arrowNnextIcon.className = "fa-solid fa-angles-right";
  pagination.appendChild(arrowNext);
  arrowNext.appendChild(arrowNextIcon);
  pagination.appendChild(arrowNnext);
  arrowNnext.appendChild(arrowNnextIcon);
}

function goToPage(keyword, pageNumber) {
  const searchUrl = `${URL_SEARCH_RESULT}${encodeURIComponent(
    keyword
  )}&page=${encodeURIComponent(pageNumber)}`;
  location.href = searchUrl;
}

// 페이지 버튼 생성 및 이동
const board = document.querySelector(".comment ul");
const pageButton = document.querySelector(".pagenation");
pageButton.addEventListener("click", async (event) => {
  const pagination = document.querySelector(".pagenation");
  // 현재 active 클래스를 가진 요소를 선택한다.
  let currentPage = document.querySelector(".active");
  console.log(currentPage);
  // 그 요소의 active 클래스를 제거한다.
  currentPage.classList.remove("active");
  // 기존 페이지의 게시글 제거
  //   while (board.hasChildNodes()) {
  //     board.removeChild(board.firstChild);
  //     console.log("지운다");
  //   }

  // 새로운 페이지의 게시글 불러오기
  // 타겟의 태그가 A라면
  if (event.target.tagName == "A") {
    console.log("스위치 page");
    event.target.classList.add("active");
    goToPage(keyword, event.target.innerText);
    return;
  }
  if (event.target.tagName == "I") {
    switch (event.target.className) {
      // 맨 앞 페이지로 이동
      case "fa-solid fa-angles-left": {
        console.log("pprev");
        while (pagination.hasChildNodes()) {
          pagination.removeChild(pagination.firstChild);
        }
        goToPage(keyword, 1);
        // makePagination(keyword, 1);
        // makeSearchResult(keyword, 1);
        break;
      }
      // 이전 페이지로 이동
      case "fa-solid fa-angle-left": {
        console.log("prev");
        let prePage = currentPage.previousSibling;
        console.log(`prePage.innerText : ${prePage.innerText}`);
        // 이전 페이지에 내용이 없는데, 현재 페이지가 1페이지라면
        if (!prePage.innerText && currentPage.innerText == 1) {
          while (pagination.hasChildNodes()) {
            pagination.removeChild(pagination.firstChild);
          }
          goToPage(keyword, 1);
          // makePagination(keyword, 1);
          // makeSearchResult(keyword, 1);
          break;
        }
        // 이전 페이지에 내용이 없다면,
        if (!prePage.innerText) {
          while (pagination.hasChildNodes()) {
            pagination.removeChild(pagination.firstChild);
          }
          goToPage(keyword, currentPage.innerText - 1);
          // makePagination(keyword, currentPage.innerText - 1);
          // makeSearchResult(keyword, currentPage.innerText - 1);
          break;
        }
        // 이전 페이지에 내용이 있다면,
        prePage.classList.add("active");
        goToPage(keyword, prePage.innerText);
        // makeSearchResult(keyword, prePage.innerText);
        break;
      }
      // 다음 페이지로 이동
      case "fa-solid fa-angle-right": {
        console.log("next");
        // 만약 현재 페이지가 5의 배수라면 다음 페이지 그룹으로 만든다.
        if (currentPage.innerText % 5 == 0) {
          console.log(
            `currentPage.innerText / 5 : ${Math.ceil(
              currentPage.innerText / 5
            )}`
          );
          while (pagination.hasChildNodes()) {
            pagination.removeChild(pagination.firstChild);
          }
          goToPage(keyword, Math.ceil(currentPage.innerText) + 1);
          // makePagination(keyword, Math.ceil(currentPage.innerText) + 1);
          // makeSearchResult(keyword, Math.ceil(currentPage.innerText) + 1);
          return;
        }
        // 현재 페이지가 5의 배수가 아니라면,
        let nextPage = currentPage.nextSibling;
        console.log(nextPage);
        console.log(`nextPage.innerText : ${nextPage.innerText}`);
        if (!nextPage.innerText) {
          console.log("다음 페이지가 없습니다.");
          currentPage.classList.add("active");
          goToPage(keyword, currentPage.innerText);
          // makeSearchResult(keyword, currentPage.innerText);
          break;
        }
        nextPage.classList.add("active");
        goToPage(keyword, nextPage.innerText);
        // makeSearchResult(keyword, nextPage.innerText);
        break;
      }
      // 마지막 페이지로 이동
      case "fa-solid fa-angles-right": {
        // 전체 데이터 수 가져오기
        const data = await getSearchResultCount(keyword);
        // 마지막 페이지수 구하기
        const lastPage = Math.ceil(data.length / 10);
        while (pagination.hasChildNodes()) {
          pagination.removeChild(pagination.firstChild);
        }
        goToPage(keyword, lastPage);
        // makePagination(keyword, lastPage);
        // makeSearchResult(keyword, lastPage);
        break;
      }
    }
  }
});

function logoutPopUp() {
  Swal.fire({
    text: "로그아웃 되었습니다.",
    timer: 2000,
  });
}
