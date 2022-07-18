// 자유 게시판 페이지
document.addEventListener("DOMContentLoaded", getPost());
document.addEventListener("DOMContentLoaded", getComment());
const commentButton = document.querySelector(".comment-maker__button");
commentButton.addEventListener("click", makeComment);

async function getPost() {
  const URL_GET_POST = `http://localhost:8080/posts/${1}`;
  const response = await fetch(URL_GET_POST, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);
  const title = document.querySelector(".post__content__wrapper h3");
  title.innerHTML = data[0]["title"];
  const content = document.querySelector(".post__content__wrapper p");
  content.textContent = data[0]["content"];
  const userName = document.querySelector(
    ".post__profile-information span span"
  );
  userName.innerHTML = data[0]["nickname"];
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

async function getComment() {
  const URL_GET_COMMENT = `http://localhost:8080/comments/getbypostid/${1}`;
  const response = await fetch(URL_GET_COMMENT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  showPagenation(data.length);
  const commentCount = document.querySelector(".comment h4 span");
  const commentWrapper = document.querySelector(".comment ul");
  commentCount.textContent = data.length;
  for (let i = 0; i < data.length; i++) {
    const li = document.createElement("li");
    const profileDiv = document.createElement("div");
    profileDiv.className = "comment__user-profile-image";
    const profileImg = document.createElement("img");
    profileImg.src = `images/${data[i]["image"]}`;
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

// 프론트 서버 내에서 json 파일을 이용해서, comment 작성 하는 법.
// fetch를 이용해서 post 요청을 하는 방법에 대해서 몰랐다.
// 단순히 json파일의 경로를 fetch 경로로 지정하고, post 요청을 보내면,
// 해당 json 파일로 post 요청이 가는 줄 알았다.
// 그것이 아니라, fetch를 통해서, post 요청을 보내고.
// 따로 서버에서 json 파일에 데이터를 작성해줄, 라우트 경로를 하나더
// 만들어서 해당 기능을 구현해야 했다.

// 댓글 등록(아파트 정보 페이지에서)
async function makeComment() {
  const comment = {
    content: document.querySelector("textarea").value,
    post_id: 1,
  };
  const response = await fetch("http://localhost:3000/make-comment", {
    method: "post", // POST 요청을 보낸다.
    body: JSON.stringify(comment), // comment JS 객체를 JSON문자열으로 변경하여 보냄
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response);
  const data = await response.json();
}

function showPagenation(dataLength) {
  if (dataLength < 6) {
    const pagenation = document.querySelector(".pagenation");
    pagenation.style.display = "none";
  }
}
