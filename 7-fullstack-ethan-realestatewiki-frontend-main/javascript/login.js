const loginbutton = document.querySelector("#loginButton");

// 로그인 버튼을 클릭하면 login 함수가 실행된다.
loginbutton.addEventListener("click", login);

// login 함수
function login() {
  // 유저에게 입력 받은 id, pw의 값을 가져와서 변수에 담는다.
  const userId = document.querySelector("#user_id").value;
  const userPw = document.querySelector("#user_pw").value;
  // // 유저에게 입력 받은 id, pw와 json파일 내 id, pw 데이터를 비교해서 로그인을 해준다.
  checkUser(userId, userPw);
}

async function checkUser(userId, userPw) {
  // fetch메서드를 통해 응답을 가져온다.
  const response = await fetch("..\\datas\\user.json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  // 응답을 json 객체로 변환 시켜서 data 변수에 넣는다.
  const data = await response.json();
  // 유저 id를 요소로 가지는 배열 생성
  const user_id_pool = [];
  // 유저 pw를 요소로 가지는 배열 생성
  const user_pw_pool = [];
  for (let i = 0; i < data.length; i++) {
    // user_id_pool 배열과 user_pw_pool 배열을 생성한다.
    user_id_pool.push(data[i]["user_id"]);
    user_pw_pool.push(data[i]["user_pw"]);
  }
  // user_id_pool 배열 내에서, 매개변수로 받은 user_id 값을 가진 유저의 인덱스 값을 찾는다.
  const user_index = user_id_pool.findIndex((element) => element == userId);
  // user_id_pool 배열 내에 매개별수로 받은 user_id 값을 가진 요소가 없다면,
  if (user_index === -1) {
    return window.alert("로그인 실패");
  }
  // user_pw_pool 배열 내의 동일한 인덱스 값을 가진 패스워드와 사용자가 입력한 패스워드가 일치하지 않는다면,
  if (user_pw_pool[user_index] != userPw) {
    return window.alert("패스워드 오류");
  }
  document.location.href = "..\\html\\home.html";
  return window.alert("로그인 되었습니다.");
}
