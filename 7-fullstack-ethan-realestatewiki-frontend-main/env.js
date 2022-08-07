import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env 파일 경로 지정해주기
let envpath;

switch (process.env.NODE_ENV) {
  // NODE_ENV 값이 production일 때
  case "production":
    envpath = path.join(__dirname, "..", ".env.prod");
    console.log(path.join(__dirname, "..", ".env.prod"));
    break;

  // NODE_ENV 값이 development일 때
  case "development":
    envpath = path.join(__dirname, "..", ".env.dev");
    break;
}

dotenv.config({ path: envpath });
