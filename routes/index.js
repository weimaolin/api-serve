var express = require('express');
var router = express.Router();

// 导入数据库
var mysql = require('mysql')
// 导入node自带的加密模块(不需要安装)
//导入加密模块
const crypto = require("crypto");


var connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'weimaolin',
  database: 'test',
  useConnectionPooling: true
})



// 查看数据库是否连接成功
connection.connect(() => {
  console.log('数据库已连接成功,可以开始编写API接口!')
})



/* 编写注册API接口 请求方式：post*/
router.post('/register', (req, res) => {
  console.log(req.body);
  let username = req.body.username;
  let password = req.body.password;
  let md5 = crypto.createHash("md5");
  let newPas = md5.update(password).digest("hex");
  // 插入sql语句
  var regssql = "insert into user(username,password) values('" + username + "','" + newPas + "')";
  // 查询sql语句
  var selsql = "select username from user where username='" + username + "'"
  //将用户名和密码插入到数据表中的函数
  function regfun() {
    connection.query(regssql, (err, result) => {
      if (err) {
        console.log(err);
        return
      }
      res.json({
        code: 1,
        msg: "注册成功"
      })
      console.log('注册成功')
    })
  } // 先查询用户名是否存在，在决定注册插入用户名和密码
  connection.query(selsql, (err, result) => {
    if (err) {
      console.log(err)
      return
    }
    if (result == '') {
      regfun() // 执行插入函数
    } else {
      res.json({
        code: -1,
        msg: "注册失败，用户名已存在"
      })
      console.log(username + '用户名已存在')
    }

  })
})

/* 编写登录API接口 请求方式：post*/
router.post('/login', (req, res) => {
  console.log(req.body)
  let username = req.body.username;
  let password = req.body.password;
  let md5 = crypto.createHash("md5");
  let newPas = md5.update(password).digest("hex");
  connection.query(`select * from user where username= '${username}'`, (err, data) => {
    if (err) {
      res.send('网络错误504')
    }
    if (data) {
      if (data[0].password == newPas) {
        res.json({
          code: 1,
          msg: '登录成功!!'
        })
      } else {
        res.json({
          code: -1,
          msg: '用户名或密码错误,请重新输入!!'
        })
      }
    }
  })
})




router.post('/addContent', (req, res) => {
  let {
    name,
    date,
    phone,

    address,
    idCard,
    email,

  } = req.body;
  let content = [name, date, phone, address, idCard, email];
  const sqlStr = 'insert into info(name,date, phone, address, idCard, email) values(?,?,?,?,?,?)';
  connection.query(sqlStr, content, function (err, data) {
    if (err) {
      var result = {
        "status": "-1",
        "message": "你的信息已存在"
      }
      return res.jsonp(result);
    } else {
      var result = {
        "status": "1",
        "message": "信息提交成功",
        data: data
      }
      console.log('successfully')
      return res.jsonp(result)
    }
  })
})


router.post('/delete', (req, res) => {
  const id = req.body.id;
  // const sqlStr = ('delete from info where id=' + id);
  connection.query('delete from info where id=' + id, (err, data) => {
    if (err) {
      throw err
    } else {
      res.send(data)
    }
  })
})







router.post('/update', (req, res) => {
  console.log(req.body)
  const id = req.body.id
  const name = req.body.name;
  const date = req.body.date;
  const phone = req.body.phone;
  const idCard = req.body.idCard;
  const address = req.body.address;
  const email = req.body.email;
  connection.query(`update info set name='${name}',date='${date}',phone='${phone}',idCard='${idCard}',address='${address}',email='${email}' WHERE ID='${id}'`, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send('database err').end();
    } else {
      res.send('修改成功');
    }
  })
})


router.get('/search', (req, res) => {
  const sqlStr = 'select * from info';
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err
    } else {
      res.send(data)
    }
  })
})

// 测试接口
router.post('/getData',(req,res)=>{
 var hello=req.body;
 var hellos="handsomeboy"
 res.send(hellos)
})






// router.post('/random',(req,res)=>{
//   const list=[];
//   for (let i = 0; i <4; i++) {
//     const index=Math.floor(Math.random()*(61-0+1)+0);
//     const number=String.fromCharCode(list[index])
//     console.log(number)
    
//   }
// })

module.exports = router, connection;


// create table info(
//   id int(11) not null auto_increment,
//  name varchar(11) not null unique,
//  date varchar(25) not null,
//  phone varchar(25) not null,
//  address varchar(50) not null,
//  idCard varchar(25) not null,
//  email varchar(25) not null,
//  PRIMARY KEY (`id`)
//  );