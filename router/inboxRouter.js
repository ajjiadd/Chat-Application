//external imports
const express = require("express");

//internal import
const {getInbox} = require("../controller/inboxController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const {checkLogin} = require("../middlewares/common/checkLogin");

//implement the router
const router = express.Router();


//inbox page
router.get("/",decorateHtmlResponse("Inbox"),checkLogin, getInbox);

module.exports = router;