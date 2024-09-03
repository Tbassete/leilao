const express = require("express");
const Sequelize = require('sequelize');//conexao com mysql
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
const exphbs = require("express-handlebars")
// const handlebars = require('express-handlebars');
// const { engine } = require('express-handlebars');

const port = 3001;

// handlebars

// app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars");

// app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
// app.engine('handlebars', engine({defaultLayout: 'main'}))
// app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
// app.engine('handlebars', engine());


app.engine('handlebars', exphbs.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true, // Habilita o acesso a propriedades do protótipo
        allowProtoMethodsByDefault: true
    }
}));

//


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
        type: Sequelize.FLOAT
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
// execute esse comando so uma vez para criar a table
// lance.sync({force: true}).then(() => {
//     console.log('Tabela criada com sucesso!');
//   }).catch((error) => {
//     console.error('Erro ao criar a tabela:', error);
//   }); 

// module.exports = {
//     Sequelize: Sequelize,
//     sequelize: sequelize
// }

app.get("/home", function(req, res){
    res.sendFile(__dirname+"/pag01.html")
})

// app.get("/", function(req, res){
//     lance.findAll({
//       lances
//     }).then(lances => {
//         res.render('pag01.handlebars', { lances: lances, layout: false });
//     }).catch(erro => {
//         res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
//     });
// })

app.post("/lance", function(req, res) {
    const { leilaon, lanceFixo, numeroZap, nome } = req.body;

    // Converta lanceFixo para número
    const lanceAtual = parseFloat(lanceFixo);

    // Verifique se a conversão foi bem-sucedida
    if (isNaN(lanceAtual)) {
        return res.status(400).send("Valor de lance inválido.");
    }

    // Encontre o maior lance atual para o leilão específico
    lance.findAll({
        where: { leilao: leilaon },
        order: [['lanceInicial', 'DESC']],
        limit: 1 // Limitamos a 1 para pegar apenas o maior lance
    }).then(function(lances) {
        if (lances.length > 0) {
            // O maior lance será o primeiro na lista devido à ordenação DESC
            const lanceAnterior = lances[0];
            const lanceAnteriorValor = parseFloat(lanceAnterior.lanceInicial);

            // Adicione logs para depuração
            console.log(`Lance Atual: ${lanceAtual}`);
            console.log(`Lance Anterior: ${lanceAnteriorValor}`);

            // Verifique se o lance atual é estritamente maior que o anterior
            if (lanceAtual > lanceAnteriorValor) {
                // Cria o novo lance, pois ele é maior
                return lance.create({
                    leilao: leilaon,
                    lanceInicial: lanceAtual,
                    histLances: lanceFixo, // Ajuste conforme sua lógica
                    NumZap: numeroZap,
                    nomeComprador: nome
                });
            } else {
                // Se o lance atual não é maior, lance um erro
                throw new Error('O lance atual deve ser maior que o lance anterior.');
            }
        } else {
            // Se não houver lances, qualquer lance é válido
            return lance.create({
                leilao: leilaon,
                lanceInicial: lanceAtual,
                histLances: lanceFixo, // Ajuste conforme sua lógica
                NumZap: numeroZap,
                nomeComprador: nome
            });
        }
    }).then(function() {
        res.sendFile(__dirname + "/pag02.html", function(erro) {
            if (erro) {
                res.send("ops: " + erro);
            }
        });
    }).catch(function(erro) {
        res.send("ops: " + erro.message);
    });
});



app.get("/leilao01/:leilaoId", function(req,res){
    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao01.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });

})

app.get("/leilao02/:leilaoId", function(req,res){

    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao02.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
    
})

app.get("/leilao03/:leilaoId", function(req,res){

    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao03.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
    
})

app.get("/leilao04/:leilaoId", function(req,res){

    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao04.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
    
})

app.get("/leilao05/:leilaoId", function(req,res){

    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao05.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
    
})

app.get("/leilao06/:leilaoId", function(req,res){

    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao06.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
    
})

app.get("/leilao07/:leilaoId", function(req,res){

    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao07.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
    
})

app.get("/leilao08/:leilaoId", function(req,res){

    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao08.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
    
})

app.get("/leilao09/:leilaoId", function(req,res){

    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao09.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
    
})

app.get("/leilao10/:leilaoId", function(req,res){

    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao10.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
    
})

app.get("/leilao11/:leilaoId", function(req,res){

    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao11.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
    
})

app.get("/leilao12/:leilaoId", function(req,res){

    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao12.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
    
})

app.get("/leilao13/:leilaoId", function(req,res){

    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao13.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
    
})

app.get("/leilao14/:leilaoId", function(req,res){

    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao14.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
    
})

app.get("/leilao15/:leilaoId", function(req,res){

    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao15.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
    
})

app.get("/leilao16/:leilaoId", function(req,res){

    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao16.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
    
})

app.get("/leilao17/:leilaoId", function(req,res){

    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao17.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
    
})

app.get("/leilao18/:leilaoId", function(req,res){

    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao18.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
    
})

app.get("/leilao19/:leilaoId", function(req,res){

    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao19.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
    
})

app.get("/leilao20/:leilaoId", function(req,res){

    const leilaoId = req.params.leilaoId;

    lance.findAll({
        where: {
            leilao: leilaoId
        }
    }).then(lances => {
        res.render('leilao20.handlebars', { lances: lances, layout: false });
    }).catch(erro => {
        res.status(500).send("Houve um erro ao buscar lances: " + erro.message);
    });
    
})
console.log("servidor rodando na porta 3001");
app.listen(3001);