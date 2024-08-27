const express = require("express");
const Sequelize = require('sequelize');//conexao com mysql
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const { engine } = require('express-handlebars');
app.use(express.static('public'));
const port = 3001;

// handlebars
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', engine());
app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true, // Habilita o acesso a propriedades do protótipo
        allowProtoMethodsByDefault: true
    }
}));
// body parser
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

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
        type: Sequelize.STRING
    },
    lanceInicial: {
        type: Sequelize.STRING
    },
    histLances: {
        type: Sequelize.STRING
    },
    NumZap:{
        type: Sequelize.STRING
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

// app.get("/leilao01", function(req,res){
//     res.sendFile(__dirname+"/pages/leilao01.html")
// })

app.post("/lance", function(req, res) {
    const { leilaon, lanceFixo, numeroZap, nome } = req.body;
    
    // Encontre o maior lance atual para o leilão específico
    lance.findOne({
        where: { leilao: leilaon },
        order: [['lanceInicial', 'DESC']]
    }).then(function(lanceAnterior) {
        const lanceAtual = parseFloat(lanceFixo);
        
        // Verifica se o lance anterior existe e se o lance atual é maior
        if (!lanceAnterior || lanceAtual > parseFloat(lanceAnterior.lanceInicial)) {
            // Cria o novo lance, pois ele é maior
            return lance.create({
                leilao: leilaon,
                lanceInicial: lanceAtual,
                histLances: lanceFixo, // Pode ajustar conforme sua lógica
                NumZap: numeroZap,
                nomeComprador: nome
            });
        } else {
            // Retorna um erro se o lance atual não for maior
            throw new Error('O lance atual deve ser maior que o lance anterior.');
        }
    }).then(function() {
        res.sendFile(__dirname + "/pag02.html", function(erro) {
            if (erro) {
                res.send("Houve um erro: " + erro);
            }
        });
    }).catch(function(erro) {
        res.send("Houve um erro ao criar o lance: " + erro.message);
    });
});

app.get("/leilao01", function(req,res){
    lance.findAll().then(lances => {
        res.render('leilao01', {lances: lances});
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
})



console.log("servidor rodando na porta 3000");
app.listen(3001);