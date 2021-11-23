const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost/express-db',{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,  //必需加否则报错！
    autoIndex: false   //被禁用，因为索引创建可能会导致显著性能影响
},function(err){
    if(err){
        console.log('链接数据库失败：'+err);
    }else{
        console.log('数据库连接成功！');
    }
})
const UserSchema=new mongoose.Schema({
   email:{
       type:String,
       unique:true
   },
   code:{
     type:String  
   }
})
module.exports=mongoose.model('Yanzheng',UserSchema);
