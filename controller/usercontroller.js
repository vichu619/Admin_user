const bcrypt = require("bcrypt");
const { response } = require("express");
const express= require('express')
const db = require("../model/server");


const loginpageView = (req, res) => {
  console.log(req.session.loginuser);

  if (req.session.loginuser) {
    console.log("HomeReached");
    res.redirect("/userhome");
  } else {
    console.log("else-session");
    res.render("login", { message: req.session.loginerror });
  }

  req.session.loginerror = false;
};

const postlogin = async (req, res) => {
  const { email, password } = req.body;

  let user = await db.get().collection("userdetails").findOne({ email });

  console.log(user);

  if (user) {
    bcrypt.compare(password, user.password, (err, data) => {
      if (err) {
        console.log(err);
      } else if (data) {
        console.log("login user succesfull");

        req.session.loginuser = true;
        res.redirect("/userhome");
      } else {
        req.session.loginerror = true;

        console.log("password wrong");
        res.redirect("/");
      }
    });
  } else {
    console.log("wrong user");
    req.session.loginerror = true;
    console.log("wrong user");
    res.redirect("/");
  }
};

const signupView = (req, res) => {
  if (req.session.loginuser) {
    res.redirect("/");
  } else {
    res.render("signup");
  }
};

let toy = [
  {
    Name: "SAMSUNG Galaxy Z Fold4 5G",
    Company: "SAMSUNG",
    Price: "1,64,999/-",
    Stock: "Available",
    img: "https://rukminim1.flixcart.com/image/416/416/xif0q/mobile/p/v/o/-original-imagh7nzmxwmbpvf.jpeg?q=70",
  },
  {
    Name: "SAMSUNG Galaxy S21 Ultra",
    Company: "SAMSUNG",
    Price: "1,29,999/-",
    Stock: "Available",
    img: "https://rukminim1.flixcart.com/image/416/416/kjvrdzk0/mobile/t/x/3/samsung-galaxy-s21-ultra-sm-g998bzkginu-original-imafzcm2vacyygnb.jpeg?q=70",
  },
  {
    Name: "SAMSUNG Galaxy S22 Ultra",
    Company: "SAMSUNG",
    Price: "1,19,675/-",
    Stock: "Available",
    img: "https://rukminim1.flixcart.com/image/416/416/xif0q/mobile/g/z/p/-original-imaggj68yffchuwx.jpeg?q=70",
  },
  {
    Name: "ASUS ROG Phone 5",
    Company: " ASUS",
    Price: " 49,999/-",
    Stock: "Available",
    img: "https://rukminim1.flixcart.com/image/416/416/km2clu80/mobile/8/r/x/rog-phone-5-zs673ks-1a053in-asus-original-imagff5hufbu4eg5.jpeg?q=70",
  },
  {
    Name: "Google Pixel 7 Pro",
    Company: "GOOGLE",
    Price: "81,999/-",
    Stock: "Available",
    img: "https://rukminim1.flixcart.com/image/416/416/xif0q/mobile/z/g/q/-original-imaggsueh4b26fj7.jpeg?q=70",
  },
  {
    Name: "APPLE iPhone 14 Plus",
    Company: "APPLE",
    Price: "1,04,999/-",
    Stock: "Available",
    img: "https://rukminim1.flixcart.com/image/416/416/km2clu80/mobile/8/r/x/rog-phone-5-zs673ks-1a053in-asus-original-imagff5hufbu4eg5.jpeg?q=70",
  },
  {
    Name: "ASUS 6Z",
    Company: "ASUS",
    Price: "35,999/-",
    Stock: "Available",
    img: "https://rukminim1.flixcart.com/image/416/416/jx0prbk0/mobile/y/t/v/asus-6z-zs630kl-2a014ww-original-imafhkqythzfmjp8.jpeg?q=70",
  },
  {
    Name: "APPLE iPhone 14 Pro Max",
    Company: "APPLE",
    Price: "1,82,999/-",
    Stock: "Available",
    img: "https://rukminim1.flixcart.com/image/416/416/xif0q/mobile/k/s/t/-original-imaghxengzjc2djt.jpeg?q=70",
  },
];

const homepageView = (req, res) => {
  console.log("home-session");
  if (req.session.loginuser) {
    res.render("userhome", { toy });
  } else res.redirect("/");
};

// const adduserStatus = require('adduserStatus');

const postuserview = async (req, res) => {
  let name = req.body.username;
  let email = req.body.emailaddress;
  let hashedpassword = await bcrypt.hash(req.body.password, 10);
  let hashedconfirmpassword = await bcrypt.hash(req.body.conpassword, 10);

  console.log("register");
  if(req.body.username.trim()===""){
    res.render('signup',{errName:"Enter valid Name...!"})
  }else{
  let dataToInsert = {
   name: name,
    email: email,
    password: hashedpassword,
    confirmpassword: hashedconfirmpassword,
  }
 
  db.get()
  .collection("userdetails")
    .findOne({email:email},(err,data)=>{
      if(err) {console.log(err);}
      //console.log(data);
      console.log("data ivdethi");
          if(data){
            console.log("if ullil keri")
              res.render('signup',{errMail:"Email already exists!!!"})
          }else{

              db.get()
              .collection("userdetails")
              .insertOne(dataToInsert, (err, collection) => {
                console.log(dataToInsert);
                res.render('signup',{created:"New account created...."})
                if (err) throw err;
                
                console.log("insertion");
              });
            }
    })
  
  }

    };


  

const logout = (req, res) => {
  req.session.loginuser=false;
  res.redirect("/");
};

module.exports = {
  loginpageView,
  homepageView,
  signupView,
  postuserview,
  postlogin,
  logout,
};

const router = express.Router();













