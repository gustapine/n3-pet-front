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

app.get("/", function (req, res) {
    res.render("home");
});

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

    let info = {
        nome_pet: req.body.nome_pet,
        genero_pet: req.body.genero_pet,
        tutor: req.body.tutor,
        altura: req.body.altura
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
    res.render("searchPet");
});

app.post("/allPets", function (req, res) {
    let searchAltura = req.body.searchAltura

    axios.get(`http://localhost:5000/api/pet/altura/${searchAltura}`)
        .then(response => {
            console.log(response.data);
            const data = response.data;
            res.render("showPet", {
                data: data.map(pet => ({
                  nome: pet.nome_pet,
                  genero: pet.genero_pet,
                  altura: pet.altura
                }))
              });
        })
        .catch(error => {
            console.error(error);
            res.render("error");
        });
})

app.get('/searchByTutor', (req, res) =>{
    res.render("searchPetTutor");
})

app.post('/searchByTutor', (req, res) => {
  let searchTutor = req.body.searchTutor;

  axios.get(`http://localhost:5000/api/pet/nomeTutor/${searchTutor}`)
    .then(response => {
      console.log(response.data);
      const data = response.data;

      res.render("showPet", {
        data: data.map(pet => ({
          nome: pet.nome_pet,
          genero: pet.genero_pet,
          altura: pet.altura
        }))
      });
    })
    .catch(error => {
      console.error(error);
      res.render("error");
    });
});


app.get('/showPet', (req, res) =>{
    res.render("showPet");
})

app.listen(7000, function () {
    console.log("Server started on port 7000");
});
