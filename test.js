import fs from "fs";

// buffer 형태로 json 데이터를 가져온다.
const dataBuffer = fs.readFileSync(
  "7-fullstack-ethan-realestatewiki-frontend-main/datas/makecomment.json"
);
// buffer 형태의 데이터를 String 형태로 만든다.
const dataJson = dataBuffer.toString();
// json문자열을 객체로 변환한다.
const comment = JSON.parse(dataJson);
console.log(comment);

comment.content = "댓글2";
comment.id = "ethan";

// javascript 값을 JSON 문자열로 변환한다.
const commentJSON = JSON.stringify(comment);
fs.writeFileSync(
  "7-fullstack-ethan-realestatewiki-frontend-main/datas/makecomment.json",
  commentJSON
);
