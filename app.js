//jshint esversion:6

const axios = require('axios');
const express = require('express');
const bodyParser = require("body-parser");
const _ = require('lodash')

const ejs = require('ejs');

let entry = [];

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const url = 'http://localhost:5000/api/tutor/getAllTutors'

app.get("/", function (req, res) {
    // axios.get(url)
    //     .then(response => {
    //         // Processar os dados da resposta da API
    //         console.log(response.data);
    res.render("home");
    //     })
    //     .catch(error => {
    //         console.error(error);
    //         res.render("error");
    //     });
});



// processo de login
app.get('/login', function (req, res) {

    res.render('login');
});

app.post('/login', function (req, res) {
    let email = req.body.email;
    let senha = req.body.senha;
  
    let info = {
      email: email,
      senha: senha
    };
  
    axios.post('http://localhost:5000/auth/login', info)
      .then(response => {
        console.log(response.data);
        res.redirect('/');
      })
      .catch(error => {
        console.error(error);
        res.render("invalid");
      });
  });
  

app.get("/register", function (req, res) {
    res.render("register");
});

app.post('/register', function (req, res) {

  
    let info = {
        nome: req.body.nome,
        email: req.body.email,
        cpf: req.body.cpf,
        senha: req.body.senha
    }
  
    axios.post('http://localhost:5000/api/tutor/addTutor', info)
      .then(response => {
        console.log(response.data);
        res.redirect('/');
      })
      .catch(error => {
        console.error(error);
        res.render("error");
      });
  });


app.get("/addPet", function (req, res) {
    res.render("addPet");
});

app.post("/addPet", function (req, res) {

    let alt = req.body.altura

    if (alt <= 15 ) {
        var Altura = 1
    } else if(alt > 15 && alt < 45) {
        var Altura = 2
    }else{
        var Altura = 3
    }

    let info = {
        nome_pet: req.body.nome_pet,
        genero_pet: req.body.genero_pet,
        tutor: req.body.tutor,
        altura: Altura
    }

    axios.post('http://localhost:5000/api/pet/addPet', info)
      .then(response => {
        console.log(response.data);
        res.redirect('/');
      })
      .catch(error => {
        console.error(error);
        res.render("error");
      });
    
});



app.get("/updatePet", function (req, res) {
    res.render("updatePet");
});

app.get("/allPets", function (req, res) {
    axios.get('http://localhost:5000/api/pet/getAllPets')
        .then(response => {
            // Processar os dados da resposta da API
            console.log(response.data);
            res.render("allPets");
        })
        .catch(error => {
            // Tratar erros
            console.error(error);
            res.render("error");
        });
});





app.post('/compose', function (req, res) {
    let title = req.body.newTitle;
    let content = req.body.newContent;

    let entries = {
        title: title,
        content: content
    }
    entry.push(entries)
    console.log(entries);
    res.redirect('/allPosts');
});


app.get('/allPosts/:entryTitle', (req, res) => {
    const requestedTitle = _.lowerCase(req.params.entryTitle);
    console.log(req.params.entryTitle)
    entry.forEach(function (entry) {
        const storedTitle = _.lowerCase(entry.title)

        if (storedTitle === requestedTitle) {
            console.log('found');
            res.render("post", {
                title: entry.title,
                content: entry.content
            })
        } else {
            console.log('not found');
        }
    })
});

app.listen(7000, function () {
    console.log("Server started on port 7000");
});
