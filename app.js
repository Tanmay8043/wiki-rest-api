const express= require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema ={
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

//------------------------------------------"/articles" route-----------------------------------------------
app.route("/articles")

.get(function(req,res){
  Article.find(function(err, results){
    if(!err)
    res.send(results);
    else res.send(err);
  });
})

.post(function(req,res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Succesfully posted a new article.");
    }else{
      res.send(err);
    }
  });
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Succesfully deleted all the articles.");
    }else{
      res.send(err);
    }
  })
});

//------------------------------------------"/articles/" route(A specific article route)-----------------------------------------------
app.route("/articles/:title")
.get(function(req, res){

  Article.findOne({title: req.params.title}, function(err, result){
    if(result){
      res.send(result);
    }else{
      res.send("No such articles found");
    }
  })
})
.put(function(req, res){
  Article.update(
    {title: req.params.title},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Succesfully updated the article.");
      }else{
        res.send(err);
      }
    }
  )
})
.patch(function(req, res){
  Article.update(
    {title: req.params.title},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Succesfully updated the article.");
      }else{
        res.send(err);
      }
    }
  )
})
.delete(function(req, res){
  Article.deleteOne(
  {title: req.params.title},
  function(err){
    if(!err){
      res.send("Succesfully deleted the article.");
    }else{
      res.send(err);
    }
  }
  )
});

app.listen(3000, function(){
  console.log("Server is running on port 3000");
})
