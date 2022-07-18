// 홈 페이지가 로드되면 makeHome()을 실행한다.
document.addEventListener("DOMContentLoaded", getApt());
document.addEventListener("DOMContentLoaded", getPost());

// 게시글 정보 가져오기
async function getPost() {
  const popularPost = document.querySelector(".popular-post");
  const response = await fetch("..\\datas\\popular-post.json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data[0]["id"]);
  for (let i = 0; i < 3; i++) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const div = document.createElement("div");
    const nickname = document.createElement("span");
    const view = document.createElement("span");
    const recomended = document.createElement("span");
    a.textContent = data[i]["title"];
    a.setAttribute("href", `http://localhost:8080/posts/${data[i]["id"]}`);
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
  for (let i = 3; i < 10; i++) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = data[i]["title"];
    a.setAttribute("href", `http://localhost:8080/posts/${data[i]["id"]}`);
    popularPost.appendChild(li);
    li.appendChild(a);
  }
}

// 아파트 정보 가져오기
async function getApt() {
  const popularApt = document.querySelector(".popular-apt");
  //TODO : 시간될때 response를 하나의 함수로 바꿀수 있다. method 인자값을 주고, 중복 줄이는 방식으로 구현.
  const response = await fetch("..\\datas\\apt.json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  for (let i = 0; i < 3; i++) {
    // TODO : 변수명 변경, 다른 사람들이 봐도 이해할 수 있게 만들기
    const li = document.createElement("li");
    const a = document.createElement("a");
    const div = document.createElement("div");
    const address = document.createElement("span");
    const price = document.createElement("span");
    a.textContent = data[i]["name"];
    address.textContent = `${data[i]["address"]}`;
    price.textContent = ` / 최근 실거래가 : 업데이트 필요`;
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
    popularApt.appendChild(li);
    li.appendChild(a);
  }
}
