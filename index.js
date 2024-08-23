const express = require("express");
const Sequelize = require('sequelize');//conexao com mysql
const app = express();

const port = 3000;

// conexao com o banco de dados mysql
const Sequelize = new Sequelize('lance', 'root', 'jaguarasso',{
    host: "localhost",
    dialect: 'mysql'
})

//criar a table no mysql
const lance = db.sequelize.define('lance', {

    leilao: {
        type: db.Sequelize.int
    },
    lanceInicial: {
        type: db.Sequelize.int
    },
    histLances: {
        type: db.Sequelize.int
    },
    NumZap:{
        type: db.Sequelize.int
    },
    nomeComprador:{
        type: db.Sequelize.TEXT
    }
})
//execute esse comando so uma vez para criar a table
// lance.sync({force: true}) 

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}

app.get("/home", function(req, res){
    res.sendFile(__dirname+"/pag01.html")
})


app.get("/add", function(req, res){
    res.send("ta de sacanagi")
})

function darlance(){

}

// app.get("/darlance", function(req, res){
    
// })


console.log("servidor rodando na porta 3000");
app.listen(3000);