//对token生成和有效性的验证的封装
const jwt=require('jsonwebtoken');
const secret='kendnkkoadwdyw';   //密钥，防止篡改，此处直接用了一个字符串，不用密钥生成了（也可以把密钥放到一个文件里，然后读取fs.readFile()）
//此处的密钥作用是用来把token的头部（已被base64加密）和载荷（已被base64加密）加该密钥后，用HS256算法或其他算法加密形成token的最后一段也叫签名（token的个段是用点'.'来分割的）
//所以token3段的形成就是在签名处形成的。
//最主要的目的：服务器应用在接受到JWT后，会首先对头部和载荷的内容用同一算法再次签名，如果服务器应用对头部和载荷再次以同样方法签名之后发现，自己计算出来的签名和接受到的签名不一样，那么就说明这个Token的内容被别人动过的，我们应该拒绝这个Token，返回一个HTTP 401 Unauthorized响应。


//token生成方法---data是自定义的信息，exp是传的过期时间
let createToken=function(data,exp){
    let obj={};
    obj.data=data?data:null;
    obj.type='jsonwebtoken';
    obj.ctime=new Date().getTime();    //token的创建时间
    exp=exp?exp:60*60*24;        //设定超时时间，不设置就默认一天
    let token=jwt.sign(obj,secret,{expiresIn:exp});    //调用token的生成方法
    return token;
};

//token验证，传入token
let varifyToken=(token)=>{
     let info=jwt.verify(token,secret,(error,res)=>{
         var data={};   //通过回调函数自定义返回信息，不然默认的是创建token时传进的obj和时间，这里加上状态码
          if(error){
               data.code='606';         //此定义的失败码
               data.msg='token验证失败';
               data.obj=error;          //存失败信息，比如过期等等
          }else{
               data.code='608';
               data.msg='token验证成功';
               data.obj=res;
          }
          return data;
     });
     console.log(info);
      return info;

};
module.exports={createToken,varifyToken};
