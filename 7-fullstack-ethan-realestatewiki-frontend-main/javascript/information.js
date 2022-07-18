// 아파트 정보 페이지

// URL 상수
const URL_APT_INFO = "..\\datas\\apt-info.json";
const URL_APT_POST = "..\\datas\\related-post.json";
const URL_APT_COMMENT = "..\\datas\\related-comment-apt.json";
const URL_APT_PRICE = "..\\datas\\recent-price.json";

document.addEventListener("DOMContentLoaded", getAptInfo());
document.addEventListener("DOMContentLoaded", getResentPrice());
document.addEventListener("DOMContentLoaded", getRelatedPost());
document.addEventListener("DOMContentLoaded", getRelatedComment());
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

  // 제이슨 파일로 가지고 있는 값을 변수로 할당하고, 다시 파일로 저장
  // 제이슨파일을 데이터베이스라고 생각, 오버라이드?
  // 제이슨파일을 가지고 CRUD 하고있는 것
  // 제이슨파일을 코드로 어떻게 변경할 수 있는지 찾아볼것.
  // 최대한 API 구현하듯이 구현
  // 보낼때도 똑같이 보내고
  // url 상수로 바꾸는게 좋다.

  const response = await fetch(URL_APT_INFO, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  const i = 0;
  aptInfoTitle.innerHTML = data[i]["name"];
  households.innerHTML = `세대수 : ${data[i]["households_count"]}세대`;
  dong.innerHTML = `/ 동수 : ${data[i]["all_dong_count"]}동`;
  approvalDate.innerHTML = `사용승인일 : '${data[i]["approval_date"]}`;
}

//아파트 최근 가격 정보 가져오기
async function getResentPrice() {
  const aptPrice = document.querySelector(
    ".apt-info__price :nth-child(2) .content"
  );
  const aptPriceDetail = document.querySelector(
    ".apt-info__price :nth-child(2) .content-sub"
  );
  const response = await fetch(URL_APT_PRICE, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  const i = 0;
  aptPrice.innerHTML = `${parseInt(data[i]["거래금액"]) / 10}억원`;
  aptPriceDetail.innerHTML = `${data[i]["년"]}.${data[i]["월"]}.${data[i]["일"]}, ${data[i]["층"]}층, ${data[i]["전용면적"]}m^2`;
}

//아파트 관련 게시글 가져오기
async function getRelatedPost() {
  const postList = document.querySelector(".apt-info__posts .content");
  const response = await fetch(URL_APT_POST, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data.length);
  if (data.length > 5) {
    for (let i = 0; i < 5; i++) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      if (data[i]["title"]) {
      }
      a.textContent = data[i]["title"];
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
      postList.appendChild(li);
      li.appendChild(a);
    }
  }
}

// 아파트 관련 댓글 가져오기
async function getRelatedComment() {
  const commentCount = document.querySelector(".comment h4 span");
  const commentWrapper = document.querySelector(".comment ul");
  const response = await fetch(URL_APT_COMMENT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  const i = 0;
  showPagenation(data.length);
  commentCount.textContent = data.length;
  for (let i = 0; i < 5; i++) {
    const li = document.createElement("li");
    const profileDiv = document.createElement("div");
    profileDiv.className = "comment__user-profile-image";
    const profileImg = document.createElement("img");
    profileImg.src = `html/${data[i]["image"]}`;
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
    commentCreatedTime.textContent = ` / ${data[i]["datetime_created"]}`;
    li.appendChild(profileDiv);
    profileDiv.appendChild(profileImg);
    li.appendChild(commentDiv);
    commentDiv.appendChild(commentContent);
    li.appendChild(commentInfo);
    commentInfo.appendChild(commentWriter);
    commentInfo.appendChild(commentCreatedTime);
  }
}

// 댓글 등록(아파트 정보 페이지에서)
async function makeComment() {
  const comment = {
    content: document.querySelector("textarea").value,
    apt_id: 2005,
  };
  // TODO : 파일에 입력하도록.. 만들기
  // 백엔드로 연결하지말고, 파일에 입력시키도록
  const response = await fetch("http://127.0.0.1:8080/comments", {
    method: "post", // POST 요청을 보낸다.
    body: JSON.stringify(comment), // comment JS 객체를 JSON으로 변경하여 보냄
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);
}

// 댓글이 5개 이하이면 페이지네이션을 숨긴다.
function showPagenation(dataLength) {
  if (dataLength < 6) {
    const pagenation = document.querySelector(".pagenation");
    pagenation.style.display = "none";
  }
}
