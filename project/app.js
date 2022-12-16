const createError = require("http-errors");
const express = require("express");
const morgan = require("morgan"); // 로그
const helmet = require("helmet"); // 기초 보안 설정
const cookieParser = require("cookie-parser"); 
const bodyParser = require("body-parser"); // form데이터를 서버로 받아와서 활용가능하게 해줌
const globalRouter = require("./routers/globalRouter");
const authRouter = require("./routers/auth");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const passportConfig = require("./passport");
const { expressCspHeader, INLINE, NONE, SELF } = require("express-csp-header");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use("/static", express.static((__dirname, "static")));
const nunjucks = require("nunjucks");
nunjucks.configure("views", {
  // 폴더 경로: views
  express: app, // 위에 const app = express();라서 app객체 즉, express 함수를 넣음
  watch: true, // html 파일이 변경될 때, 템플릿 엔진을 다시 렌더링
});
passportConfig();
app.use(helmet());
app.use(
  expressCspHeader({
    directives: {
      "script-src": [
        SELF,
        INLINE,
        "https://cdnjs.cloudflare.com",
        "https://unpkg.com",
        "https://kit.fontawesome.com",
      ],
    },
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", globalRouter);
app.use("/", authRouter);
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
