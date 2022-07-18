import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(`${__dirname}`));

// home 화면 띄워주기
app.get("/home", (req, res) => {
  res.sendFile(`${__dirname}\\html\\home.html`);
});

// 아파트 정보 화면 띄워주기
app.get("/info", (req, res) => {
  res.sendFile(`${__dirname}\\html\\information.html`);
});

// 아파트 정보 화면 띄워주기
app.get("/post", (req, res) => {
  res.sendFile(`${__dirname}\\html\\post.html`);
});

// 로그인 화면 띄워주기
app.get("/login", (req, res) => {
  res.sendFile(`${__dirname}\\html\\login.html`);
});

// 게시판 화면 띄워주기
app.get("/freeboard", (req, res) => {
  res.sendFile(`${__dirname}\\html\\freeboard.html`);
});

// 마이페이지 띄워주기
app.get("/mypage", (req, res) => {
  res.sendFile(`${__dirname}\\html\\mypage.html`);
});

// 회원가입 띄워주기
app.get("/signup", (req, res) => {
  res.sendFile(`${__dirname}\\html\\signup.html`);
});

app.post("/make-comment", makeComment);

function makeComment(req, res) {
  const comment = req.body;
  console.log(comment);
  return res.status(201).json({
    message: `Created : creating post success`,
  });
}

app.listen(3000, () => {
  console.log("server is listening");
  console.log(__dirname);
});
