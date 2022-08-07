// 자유 게시판 페이지
// URL 상수 (개발)
// const URL_FREEBOARD = "http://localhost:8080/freeboard/";
// const URL_GET_ALL_POST = "http://localhost:8080/posts/lists?page=";
// const URL_POST_COUNT = "http://localhost:8080/posts/all";
// const URL_GET_POST = `http://localhost:8080/posts/`;
// const URL_GET_POST_DETAIL = `http://localhost:443/post/`;
// const URL_LOGOUT = "http://localhost:8080/users/logout";
// const URL_LOGIN = `http://localhost:443/login`;
// const URL_MAKE_POST = "http://localhost:443/make-post";
// const URL_SEARCH_RESULT = "http://localhost:443/search-result/?keyword=";

// URL 상수 (배포)
const URL_FREEBOARD = "https://api.realestatewiki.kr/freeboard/";
const URL_GET_ALL_POST = "https://api.realestatewiki.kr/posts/lists?page=";
const URL_POST_COUNT = "https://api.realestatewiki.kr/posts/all";
const URL_GET_POST = `https://api.realestatewiki.kr/posts/`;
const URL_GET_POST_DETAIL = `https://realestatewiki.kr/post/`;
const URL_LOGOUT = "https://api.realestatewiki.kr/users/logout";
const URL_LOGIN = `https://realestatewiki.kr/login`;
const URL_MAKE_POST = "https://realestatewiki.kr/make-post";
const URL_SEARCH_RESULT = "https://realestatewiki.kr/search-result/?keyword=";

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

// 페이지 당 컨텐츠 수
const CONTENTS_PER_PAGE = 20;
let pageNumber = 1;
const board = document.querySelector(".board__content");

document.addEventListener("DOMContentLoaded", getAllPost(pageNumber));
document.addEventListener("DOMContentLoaded", makePagination(1));

// 자유게시판 게시글 불러오기
async function getAllPost(pageNumber) {
  const response = await fetch(
    `${URL_GET_ALL_POST}${encodeURIComponent(pageNumber)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  for (let i = 0; i < data.length; i++) {
    const li = document.createElement("li");
    const post = document.createElement("div");
    const postTitleWrapper = document.createElement("div");
    postTitleWrapper.className = "board__content-title";
    const postTitle = document.createElement("a");
    postTitle.textContent = data[i]["title"];
    postTitle.classList.add(`id${data[i]["id"]}`);
    postTitle.setAttribute("href", `${URL_GET_POST_DETAIL}${data[i]["id"]}`);
    const postSubtitleWrapper = document.createElement("div");
    postSubtitleWrapper.className = "board__content-info";
    const postWriter = document.createElement("span");
    const postCreated = document.createElement("span");
    const postViews = document.createElement("span");
    const postRecomended = document.createElement("span");
    postWriter.textContent = data[i]["user_Id"];
    postCreated.textContent = ` / ${data[i]["datetime_updated"]}`;
    postViews.textContent = ` / 조회수 : ${data[i]["views"]}`;
    // postRecomended.textContent = ` / 추천수 : ${data[i]["recommended_number"]}`;
    const commentCountWrapper = document.createElement("div");
    commentCountWrapper.className = "board__content-likes";
    const commentCount = document.createElement("span");
    commentCount.textContent = data[i]["comments_count"];
    board.appendChild(li);
    li.appendChild(post);
    post.appendChild(postTitleWrapper);
    postTitleWrapper.appendChild(postTitle);
    post.appendChild(postSubtitleWrapper);
    postSubtitleWrapper.appendChild(postWriter);
    postSubtitleWrapper.appendChild(postCreated);
    postSubtitleWrapper.appendChild(postViews);
    postSubtitleWrapper.appendChild(postRecomended);
    li.appendChild(commentCountWrapper);
    commentCountWrapper.appendChild(commentCount);
  }
}

// 모든 데이터 가져오기
async function getDataCount() {
  const response = await fetch(URL_POST_COUNT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}

//페이지네이션 생성
async function makePagination(page) {
  // 활성화해야할 페이지
  let activePageNumber = page;
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
  // 컨텐츠 개수 가져오기
  const response = await fetch(URL_POST_COUNT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  // 만약 총 게시글이 21개 이하이면 페이지 네이션을 만들지 않는다.
  if (data[0]["count(*)"] < 21) {
    return;
  }
  const arrowPprev = document.createElement("a");
  arrowPprev.className = "arrow pprev";
  arrowPprev.setAttribute("href", "#");
  const arrowPprevIcon = document.createElement("i");
  arrowPprevIcon.className = "fa-solid fa-angles-left";
  const arrowPrev = document.createElement("a");
  arrowPrev.className = "arrow prev";
  arrowPrev.setAttribute("href", "#");
  const arrowPrevIcon = document.createElement("i");
  arrowPrevIcon.className = "fa-solid fa-angle-left";
  pagination.appendChild(arrowPprev);
  arrowPprev.appendChild(arrowPprevIcon);
  pagination.appendChild(arrowPrev);
  arrowPrev.appendChild(arrowPrevIcon);
  // 전체 페이지를 totalPage 변수에 넣는다.
  const totalPage = Math.ceil(data[0]["count(*)"] / CONTENTS_PER_PAGE);

  // 자신의 페이지 그룹 * 5 <= totalPage 일 때
  if (pageGroup * 5 <= totalPage) {
    for (let i = 0; i < 5; i++) {
      const a = document.createElement("a");
      a.textContent = i + firstPageNumber;
      a.setAttribute("href", `#`);
      a.classList.add("page");
      a.classList.add(`page${i + firstPageNumber}`);
      pagination.appendChild(a);
    }
    const activePage = document.querySelector(`.page${activePageNumber}`);
    activePage.classList.add("active");
  }

  // 자신의 페이지 그룹 * 5 > totalPage 일 때
  if (pageGroup * 5 > totalPage) {
    for (let i = 0; i < totalPage - (pageGroup - 1) * 5; i++) {
      const a = document.createElement("a");
      a.textContent = i + firstPageNumber;
      a.setAttribute("href", `#`);
      a.classList.add("page");
      a.classList.add(`page${i + firstPageNumber}`);
      pagination.appendChild(a);
    }
    const activePage = document.querySelector(`.page${activePageNumber}`);
    activePage.classList.add("active");
  }
  const arrowNext = document.createElement("a");
  arrowNext.className = "arrow next";
  arrowNext.setAttribute("href", "#");
  const arrowNextIcon = document.createElement("i");
  arrowNextIcon.className = "fa-solid fa-angle-right";
  const arrowNnext = document.createElement("a");
  arrowNnext.className = "arrow nnext";
  arrowNnext.setAttribute("href", "#");
  const arrowNnextIcon = document.createElement("i");
  arrowNnextIcon.className = "fa-solid fa-angles-right";
  pagination.appendChild(arrowNext);
  arrowNext.appendChild(arrowNextIcon);
  pagination.appendChild(arrowNnext);
  arrowNnext.appendChild(arrowNnextIcon);
}

// 페이지 버튼 생성 및 이동
const pageButton = document.querySelector(".pagenation");
pageButton.addEventListener("click", async (event) => {
  const pagination = document.querySelector(".pagenation");
  // 현재 active 클래스를 가진 요소를 선택한다.
  currentPage = document.querySelector(".active");
  // 그 요소의 active 클래스를 제거한다.
  currentPage.classList.remove("active");
  // 기존 페이지의 게시글 제거
  while (board.hasChildNodes()) {
    board.removeChild(board.firstChild);
  }

  // 새로운 페이지의 게시글 불러오기
  // 타겟의 태그가 A라면
  if (event.target.tagName == "A") {
    event.target.classList.add("active");
    getAllPost(event.target.innerText);
    return;
  }
  if (event.target.tagName == "I") {
    switch (event.target.className) {
      // 맨 앞 페이지로 이동
      case "fa-solid fa-angles-left": {
        while (pagination.hasChildNodes()) {
          pagination.removeChild(pagination.firstChild);
        }
        makePagination(1);
        getAllPost(1);
        break;
      }
      // 이전 페이지로 이동
      case "fa-solid fa-angle-left": {
        prePage = currentPage.previousSibling;
        // 이전 페이지에 내용이 없는데, 현재 페이지가 1페이지라면
        if (!prePage.innerText && currentPage.innerText == 1) {
          while (pagination.hasChildNodes()) {
            pagination.removeChild(pagination.firstChild);
          }
          makePagination(1);
          getAllPost(1);
          break;
        }
        // 이전 페이지에 내용이 없다면,
        if (!prePage.innerText) {
          while (pagination.hasChildNodes()) {
            pagination.removeChild(pagination.firstChild);
          }
          makePagination(currentPage.innerText - 1);
          getAllPost(currentPage.innerText - 1);
        }
        prePage.classList.add("active");
        getAllPost(prePage.innerText);
        break;
      }
      // 다음 페이지로 이동
      case "fa-solid fa-angle-right": {
        // 만약 현재 페이지가 5의 배수라면 다음 페이지 그룹으로 만든다.
        if (currentPage.innerText % 5 == 0) {
          while (pagination.hasChildNodes()) {
            pagination.removeChild(pagination.firstChild);
          }
          makePagination(Math.ceil(currentPage.innerText) + 1);
          getAllPost(Math.ceil(currentPage.innerText) + 1);
          return;
        }
        // 현재 페이지가 5의 배수가 아니라면,
        nextPage = currentPage.nextSibling;
        if (!nextPage.innerText) {
          currentPage.classList.add("active");
          getAllPost(currentPage.innerText);
          break;
        }
        nextPage.classList.add("active");
        getAllPost(nextPage.innerText);
        break;
      }
      // 마지막 페이지로 이동
      case "fa-solid fa-angles-right": {
        // 전체 데이터 수 가져오기
        const totalData = await getDataCount();
        // 마지막 페이지수 구하기
        const lastPage = Math.ceil(
          totalData[0]["count(*)"] / CONTENTS_PER_PAGE
        );
        while (pagination.hasChildNodes()) {
          pagination.removeChild(pagination.firstChild);
        }
        makePagination(lastPage);
        getAllPost(lastPage);
        break;
      }
    }
  }
});

const boardContent = document.querySelector(".board__content");
boardContent.addEventListener("click", (event) => {
  if (event.target.tagName == "A") {
    const className = event.target.className;
    const postId = className.replace("id", "");
  }
});

const makePostButton = document.querySelector(".board__button-make-post");
makePostButton.addEventListener("click", goToMakePostPage);

function goToMakePostPage() {
  location.href = URL_MAKE_POST;
}

function logoutPopUp() {
  Swal.fire({
    text: "로그아웃 되었습니다.",
    timer: 2000,
  });
}
