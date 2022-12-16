const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true, // 적지 않으면 deprecatedError 가 발생. 경고 메세지 출력 (지원 중단 경고 해결 옵션)
  useFindAndModify: false, 
  useUnifiedTopology: true, // 새 토폴로지 엔진을 사용
});

const db = mongoose.connection;

const handleOpen = () => console.log("✅  Connected to DB"); // 연결 성공
const handleError = (
  error // 연결 실패
) => console.log(`❌ Error on DB Connection:${error}`);

db.once("open", handleOpen);
db.on("error", handleError);
