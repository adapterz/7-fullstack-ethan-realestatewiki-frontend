export function logoutPopUp() {
  Swal.fire({
    text: "로그아웃 되었습니다.",
    timer: 2000,
  });
}

export function loginRequiredPopUp() {
  Swal.fire({
    text: "로그인이 필요합니다.",
    timer: 2000,
  });
}

export function loginSuccessPopUp() {
  Swal.fire({
    text: "로그인 되었습니다.",
    confirmButtonText: "확인",
    timer: 2000,
  });
}

export function loginFailurePopUp() {
  Swal.fire({
    text: "아이디 또는 비밀번호가 일치하지 않습니다.",
    confirmButtonText: "확인",
  });
}

export function alreadyLoginPopUp() {
  Swal.fire({
    text: "이미 로그인 되어 있습니다.",
    confirmButtonText: "확인",
    timer: 2000,
  });
}

export function makingCommentSuccessPopUp() {
  Swal.fire({
    text: "댓글이 작성 되었습니다.",
    timer: 2000,
  });
}

export function commentFailPopUp() {
  Swal.fire({
    text: "로그인이 필요합니다.",
    timer: 2000,
  });
}

export function deleteCommentSuccessPopUp() {
  Swal.fire({
    text: "댓글이 삭제되었습니다.",
    timer: 2000,
  });
}

export function updateCommentSuccessPopUp() {
  Swal.fire({
    text: "댓글이 수정되었습니다.",
    timer: 2000,
  });
}

export function noChangePopUp() {
  Swal.fire({
    text: "수정된 내용이 없습니다.",
    timer: 2000,
  });
}

export function updateCommentFailurePopUp() {
  Swal.fire({
    text: "댓글 수정이 실패했습니다. 관리자에게 문의해주세요.",
    timer: 2000,
  });
}

export function deletePostSuccessPopUp() {
  Swal.fire({
    text: "게시글이 삭제되었습니다.",
    timer: 2000,
  });
}

export function showPrivacyPolicy() {
  Swal.fire({
    text: "개인정보처리방침입니다. 개인정보처리방침입니다. 개인정보처리방침입니다. 개인정보처리방침입니다.",
    confirmButtonText: "확인",
    timer: 2000,
  });
}

export function requireAgreePopUp() {
  Swal.fire({
    text: "개인정보처리방침 동의가 필요합니다.",
    confirmButtonText: "확인",
    timer: 2000,
  });
}

export function requireInfoPopUp() {
  Swal.fire({
    text: "필수 항목을 입력해주세요.",
    confirmButtonText: "확인",
    timer: 2000,
  });
}

export function signupSuccessPopUp() {
  Swal.fire({
    text: "회원가입 되었습니다.",
    timer: 2000,
  });
}

export function signupFailPopUp() {
  Swal.fire({
    text: "회원가입이 실패하였습니다. 입력 정보를 확인해주세요.",
    timer: 2000,
  });
}

export function updatePostSuccessPopUp() {
  Swal.fire({
    text: "게시글이 수정 되었습니다.",
    timer: 2000,
  });
}
export function updatePostFailPopUp() {
  Swal.fire({
    text: "제목과 내용을 올바르게 입력해주세요.",
    timer: 2000,
  });
}
