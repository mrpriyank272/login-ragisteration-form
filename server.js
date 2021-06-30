require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models/sign')
const app = express();
const auth = require("./middleware/auth");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.set('view engine', 'ejs');

app.get('/', (req,res) =>{
    res.render('index')
})
app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/userprofile",(req,res)=>{
    res.render("userprofile");
});

app.get("/securepage", auth ,(req,res)=>{
    res.render("securepage");
});

app.get("/register",(req,res)=>{
    res.render("register");
});


app.post("/register",async(req,res)=>{
    console.log(req.body)
    const username = req.body.username
    const email = req.body.email
    const phone = req.body.phone
    const grade = req.body.grade
    const dateofbirth = req.body.dateofbirth
    const password = req.body.password
    if (!username || !email || !phone || !grade || !dateofbirth || !password)
       res.send("missing");
    //    return ('something missing');

    const record = new db({
        username:username,
        email:email,
        phone:phone,
        grade:grade,
        dateofbirth:dateofbirth,
        password:password
    })

    await record.save()
    console.log("the success part" + record);
    res.send("register successfully");
})

app.post("/login", async(req,res) =>{
    try {
        const email = req.body.email;
        const password = req.body.password;


        const useremail = await db.findOne({email:email});
        console.log(useremail);

        const isMatch = await bcrypt.compare(password, useremail.password);

        const token = await useremail.generateAuthToken();
        console.log("the token part" + token); 

        res.cookie("jwt", token, {
            expires:new Date(Date.now() + 50000),
            httpOnly:true
        });
        
        if(isMatch){
            res.status(201).render("userprofile");
        }else{
            res.send("Password are not matching");
        }
    } catch (error) {
        res.status(400).send("invalid email")
    }
})
  
mongoose.connect('mongodb://localhost:27017/signpage', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log(`connection successful`);
}).catch((err) => {
    console.log(`no connection`);
})

app.listen(8000, () =>{
    console.log('server is started')
});


