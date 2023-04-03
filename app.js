//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");


const mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://harryraj1413:test123@cluster0.ahznuwr.mongodb.net", {useNewUrlParser: true});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "milk"
});

const item2 = new Item({
  name: "eggs"
});

const item3 = new Item({
  name: "Give laundry"
})

const defaultItems = [item1,item2,item3];

// const listSchema ={
//   name: String,
//   items: [itemsSchema]
// };

// const List = mongoose.model("List", listSchema);




app.get("/", function(req, res) {
  Item.find({})
  .then(function(foundItems ){

    if(foundItems.length === 0){
      Item.insertMany(defaultItems)
      .then(function () {
          console.log("Successfully added defult items to DB");
      })
      .catch(function (err) {
          console.log(err);
      });

      res.redirect("/");
    }

    else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }

  })
  .catch(function(err){
    console.log(err);
  })


  
  

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();

  res.redirect("/");
  
});

app.post("/delete", function(req,res){
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId)
  .then(function () {
    console.log("Successfully deleted");
    
})
.catch(function (err) {
    console.log(err);
});

res.redirect("/");



});

// app.get("/:customListName", function(req,res){
//   const customListName =req.params.customName;

//   List.findOne({name: customListName})
//   .then(function(foundList){
//       if(!foundList){
//         // create a new list
//         const list = new List({
//           name: customListName,
//           items: defaultItems
//         });

//         list.save();
//         res.redirect("/"+customListName);
//       }
//       else{
//         // show existing list

//         res.render("list", {listTitle: foundList.name, newListItems: foundList.items})

//       }
//   })
//   .catch(function (err) {
//     console.log(err);
// });
// })

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
