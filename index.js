const express = require("express");
const app = express();

const port = 3000;

app.get("/home", function(req, res){
    res.sendFile(__dirname+"/pag01.html")
})


app.get("/add", function(req, res){
    res.send("ta de sacanagi")
})



console.log("servidor rodando na porta 3000");
app.listen(3000);