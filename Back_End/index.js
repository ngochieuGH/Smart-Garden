const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "newdb"
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(express.json());
app.get("/",(req,res)=>{
    res.json({name: 'Monday, 13/11/2023'});
})
app.post("/login",(req,res)=>{
    const {username, password} = req.body;
    const sql = "SELECT name, token FROM user WHERE username = ? AND password = ?";
    con.query(sql,[username,password], (error, results, fields) => {
        if(error){
            console.log(error);
            return ;
        }
        if(results.length > 0){
            res.json(results);
        }
        else{
            console.log("Khong co du lieu");
        }
    })
})
app.post("/identified",(req,res) => {
    const data = req.body;
    console.log(data);
    const sql = "SELECT name, temp, water, soil, light FROM identified WHERE nameEng = ?";
    con.query(sql,[data], (error, results, fields) => {
        if(error){
            console.log(error);
            return ;
        }
        if(results.length > 0){
            res.json(results);
        }
        else{
            console.log("Khong co du lieu");
        }
    })
})
app.post("/disease",(req,res) => {
    const data = req.body;
    console.log(data);
    const sql = "SELECT name, description FROM disease WHERE nameEng = ?";
    con.query(sql,[data], (error, results, fields) => {
        if(error){
            console.log(error);
            return ;
        }
        if(results.length > 0){
            res.json(results);
        }
        else{
            console.log("Khong co du lieu");
        }
    })
})
//192.168.1.4
app.listen(3000,function () {
    console.log("Server is running on port 3000");
})