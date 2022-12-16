const express = require("express");
const Pet = require("../models/Pet");
const Post = require("../models/Post");
const Result = require("../models/Result");

const globalRouter = express.Router();

globalRouter.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

globalRouter.get("/", (req, res) => {
  console.log(req.user);
  res.render("home");
});
globalRouter.get("/intro", async (req, res) => {
  res.render("intro");
});
globalRouter.get("/center", async (req, res) => {
  const pet = await Pet.find({});
  res.render("center", { pet });
});
globalRouter.get("/center/:name", async (req, res) => {
  const center_name = req.params.name;
  const pet = await Pet.find({ center_name });
  res.render("center", { pet, center_name });
});
globalRouter.get("/board/:type", async (req, res) => {
  const type = req.params.type;
  if (type == 1) {
    var post = await Post.find({}).sort({ num: -1 });
    result = [];
    for (var i in post) {
      result[i] = {};
      result[i].title = post[i].title;
      result[i].content = post[i].content;
      result[i].num = post[i].num;
      result[i].creator = post[i].creator;
      result[i].date = post[i].date.toLocaleString();
    }
  } else {
    var post = await Result.find({}).sort({ num: -1 });
    result = [];
    for (var i in post) {
      result[i] = {};
      result[i].title = post[i].title;
      result[i].content = post[i].content;
      result[i].num = post[i].num;
      result[i].creator = post[i].creator;
      result[i].date = post[i].date.toLocaleString();
    }
  }
  res.render("board", { result, type });
});

globalRouter.get("/board/:type/create", async (req, res) => {
  const type = req.params.type;
  res.render("board_create", { type });
});
globalRouter.post("/board/:type/create", async (req, res) => {
  const type = req.params.type;
  let post;
  if (type == 1) {
    post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      creator: req.user.nick,
    });
  } else {
    post = await Result.create({
      title: req.body.title,
      content: req.body.content,
      creator: req.user.nick,
    });
  }
  res.redirect(`/board/${type}/${post.num}`);
});

globalRouter.get("/board/:type/update/:num", async (req, res) => {
  let post;
  const type = req.params.type;
  if (type == 1) {
    post = await Post.findOne({ num: req.params.num });
  } else {
    post = await Result.findOne({ num: req.params.num });
  }
  res.render("board_update", { post, type });
});

globalRouter.post("/board/:type/update/:num", async (req, res) => {
  const type = req.params.type;
  let post;
  if (type == 1) {
    post = await Post.updateOne(
      { num: req.params.num },
      { title: req.body.title, content: req.body.content }
    );
  } else {
    post = await Result.updateOne(
      { num: req.params.num },
      { title: req.body.title, content: req.body.content }
    );
  }
  res.redirect(`/board/${type}/${req.params.num}`);
});

globalRouter.post("/board/:type/delete", async (req, res) => {
  const type = req.params.type;
  if (type == 1) {
    await Post.deleteOne({ num: req.body.num });
  } else {
    await Result.deleteOne({ num: req.body.num });
  }
  res.redirect(`/board/${type}`);
});

globalRouter.get("/board/:type/:num", async (req, res) => {
  const type = req.params.type;
  let post, date;
  if (type == 1) {
    post = await Post.findOne({ num: req.params.num });
    date = post.date.toLocaleString();
  } else {
    post = await Result.findOne({ num: req.params.num });
    date = post.date.toLocaleString();
  }
  res.render("board_detail", { post, date, type });
});

globalRouter.get("/test", async (req, res) => {
  // await Post.create({ title: "hi2", content: "hi content2" });
  var post = await Post.find({});
  res.send(post);
});
globalRouter.get("/knowledge/:num", (req, res) => {
  res.render(`knowledge${req.params.num}`);
});
module.exports = globalRouter;
