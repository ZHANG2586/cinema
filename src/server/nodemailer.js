var nodemailer=require('nodemailer');
var Yanzheng=require('./yanzhengshujuku');
//对nodemailer发送邮件功能进行封装进行封装
function Hh(emails,call){       
    var transporter=nodemailer.createTransport({      //创建一个运输邮件的对象
        host:'smtp.qq.com',         //此处是主机号或者ip地址
        port:587,                  //端口号
        secure:false,              
        auth:{                        //定义要认证的数据
            user:'2586548378@qq.com',     //邮箱名
            pass:'vlhwdirpcflreabf'      //这里是授权密码而不是邮箱密码
        }
    });
    const randomFns=()=>{          //此函数用来生成一个随机的数字字符串（长度为6）
        let code='';
        for(let i=0;i<6;i++){
            code+=parseInt(Math.random()*10);
        }
        return code;
    };
    var code=randomFns();
   var mailOptions={                //SMTP信封的自定义,信封物业消息对象.
        from:'2586548378@qq.com',    //发送邮件方
        to:emails,                   //接收邮件方
        subject:'nodemailer邮件发送',    //邮件的主题
          //消息的HTML版本（此处使用了ES5中的模板字符串）
        html:`                           
        <p>你好！</p>
        <p>你正在修改密码</p>
        <p>你的验证码是：<strong style='color:#ff4e2a;'>${code}</strong></p>
        <p>***该验证码5分钟内有效***</p>`
        };
        transporter.sendMail(mailOptions,function(err,info){        //发送邮件
            if(err){
                  call(false);          
            }
            else{
                call(true);
            }
        });
        
        Yanzheng.find({email:emails},function(err,doc){       //此处查删
            if(err){
                console.log(err);
            }
            else{
                Yanzheng.deleteMany({email:emails},function(err,doc){
                    if(err){
                        console.log(err);
                    }
                })
            }
        }).then(()=>{
            Yanzheng.create({email:emails,code:code});    //此处时异步进行添加数据
        })
            
     
        // Yanzheng.create({email:emails,code:code});
        
        setTimeout(async ()=>{
             await Yanzheng.deleteMany({email:emails});     //设定一个定时器来在验证码到期时删除数据库中相应的验证码
         },1000*60*5);
       
}
module.exports={Hh};   //
