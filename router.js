const express = require('express') //创建路由实例
const router = express.Router()

router.get('/',(req,res) => {

  res.render('index.html')
})
router.get('/login',function(req,res){
    res.render('StaffLogin.html')
  })

  
module.exports = router  //暴露接口
