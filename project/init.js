require("./db");
const app = require("./app");
const http = require("http");
const dotenv = require("dotenv"); // 환경 변수 사용을 위해서 (.env 파일)
dotenv.config();
require("./models/Pet");
require("./models/Post");
require("./models/User");
require("./models/Result");

const PORT = process.env.PORT || "8090";
app.set("port", PORT);
//

const server = http.createServer(app);

const handleListening = function () {
  console.log(`✅ Listening on: http://localhost:${PORT}`);
};

server.listen(PORT, handleListening);
