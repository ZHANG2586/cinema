//接受请求并验证cookie中存储的token（封装）
const {varifyToken}=require('./token.js');

//此处不能直接放到最开始的app.use()中来接受所有的请求，因为该导出的方法需要参数，只能放到express的路由中了！（否则会报req和res未定义的错误）
module.exports=(req,res,next)=>{
    console.log('登陆进来了');
    let url=req.url;       //当前访问的url，不包含参数？后面的。
    console.log(url);
    let whiteUrl='/denglou';     //白名单，不需要token验证的，暂时只加这几个
    console.log(whiteUrl);
    if(whiteUrl.indexOf(url)===0 && whiteUrl.length === url.length){
        return;     //找到是白名单的直接放行，不验证（此处只限于添加了token验证函数，对于没有添加token验证的express路由（相当于默认不需要token验证的请求））
    }else{
    console.log('进来验证了');
    //
    // let token=req.headers.authorization;
    let token=req.cookies['mt_token'];      //获取前端axios请求传来的token（该token被存储在cookie中，即获取前端请求头中的cookie）
    console.log(token);
    let result=varifyToken(token);     //调用token.js文件里的验证token的方法
    console.log(result);
    if(result.code==606){
        res.send(result);          //验证失败时返回的信息
        
    }else{
        // req.resToken=result;        //验证成功时，不做任何操做（即可以执行本次请求的目的操作了）
        // return next();
    }
    }
};