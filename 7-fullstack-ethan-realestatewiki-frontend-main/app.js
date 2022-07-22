import express from "express";
import https from "https";
import http from "http";
import fs from "fs";
import "./env.js";
// import { config } from "./env.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(`${__dirname}`));

// home 화면 띄워주기
app.get("/", (req, res) => {
  const dirPath = path.join(__dirname, "html", "home.html");
  console.log(dirPath);
  res.sendFile(dirPath);
});

// 아파트 정보 화면 띄워주기
app.get("/info", (req, res) => {
  const dirPath = path.join(__dirname, "html", "information.html");
  console.log(dirPath);
  res.sendFile(dirPath);
});

// 아파트 정보 화면 띄워주기
app.get("/post", (req, res) => {
  const dirPath = path.join(__dirname, "html", "post.html");
  console.log(dirPath);
  res.sendFile(dirPath);
});

// 로그인 화면 띄워주기
app.get("/login", (req, res) => {
  const dirPath = path.join(__dirname, "html", "login.html");
  console.log(dirPath);
  res.sendFile(dirPath);
});

// 게시판 화면 띄워주기
app.get("/freeboard", (req, res) => {
  __filename, path.extname(__filename);
  const dirPath = path.join(__dirname, "html", "freeboard.html");
  console.log(dirPath);
  res.sendFile(dirPath);
});

// 마이페이지 띄워주기
app.get("/mypage", (req, res) => {
  const dirPath = path.join(__dirname, "html", "mypage.html");
  console.log(dirPath);
  res.sendFile(dirPath);
});

// 회원가입 띄워주기
app.get("/signup", (req, res) => {
  const dirPath = path.join(__dirname, "html", "signup.html");
  console.log(dirPath);
  res.sendFile(dirPath);
});

app.post("/make-comment", makeComment);

function makeComment(req, res) {
  const comment = req.body;
  console.log(comment);
  return res.status(201).json({
    message: `Created : creating post success`,
  });
}

const keyPath = path.join(
  __dirname,
  "..",
  "..",
  "/etc",
  "letsencrypt",
  "archive",
  "realestatewiki.kr",
  "cert1.pem"
);

console.log(keyPath);

const option =
  process.env.NODE_ENV === "production"
    ? {
        key: fs.readFileSync(
          path.resolve(
            "/etc",
            "letsencrypt",
            "archive",
            "realestatewiki.kr",
            "privkey1.pem"
          )
        ),
        cert: fs.readFileSync(
          path.resolve(
            "/etc",
            "letsencrypt",
            "archive",
            "realestatewiki.kr",
            "cert1.pem"
          )
        ),
        ca: fs.readFileSync(
          path.resolve(
            "/etc",
            "letsencrypt",
            "archive",
            "realestatewiki.kr",
            "chain1.pem"
          )
        ),
      }
    : undefined;

option
  ? https.createServer(option, app).listen(process.env.PORT_NUM, () => {
      console.log(`server is listening ${process.env.PORT_NUM}`);
    })
  : http.createServer(app).listen(process.env.PORT_NUM, () => {
      console.log(`server is listening ${process.env.PORT_NUM}`);
    });
// app.listen(process.env.PORT_NUM, () => {
//   console.log("server is listening");
//   console.log("The value of PORT is:", process.env.PORT_NUM);
// });;
