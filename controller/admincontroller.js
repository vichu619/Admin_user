const { objectid, ObjectId } = require("mongodb");
const db = require("../model/server");
const bcrypt = require("bcrypt");

const getadminlog = (req, res) => {
  if (req.session.adminlogged) {
    req.session.adminlogerror = false;
    res.render("adminhome");
  } else {
    req.session.adminlogin = true;
    console.log("Admin login reached");
    res.render("adminlogin", { message: req.session.adminlogerror });
  }
};

const adminemail = "admin@gmail.com";
const adminpassword = 123456;

const adminhomeview = (req, res) => {
  console.log(req.body);
  let email = req.body.email;
  let password = req.body.password;

  let data = {
    email: email,
    password: password,
  };
  if (
    (adminemail == data.email && adminpassword == data.password) ||
    req.session.adminlogged
  ) {
    console.log("admin home reached");
    req.session.adminlogged = true;
    req.session.adminlogerror = false;
    res.render("adminhome");
  } else {
    req.session.adminlogerror = true;
    res.redirect("/admin");
  }
};
console.log("1");
const getusers = async (req, res) => {
  let userdetails = await db.get().collection("userdetails").find().toArray();
  console.log(userdetails);

  if (req.session.adminlogged) {
    console.log("2");
    res.render("viewall", { userdetails });
  } else {
    res.redirect("/admin");
  }
};

const adminaddusers = (req, res) => {
  if (req.session.adminlogged) {
    res.render("adduser",{errMsg:req.session.sameMail});
    req.session.sameMail=false;

  } else {
    res.redirect("/admin");
  }
};

let search = async (req, res) => {
  console.log("i");

  console.log(req.body.searchData);

  let regExp = new RegExp(req.body.searchData);
  let matcheduser = await db
    .get()
    .collection("userdetails")
    .find({
      $or: [
        {
          name: { $regex: regExp },
        },
        { email: { $regex: regExp } },
      ],
    })
    .toArray();
  console.log(matcheduser);
  console.log("IILLL");

  if (req.session.adminlogged) {
    console.log("2");
    res.render("viewall", { matcheduser });
  } else {
    res.redirect("/admin");
  }
};
console.log("II");

let deleteuser = async (req, res) => {
  let id1 = req.params.id;
  console.log(req.params.id);
  let del = await db
    .get()
    .collection("userdetails")
    .deleteOne({ _id: ObjectId(id1) });
  if (req.session.adminlogged) {
    console.log("2");
    res.redirect("/admin/getusers");
  } else {
    res.redirect("/admin");
  }
};

let edituser = async (req, res) => {
  let userIdpass = req.params.id;
  let matcheduser = await db
    .get()
    .collection("userdetails")
    .find({ _id: ObjectId(userIdpass) })
    .toArray();
  console.log("edituser", matcheduser);

  if (req.session.adminlogged) {
    console.log("2");
    res.render("edit", { matcheduser: matcheduser[0] });
  } else {
    res.redirect("/admin");
  }
};

let updateuser = async (req, res) => {
  let updateId = req.params.id;
  let updatedname = req.body.updatename;
  let updatedemail = req.body.email;

  console.log(req.body);
  console.log(updatedemail);
  if(updatedname.trim()===""){
    res.render('edit',{errName:"Enter valid name..!"})
  }else{
  db.get()
  .collection("userdetails")
  .findOne({email:updatedemail},(err,isData)=>{
      if(err) {console.log(err.message,'error in message');}
      //console.log(data);
      console.log("data same ano??");
          if(isData){
              req.session.sameMail = true;
              console.log("mail same aan ")
              res.render('edit',{sameMail:"Email already exists!!!!"})
              console.log("samemail error  displayed");
          }else{
                  db.get()
                  .collection("userdetails")
                  .updateMany(
                    {
                      _id: ObjectId(updateId),
                    },
                    {
                      $set: {
                        name: updatedname,
                        email: updatedemail,
                      },
                    }
                  )
                  res.redirect('/admin/getusers')
                  }
            });
}
}

const adduser = async (req, res) => {
  let name = req.body.username;
  let email = req.body.emailaddress;
  let hashedpassword = await bcrypt.hash(req.body.password, 10);
  let hashedconfirmpassword = await bcrypt.hash(req.body.conpassword, 10);

  console.log("register");

  let data = {
    name: name,
    email: email,
    password: hashedpassword,
    confirmpassword: hashedconfirmpassword,
  };
if(data.name.trim()===""){

    res.render('adduser',{errName:"Enter valid name..!"})
  
      
} else{

  db.get()
  .collection("userdetails")
    .findOne({email:email},(err,isData)=>{
      if(err) {console.log(err.message,'error in message');}
      //console.log(data);
      console.log("data ivdethi");
          if(isData){
              req.session.sameMail = true;
              console.log("ullil ethi")
              res.redirect('/admin/adminaddusers')
              console.log("entha pad");
          }else{

              db.get()
              .collection("userdetails")
              .insertOne(data, (err, collection) => {
                // console.log(dataToInsert);
                res.render('adduser',{added:"New user created successfully..."})
                if (err) throw err;
                
                console.log("insertion");
              });
            }
    })
    // let adduser = await db
    // .get()
    // .collection("userdetails")
    // .insertOne(data, (err, collection) => {
    //   console.log(req.body);
    //   if (err) throw err;
    //   console.log("insertion");
    // });

    // if (req.session.adminlogged) {
    //   res.redirect("/admin/getusers");
    // } else {
    //   res.redirect("/admin");
    // }
  }
}
const adlogout = (req, res) => {
  req.session.adminlogged = false;
  res.redirect("/admin");
}


// const postlogadmin = (req,res)=>{

//     res.redirect('/adminhome')
// }

module.exports = {
  getadminlog,
  adminhomeview,
  getusers,
  search,
  deleteuser,
  edituser,
  updateuser,
  adlogout,
  adduser,
  adminaddusers,
};
