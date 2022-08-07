const URL_HOME = "https://realestatewiki.kr";
const URL_LOGOUT = "https://api.realestatewiki.kr/users/logout";
const URL_LOGIN = `https://realestatewiki.kr/login`;
const URL_ID_CHECK = "https://api.realestatewiki.kr/users/id-check";
const URL_NICKNAME_CHECK = "https://api.realestatewiki.kr/users/nickname-check";
const URL_PHONENUMBER_CHECK =
  "https://api.realestatewiki.kr/users/phonenumber-check";
const URL_EMAIL_CHECK = "https://api.realestatewiki.kr/users/email-check";
const URL_MAKE_USER = "https://api.realestatewiki.kr/users";

// 로그인 되어 있지 않을 때, 홈화면으로 돌아가기
if (getCookie("LoginSession")) {
  alreadyLoginPopUp();
  setTimeout(() => {
    location.href = URL_HOME;
  });
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

/*
 * 디바운싱 : Interval 내 반복되는 이벤트를 무시함.
 */
const debounce = (f, interval) => {
  let now = null;

  return (...param) => {
    if (now) clearTimeout(now);

    now = setTimeout(() => {
      f(...param);
    }, interval);
  };
};

/*
 * 쓰로틀링 : 연이은 이벤트의 Interval 단위 실행을 보장.
 */
const throttling = (f, interval = 300) => {
  let isPending = false;

  return (...param) => {
    if (!isPending) {
      isPending = !!setTimeout(() => {
        f(...param);
        isPending = false;
      }, interval);
    }
  };
};

let userIdConfirmed = false;
let userPwConfirmed = false;
let userNicknameConfirmed = false;
let userPhonenumberConfirmed = false;
let userEmailConfirmed = false;

// 유저 아이디 실시간 유효성 검사
const userIdinputBox = document.querySelector("#user_id");
const checkMsgUserId = document.querySelector(".signup__check_msg-user_id");
console.log(userIdinputBox);
console.log(checkMsgUserId);

userIdinputBox.addEventListener("input", debounce(userIdinputHandler, 500));

async function userIdinputHandler(event) {
  const user_id = { user_id: event.target.value };

  if (user_id) {
    console.log(`user_id: ${user_id["user_id"]}`);
    console.log(`isId(user_id["user_id"]): ${isId(user_id["user_id"])}`);
    if (!isId(user_id["user_id"])) {
      checkMsgUserId.style.display = "block";
      checkMsgUserId.style.color = "red";
      checkMsgUserId.innerText =
        "5~15자의 영문 소문자, 숫자의 조합만 사용 가능합니다.";
      userIdConfirmed = false;
      return console.log(
        "아이디는 영문소문자로 시작하는 5~15자영문소문자, 숫자 조합으로 구성되어야 합니다."
      );
    }

    const response = await fetch(URL_ID_CHECK, {
      method: "post", // POST 요청을 보낸다.
      body: JSON.stringify(user_id), // comment JS 객체를 JSON문자열으로 변경하여 보냄
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response["status"] == 409) {
      checkMsgUserId.style.display = "block";
      checkMsgUserId.style.color = "red";
      checkMsgUserId.innerText = "중복된 아이디입니다.";
      userIdConfirmed = false;
      return console.log("중복된 아이디 입니다.");
    }
    if (response["status"] == 200) {
      checkMsgUserId.style.display = "block";
      checkMsgUserId.style.color = "green";
      checkMsgUserId.innerText = "사용가능한 아이디입니다.";
      userIdConfirmed = true;
      return console.log("사용가능한 아이디입니다.");
    }
  }
}

// 비밀번호 실시간 유효성 검사
const userPwinputBox = document.querySelector("#user_pw");
const checkMsgUserPw = document.querySelector(".signup__check_msg-user_pw");
userPwinputBox.addEventListener("input", debounce(userPwinputHandler, 500));
console.log(userPwinputBox);
console.log(checkMsgUserPw);

async function userPwinputHandler(event) {
  const user_pw = { user_pw: event.target.value };

  if (user_pw) {
    console.log(`user_pw: ${user_pw["user_pw"]}`);
    console.log(
      `isPassword(user_pw["user_pw"]): ${isPassword(user_pw["user_pw"])}`
    );

    if (!isPassword(user_pw["user_pw"])) {
      checkMsgUserPw.style.display = "block";
      checkMsgUserPw.style.color = "red";
      checkMsgUserPw.innerText =
        "8 ~ 15자 영문소문자, 숫자, 특수문자를 최소 한가지씩 조합하여 사용 가능합니다.";
      userPwConfirmed = false;
      return console.log(
        "8 ~ 15자 영문소문자, 숫자, 특수문자를 최소 한가지씩 조합하여 사용 가능합니다."
      );
    }
    checkMsgUserPw.style.display = "block";
    checkMsgUserPw.style.color = "green";
    checkMsgUserPw.innerText = "사용 가능한 비밀번호 입니다.";
    userPwConfirmed = true;
  }
}

// 중복 비밀번호 실시간 유효성 검사
const userPwCheckinputBox = document.querySelector("#user_pw_check");
const checkMsgUserPwCheck = document.querySelector(
  ".signup__check_msg-user_pw_check"
);
userPwCheckinputBox.addEventListener(
  "input",
  debounce(userPwCheckinputHandler, 500)
);
console.log(userPwCheckinputBox);
console.log(`checkMsgUserPwCheck : ${checkMsgUserPwCheck}`);

async function userPwCheckinputHandler(event) {
  const user_pw_check = { user_pw_check: event.target.value };
  console.log(`user_pw: ${user_pw.value}`);
  console.log(`user_pw_check: ${user_pw_check["user_pw_check"]}`);
  if (user_pw.value != user_pw_check["user_pw_check"]) {
    checkMsgUserPwCheck.style.display = "block";
    checkMsgUserPwCheck.style.color = "red";
    checkMsgUserPwCheck.innerText = "비밀번호가 일치하지 않습니다.";
    return console.log("비밀번호가 일치하지 않습니다.");
  }
  checkMsgUserPwCheck.style.display = "block";
  checkMsgUserPwCheck.style.color = "green";
  checkMsgUserPwCheck.innerText = "비밀번호가 일치합니다.";
}

// 닉네임 실시간 유효성 검사
const nicknameinputBox = document.querySelector("#user_nickname");
const checkMsgNickname = document.querySelector(".signup__check_msg-nickname");
console.log(nicknameinputBox);
console.log(checkMsgNickname);

nicknameinputBox.addEventListener("input", debounce(nicknameinputHandler, 500));

async function nicknameinputHandler(event) {
  const nickname = { nickname: event.target.value };

  if (nickname) {
    console.log(`nickname: ${nickname["nickname"]}`);
    console.log(
      `isNickname(nickname["nickname"]): ${isNickname(nickname["nickname"])}`
    );
    //닉네임이 정규식과 일치하지 않을 때,
    if (!isNickname(nickname["nickname"])) {
      checkMsgNickname.style.display = "block";
      checkMsgNickname.style.color = "red";
      checkMsgNickname.innerText =
        "5~10자의 영어, 숫자 또는 한글의 조합으로 사용 가능합니다.";
      userNicknameConfirmed = false;
      return console.log(
        "5~10자의 영어, 숫자 또는 한글의 조합으로 사용 가능합니다."
      );
    }

    const response = await fetch(URL_NICKNAME_CHECK, {
      method: "post", // POST 요청을 보낸다.
      body: JSON.stringify(nickname), // comment JS 객체를 JSON문자열으로 변경하여 보냄
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response["status"] == 409) {
      checkMsgNickname.style.display = "block";
      checkMsgNickname.style.color = "red";
      checkMsgNickname.innerText = "중복된 닉네임입니다.";
      userNicknameConfirmed = false;
      return console.log("중복된 닉네임 입니다.");
    }
    if (response["status"] == 200) {
      checkMsgNickname.style.display = "block";
      checkMsgNickname.style.color = "green";
      checkMsgNickname.innerText = "사용가능한 닉네임입니다.";
      userNicknameConfirmed = true;
      return console.log("사용가능한 닉네임입니다.");
    }
  }
}

// 핸드폰번호 실시간 유효성 검사
const phonenumberinputBox = document.querySelector("#user_phonenumber");
const checkMsgPhonenumber = document.querySelector(
  ".signup__check_msg-phonenumber"
);
console.log(phonenumberinputBox);
console.log(checkMsgPhonenumber);

phonenumberinputBox.addEventListener(
  "input",
  debounce(phonenumberinputHandler, 500)
);

async function phonenumberinputHandler(event) {
  const phonenumber = { phonenumber: event.target.value };
  if (phonenumber) {
    console.log(`phonenumber: ${phonenumber["phonenumber"]}`);
    console.log(
      `isPhonenumber(phonenumber["phonenumber"]): ${isPhoneNumber(
        phonenumber["phonenumber"]
      )}`
    );
    //닉네임이 정규식과 일치하지 않을 때,
    if (!isPhoneNumber(phonenumber["phonenumber"])) {
      checkMsgPhonenumber.style.display = "block";
      checkMsgPhonenumber.style.color = "red";
      checkMsgPhonenumber.innerText = "- 없이 숫자로만 작성";
      userPhonenumberConfirmed = false;
      return console.log("번호는 - 없이 숫자로만 작성");
    }

    const response = await fetch(URL_PHONENUMBER_CHECK, {
      method: "post", // POST 요청을 보낸다.
      body: JSON.stringify(phonenumber), // comment JS 객체를 JSON문자열으로 변경하여 보냄
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response["status"] == 409) {
      checkMsgPhonenumber.style.display = "block";
      checkMsgPhonenumber.style.color = "red";
      checkMsgPhonenumber.innerText = "중복된 핸드폰번호입니다.";
      userPhonenumberConfirmed = false;
      return console.log("중복된 핸드폰번호 입니다.");
    }
    if (response["status"] == 200) {
      checkMsgPhonenumber.style.display = "block";
      checkMsgPhonenumber.style.color = "green";
      checkMsgPhonenumber.innerText = "사용가능한 핸드폰번호입니다.";
      userPhonenumberConfirmed = true;
      return console.log("사용가능한 핸드폰번호입니다.");
    }
  }
}

// 이메일 실시간 유효성 검사
const emailinputBox = document.querySelector("#user_email");
const checkMsgEmail = document.querySelector(".signup__check_msg-email");
console.log(emailinputBox);
console.log(checkMsgEmail);

emailinputBox.addEventListener("input", debounce(emailinputHandler, 500));

async function emailinputHandler(event) {
  const email = { email: event.target.value };
  if (email) {
    console.log(`email: ${email["email"]}`);
    console.log(`isEmail(email["email"]): ${isEmail(email["email"])}`);
    //닉네임이 정규식과 일치하지 않을 때,
    if (!isEmail(email["email"])) {
      checkMsgEmail.style.display = "block";
      checkMsgEmail.style.color = "red";
      checkMsgEmail.innerText = "이메일을 입력해주세요.";
      userEmailConfirmed = false;
      return console.log("이메일을 입력해주세요.");
    }

    const response = await fetch(URL_EMAIL_CHECK, {
      method: "post", // POST 요청을 보낸다.
      body: JSON.stringify(email), // comment JS 객체를 JSON문자열으로 변경하여 보냄
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response["status"] == 409) {
      checkMsgEmail.style.display = "block";
      checkMsgEmail.style.color = "red";
      checkMsgEmail.innerText = "중복된 이메일입니다.";
      userEmailConfirmed = false;
      return console.log("중복된 이메일입니다.");
    }
    if (response["status"] == 200) {
      checkMsgEmail.style.display = "block";
      checkMsgEmail.style.color = "green";
      checkMsgEmail.innerText = "사용가능한 이메일입니다.";
      userEmailConfirmed = true;
      return console.log("사용가능한 이메일입니다.");
    }
  }
}

// 이미지 실시간 유효성 검사
const imageinputBox = document.querySelector("#user_image");
const checkMsgImage = document.querySelector(".signup__check_msg-image");
console.log(imageinputBox);
console.log(checkMsgImage);

imageinputBox.addEventListener("input", debounce(imageinputHandler, 500));

async function imageinputHandler(event) {
  const fileForm = /(.*?)\.(jpg|jpeg|png|gif|bmp|pdf)$/;
  const maxSize = 5 * 1024 * 1024;
  let fileSize;

  const image = event.target.value;
  console.log(image);
  if (image != "" && image != null) {
    fileSize = document.getElementById("user_image").files[0].size;
    console.log(`fileSize: ${fileSize}`);
    console.log(`fileForm.test(image): ${fileForm.test(image)}`);
    console.log(`maxSize: ${maxSize}`);
    console.log(`fileSize: ${fileSize}`);
    if (!fileForm.test(image)) {
      alert("이미지 파일만 업로드 가능");
      event.target.value = "";
      return;
    }
    if (fileSize >= maxSize) {
      alert("파일 사이즈는 5MB까지 가능");
      event.target.value = "";
      return;
    }
    alert("파일 업로드 완료");
    return;
  }
}

// checkBox.addEventListener("click", debounce(imageinputHandler, 500));

// if(is_checked){
// }

// 회원가입 요청 (to 백엔드 서버)

console.log(document.querySelector("#signup__form"));
// const formData = new FormData(document.querySelector("#signup__form"));
// const form = document.getElementById("signup__form");
// let data = new FormData();
// data.append("name", form.user_id.value);
async function signup() {
  const formData = new FormData(document.getElementById("signup__form"));
  const user_id = document.querySelector("#user_id").value;
  const user_pw = document.querySelector("#user_pw").value;
  const user_pw_check = document.querySelector("#user_pw_check").value;
  const nickname = document.querySelector("#user_nickname").value;
  const phone_number = document.querySelector("#user_phonenumber").value;
  const email = document.querySelector("#user_email").value;
  const image = document.querySelector('input[type="file"]');
  console.log(image);
  formData.append("user_id", user_id);
  formData.append("user_pw", user_pw);
  formData.append("user_pw_check", user_pw_check);
  formData.append("nickname", nickname);
  formData.append("phone_number", phone_number);
  formData.append("email", email);
  formData.append("image", image.files[0]);
  console.log(formData);
  console.log(`formData : ${formData.getAll("image")}`);
  console.log(`formData : ${formData.entries("image")}`);
  console.log(user_id);
  if (
    !user_id ||
    !user_pw ||
    !user_pw_check ||
    !nickname ||
    !phone_number ||
    !email
  ) {
    requireInfoPopUp();
    return;
  }
  if (
    !userIdConfirmed ||
    !userPwConfirmed ||
    !userNicknameConfirmed ||
    !userPhonenumberConfirmed ||
    !userEmailConfirmed
  ) {
    requireInfoPopUp();
    return;
  }

  const checkBox = document.querySelector("#agree");
  const is_checked = checkBox.checked;
  console.log(`is_checked: ${is_checked}`);
  // 개인정보처리방침 동의가 체크되지 않으면
  if (!is_checked) {
    requireAgreePopUp();
    return;
  }

  const response = await fetch(URL_MAKE_USER, {
    method: "post", // POST 요청을 보낸다.
    body: formData, // comment JS 객체를 JSON문자열으로 변경하여 보냄
    headers: {},
  });
  console.log(response);
  if (response["status"] == 201) {
    signupSuccessPopUp();
    location.href = URL_HOME;
    return;
  }
  signupFailPopUp();
  return;
}

const signupButton = document.querySelector(".signup__button--confirm");
signupButton.addEventListener("click", signup);

const privacyPolicyButton = document.querySelector(".privacy-policy-content");
privacyPolicyButton.addEventListener("click", showPrivacyPolicy);

const cancelButton = document.querySelector(".signup__button--cancel");
cancelButton.addEventListener("click", goToHome);
function goToHome() {
  location.href = URL_HOME;
}

// 아이디 정규식, 영문자로 시작하는 영문자 또는 숫자 5~15자
function isId(asValue) {
  var regExp = /^[a-z](?=.*[a-z])(?=.*[0-9]).{4,14}$/g;
  return regExp.test(asValue);
}

//비밀번호 정규식, 8 ~ 15자 영문, 숫자, 특수문자를 최소 한가지씩 조합
function isPassword(asValue) {
  var regExp =
    /^(?=.*[a-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,15}$/;
  return regExp.test(asValue); // 형식에 맞는 경우 true 리턴
}

// 이메일 주소 체크
function isEmail(asValue) {
  var regExp =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

  return regExp.test(asValue);
}

// 핸드폰 번호 체크
function isPhoneNumber(asValue) {
  var regExp = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;
  return regExp.test(asValue);
}

// 닉네임 체크 한글, 영문, 숫자 5 ~ 10자
function isNickname(asValue) {
  var regExp = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{5,10}$/;
  return regExp.test(asValue);
}

function showPrivacyPolicy() {
  Swal.fire({
    text: "개인정보처리방침입니다. 개인정보처리방침입니다. 개인정보처리방침입니다. 개인정보처리방침입니다.",
    confirmButtonText: "확인",
    timer: 2000,
  });
}

function requireAgreePopUp() {
  Swal.fire({
    text: "개인정보처리방침 동의가 필요합니다.",
    confirmButtonText: "확인",
    timer: 2000,
  });
}

function requireInfoPopUp() {
  Swal.fire({
    text: "필수 항목을 입력해주세요.",
    confirmButtonText: "확인",
    timer: 2000,
  });
}

function signupSuccessPopUp() {
  Swal.fire({
    text: "회원가입 되었습니다.",
    timer: 2000,
  });
}

function signupFailPopUp() {
  Swal.fire({
    text: "회원가입이 실패하였습니다. 입력 정보를 확인해주세요.",
    timer: 2000,
  });
}

function alreadyLoginPopUp() {
  Swal.fire({
    text: "이미 로그인되었습니다.",
    timer: 4000,
  });
}

function logoutPopUp() {
  Swal.fire({
    text: "로그아웃 되었습니다.",
    timer: 2000,
  });
}
