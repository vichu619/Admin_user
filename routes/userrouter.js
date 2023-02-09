const express = require("express");

const {
  loginpageView,
  homepageView,
  signupView,
  postuserview,
  postlogin,
  logout,
} = require("../controller/usercontroller");

const router = express.Router();


router.get('/admin',(rq,rs,n)=>{

console.log('its myyy adminnnnn from user');

n();

})

router.get("/", loginpageView);
router.get("/signup", signupView);
router.get("/userhome", homepageView);

router.post("/signuppost", postuserview);
router.post("/home", postlogin);
router.get("/logout", logout);


module.exports = router;

