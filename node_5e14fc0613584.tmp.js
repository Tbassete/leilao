const express = require("express");
const Sequelize = require('sequelize');//conexao com mysql
const app = express();
app.use(express.static('public'));
const port = 3000;

// conexao com o banco de dados mysql
const sequelize = new Sequelize('postapp', 'root', 'jaguarasso',{
    host: "localhost",
    dialect: 'mysql'
})

sequelize.authenticate().then(function(){
    console.log("conectou com sucesso")
}).catch(function(erro){
    console.log("falha ao se conectar:"+erro)
})

//criar a table no mysql
const lance = sequelize.define('lance', {

    leilao: {
        type: Sequelize.INTEGER
    },
    lanceInicial: {
        type: Sequelize.INTEGER
    },
    histLances: {
        type: Sequelize.INTEGER
    },
    NumZap:{
        type: Sequelize.INTEGER
    },
    nomeComprador:{
        type: Sequelize.STRING
    },
    dataLimite:{
        type: Sequelize.DATE
    }
})
//execute esse comando so uma vez para criar a table
// lance.sync({force: true}).then(() => {
//     console.log('Tabela criada com sucesso!');
//   }).catch((error) => {
//     console.error('Erro ao criar a tabela:', error);
//   }); 

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

app.get("/leilao01", function(req,res){
    res.sendFile(__dirname+"/public/pages/leilao01.html")
})


// app.get("/darlance", function(req, res){
    
// })


console.log("servidor rodando na porta 3000");
app.listen(3000);