const express = require('express')
const User=require("./shuju")
var nodemailer=require('./nodemailer');
const Yanzheng=require('./yanzhengshujuku')
var cookieParser=require('cookie-parser');   //
const checkToken=require('./checkToken');
const request=require('request');
const qs=require('querystring');
// const axios=require()
const {createToken}=require('./token');
const app = express();
const port = 3016;

const cors=require('cors');  //cors设置
app.use(cors({
  origin:'http://localhost:3000',
  // origin:'http://192.168.3.13:5000',
  credentials:true
}));
app.use(cookieParser());

app.disable('view cache');
//node跨域设置
app.all('*', function (req, res, next) {
  //响应头指定了该响应的资源是否被允许与给定的origin共享。*表示所有域都可以访问，同时可以将*改为指定的url，表示只有指定的url可以访问到资源. 
    // res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Origin',"http://localhost:3000");   //如果要发送Cookie，就不能设为星号（*），必须指定明确的且与请求网页一致的域名。
    // res.header('Access-Control-Allow-Origin'," http://192.168.3.13:5000");
    res.header('Access-Control-Allow-Credentials',"true");      //允许带cookies
    res.header("Access-Control-Allow-Headers",  "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    //允许请求资源的方式
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
  });     //此处是解决跨域问题（只要域名，端口，通信协议这三者中任一一个不同都是跨域问题！或者在package.json中设置代理"proxy"(建议首选第一个) ）

// app.use(checkToken(req,res));  //不能在此处直接应用token验证，因为验证函数需要参数req和res所以不能直接添加到此处（否则会报错req，res未定义），应该在相应路由中添加token验证（且必须把它放在路由的最前面）。
// //注册(get)
// app.get('/',async(req,res)=>{       //此处是识别的是from的get的请求，async/await 来处理异步
//   console.log(req.query.userName);   //注意get请求，服务端要相应时应该使用req.query来获取get请求发送来的用户名和密码等全部数据！
//                                      //使用req.query.变量名 来获取相应的变量的值
//   const user=await User.create({     
  
//       username:req.query.userName,
//       password:req.query.password
//   })
//   res.send(req.query);
// })



//注册(post)      //当使用post来请求服务器时，不要直接在浏览器中直接访问对应路由（否则会报错），因为浏览器默认发出的请求都是get请求，在控制台会报错404 get（前提是服务器只有post路由）。
var bodyParser=require('body-parser');        //调用body-parser第三方模块           
app.use(bodyParser.urlencoded({extended:false}))    //此中间件的作用是获取请求字符串，然后转换成对象赋值给req.body

app.use(bodyParser.json());    //判断请求体格式是不是json格式，若是会调用json.parse方法把请求体转换成对象
//上面两个只会生效一个
 app.post('/',function(req,res){
  let user=req.body;
     User.create({
    username:req.body.username,
    password:req.body.password,
    email:req.body.email
  }).then(()=>{

  }).catch((err)=>{
      console.log('用户注册失败！');
      res.send(err);
  })
//  if(req.body.username){
//      res.redirect('http://localhost:3000');
//  }
  res.send(user);
})

const getCookieExpires=()=>{       //此处是设定cookie的生存时间
     const d=new  Date();
     d.setTime(d.getTime()+(60*60*1000));
     return d.toDateString();
}

//登录页面   
app.post('/denglou',function(req,res){
      // User.find({'username':req.body.username},function(err,doc){      //此处用于使用express和mongoess来在mongodb中查找（查找方法此处用的是find）指定的数据是否存在！
      //   if(err){
      //     console.log(err);
      //   }
      //   else{
      //     res.cookie('userId',doc.data[0]._id,{domain:'http://127.0.0.1:3000',path:'/',maxAge:5000000});
      //     // res.cookie('userid',doc._id,{maxAge:1000*60*24*7});
          
      //     res.json(doc);    //如果查找到了则用res.json来把数据转换成json同时响应给前端
      //   }
      // })
      checkToken(req,res);     //此处添加token验证
      User.findOne({'username':req.body.username}).then((doc)=>{      //此处使用了异步函数来处理，与上面的find()来查询，得到的效果一样（推荐使用此法）（不同之处是此处使用的是findOne（）来查询数据库，得到的结果是一个document对象(而用find（）得到的是一个文件数组)，在前端的响应处理时候会有点区别（一个是对data对象处理，一个是对data数组对象处理））。
        if(doc){
          // res.cookie('userId',doc.data._id,{domain:'http://localhost:3000',path:'/',maxAge:5000000});
          // let cookie_data = { username:'sssss', password: 'reeef' }; 
          // res.cookie( 'userinfo', JSON.stringify( cookie_data ), { domain: 'http://localhost:3000', httpOnly: false } );
          res.setHeader('Set-Cookie',`mt_token=${createToken(doc._id,'1h')};path=/;httpOnly:false;expires=${getCookieExpires()}`);    //
          res.json(doc);
        }else{
            throw new Error('密码错误或用户名错误!');
        }
      }).catch((err)=>{
          console.log(err);
      })

})
//第三方验证(此处不能使用redirect重定向，以为配置或是浏览器的设置原因导致res.redirect是以响应头中的res.data对象中的内容值的形式返回到前端的所以不会导致浏览器中的location的属性值发生变化，只能把它当作一个值在前端接受，在浏览器上来跳转（或者是要更改相应的配置，但是这种方法还没有找到具体的方案）)
const config={
  client_id:'6cc632d3f7b058f3ce32',
  client_secret:'bc92dc56a34938f5a48988274023a4c6ed91cb8a'
}
app.post('/github/login',function(req,res){
      var path="https://github.com/login/oauth/authorize";
      path+='?client_id='+config.client_id;
      res.json(path);
      // return res.redirect(path);

});

// code => token => userInfo 的过程
function getUserInfo (code) {
  return new Promise((resolve, reject) => {      //Promise古人云：“君子一诺千金”，这种“承诺将来会执行”的对象在JavaScript中称为Promise对象。 Promise有各种开源实现，在ES6中被统一规范，由浏览器直接支持。先测试一下你的浏览器是否支持Promise
    request.get({
      url: `https://github.com/login/oauth/access_token?client_id=${config.client_id}&client_secret=${config.client_secret}&code=${code}`,
    }, (err, res, body) => {
      var token = qs.parse(body).access_token;
      // console.log(qs.parse(body));
      console.log(token);
      resolve(token);
    })
  }).then((token) => {
    console.log(token)
    return new Promise((resolve, reject) => {
      request.get({
        // url: `https://api.github.com/user?access_token=${token}&scope=user`    //因为GitHub不再支持查询参数进行身份验证（即弃用了该方法！），所以不能使用把令牌放在url中来进行身份验证的方法。相反，必须将身份验证移动到标题中。
        url: `https://api.github.com/user`
        ,
        headers: {
          'User-Agent': 'Awesome-Octocat-App',
          'Authorization':"token "+`${token}`     //此方法是GitHub进行身份验证的新方法（上面的将token放在url中的旧方法已经被废弃了，若执意用旧方法获取不到用户信息）（参考此博客：https://blog.csdn.net/kuaileky/article/details/104217757）
        }
      }, (err, res, body) => {
        var userInfo=JSON.parse(body);
        console.log(body);
        console.log(userInfo);
        resolve(userInfo);
      })
    })
  })
}
//当进入到github登录界面后登录成功过后，会自动向服务器发起'/github/callback'的get请求(注意是get请求)
app.post('/github/callback',function(req,res){
          console.log(req.body);
          
          const code=req.body.code;
          const params={    
            client_id:config.client_id,
            client_secret:config.client_secret,
            code:code
          };
          getUserInfo(code).then((userInfo)=>{     
               console.log(userInfo.login);
              res.json(userInfo);
          })
});

//发送验证码（到qq邮箱使用的是smtp方式发送）
app.post('/yanzheng',function(req,res){
  console.log(req.body);
  console.log(req.body.email);
     nodemailer.Hh(req.body.email,(state)=>{    
       if(state){
         //在创建发送成功时给前端返回一个token（在请求修改时要进行token的验证）
         res.setHeader('Set-Cookie',`mt_token=${createToken(doc._id,'1h')};path=/;httpOnly:false;expires=${getCookieExpires()}`);    //此处生成一个token把并且把该token放在cookie中直接发送的浏览器的页面中保存到了浏览器页面的cookie中了，再次发起axios请求时会自带上刚才传到前端页面的cookie的值。
         return res.send('发送成功！');
       }else{
 
         return res.send('发送失败！');
       }
     })
})
//验证码和用户名以及qq邮箱号的验证阶段
app.post('/yanzheng/genggai',function(req,res){
    checkToken(req,res);   //检测token
    User.find({'username':req.body.username,'email':req.body.email},function(err,doc){
      if(err){
           console.log(err);
      }else{
        Yanzheng.find({'email':req.body.email,'code':req.body.code},function(err,doc){
          if(err){
            console.log(err);
          }else{
            Yanzheng.deleteMany({'email':req.body.email},function(err,doc){
              if(err){
                console.log(err);
              }
            });
            res.json('验证成功！');
          }

        })
      }

    })
})

//修改密码
app.post('/yanzheng/genggai/xougai',function(req,res){
    User.find({'username':req.body.username},function(err,doc){
      if(err){
        console.log(err);
      }else{
         User.updateOne({'username':req.body.username,'email':req.body.email},
         {'username':req.body.username,'password':req.body.password,'email':req.body.email},
         function(err,doc){
           if(err){
             console.log(err);
           }else{

             res.json('密码修改成功！');     //此处要修改（因为此处当输入的qq邮箱与数据库中的相应用户的qq邮箱不匹配时，此处不会报错还会显示密码更新成功！（但因为数据库没有更改所以根本就没修改成功！继而也无法用新密码进行登录））
           }
         });
      }

    })
})
const Huiyishuju=require('./huiyishuju');
//处理会议室的表单提交
app.post('/huiyi/biaodan',function(req,res){
    // Huiyishuju.find().then(               //此处find（）不适用他只能用于查找不适用于给前端返回数据集合，建议用mongodb的聚合管道机制！（因为它给前端返回的是一个空数组data，这是因为我们使用mongoose造成的（因为mongoose会在创建目标集合时，不仅会把指定的集合名用小写表示，还会自己给其后添加小写s））目的不仅是查看目标数据库中的目标集合里的
    //   (result)=>{
    //     if(result){
    //       console.log(result);
    //         res.send(result);
    //      }else{
    //        console.log(err);
    //      }
    //     }
    // )
    console.log(req);
    checkToken(req,res);      //添加token验证
    Huiyishuju.aggregate([                //此处使用了mongodb中的聚合管道机制来获取目标数据库中的目标集合中的所有文件数据，此处只是在聚合中用了$match过滤管道（和find（）作用一样）。
      {$match:{number:{$gte:'0'}}}         
    ],function(err,docs){
      if(err)
         {
           console.log(err);
           return;
         }
         res.json(JSON.stringify(docs));    //注意此处必须使用JSON.stringify(docs)来处理符合条件的数据文件，这样才能以data数组（但是此数组返回前段时已经被转换成了JSON字符串，需要使用JSON.parse（）把它转换成对象（即数组对象）才能当数组进行之后的操作）的形式的返回所有符合$match筛选管道的数据文件，否则只使用res.json(docs)只会得到数据库中符合条件的首个数据文件（后面符合的数据文件是不会被返回的）
    })
})
 //会议表单验证成功后提交，把请求数据添加到数据库
 app.post('/huiyi/biaodan/tianjia',function(req,res){
        checkToken(req,res);      //添加token验证
       Huiyishuju.create({id:req.body.id,huiyiname:req.body.huiyiname,number:req.body.number,star_time:req.body.star_time,end_time:req.body.end_time,status:req.body.status,reply:req.body.reply},function(err,doc){
             if(err){
               console.log(err);
             }
             else{
               res.json(doc);    //此处注意了（当使用的是res.json(req)时一直报错，但是数据又添加到了数据库中，但就是当放回到前端时axios的catch（err）不停相应！此处原因还未搞清！！！（有待解决！））
             }
       })
 })


// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })

//消息查询

//消息查询之发起人查询
app.post('/huiyi/faqiren',function(req,res){
      // checkToken(req,res);
      if(req.body.username!==''){
       User.find({'username':req.body.username},function(err,doc){
              if(err){
                console.log(err);
                res.send(err);
              }
              console.log(doc);
              res.json(doc);
       })}else{
           res.json({username:'false'});
       }
})

//消息查询之会议信息查询
app.post('/huiyi/xinxi',function(req,res){
    // checkToken(req,res);
    Huiyishuju.aggregate([                //此处使用了mongodb中的聚合管道机制来获取目标数据库中的目标集合中的所有文件数据，此处只是在聚合中用了$match过滤管道（和find（）作用一样）。
      {$match:{id : req.body.id}}         
    ],function(err,docs){
      if(err)
         {
           console.log(err);
           return;
         }
         res.json(JSON.stringify(docs));    //注意此处必须使用JSON.stringify(docs)来处理符合条件的数据文件，这样才能以data数组（但是此数组返回前段时已经被转换成了JSON字符串，需要使用JSON.parse（）把它转换成对象（即数组对象）才能当数组进行之后的操作）的形式的返回所有符合$match筛选管道的数据文件，否则只使用res.json(docs)只会得到数据库中符合条件的首个数据文件（后面符合的数据文件是不会被返回的）
      
    })
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})