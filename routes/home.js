const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
      res.render('index' , {title:"homepage" , message:"Welcome Home.....!!!"})
})

module.exports = router;