import Zhuce from './component/zhuce'
import React, { Component } from 'react'
import axios from 'axios';
import {withRouter} from 'react-router-dom'

let time;
class PostFrom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email:'',
            duoCidianji: true
        };
        // this.onChange = this.onChange.bind(this)
    }
    onChange(e) {//把当前修改的值赋入state
        this.setState({
            [e.target.name]:e.target.value

        });
         console.log(e.target.name);
    }
   onSubmit(e) {
        // 阻止事件传递        
        e.preventDefault();
        
     if(this.state.duoCidianji){
        this.setState({duoCidianji: false});   //用于防止多次导致多次提交相同数据到数据库中
        console.log(this.state.username);
        console.log(this.state.password);
        console.log(this.state.email);
        

        // 把表单用的最终数据从state中提取出来,传入请求
        const post1 ={
            username:this.state.username,
            password:this.state.password,
            email:this.state.email
        };
     //判断提交的数据模式是否符合要求（例如：qq要加上@qq.com才行）
        if(post1.username.length > 0 && post1.username.indexOf(' ') === -1
        && post1.password.length > 0 && post1.email.length > 8
        && post1.email.indexOf('@qq.com') === post1.email.length-7){
        axios.post('http://192.168.230.243:3019',post1)
          .then((response) => {
              console.log(response);
            console.log(response.data);//请求的返回体
            console.log(response.data.username);
             alert("注册成功！(确认后将返回登陆页面，请进行登录！)");
            // response.Redirect("back");
            // window.location.href = 'http://localhost:3000';
             
             clearTimeout(time);  //用于取消由setTimeout()定时器设置的交互时间
            this.props.history.push('/');
          })
          .catch((err) => {
            console.log(err);//异常
          });      
        }
        else{
               alert("提交数据格式错误!（用户名和密码不能有空格字符，邮箱qq号后加@qq.com）");
               return;
        }
        time=setTimeout(()=>{
            this.setState({duoCidianji : true});
        },3000);    //此处定时器的作用（当首次注册格式错误后，等待三秒才能再次注册）
      }
    }
    render() {
        return (
            <div>
                <h1>注册页面</h1>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <div>
                        <label >username</label>
                        <br />
                        <input type="text" name="username"  onChange={this.onChange.bind(this)} 
                        value={this.state.title} />
                    </div>
                    <div>
                        <label >password</label>
                        <br />
                         <input type="password" name='password' onChange={this.onChange.bind(this)} 
                         value={this.state.body}></input>
                    </div>
                    
                    <div>
                        <label >qq-email</label>
                        <br />
                         <input type="password" name='email' onChange={this.onChange.bind(this)} 
                         value={this.state.body}></input>
                    </div>
                    <button type="submit" >注册</button>
                </form>
            </div>
        )
    }
}

export default withRouter(PostFrom);