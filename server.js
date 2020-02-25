// configurando servidor
const express = require("express")
const server = express()
const nunjucks = require("nunjucks")

server.use(express.static('public'))

server.use(express.urlencoded({extended: true}))

const Pool = require('pg').Pool
const db =  new Pool({
    user: 'postgres',
    password: 'grasy',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})
//configurando template engine




nunjucks.configure("./", {
    express: server,
    noCache: true
})


server.get("/", function(req, res) {
   
    db.query("Select * from donors", function(err, result){
        if (err) return res.send("Erro de banco de dados.")
       
        const donors = result.rows
        return res.render("index.html", { donors})
    })
   
    
    })
   
    
server.post('/', function (req, res) {
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood
    
  
     if (name == "" || email == "" || blood == "") {
         return res.send("Todos os campos são obrigatórios.")
     }


    const query = `
    INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3) `

    const values = [name, email, blood]
    
    db.query(query, values, function(err) {

        if (err) return res.send("Erro de banco de dados.")
   

        return res.redirect("/")
        })

    })

    


server.listen(3000, function() {
    console.log("iniciei o servidor.")
})