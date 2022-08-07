const URL_LOGOUT = "http://localhost:8080/users/logout";
const URL_LOGIN = `http://localhost:443/login`;
const URL_HOME = "http://localhost:443";
const URL_GET_MY_POST_COUNT = "http://localhost:8080/posts/user-post/count";
const URL_GET_MY_POST_COMMENT =
  "http://localhost:8080/comments/getbyuserIndex/post-comment";
const URL_GET_MY_APT_COMMENT =
  "http://localhost:8080/comments/getbyuserIndex/apt-comment";
const URL_GET_POST = "http://localhost:443/post/";
const URL_GET_APT_INFO = "http://localhost:443/info/";

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

// 로그인 되어 있지 않을 때, 홈화면으로 돌아가기

if (!getCookie("LoginSession")) {
  loginRequiredPopUp();
  setTimeout(() => {
    location.href = URL_HOME;
  });
}

document.addEventListener("DOMContentLoaded", getMyPost);
document.addEventListener("DOMContentLoaded", getMyPostComment);
document.addEventListener("DOMContentLoaded", getMyAptComment);

async function getMyPost() {
  const myPostList = document.querySelector(".myposts__items");
  const response = await fetch(
    `${URL_GET_MY_POST_COUNT}`,
    // userId=${encodeURIComponent(userId)}
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  if (response["status"] == 404) {
    const totalPostCount = document.querySelector(".myposts__info > span > b");
    totalPostCount.textContent = 0;
    return;
  }
  const data = await response.json();
  const totalPostCount = document.querySelector(".myposts__info > span > b");
  totalPostCount.textContent = `${data.length}`;
  for (let i = 0; i < data.length; i++) {
    const item = document.createElement("li");
    const postTitle = document.createElement("a");
    postTitle.className = "myposts__title";
    postTitle.textContent = data[i]["title"];
    postTitle.setAttribute("href", `${URL_GET_POST}${data[i]["id"]}`);
    const postInfo = document.createElement("div");
    postInfo.className = "myposts__sub-detail";
    const dateIcon = document.createElement("i");
    dateIcon.className = "fa-regular fa-calendar-days";
    const postInfoDate = document.createElement("span");
    postInfoDate.textContent = data[i]["datetime_created"];
    const viewsIcon = document.createElement("i");
    viewsIcon.className = "fa-regular fa-eye";
    const postInfoviews = document.createElement("span");
    postInfoviews.textContent = data[i]["views"];
    const commentsIcon = document.createElement("i");
    commentsIcon.className = "fa-regular fa-comment-dots";
    const postInfocomments = document.createElement("span");
    postInfocomments.textContent = data[i]["comments_enabled"];
    const recommendsIcon = document.createElement("i");
    recommendsIcon.className = "fa-solid fa-thumbs-up";
    const postInforecommends = document.createElement("span");
    postInforecommends.textContent = data[i]["recommended_number"];
    myPostList.append(item);
    item.append(postTitle);
    item.append(postInfo);
    postInfo.append(dateIcon);
    postInfo.append(postInfoDate);
    postInfo.append(viewsIcon);
    postInfo.append(postInfoviews);
    postInfo.append(commentsIcon);
    postInfo.append(postInfocomments);
    postInfo.append(recommendsIcon);
    postInfo.append(postInforecommends);
  }
}

// 작성한 댓글 보기

async function getMyPostComment() {
  const myPostCommentList = document.querySelector(".myPostcomments__items");
  const response = await fetch(`${URL_GET_MY_POST_COMMENT}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response["status"] == 404) {
    const totalPostCount = document.querySelector(
      ".myPostcomments__info > span > b"
    );
    totalPostCount.textContent = 0;
    return;
  }
  const data = await response.json();
  const totalPostCount = document.querySelector(
    ".myPostcomments__info > span > b"
  );
  totalPostCount.textContent = `${data.length}`;

  for (let i = 0; i < data.length; i++) {
    const item = document.createElement("li");
    const postCommentTitle = document.createElement("a");
    postCommentTitle.className = "myPostcomments__title";
    postCommentTitle.textContent = data[i]["content"];
    postCommentTitle.setAttribute(
      "href",
      `${URL_GET_POST}${data[i]["post_id"]}`
    );
    const postCommentInfo = document.createElement("div");
    postCommentInfo.className = "myPostcomments__sub-detail";
    const postCommentdateIcon = document.createElement("i");
    postCommentdateIcon.className = "fa-regular fa-calendar-days";
    const postCommentInfoDate = document.createElement("span");
    postCommentInfoDate.textContent = data[i]["datetime_updated"];
    myPostCommentList.append(item);
    item.append(postCommentTitle);
    item.append(postCommentInfo);
    postCommentInfo.append(postCommentdateIcon);
    postCommentInfo.append(postCommentInfoDate);
  }
}

async function getMyAptComment() {
  const myPostCommentList = document.querySelector(".myAptcomments__items");
  const response = await fetch(`${URL_GET_MY_APT_COMMENT}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response["status"] == 404) {
    const totalPostCount = document.querySelector(
      ".myAptcomments__info > span > b"
    );
    totalPostCount.textContent = 0;
    return;
  }
  const data = await response.json();
  const totalPostCount = document.querySelector(
    ".myAptcomments__info > span > b"
  );
  totalPostCount.textContent = `${data.length}`;

  for (let i = 0; i < data.length; i++) {
    const item = document.createElement("li");
    const postCommentTitle = document.createElement("a");
    postCommentTitle.className = "myAptcomments__title";
    postCommentTitle.textContent = data[i]["content"];
    postCommentTitle.setAttribute(
      "href",
      `${URL_GET_APT_INFO}${data[i]["apt_id"]}`
    );
    const postCommentInfo = document.createElement("div");
    postCommentInfo.className = "myPostcomments__sub-detail";
    const postCommentdateIcon = document.createElement("i");
    postCommentdateIcon.className = "fa-regular fa-calendar-days";
    const postCommentInfoDate = document.createElement("span");
    postCommentInfoDate.textContent = data[i]["datetime_updated"];
    const postCommentAptIcon = document.createElement("i");
    postCommentAptIcon.className = "fa-solid fa-building";
    const postCommentInfoAptName = document.createElement("span");
    postCommentInfoAptName.textContent = data[i]["name"];

    myPostCommentList.append(item);
    item.append(postCommentTitle);
    item.append(postCommentInfo);
    postCommentInfo.append(postCommentdateIcon);
    postCommentInfo.append(postCommentInfoDate);
    postCommentInfo.append(postCommentAptIcon);
    postCommentInfo.append(postCommentInfoAptName);
  }
}

function loginRequiredPopUp() {
  Swal.fire({
    text: "로그인이 필요합니다.",
    timer: 4000,
  });
}

function logoutPopUp() {
  Swal.fire({
    text: "로그아웃 되었습니다.",
    timer: 2000,
  });
}
