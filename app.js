const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/godoDB", {useNewUrlParser: true});

//Database

const noteSchema = {
    creator: String,
    title: String,
    content: String,
    date: String,
    color: String,
    userGroup: String,
};

const Note = mongoose.model("Notes", noteSchema);

//Functional (get, post)

app.get("/notes", function(req, res){
    Note.find(function(err, foundNotes){
        if(!err){
        res.send(foundNotes)
        }else{
            res.send(err);
        }
    })
});

app.post("/notes", function(req, res){
    console.log(req.body.creator);
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.body.date);
    console.log(req.body.color);
    console.log(req.body.userGroup);

    const newNote = new Note({
    creator: req.body.creator,
    title: req.body.title,
    content: req.body.content,
    date: req.body.date,
    color: req.body.color,
    userGroup: req.body.userGroup,
    });

    newNote.save(function(err){
        if(!err){
            res.send("new notes added to the database.")
        }else{
            res.send(err)
        }
    });
});

//Specific function

app.route("/notes/:notesTitle")
.get(function(req, res){
    Note.findOne({title: req.params.notesTitle}, function(err, foundNote){
        if(foundNote){
            res.send(foundNote)
        }else{
            res.send("not able to find this note.")
        };
    });
})
.put(function(req, res){
    Note.update(
        {title: req.params.notesTitle},
        {creator: req.body.creator,
            title: req.body.title,
            content: req.body.content,
            date: req.body.date,
            color: req.body.color,
            userGroup: req.body.userGroup},
            {overwrite: false},
            function(err){
                if(!err){
                    res.send("updated note");
                }
            }
    )
})
.delete(function(req,res){
    Note.deleteOne(
        {title: req.params.notesTitle},
        function(err){
            if(!err){
                res.send("Note Deleted")
            }else{
                res.send(err)
            }
        }
    )
});

//TODO

app.listen(3000,function(){
    console.log("Server running on port 3000")
});