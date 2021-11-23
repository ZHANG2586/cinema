import axios from 'axios';
import React,{Component} from 'react';
import {withRouter} from 'react-router-dom'

class modify extends Component{
    constructor(props){
        super(props);
        this.state={
            username:'',
            email:'',
            password:'',
            password2:''
        }
        this.onsubmit=this.onsubmit.bind(this);
        this.onChange=this.onChange.bind(this);
    }
    onChange(e){
        this.setState({
            [e.target.name]:e.target.value
        });
        console.log(e.target.name);
    }

    onsubmit(e){
        e.preventDefault();
        if(this.state.username.length>0)
        {
             if(this.state.password==this.state.password2&&this.state.password.length>0){
                     var post={
                         username:this.state.username,
                         email:this.state.email,
                         password:this.state.password,
                         password2:this.state.password2
                     }
                      axios.post('http://192.168.230.243:3019/yanzheng/genggai/xougai',post)
                          .then((res)=>{
                               console.log(res);
                               alert('修改密码成功！(即将跳转回登录界面，请进行重新登录！)');
                            //    window.location.href='http://localhost:3000';
                            this.props.history.push('/');
                          })
                          .catch((err)=>{
                               console.log(err);
                               alert('不存在该用户，密码修改失败！（请刷新页面重新尝试！）');
                          })
             }else{
                 alert('两次输入密码不一致，请再次输入！')
             }
        }else{
            alert('请输入用户名！')
        }

    }
    
    render(){
        return(
            <div>
              <form>
                   <input type='text' name='username' onChange={this.onChange} 
                   placeholder='请输入用户名'></input>
                   <input type='text' name='email' onChange={this.onChange} 
                   placeholder='请输入绑定的qq邮箱'></input>
                   <input type='password' name='password' onChange={this.onChange} 
                   placeholder='请输入新密码'></input>
                   <input type='password' name='password2' onChange={this.onChange} 
                   placeholder='再次确认密码'></input>
                   <button onClick={this.onsubmit} style={{height:'30px',width:'80px'}}>提交</button>
              </form>
            </div>
        );
    }
}

export default withRouter(modify);