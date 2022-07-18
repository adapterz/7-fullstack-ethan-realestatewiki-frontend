// 자유 게시판 페이지

// URL 상수
const URL_GET_ALL_POST = "..\\datas\\all-post.json";

document.addEventListener("DOMContentLoaded", getAllPost());

//아파트 기본 정보 가져오기
async function getAllPost() {
  const board = document.querySelector(".board__content");
  const response = await fetch(URL_GET_ALL_POST, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  showPagenation(data.length);
  for (let i = 0; i < data.length; i++) {
    const li = document.createElement("li");
    const post = document.createElement("div");
    const postTitleWrapper = document.createElement("div");
    postTitleWrapper.className = "board__content-title";
    const postTitle = document.createElement("a");
    postTitle.textContent = data[i]["title"];
    postTitle.setAttribute(
      "href",
      `http://localhost:8080/posts/${data[i]["id"]}`
    );
    const postSubtitleWrapper = document.createElement("div");
    postSubtitleWrapper.className = "board__content-info";
    const postWriter = document.createElement("span");
    const postCreated = document.createElement("span");
    const postViews = document.createElement("span");
    const postRecomended = document.createElement("span");
    postWriter.textContent = data[i]["user_Id"];
    postCreated.textContent = ` / ${data[i]["datetime_updated"]}`;
    postViews.textContent = ` / 조회수 : ${data[i]["views"]}`;
    postRecomended.textContent = ` / 추천수 : ${data[i]["recommended_number"]}`;
    const commentCountWrapper = document.createElement("div");
    commentCountWrapper.className = "board__content-likes";
    const commentCount = document.createElement("span");
    commentCount.textContent = data[i]["comments_count"];
    board.appendChild(li);
    li.appendChild(post);
    post.appendChild(postTitleWrapper);
    postTitleWrapper.appendChild(postTitle);
    post.appendChild(postSubtitleWrapper);
    postSubtitleWrapper.appendChild(postWriter);
    postSubtitleWrapper.appendChild(postCreated);
    postSubtitleWrapper.appendChild(postViews);
    postSubtitleWrapper.appendChild(postRecomended);
    li.appendChild(commentCountWrapper);
    commentCountWrapper.appendChild(commentCount);
  }
}

function showPagenation(dataLength) {
  if (dataLength < 11) {
    const pagenation = document.querySelector(".pagenation");
    pagenation.style.display = "none";
  }
}
