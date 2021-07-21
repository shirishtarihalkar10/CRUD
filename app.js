//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const axios = require("axios");

const app = express();
const url = "https://gorest.co.in/public/v1/users"
const key = "?access-token=e2edc0743c42fdef76591140a60b87382508de6efe66cd7f8508e187ce2128ab"

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(express.static("public"));

// GET function for displaying all users
app.get("/users", function(req, res){

  getUrl = url + process.env.KEY
  https.get(url,function(response){
    console.log(response.statusCode);

      response.on("data",function(data){
      const APIdata = JSON.parse(data);
      const APIusersData = APIdata.data
      res.render("home",{
        userData: APIusersData
      });

    });
  })

});

// GET function for displaying the data of specific user
app.get("/users/:userid",function(req,res){

  userRequestedId = req.params.userid;
  userURL = url + "/" + userRequestedId + key

  https.get(userURL,function(response){
    console.log(response.statusCode);
    response.on("data",function(data){
      const APIData = JSON.parse(data);
      const APIuserData = APIData.data;
      res.render("userdets",{
        userData: APIuserData
      })

    })

  })
})

// GET function for displaying the post made by the user
app.get("/users/:userid/posts",function(req,res){

  userRequestedId = req.params.userid;
  userURL = url + "/" + userRequestedId + "/posts" + key

  https.get(userURL,function(response){
    console.log(response.statusCode);
    response.on("data",function(data){
      const APIData = JSON.parse(data);
      const APIpostData = APIData.data;
      res.render("post",{
        userPost: APIpostData
      })
    })
  })
})

app.get("/users/:userid/compose",function(req,res){
  userID = req.params.userid
  res.render("compose",{
    userID: userID
  })
})

// POST the data entered by the user
app.post("/users/:userid/compose", function(req, res){
  const userID = req.params.userid
  const postUrl = "https://gorest.co.in/public/v1/users/"+userID+"/posts" + key
  console.log(postUrl);
  const data = JSON.stringify({
    id: userID,
    user_id: userID,
    title: req.body.postTitle,
    body: req.body.postBody
  })

  axios.post(postUrl,data,{
    headers: {
      'content-type': 'application/json'
    }
  }).then(res=>{
    console.log("Status Code: "+ res.status);
    console.log("Body: "+ res.data);
    res.write();
  }).catch(err=>{
    console.log(err);
  })

  res.redirect("/users");
});


// Listening on port 3000
app.listen(process.env.PORT || 3000, function(){
  console.log("Server started on port 3000.");
});
