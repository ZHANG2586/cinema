import '../../home/home.css'
import React,{Component} from 'react'
import cookie from 'react-cookies';
import {loginUser} from '../../cookie'     
import axios from 'axios';
import getQueryString from '../../geturl'
import {Link,withRouter} from 'react-router-dom'
import ReactLive2d from 'react-live2d';
import styled from 'styled-components'
const Li=styled.li`
  width:47%;
  height:81px;
  line-height:81px;
  font-size:30px;
  margin:0;
  border-bottom:1px solid black;
  position:'relative'
`

const Button=styled.button`
  width:20%;
  position:'absolute';
  right:0;

`
let data1={
  username:''
},data2={
  id:'12345678'
};
let Myli=[];

class home extends Component{
   constructor(props){
       super(props);
       this.state={
           code:'',
           login:'________',
           avatar_url:'https://avatars.githubusercontent.com/u/66770812?v=4',
           Username:'false'
       }
       this.onsubmit=this.onsubmit.bind(this);
       this.onsubmit2=this.onsubmit2.bind(this);
       this.getUser=this.getUser.bind(this);
   }
   //获取url参数
 

   componentDidMount(){      //查看当前网页中的cookie里存储了些什么，以及cookie中有没有名叫mt_token的coookie.
    if(this.props.location.state!==undefined){
            console.log(this.props.location.state.username);
            this.setState({login:this.props.location.state.username}); 
     }
     let userId=loginUser();       
         console.log(userId);               
         console.log(cookie.loadAll());     //此处使用的loadAll()是react-cookies包中的方法
                                                     
         const code = getQueryString('code');     //request.getQueryString()就是获取查询字符串,比如客户端发送 http://localhost/test.do?a=b&c=d&e=f通过request.getQueryString()得到的是 a=b&c=d&e=f    
        if(code){
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
         console.log(code);
         if (code) {
           this.setState(
             {
               code:code
             },
             () => {
               if (!this.state.code) {
                 return;
               }
               console.log(this.state.code);
               this.getUser(this.state.code);
             }
           );
         }else{
           console.log('code获取失败！');
         }
         if(this.props.location.state!==undefined){
          data1.username=this.props.location.state.username;
          data2.id=this.props.location.state.username;
     }
     function getuser(){
         return axios.post('http://192.168.230.243:3019/huiyi/faqiren',data1);
        // return axios.post('http://192.168.230.243:3019/huiyi/faqiren',data1);
     }
     function getxiaoxi(){
         return axios.post('http://192.168.230.243:3019/huiyi/xinxi',data2);
     }
     axios.all([getuser(),getxiaoxi()]).then(
         axios.spread((acct,perms)=>{
             console.log(acct);
             console.log(perms);
             console.log(perms.data[0]);
             console.log(perms.data);      
             console.log(JSON.parse(perms.data));
             let array=JSON.parse(perms.data);
             for(let i=0;i<array.length;++i){
                  Myli[i]=array[i];
             }
             console.log(acct.data);
             if(acct.data instanceof Array){
                 // Myli.push(acct.data[0]);
                 console.log(this.state);
                 this.setState({Username:acct.data[0].username},()=>console.log(this.state));
                 // console.log(Username);
             }
             // Myli.push(acct.data);
             console.log(Myli);
         })
     ).catch((err)=>{
         console.log(err);
     })
    
    // if(this.state.login===''){
    //   this.setState({login:'_______'})
    // }
   }    
  
   
// componentWillReceiveProps(nextProps) {
//     const code = getQueryStringByName('code')
//     if (code) {
//       this.setState(
//         {
//           code
//         },
//         () => {
//           if (!this.state.code) {
//             return;
//           }
//           this.getUser(this.state.code);
//         },
//       );
//     }
//   }
  getUser(code) {
       let t={
           code:code
       };
       
      axios.post(
        'http://192.168.230.243:3019/github/callback',
         t,
        { withCredentials: true }
      )
      .then(res => {
        console.log('res :', res);
        console.log(res.data.login);
        console.log(res.data.avatar_url);
        if(res.data.avatar_url !== undefined){
            this.setState({login: res.data.login,avatar_url:res.data.avatar_url},
              ()=>console.log(this.state));
        }
        

        // var params={
        //     client_id:res.data.client_id,
        //     client_secret:res.data.client_secret,
        //     code:res.data.code
        // }
        // axios.post('https://github.com/login/oauth/access_token', params).then((res)=>{
        //     console.log(res);
        //     const access_token = JSON.parse(res.data).access_token
        //     console.log(access_token);    
        // }).catch((err)=>{
        //     console.log(err);
        // });
        
        // if (res.status === 200 && res.data.code === 0) {
        //   this.props.loginSuccess(res.data);
        //   let userInfo = {
        //     _id: res.data.data._id,
        //     name: res.data.data.name,
        //   };
        //   window.sessionStorage.userInfo = JSON.stringify(userInfo);
        //   message.success(res.data.message, 1);
        //   this.handleLoginCancel();
        //   // 跳转到之前授权前的页面
        //   const href = window.localStorage.preventHref
        //   if(href){
        //     window.location.href = href 
        //   }
        // } else {
        //   this.props.loginFailure(res.data.message);
        //   message.error(res.data.message, 1);
        // }
      })
      .catch(err => {
        console.log(err);
      });
  }

    onsubmit=(e)=>{
        e.preventDefault();
        // window.location.href='http://localhost:3000/#/home/huiyi';    
        // <Link to='huiyi'></Link>
        if(this.props.location.state!==undefined){
                this.props.history.push({pathname:'/home/huiyi',
                       state:{username:this.props.location.state.username}});   //此处注意要想使非路由组件使用路由组件的this.props.history必须使用withRouter来把该组件包装成路由组件才行！
        }else{
          this.props.history.push('/home/huiyi');
        }
    }
    onsubmit2(e){
         e.preventDefault();
        //  window.location.href='http://localhost:3000/#/home/qiandao';
        this.props.history.push('/home/qiandao');
    }
    onsubmit3=(e)=>{
          e.preventDefault();
          if(this.props.location.state!==undefined){
               this.props.history.push({pathname:'/home/xiaoxi',
               state:{username:this.props.location.state.username}});
          }else{
             this.props.history.push('/home/xiaoxi');
          }
    }
    onclick4=()=>{
      if(this.props.location.state!==undefined){
        this.props.history.push({pathname:'/home/xiaoxi',
        state:{username:this.props.location.state.username}});
      }else{
        this.props.history.push('/home/xiaoxi');
      }
    }
    render(){
      let i=0;
       if(Myli.length>0){
         var person=(
             <ul>
                    {
                            Myli.map((value)=>{
                                 ++i;
                                if(i==1){
                                return (
                                  <li style={{width:'100%',border:'1px solid',height:'2%',
                                  fontSize:'smaller',margin:'auto',position:'relative'}}>
                                      会议名称： {value.huiyiname}
                                      <span style={{marginLeft:'2%'}}>
                                      时间：</span>{value.star_time}~{value.end_time}
                                      <span style={{marginLeft:'2%'}}>
                                      会议人数：</span>{value.number}
                                      <span style={{marginLeft:'2%'}}>
                                      会议发起人：</span>{this.state.Username}
                                      <button style={{position:'absolute',right:'10%',width:'8%',
                                      top:'35%'}}>加入会议</button>
                                      <button style={{position:'absolute',right:'3px',width:'8%',
                                      top:'35%'}}>退出会议</button>
                                  </li>
                                );}
                      
                            })
                    }
             </ul>
         )
       }

    return(
      <>
          <h1>主页</h1>
          <div style={{position:'absolute',right:'3%',top:'1%',marginLeft:'2%',width:'50px',
          height:'50px',borderRadius:'50px',textAlign:'center',lineHeight:'50px',overflow:'hidden'}}>
                <img src={this.state.avatar_url} style={{verticalAlign:'middle',width:'100%'}}></img>
          </div>
          <h1 style={{fontSize:'xx-small',position:'absolute',right:'20%',width:'80px',
          lineHeight:'50px',height:'50px',marginTop:0,overflow:'hidden',top:'1%',marginLeft:'10px'}}>
            {this.state.login}
          </h1>
        <div className='kk'>
            <div id='id' style={{position:'relative',width:'100%',height:'81px'}}>
             <h2 className='server' style={{width:'50%',height:'100%',position:'absolute',left:'10',borderBottom:'0'}}>业务区</h2>
             {/* <h2 className='infrom' style={{width:'400px',height:'80px',display:'inline-block',margin:'0 0 0 0'}}><a>消息区</a></h2> */}
             {/* <a href='#/home/xiaoxi' style={{color:'black',position:'absolute',right:0,width:'400px',height:'80px'}}><h2 style={{display:'inline-block'}}>消息区</h2></a> */}
             <h2 className='server2' onClick={this.onsubmit3} 
             style={{width:'50%',height:'100%',textAlign:'center',
             lineHeight:'81px',position:'absolute',right:'0',marginTop:'0',marginBottom:'0'}}>消息区</h2>
             </div>
             <Li className='h'>会议室
                 <Button className='b' onClick={this.onsubmit} history={this.props.history}>预约</Button>
                 {/* <Link to='/home/huiyi' >预约</Link> */}
             </Li>
             <Li>位置签到
                 <Button className='b' onClick={this.onsubmit2}>签到</Button>
             </Li>
             <div style={{width:'40%',height:'40%',borderTop:'1px solid red',borderBottom:'1px solid red',
             position:'absolute',right:'6%',top:'25%'}}>
                  {person}
                  <Button style={{position:'relative',left:'39%'}} onClick={this.onclick4}>更多</Button>
             </div>
        </div>
      </>
     );
    }
}

export default withRouter(home);