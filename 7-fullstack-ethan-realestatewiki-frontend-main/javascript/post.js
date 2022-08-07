const href = window.location.href;
const parts = href.split("/");
const id = parts.pop().replace("?", "");

const URL_GET_POST = `https://api.realestatewiki.kr/posts/${id}`;
const URL_GET_COMMENT = `https://api.realestatewiki.kr/comments/getbypostid/${id}/?page=`;
const URL_GET_POST_COMMENT_COUNT = `https://api.realestatewiki.kr/comments/Countbypostid/${id}`;
const URL_POST = `https://realestatewiki.kr/post/${id}`;
const URL_LOGOUT = "https://api.realestatewiki.kr/users/logout";
const URL_LOGIN = `https://realestatewiki.kr/login`;
const URL_CORRECT_POST = "https://realestatewiki.kr/update-post/";
const URL_DELETE_POST = `https://api.realestatewiki.kr/posts/${id}`;
const URL_DELETE_RELATED_POST_COMMENT = `https://api.realestatewiki.kr/comments/commentinpost/all-comment-in-post/${id}`;
const URL_FREEBOARD = `https://realestatewiki.kr/freeboard`;
const URL_DELETE_COMMENT =
  "https://api.realestatewiki.kr/comments/commentinpost/";
const URL_UPDATE_COMMENT = `https://api.realestatewiki.kr/comments/commentinpost/`;
const URL_GET_IMAGE = `https://api.realestatewiki.kr/`;
const URL_MAKE_APT_COMMENT = "https://api.realestatewiki.kr/comments";
const URL_GO_TO_POST = "https://realestatewiki.kr/post/";

let pageNumber = 1;

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

// 자유 게시판 페이지
document.addEventListener("DOMContentLoaded", getPost());
document.addEventListener("DOMContentLoaded", getComment(pageNumber));
document.addEventListener("DOMContentLoaded", makePagination(pageNumber));

async function getPost() {
  const response = await fetch(URL_GET_POST, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await response.json();
  if (getCookie("user_id") != data[0]["user_id"]) {
    const postDeleteButton = document.querySelector(".post__button-delete");
    const postCorrectButton = document.querySelector(".post__button-correct");
    postDeleteButton.style.display = "none";
    postCorrectButton.style.display = "none";
  }
  const title = document.querySelector(".post__content__wrapper h3");
  title.innerHTML = data[0]["title"];
  const content = document.querySelector(".post__content__wrapper p");
  content.textContent = data[0]["content"];
  const profileImg = document.querySelector(
    "#wrapper > section > section > div.post__content__wrapper > div > div.post__imoticon > div.post__profile-picture > img"
  );
  profileImg.src = `${URL_GET_IMAGE}${data[0]["image"]}`;
  const userName = document.querySelector(
    ".post__profile-information span span"
  );
  userName.innerHTML = data[0]["user_id"];
  const createdDate = document.querySelector(
    ".post__imoticon :nth-child(2) :nth-child(2) :nth-child(1) span"
  );
  createdDate.textContent = data[0]["datetime_updated"];
  const views = document.querySelector(
    ".post__imoticon :nth-child(2) :nth-child(2) :nth-child(2) span"
  );
  views.textContent = data[0]["views"];
  const recommended_number = document.querySelector(
    ".post__imoticon :nth-child(2) :nth-child(2) :nth-child(3) span"
  );
  recommended_number.textContent = data[0]["recommended_number"];
}

// 댓글 총개수를 파악하기
async function getPostCommentCount() {
  const response = await fetch(URL_GET_POST_COMMENT_COUNT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}

// 댓글 불러오기 (게시글 관련) (페이지네이션)
async function getComment(pageNumber) {
  // 댓글 데이터를 불러온다. (페이지 번호를 함께 요청)
  const response = await fetch(`${URL_GET_COMMENT}${pageNumber}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  // 총 댓글 개수를 가져와서 textContent에 할당한다.
  const rawCommentCountData = await getPostCommentCount();
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
    const commentWrapperWrapper = document.createElement("div");
    commentWrapperWrapper.className = "comment__wrapper-wrapper";
    const commentDiv = document.createElement("div");
    commentDiv.className = "comment__wrapper";
    const commentContent = document.createElement("div");
    commentContent.className = "comment__content";
    commentContent.textContent = data[i]["content"];
    const commentInfo = document.createElement("div");
    commentInfo.className = "comment__writer";
    const commentWriter = document.createElement("span");
    const commentCreatedTime = document.createElement("span");
    const commentWriterId = document.createElement("span");
    const commentId = document.createElement("span");
    const postId = document.createElement("span");
    commentWriter.textContent = data[i]["user_id"];
    commentCreatedTime.textContent = ` / ${data[i]["datetime_updated"]}`;
    commentWriterId.textContent = `${data[i]["user_index"]}`;
    commentId.textContent = `${data[i]["id"]}`;
    postId.textContent = `${data[i]["post_id"]}`;
    const updateButton = document.createElement("button");
    updateButton.className = "comment__button-correct";
    updateButton.type = "button";
    const updateButtonIcon = document.createElement("i");
    updateButtonIcon.className = "fa-solid fa-pencil";
    const deleteButton = document.createElement("button");
    deleteButton.className = "comment__button-delete";
    deleteButton.type = "button";
    const deleteButtonIcon = document.createElement("i");
    deleteButtonIcon.className = "fa-solid fa-trash-can";
    li.appendChild(profileDiv);
    profileDiv.appendChild(profileImg);
    li.appendChild(commentWrapperWrapper);
    // li.appendChild(commentDiv);
    commentDiv.appendChild(commentContent);
    // li.appendChild(commentInfo);
    commentWrapperWrapper.appendChild(commentDiv);
    commentWrapperWrapper.appendChild(commentInfo);
    commentInfo.appendChild(commentWriter);
    commentInfo.appendChild(commentCreatedTime);
    commentInfo.appendChild(commentWriterId);
    commentInfo.appendChild(commentId);
    commentInfo.appendChild(postId);
    updateButton.appendChild(updateButtonIcon);
    deleteButton.appendChild(deleteButtonIcon);
    commentInfo.appendChild(updateButton);
    commentInfo.appendChild(deleteButton);
    const textArea = document.createElement("input");
    textArea.className = "comment-update-textarea";
    textArea.value = data[i]["content"];
    commentWrapperWrapper.appendChild(textArea);
    const buttonWrapper = document.createElement("div");
    buttonWrapper.className = "update-button-wrapper";
    const textUpdatebutton = document.createElement("button");
    textUpdatebutton.className = "comment-update-button";
    textUpdatebutton.type = "button";
    const textUpdatebuttonIcon = document.createElement("i");
    textUpdatebuttonIcon.className = "fa-solid fa-check";
    textUpdatebutton.appendChild(textUpdatebuttonIcon);
    const updatecancelbutton = document.createElement("button");
    updatecancelbutton.className = "comment-update-button";
    const updatecancelbuttonIcon = document.createElement("i");
    updatecancelbuttonIcon.className = "fa-solid fa-x";
    updatecancelbutton.type = "button";
    updatecancelbutton.appendChild(updatecancelbuttonIcon);
    commentWrapperWrapper.appendChild(buttonWrapper);
    buttonWrapper.appendChild(textUpdatebutton);
    buttonWrapper.appendChild(updatecancelbutton);
    textArea.style.display = "none";
    buttonWrapper.style.display = "none";
    if (getCookie("user_id") != data[i]["user_id"]) {
      updateButton.style.display = "none";
      deleteButton.style.display = "none";
    }
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
  const response = await fetch(URL_GET_POST_COMMENT_COUNT, {
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
    getComment(event.target.innerText);
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
        getComment(1);
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
          getComment(1);
          break;
        }
        // 이전 페이지에 내용이 없다면,
        if (!prePage.innerText) {
          while (pagination.hasChildNodes()) {
            pagination.removeChild(pagination.firstChild);
          }
          makePagination(currentPage.innerText - 1);
          getComment(currentPage.innerText - 1);
          break;
        }
        // 이전 페이지에 내용이 있다면,
        prePage.classList.add("active");
        getComment(prePage.innerText);
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
          getComment(Math.ceil(currentPage.innerText) + 1);
          return;
        }
        // 현재 페이지가 5의 배수가 아니라면,
        nextPage = currentPage.nextSibling;
        if (!nextPage.innerText) {
          currentPage.classList.add("active");
          getComment(currentPage.innerText);
          break;
        }
        nextPage.classList.add("active");
        getComment(nextPage.innerText);
        break;
      }
      // 마지막 페이지로 이동
      case "fa-solid fa-angles-right": {
        // 전체 데이터 수 가져오기
        const totalData = await getPostCommentCount();
        // 마지막 페이지수 구하기
        const lastPage = Math.ceil(totalData[0]["count(*)"] / 5);
        while (pagination.hasChildNodes()) {
          pagination.removeChild(pagination.firstChild);
        }
        makePagination(lastPage);
        getComment(lastPage);
        break;
      }
    }
  }
});

const commentButton = document.querySelector(".comment-maker__button");
commentButton.addEventListener("click", makeComment);

// 댓글 등록(아파트 정보 페이지에서)
async function makeComment() {
  const comment = {
    content: document.querySelector("textarea").value,
    post_id: id,
  };

  // 백엔드로 연결하지말고, 파일에 입력시키도록
  const response = await fetch(URL_MAKE_APT_COMMENT, {
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
      location.href = URL_POST;
    }, 1000);
    return;
  }
  commentFailPopUp();
  return;
}

const postCorrectButton = document.querySelector(".post__button-correct");
postCorrectButton.addEventListener("click", goToCorrectPost);
function goToCorrectPost() {
  location.href = `${URL_CORRECT_POST}${id}`;
}

const postDeleteButton = document.querySelector(".post__button-delete");
postDeleteButton.addEventListener("click", deletePostPopUp);

async function deletePostPopUp() {
  Swal.fire({
    title: "게시글을 삭제하시겠습니까?",
    text: "삭제된 게시글은 복구되지 않습니다.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
  }).then(async function (result) {
    if (result.isConfirmed) {
      const response = await fetch(URL_DELETE_POST, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response["status"] == 204) {
        deletePostSuccessPopUp();
        setTimeout(() => {
          location.href = URL_FREEBOARD;
        }, 1000);
        // }
      }
      return;
    } else {
      return;
    }
  });
}

// 댓글 수정, 삭제 버튼
const commentBtn = document.querySelector(".comment ul");
commentBtn.addEventListener("click", update);

async function update(event) {
  if (event.target.className == "fa-solid fa-pencil") {
    const userId =
      event.target.parentElement.parentElement.firstChild.nextSibling
        .nextSibling.innerHTML;
    const commentId =
      event.target.parentElement.parentElement.firstChild.nextSibling
        .nextSibling.nextSibling.innerHTML;
    const commentArea = event.target.parentElement.parentElement.parentElement;
    const contentArea = commentArea.firstChild;
    const contentInfoArea = commentArea.firstChild.nextSibling;
    const contentUpdateArea = commentArea.firstChild.nextSibling.nextSibling;
    const contentUpdateButtonArea =
      commentArea.firstChild.nextSibling.nextSibling.nextSibling;

    contentArea.style.display = "none";
    contentInfoArea.style.display = "none";
    contentUpdateArea.style.display = "block";
    contentUpdateButtonArea.style.display = "block";
  }
  if (event.target.className == "fa-solid fa-trash-can") {
    const userId =
      event.target.parentElement.parentElement.firstChild.nextSibling
        .nextSibling.innerHTML;
    const commentId =
      event.target.parentElement.parentElement.firstChild.nextSibling
        .nextSibling.nextSibling.innerHTML;
    const postId =
      event.target.parentElement.parentElement.firstChild.nextSibling
        .nextSibling.nextSibling.nextSibling.innerHTML;
    const response = await fetch(`${URL_DELETE_COMMENT}${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response["status"] == 204) {
      deleteCommentSuccessPopUp();
      setTimeout(() => {
        location.href = `${URL_GO_TO_POST}${postId}`;
      }, 1000);
      // }
    }
    return;
  }
  if (event.target.className == "fa-solid fa-check") {
    const userId =
      event.target.parentElement.parentElement.parentElement.firstChild
        .nextSibling.firstChild.nextSibling.nextSibling.innerHTML;
    const commentId =
      event.target.parentElement.parentElement.parentElement.firstChild
        .nextSibling.firstChild.nextSibling.nextSibling.nextSibling.innerHTML;
    const postId =
      event.target.parentElement.parentElement.parentElement.firstChild
        .nextSibling.firstChild.nextSibling.nextSibling.nextSibling.nextSibling
        .innerHTML;
    const contentUpdateArea =
      event.target.parentElement.parentElement.parentElement.firstChild
        .nextSibling.nextSibling;
    const updateCommentUrl = `${URL_UPDATE_COMMENT}${commentId}`;
    const comment = {
      content: contentUpdateArea.value,
    };
    const response = await fetch(updateCommentUrl, {
      method: "put", // POST 요청을 보낸다.
      body: JSON.stringify(comment), // comment JS 객체를 JSON으로 변경하여 보냄
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response["status"] == 201) {
      updateCommentSuccessPopUp();
      setTimeout(() => {
        location.href = `${URL_GO_TO_POST}${postId}`;
      }, 1000);
      return;
    }
    if (response["status"] == 401) {
      LoginRequiredPopUp();
      return;
    }
    if (response["status"] == 204) {
      noChangePopUp();
      return;
    }
    updateFailPopUp();
    return;

    window.alert("확인");
  }
  if (event.target.className == "fa-solid fa-x") {
    const commentArea = event.target.parentElement.parentElement.parentElement;
    const contentArea = commentArea.firstChild;
    const contentInfoArea = commentArea.firstChild.nextSibling;
    const contentUpdateArea = commentArea.firstChild.nextSibling.nextSibling;
    const contentUpdateButtonArea =
      commentArea.firstChild.nextSibling.nextSibling.nextSibling;
    contentArea.style.display = "block";
    contentInfoArea.style.display = "block";
    contentUpdateArea.style.display = "none";
    contentUpdateButtonArea.style.display = "none";
  }
}

function deleteCommentSuccessPopUp() {
  Swal.fire({
    text: "댓글이 삭제되었습니다.",
    timer: 2000,
  });
}

function updateCommentSuccessPopUp() {
  Swal.fire({
    text: "댓글이 수정되었습니다.",
    timer: 2000,
  });
}

function LoginRequiredPopUp() {
  Swal.fire({
    text: "로그인이 필요합니다.",
    timer: 2000,
  });
}

function noChangePopUp() {
  Swal.fire({
    text: "수정된 내용이 없습니다.",
    timer: 2000,
  });
}

function updateFailPopUp() {
  Swal.fire({
    text: "댓글 수정이 실패했습니다. 관리자에게 문의해주세요.",
    timer: 2000,
  });
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

function deletePostSuccessPopUp() {
  Swal.fire({
    text: "게시글이 삭제되었습니다.",
    timer: 2000,
  });
}
