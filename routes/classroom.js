const path = require('path');

const express = require('express');

const classController = require('../controllers/classroom');

const router = express.Router();

router.get('/',(req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/html')
    res.end('<html><body><form action="/upload" method=""><button>Click me</button></form></body></html>')
})
router.post('/upload',classController.upload)

module.exports = router