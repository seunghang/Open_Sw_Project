const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../models/User");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/sign", (req, res) => {
  res.render("sign");
});

router.post("/sign", isNotLoggedIn, async (req, res, next) => {
  const { email, password, nick, phone } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect("/sign?error=exist");
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
      phone,
    });
    return res.redirect("/login");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.logout(req.user, (err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      req.session;
    });
    res.redirect("/");
  });
});

module.exports = router;
