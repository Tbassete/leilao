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
//execute esse comando so uma vez para criar a table
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





// app.post("/lance", function(req, res) {
//     const { leilaon, lanceFixo, numeroZap, nome } = req.body;
    
//     // Encontre o maior lance atual para o leilão específico
//     lance.findOne({
//         where: { leilao: leilaon },
//         order: [['lanceInicial', 'DESC']]
//     }).then(function(lanceAnterior) {
//         const lanceAtual = parseFloat(lanceFixo);
        
//         // Verifica se o lance anterior existe e se o lance atual é maior
//         if (!lanceAnterior || lanceAtual > parseFloat(lanceAnterior.lanceInicial)) {
//             // Cria o novo lance, pois ele é maior
//             return lance.create({
//                 leilao: leilaon,
//                 lanceInicial: lanceAtual,
//                 histLances: lanceFixo, // Pode ajustar conforme sua lógica
//                 NumZap: numeroZap,
//                 nomeComprador: nome
//             });
//         } else {
//             // Retorna um erro se o lance atual não for maior
//             throw new Error('O lance atual deve ser maior que o lance anterior.');
//         }
//     }).then(function() {
//         res.sendFile(__dirname + "/pag02.html", function(erro) {
//             if (erro) {
//                 res.send("ops: " + erro);
//             }
//         });
//     }).catch(function(erro) {
//         res.send("ops: " + erro.message);
//     });
// });





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


app.get('/teste', (req, res) => {
    console.log('Rota /teste acessada');
    res.render('teste.handlebars', { message: 'Hello World!' });
});


console.log("servidor rodando na porta 3001");
app.listen(3001);