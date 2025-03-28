const express = require("express");
const cors = require('cors');
const helmet = require('helmet')
const cookieParser = require("cookie-parser")
const path = require('path')
const ejs = require('ejs')
const app = express();
const mongoose = require('mongoose')
const User = require('./models/Users');

app.set('template engine', "ejs")

app.use('/public',express.static('public'))
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true,}))
app.use(cookieParser())
app.use(helmet())



mongoose.connect('mongodb://localhost:27017/login-signup')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


app.get('/', async (req, res)=>{
    if(req.cookies.email && req.cookies.password){
        try {
            const user = await User.findOne({ email:req.cookies.email });
            if (!user) {
                res.render('logSignPage.ejs')
            }
    
            const isMatch = await user.comparePassword(req.cookies.password);
            if (!isMatch) {
                res.render('logSignPage.ejs')
            }
    
            res.render('index.ejs')
        } catch (err) {
            console.error('Login error:', err);
            res.send('An error occurred during login');
        }
    }

    if(req.cookies.NAME && req.cookies.PASSWORD && req.cookies.EMAIL){
        res.render('index.ejs')
    }else{
        res.render('logSignPage.ejs')
    }
})


app.post('/Log.ejs', async (req, res)=>{
    var NAME = req.body.name1
    var PASSWORD = req.body.pass1
    var EMAIL = req.body.em1
    res.render('Log.ejs')

    try {
        const existingUser = await User.findOne({ $or: [{ NAME }, { EMAIL }] });
        if (existingUser) {
            res.render('Log.ejs')
        }
        const user = new User({username:NAME, email:EMAIL, password:PASSWORD});
        await user.save();

        console.log(`Signup successful - Username: ${NAME}, Email: ${EMAIL}`);
        res.render('Log.ejs')
    } catch (err) {
        console.error('Signup error:', err);
        res.send('An error occurred during signup');
    }
})

app.post('/index.ejs', async (req, res)=>{
    console.log(req.body)
    var EMAIL = req.body.em2
    var PASSWORD = req.body.pass2
    const rememberMe = req.body.remember === 'on';
    
    if (!EMAIL || !PASSWORD) {
        return res.send('Username and password are required');
    }

    try {
        const user = await User.findOne({ email:EMAIL });
        if (!user) {
            return res.send('Invalid username or password');
        }

        const isMatch = await user.comparePassword(PASSWORD);
        if (!isMatch) {
            return res.send('Invalid username or password');
        }

        console.log(`Login successful - Username: ${EMAIL}, Remember Me: ${rememberMe}`);
        res.cookie("email", EMAIL)
        res.cookie("password", PASSWORD)
        res.render('index.ejs')
        
    } catch (err) {
        console.error('Login error:', err);
        res.send('An error occurred during login');
    }
})



app.listen(3000, ()=>{
    console.log(`Server is Listening on port.... http://localhost:3000/`)
})
