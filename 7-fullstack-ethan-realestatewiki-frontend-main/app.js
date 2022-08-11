import express from "express";
import http from "http";
import https from "https";
import fs from "fs";
import "./middlewares/config.js";
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

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send("User-agent: *\nAllow: /");
});

app.get("/sitemap.xml", (req, res) => {
  const dirPath = path.join(__dirname, "html", "sitemap.xml");
  console.log(dirPath);
  res.sendFile(dirPath);
});

// 아파트 정보 화면 띄워주기
app.get("/info/:id", (req, res) => {
  const id = req.params.id;
  const dirPath = path.join(__dirname, "html", "information.html");
  console.log(dirPath);
  res.sendFile(dirPath);
});

// 게시글 화면 띄워주기
// 그런데,
app.get("/post/:id", (req, res) => {
  const id = req.params.id;
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

// 회원가입 띄워주기
app.get("/search-result", (req, res) => {
  const dirPath = path.join(__dirname, "html", "search-result.html");
  console.log(dirPath);
  res.sendFile(dirPath);
});

// 글쓰기 페이지로 이동
app.get("/make-post", (req, res) => {
  const dirPath = path.join(__dirname, "html", "make-post.html");
  console.log(dirPath);
  res.sendFile(dirPath);
});

// 글수정 페이지로 이동
app.get("/update-post/:id", (req, res) => {
  const dirPath = path.join(__dirname, "html", "update-post.html");
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

console.log(`HTTPS 적용 여부 : ${process.env.HTTPS}`);

let chain;
let key;
let cert;
try {
  chain = fs.readFileSync(
    path.resolve(
      "/etc",
      "letsencrypt",
      "archive",
      "realestatewiki.kr",
      "fullchain1.pem"
    )
  );
  key = fs.readFileSync(
    path.resolve(
      "/etc",
      "letsencrypt",
      "archive",
      "realestatewiki.kr",
      "privkey1.pem"
    )
  );
  cert = fs.readFileSync(
    path.resolve(
      "/etc",
      "letsencrypt",
      "archive",
      "realestatewiki.kr",
      "cert1.pem"
    )
  );
} catch (err) {
  console.log("SSL 인증서가 없습니다. 로컬 환경 입니다.");
}

const options = {
  ca: chain,
  key: key,
  cert: cert,
};

if (options.cert != undefined) {
  http.createServer(app).listen(process.env.PORT_NUM_PROD, () => {
    console.log(`server is listening ${process.env.PORT_NUM_PROD}`);
  });
  https.createServer(options, app).listen(process.env.PORT_NUM, () => {
    console.log(`server is listening ${process.env.PORT_NUM}`);
  });
} else {
  http.createServer(app).listen(process.env.PORT_NUM, () => {
    console.log(`server is listening ${process.env.PORT_NUM}`);
  });
}
