// 아파트 정보 페이지
const href = window.location.href;
const parts = href.split("/");
const id = parts.pop().replace("?", "").replace("#", "");

let pageNumber = 1;

// URL 상수
const URL_APT = `http://localhost:443/info/${id}`;
const URL_APT_INFO = `http://localhost:8080/aptinfos/${id}`;
const URL_APT_PRICE = `http://localhost:8080/aptTransaction/recent-price/?`;
const URL_APT_POST = `http://localhost:8080/posts/by-aptname/?aptName=`;
const URL_APT_COMMENT = `http://localhost:8080/comments/getbyaptid/${id}`;
const URL_GET_POST_DETAIL = `http://localhost:443/post/`;
const URL_APT_COMMENT_PAGINATION = `http://localhost:8080/comments/getbyaptid/${id}/?page=`;
const URL_GET_APT_COMMENT_COUNT = `http://localhost:8080/comments/Countbyaptid/${id}`;
const URL_LOGOUT = "http://localhost:8080/users/logout";
const URL_LOGIN = `http://localhost:443/login`;
const URL_SEARCH_APT_INFO = "http://localhost:8080/aptinfos/aptname/?";
const URL_SEARCH_RESULT = `http://localhost:443/search-result/?keyword=`;
const URL_GET_IMAGE = `http://localhost:8080/`;
const URL_MAKE_COMMENT = "http://localhost:8080/comments";

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

document.addEventListener("DOMContentLoaded", getAptInfo());
document.addEventListener("DOMContentLoaded", getResentPrice());
document.addEventListener("DOMContentLoaded", getRelatedPost());
document.addEventListener("DOMContentLoaded", getAptComment(pageNumber));
document.addEventListener("DOMContentLoaded", makePagination(pageNumber));
const commentButton = document.querySelector(".comment-maker__button");
commentButton.addEventListener("click", makeComment);

//아파트 기본 정보 가져오기
async function getAptInfo() {
  const aptInfoTitle = document.querySelector(".apt-info__title");
  const households = document.querySelector(
    ".apt-info__subtitle :nth-child(1) :nth-child(1)"
  );
  const dong = document.querySelector(
    ".apt-info__subtitle :nth-child(1) :nth-child(2)"
  );
  const approvalDate = document.querySelector(
    ".apt-info__subtitle :nth-child(2) :nth-child(1)"
  );

  const response = await fetch(URL_APT_INFO, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response["status"] == 404) {
    return;
  }
  const data = await response.json();
  const i = 0;
  aptInfoTitle.innerHTML = data[i]["name"];
  households.innerHTML = `세대수 : ${data[i]["households_count"]}세대`;
  dong.innerHTML = `/ 동수 : ${data[i]["all_dong_count"]}동`;
  approvalDate.innerHTML = `사용승인일 : '${data[i]["approval_date"]}`;
  return [data[i]["name"], data[i]["adress_dong"], data[i]["address"]];
}

//아파트 최근 가격 정보 가져오기
async function getResentPrice() {
  const aptInfo = await getAptInfo();
  const aptName = aptInfo[0];
  const dong = aptInfo[1];
  const aptPrice = document.querySelector(
    ".apt-info__price :nth-child(2) .content"
  );
  const aptPriceDetail = document.querySelector(
    ".apt-info__price :nth-child(2) .content-sub"
  );
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
    aptPrice.innerHTML = `최근 거래 내역 없음`;
    aptPriceDetail.innerHTML = `업데이트 예정`;
  }
  const data = await response.json();
  const i = 0;
  aptPrice.innerHTML = `${parseInt(data[i]["거래금액"]) / 10}억원`;
  aptPriceDetail.innerHTML = `${data[i]["년"]}.${data[i]["월"]}.${data[i]["일"]}, ${data[i]["층"]}층, ${data[i]["전용면적"]}m^2`;
}

//아파트 관련 게시글 가져오기
async function getRelatedPost() {
  const postList = document.querySelector(".apt-info__posts .content");
  const aptInfo = await getAptInfo();
  const response = await fetch(
    `${URL_APT_POST}${encodeURIComponent(aptInfo[0])}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  if (data.length > 5) {
    for (let i = 0; i < 5; i++) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      if (data[i]["title"]) {
      }
      a.textContent = data[i]["title"];
      a.setAttribute("href", `${URL_GET_POST_DETAIL}${data[i]["id"]}`);
      postList.appendChild(li);
      li.appendChild(a);
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      if (data[i]["title"]) {
      }
      a.textContent = data[i]["title"];
      a.setAttribute("href", `${URL_GET_POST_DETAIL}${data[i]["id"]}`);
      postList.appendChild(li);
      li.appendChild(a);
    }
  }
}

// 댓글 총개수 파악하기
async function getAptCommentCount() {
  const response = await fetch(URL_GET_APT_COMMENT_COUNT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}

// 댓글 불러오기 (아파트 관련) (페이지네이션)
async function getAptComment(pageNumber) {
  const response = await fetch(
    `${URL_APT_COMMENT_PAGINATION}${encodeURIComponent(pageNumber)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  // 총 댓글 개수를 가져와서 textContent에 할당한다.
  const rawCommentCountData = await getAptCommentCount();
  const commentCountData = rawCommentCountData[0]["count(*)"];
  const commentCount = document.querySelector(".comment h4 span");
  const commentWrapper = document.querySelector(".comment ul");
  commentCount.textContent = commentCountData;
  // 가져온 댓글 데이터 개수에 맞게, 댓글을 생성한다.
  for (let i = 0; i < data.length; i++) {
    const li = document.createElement("li");
    const profileDiv = document.createElement("div");
    profileDiv.className = "comment__user-profile-image";
    const profileImg = document.createElement("img");
    profileImg.src = `${URL_GET_IMAGE}${data[i]["image"]}`;
    commentWrapper.appendChild(li);
    const commentDiv = document.createElement("div");
    commentDiv.className = "comment__wrapper";
    const commentContent = document.createElement("div");
    commentContent.className = "comment__content";
    commentContent.textContent = data[i]["content"];
    const commentInfo = document.createElement("div");
    commentInfo.className = "comment__writer";
    const commentWriter = document.createElement("span");
    const commentCreatedTime = document.createElement("span");
    commentWriter.textContent = data[i]["user_id"];
    commentCreatedTime.textContent = ` / ${data[i]["datetime_updated"]}`;
    li.appendChild(profileDiv);
    profileDiv.appendChild(profileImg);
    li.appendChild(commentDiv);
    commentDiv.appendChild(commentContent);
    li.appendChild(commentInfo);
    commentInfo.appendChild(commentWriter);
    commentInfo.appendChild(commentCreatedTime);
  }
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
  const response = await fetch(URL_GET_APT_COMMENT_COUNT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  });
  const data = await response.json();
  // 만약 총 게시글이 5개 이하이면 페이지 네이션을 만들지 않는다.
  if (data[0]["count(*)"] < 5) {
    return;
  }
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
  // 전체 페이지를 totalPage 변수에 넣는다.
  const totalPage = Math.ceil(data[0]["count(*)"] / 5);

  // 자신의 페이지 그룹 * 5 <= totalPage 일 때
  if (pageGroup * 5 <= totalPage) {
    for (let i = 0; i < 5; i++) {
      const a = document.createElement("a");
      a.textContent = i + firstPageNumber;
      // a.setAttribute("href", `#`);
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
      // a.setAttribute("href", `#`);
      a.classList.add("page");
      a.classList.add(`page${i + firstPageNumber}`);
      pagination.appendChild(a);
    }
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

// 페이지 버튼 생성 및 이동
const board = document.querySelector(".comment ul");
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
    getAptComment(event.target.innerText);
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
        getAptComment(1);
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
          getAptComment(1);
          break;
        }
        // 이전 페이지에 내용이 없다면,
        if (!prePage.innerText) {
          while (pagination.hasChildNodes()) {
            pagination.removeChild(pagination.firstChild);
          }
          makePagination(currentPage.innerText - 1);
          getAptComment(currentPage.innerText - 1);
          break;
        }
        // 이전 페이지에 내용이 있다면,
        prePage.classList.add("active");
        getAptComment(prePage.innerText);
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
          getAptComment(Math.ceil(currentPage.innerText) + 1);
          return;
        }
        // 현재 페이지가 5의 배수가 아니라면,
        nextPage = currentPage.nextSibling;
        if (!nextPage.innerText) {
          currentPage.classList.add("active");
          getAptComment(currentPage.innerText);
          break;
        }
        nextPage.classList.add("active");
        getAptComment(nextPage.innerText);
        break;
      }
      // 마지막 페이지로 이동
      case "fa-solid fa-angles-right": {
        // 전체 데이터 수 가져오기
        const totalData = await getAptCommentCount();
        // 마지막 페이지수 구하기
        const lastPage = Math.ceil(totalData[0]["count(*)"] / 5);
        while (pagination.hasChildNodes()) {
          pagination.removeChild(pagination.firstChild);
        }
        makePagination(lastPage);
        getAptComment(lastPage);
        break;
      }
    }
  }
});

// 댓글 등록(아파트 정보 페이지에서)
async function makeComment() {
  const comment = {
    content: document.querySelector("textarea").value,
    apt_id: id,
  };
  // TODO : 파일에 입력하도록.. 만들기
  // 백엔드로 연결하지말고, 파일에 입력시키도록
  const response = await fetch(URL_MAKE_COMMENT, {
    method: "post", // POST 요청을 보낸다.
    body: JSON.stringify(comment), // comment JS 객체를 JSON으로 변경하여 보냄
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response["status"] == 201) {
    commentSuccessPopUp();
    setTimeout(() => {
      location.href = URL_APT;
    }, 1000);
    return;
  }
  commentFailPopUp();
  return;
}

function logoutPopUp() {
  Swal.fire({
    text: "로그아웃 되었습니다.",
    timer: 2000,
  });
}

function commentSuccessPopUp() {
  Swal.fire({
    text: "댓글이 작성 되었습니다.",
    timer: 2000,
  });
}

function commentFailPopUp() {
  Swal.fire({
    text: "로그인이 필요합니다.",
    timer: 2000,
  });
}
