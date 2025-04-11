const express = require("express");
const cors = require('cors');
const helmet = require('helmet')
const cookieParser = require("cookie-parser")
const path = require('path')
const ejs = require('ejs')
const app = express();
const mongoose = require('mongoose')
const User = require('./models/Users');
const multer = require('multer');
const ort = require('onnxruntime-node');
const tiff = require('tiff');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

app.set('template engine', "ejs")

app.use('/public',express.static('public'))
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true,}))
app.use(cookieParser())
app.use(helmet());

app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; worker-src 'self' blob:",
      "script-src 'self'; style-src 'self' 'unsafe-inline'"
    );
    next();
  });


  const connectWithRetry = () => {
    console.log('Attempting MongoDB connection to mongodb://mongo:27017/myapp...');
    mongoose.connect('mongodb://mongo:27017/myapp')
      .then(() => {
        console.log('Connected to MongoDB successfully');
      })
      .catch(err => {
        console.error('MongoDB connection error:', err.message);
        console.log('Retrying in 5 seconds...');
        setTimeout(connectWithRetry, 500);
      });
  };
  
  connectWithRetry();

app.post('/predict', upload.single('image'), async (req, res) => {
    try {
        // Load TIFF image
        const rawData = fs.readFileSync(req.file.path);
        let tiffData;
        
        try {
            // Attempt to decode TIFF
            const decoded = tiff.decode(rawData, { ignoreImageTypes: false });
            console.log('Decoded TIFF structure:', Object.keys(decoded));
            
            // Handle multi-page TIFF (use first page)
            tiffData = Array.isArray(decoded) ? decoded[0] : decoded;
            
            console.log('TIFF properties:', {
                width: tiffData.width,
                height: tiffData.height,
                dataLength: tiffData.data ? tiffData.data.length : 'undefined',
                dataType: tiffData.data ? tiffData.data.constructor.name : 'undefined'
            });
        } catch (decodeError) {
            throw new Error(`TIFF decoding failed: ${decodeError.message}`);
        }

        // Validate TIFF data
        if (!tiffData || typeof tiffData.width !== 'number' || 
            typeof tiffData.height !== 'number' || !tiffData.data) {
            throw new Error('Invalid TIFF structure: missing width, height, or data');
        }

        const width = tiffData.width;
        const height = tiffData.height;
        
        // Verify channel count
        const expectedLength = width * height * 13;
        if (!tiffData.data.length || tiffData.data.length < expectedLength) {
            throw new Error(`Invalid channel count: expected ${expectedLength} values (13 channels), got ${tiffData.data.length || 0}`);
        }

        // Create input tensor
        const inputData = new Float32Array(tiffData.data);
        const inputTensor = new ort.Tensor('float32', inputData, [1, 13, height, width]);

        // Load ONNX model
        const session = await ort.InferenceSession.create('./unet.onnx');

        // Run inference
        const feeds = { input: inputTensor };
        const results = await session.run(feeds);

        const outputTensor = results.output;
        const outputData = outputTensor.data;

        // Convert predictions to base64 images
        const predictedImages = [];
        for (let channel = 0; channel < 7; channel++) {
            const channelData = new Uint8Array(height * width);
            const offset = channel * height * width;
            
            for (let i = 0; i < height * width; i++) {
                const value = outputData[offset + i];
                channelData[i] = Math.min(255, Math.max(0, Math.round(value * 255)));
            }

            const canvas = require('canvas').createCanvas(width, height);
            const ctx = canvas.getContext('2d');
            const imageData = ctx.createImageData(width, height);
            
            for (let i = 0; i < channelData.length; i++) {
                const idx = i * 4;
                imageData.data[idx] = channelData[i];
                imageData.data[idx + 1] = channelData[i];
                imageData.data[idx + 2] = channelData[i];
                imageData.data[idx + 3] = 255;
            }
            
            ctx.putImageData(imageData, 0, 0);
            predictedImages.push(canvas.toDataURL('image/png'));
        }

        fs.unlinkSync(req.file.path);
        res.json({ images: predictedImages });
    } catch (error) {
        console.error('Error details:', error);
        fs.unlinkSync(req.file.path);
        res.status(500).json({ 
            error: 'Prediction failed', 
            details: error.message 
        });
    }
});

app.get('/', async (req, res)=>{
    if(req.cookies.email && req.cookies.password){
        try {
            const user = await User.findOne({ email:req.cookies.email });
            
            if (!user) {
                return res.render('logSignPage.ejs')
            }
    
            const isMatch = await user.comparePassword(req.cookies.password);
            
            if (!isMatch) {
                return res.render('logSignPage.ejs')
            }
    
            return res.render('index.ejs')
        } catch (err) {
            console.error('Login error:', err);
            return res.send('An error occurred during login');
        }
    }

    if(req.cookies.NAME && req.cookies.PASSWORD && req.cookies.EMAIL){
        return res.render('index.ejs')
    }else{
        return res.render('logSignPage.ejs')
    }
})


app.post('/Log.ejs', async (req, res)=>{
    var NAME = req.body.name1
    var PASSWORD = req.body.pass1
    var EMAIL = req.body.em1
    // return res.render('Log.ejs')

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
        console.log("ok")
        return res.render('index.ejs')
        
    } catch (err) {
        console.error('Login error:', err);
        return res.send('An error occurred during login');
    }
})

app.get('/index.ejs', (req, res)=>{
    return res.render('index.ejs')
})

app.get('/WaterModel.ejs',(req, res)=>{
    return res.render('WaterModel.ejs')
})


app.get('/Informative.ejs',(req, res)=>{
    return res.render('Informative.ejs')
})

app.get('/About.ejs',(req, res)=>{
    return res.render('About.ejs')
})

app.listen(3000, ()=>{
    console.log(`Server is Listening on port.... http://localhost:3000/`)
})
