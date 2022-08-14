import { makeNav } from "../middlewares/nav-maker.js";
document.addEventListener("DOMContentLoaded", makeNav);

import { makeFooter } from "../middlewares/footer-maker.js";
document.addEventListener("DOMContentLoaded", makeFooter);

import { deleteCookie } from "../middlewares/utils.js";

import {
  updatePwFailPopUp,
  deleteUserIdSuccessPopUp,
  updatePwSuccessPopUP,
  notFoundImagePopUp,
  updateImageSuccessPopUP,
} from "../middlewares/popup.js";

import { cookieDoor } from "../middlewares/cookie-door.js";

import { identifyProtocol } from "../middlewares/identifyProtocol.js";
const baseUrl = identifyProtocol();
const urlBackend = baseUrl["urlBackend"];
const urlFrontend = baseUrl["urlFrontend"];

const URL_LOGOUT = `${urlBackend}/users/logout`;
const URL_LOGIN = `${urlFrontend}/login`;
const URL_HOME = `${urlFrontend}`;
const URL_GET_MY_POST_COUNT = `${urlBackend}/posts/user-post/count`;
const URL_GET_MY_POST_COMMENT = `${urlBackend}/comments/getbyuserIndex/post-comment`;
const URL_GET_MY_APT_COMMENT = `${urlBackend}/comments/getbyuserIndex/apt-comment`;
const URL_GET_POST = `${urlFrontend}/post/`;
const URL_GET_APT_INFO = `${urlFrontend}/info/`;

// 로그인 되어 있지 않을 때, 홈화면으로 돌아가기
cookieDoor();

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

const changePasswordButton = document.querySelector(".change-password-button");
console.log(changePasswordButton);
changePasswordButton.addEventListener("click", showChangePasswordBox);

function showChangePasswordBox() {
  changePasswordBox.style.display = "block";
}

const changePasswordBox = document.querySelector(".change-password-box");

const changePasswordCancelButton = document.querySelector(
  ".change-password-button-cancel"
);
changePasswordCancelButton.addEventListener("click", setPasswordBoxDisplayNone);

// 페이지 업로드 시 숨기기
document.addEventListener("DOMContentLoaded", setDisplayNone);
function setDisplayNone() {
  changePasswordBox.style.display = "none";
}

function setPasswordBoxDisplayNone() {
  changePasswordBox.style.display = "none";
}

const debounce = (f, interval) => {
  let now = null;

  return (...param) => {
    if (now) clearTimeout(now);

    now = setTimeout(() => {
      f(...param);
    }, interval);
  };
};

//비밀번호 정규식, 8 ~ 15자 영문, 숫자, 특수문자를 최소 한가지씩 조합
function isPassword(asValue) {
  var regExp =
    /^(?=.*[a-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,15}$/;
  return regExp.test(asValue); // 형식에 맞는 경우 true 리턴
}

// 현재 비밀번호 실시간 유효성 검사
const userPwinputBox = document.querySelector("#user_pw");
const checkMsgUserPw = document.querySelector(".signup__check_msg-user_pw");

let userPwConfirmed = false;

// 새 비밀번호 실시간 유효성 검사
const newUserPwinputBox = document.querySelector("#new_user_pw");
const checkMsgNewUserPw = document.querySelector(
  ".signup__check_msg-new_user_pw"
);
newUserPwinputBox.addEventListener(
  "input",
  debounce(newUserPwinputHandler, 500)
);

async function newUserPwinputHandler(event) {
  const user_pw = { user_pw: event.target.value };

  if (user_pw) {
    console.log(`user_pw: ${user_pw["user_pw"]}`);
    console.log(
      `isPassword(user_pw["user_pw"]): ${isPassword(user_pw["user_pw"])}`
    );
    if (!isPassword(user_pw["user_pw"])) {
      checkMsgNewUserPw.style.display = "block";
      checkMsgNewUserPw.style.color = "red";
      checkMsgNewUserPw.innerText =
        "8 ~ 15자 영문소문자, 숫자, 특수문자를 최소 한가지씩 조합하여 사용 가능합니다.";
      userPwConfirmed = false;
      return console.log(
        "8 ~ 15자 영문소문자, 숫자, 특수문자를 최소 한가지씩 조합하여 사용 가능합니다."
      );
    }
    checkMsgNewUserPw.style.display = "block";
    checkMsgNewUserPw.style.color = "green";
    checkMsgNewUserPw.innerText = "사용 가능한 비밀번호 입니다.";
    userPwConfirmed = true;
  }
}

// 중복 새 비밀번호 실시간 유효성 검사
let isConfirmed = false;
const newUserPwCheckinputBox = document.querySelector("#new_user_pw_check");
const checkMsgNewUserPwCheck = document.querySelector(
  ".signup__check_msg-new_user_pw_check"
);
newUserPwCheckinputBox.addEventListener(
  "input",
  debounce(newUserPwCheckinputHandler, 500)
);
console.log(newUserPwCheckinputBox);
console.log(`checkMsgNewUserPwCheck : ${checkMsgNewUserPwCheck}`);

async function newUserPwCheckinputHandler(event) {
  const new_user_pw_check = { new_user_pw_check: event.target.value };
  console.log(`new_user_pw: ${new_user_pw.value}`);
  console.log(`user_pw_check: ${new_user_pw_check["new_user_pw_check"]}`);
  if (new_user_pw.value != new_user_pw_check["new_user_pw_check"]) {
    checkMsgNewUserPwCheck.style.display = "block";
    checkMsgNewUserPwCheck.style.color = "red";
    checkMsgNewUserPwCheck.innerText = "비밀번호가 일치하지 않습니다.";
    isConfirmed = false;
    console.log(`isConfirmed : ${isConfirmed}`);
    return console.log("비밀번호가 일치하지 않습니다.");
  }
  checkMsgNewUserPwCheck.style.display = "block";
  checkMsgNewUserPwCheck.style.color = "green";
  checkMsgNewUserPwCheck.innerText = "비밀번호가 일치합니다.";
  isConfirmed = true;
  console.log(`isConfirmed : ${isConfirmed}`);
}

const changePasswordConfirmButton = document.querySelector(
  ".change-password-button-confirm"
);
changePasswordConfirmButton.addEventListener("click", changePassword);

async function changePassword() {
  if (isConfirmed == false || userPwConfirmed == false) {
    updatePwFailPopUp();
    return;
  }
  const user = {
    user_pw: document.querySelector("#user_pw").value,
    new_user_pw: document.querySelector("#new_user_pw").value,
  };
  const response = await fetch(`${urlBackend}/users/change-pw`, {
    method: "PUT", // PUT 요청을 보낸다.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
    credentials: "include",
  });
  if (response["status"] == 400) {
    updatePwFailPopUp();
  }

  if (response["status"] == 201) {
    setTimeout(() => {
      location.href = `${urlFrontend}/mypage`;
    });
    updatePwSuccessPopUP();
  }
}

const deleteUserIdBUtton = document.querySelector(".delete-id-button");
deleteUserIdBUtton.addEventListener("click", deleteUserId);

async function deleteUserId() {
  Swal.fire({
    title: "정말 탈퇴하시겠습니까?",
    text: "탈퇴시 회원정보는 복구되지 않습니다.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "탈퇴",
    cancelButtonText: "취소",
  }).then(async function (result) {
    if (result.isConfirmed) {
      const userIndexData = await fetch(`${urlBackend}/users/userInfo`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    }
    const userIndex = await userIndexData.json();
    console.log(userIndex);

    const response = await fetch(`${urlBackend}/users/${userIndex}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  });
}

// 유저 이미지 변경 박스
const userImageBox = document.querySelector(".change-image-box");
// 유저 이미지 변경 박스 페이지 업로드 시 숨기기
document.addEventListener("DOMContentLoaded", setImageBoxDisplayNone);
function setImageBoxDisplayNone() {
  userImageBox.style.display = "none";
}

// 프로필 이미지 변경 버튼 누르면 보이게 만들기
const changeUserImageButton = document.querySelector(".change-image-button");
changeUserImageButton.addEventListener("click", showUserImageBox);
function showUserImageBox() {
  userImageBox.style.display = "block";
}

// 프로필 이미지 변경 - 취소 버튼 누르면 프로필 이미지 변경 숨기기
const changeUserImageButtonCancel = document.querySelector(
  ".change-image-button-cancel"
);
changeUserImageButtonCancel.addEventListener("click", setImageBoxDisplayNone);

// 프로필 이미지 변경 - 확인 버튼 누르면 프로필 이미지 변경 숨기기
const changeUserImageButtonConfirm = document.querySelector(
  ".change-image-button-confirm"
);
changeUserImageButtonConfirm.addEventListener("click", changeUserImage);

async function changeUserImage() {
  Swal.fire({
    title: "프로필 이미지를 변경합니다.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "변경",
    cancelButtonText: "취소",
  }).then(async function (result) {
    if (result.isConfirmed) {
      const formData = new FormData(
        document.getElementById("change-image__form")
      );
      const image = document.querySelector('input[type="file"]');
      console.log(image);
      formData.append("image", image.files[0]);
      if (image.files[0] == undefined) {
        notFoundImagePopUp();
        return;
      }
      const response = await fetch(`${urlBackend}/users/change-profile-image`, {
        method: "PUT", // POST 요청을 보낸다.
        body: formData, // comment JS 객체를 JSON문자열으로 변경하여 보냄
        headers: {},
        credentials: "include",
      });
      console.log(response);
      if (response["status"] == 201) {
        updateImageSuccessPopUP();
        setTimeout(() => {
          location.href = `${urlFrontend}/mypage`;
        });
        return;
      }
    }
  });
}
