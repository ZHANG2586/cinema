// import logo from '../../../public/logo192.png';
// import '../denglou/denglou.css';
import React,{ Component, useEffect} from'react'
import axios from 'axios';
import ParticlesBg from 'particles-bg';
import ReactLive2d from 'react-live2d';

const App2 = () =>(
  <>
     <ReactLive2d width={300} height={500}></ReactLive2d>
  </>
)

//loading 动画的结束控制模块以及登陆界面的展示组件

class App extends Component{
  constructor(props){
    super(props);
    this.onSubmit=this.onSubmit.bind(this);
    this.onsubmit2=this.onsubmit2.bind(this);
    this.state={
      username:'',
      password:''
    }
  } 

  //添加人物模型组件
  componentWillMount(){
    if(this.state.username===''){
    setTimeout(()=>{
       window.L2Dwidget.init({
        pluginRootPath: 'live2dw/',
        pluginJsPath: 'lib/',
        pluginModelPath: 'live2d-widget-model-z16/assets/',
        tagMode: false,
        debug: false,
        model: { jsonPath: '../live2dw/live2d-widget-model-haru_2/assets/haru02.model.json' },
        display: { position: 'left', width: 150, height: 400 },
        mobile: { show: true },
        log: false
       })
    },1000);
   }
  }
  
  //react项目启动时 loading 动画的结束控制
  componentDidMount(){
    let loading=document.getElementById('Loading');
    if(loading){
         document.body.removeChild(loading);
    }
  }

   onChange(e){
     this.setState({
       [e.target.name]:e.target.value
     });
     console.log(e.target.name);
   }

  onSubmit(e){ 
             e.preventDefault();
             console.log(this.state.username);
             console.log(this.state.password);
            if(this.state.username.trim() === '' && this.state.password.trim()===''){
                 alert('请输入用户名或密码！');
                 return;
            }
             const post1={                   
               username:this.state.username,
               password:this.state.password
             }
             axios.post('http://192.168.230.243:3019/denglou',post1,{withCredentials:true})
                .then((res)=>{
                  console.log(res);
                  console.log(res.data);    //服务器相应后返回来的（res.data）是一个对象数组数组，所以此处应用数组的方法来操作！
                  console.log(typeof res.data);
                // if(res.data.length>0){        //注释掉此处的if else语句是因为（把node响应后，返回给前端的data数据类型由数组对象类型改为了data对象类型）
                  console.log(res.data.username);
                  if(res.data.username === this.state.username
                    // &&require('bcryptjs').compareSync(this.state.password,res.data.password)   //此处注释掉的原因是因为在部署到局域网上时，因为机密的原因，导致mongoose无法识别此类型的数据导致把该数据存入数据库的操作失败！（所以就目前所掌握的知识只能先是注释掉，等后续有时间了进行改进！）
                    &&res.data.password === this.state.password
                    ){
                    this.props.history.push({pathname :'/home',state :{username:this.state.username}})
                  }
                  else{
                    // alert('用户密码错误！');
                    return;
                  }
                  
                // }
                // else{
                //   alert('不存在该用户，请进行注册！');
                //   window.location.href='http://localhost:3000/#/ZhuCe'
                // }
              })
              .catch((err)=>{
                console.log(err);
                alert('服务器链接断开！(请开启服务器！)');
              });
  }
  onsubmit2(e){
       e.preventDefault();
       let data={};
       axios.post('http://192.168.230.243:3019/github/login',data)
         .then((res)=>{
           console.log(res);
           window.location.href=res.data;
         }).catch((err)=>{
           console.log(err);
         })
  }

  render(){
  return (
    <div className="App">
      <header className="App-header">
        <div style={{borderRadius:'100px'}}>
        <img src='./logo192.png' 
        style={{height:'200px',width:'200px',
        borderRadius:'100px',opacity:'0.1',
        opacity:'alpha(opacity=50)'}} 
        className="App-logo" alt="logo" />
        </div>
        <h4>欢迎登陆</h4>
        <form onSubmit={this.onSubmit} style={{position:'relative',zIndex:'10000'}}>
        <div>
          <input id='username' name="username" 
           onChange={this.onChange.bind(this)} 
           value={this.state.title}  type="text"
           placeholder="请输入用户名">
          </input>  
        </div>
       <div>
         <input name="password" onChange={this.onChange.bind(this)} 
         value={this.state.body}  type="password" placeholder="请输入密码"> 
         </input>
       </div>
      <button type="submit">登录</button><br></br>  
      <small className="">没有账户?
           <a href="#/ZhuCe">点击注册</a>
      </small>
      <div className="">
        <a href="#/Zhaohuimima">忘记密码</a><br></br>
        <a href='' onClick={this.onsubmit2}>第三方登录</a>  
        {/* <a href='http://localhost:3016/github/login'>第三方登录</a> */}
      </div>
      </form>
      </header>
      <App2 />
      <ParticlesBg  num={3} type='polygon'   bg={true} ></ParticlesBg>
    </div>
   );
  }
}

export default App;
