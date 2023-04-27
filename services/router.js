const express = require("express");
const router = new express.Router();
const login = require("../controllers/login.js");

router.route("/login/").post(login.post);

module.exports = router;
