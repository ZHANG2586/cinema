import axios from "axios";
import React,{ Component } from "react";
import { withRouter } from "react-router";
class S extends Component{
      constructor(props){
          super(props);
          this.state={
              username:'',
              email:'',
              code:'',
              yanzhengma:'获取验证码'
        };
          this.onSubmit=this.onSubmit.bind(this);
          this.onsubmit1=this.onsubmit1.bind(this);
          this.onChange=this.onChange.bind(this);
      }
      onChange(e){
           this.setState({
               [e.target.name]:e.target.value
           });
           console.log(e.target.name);
      }
      onSubmit(e){
              e.preventDefault();


            
             if(this.state.username.length > 0 && this.state.email.length > 0 && this.state.code.length === 6){
                var post={
                    username:this.state.username,
                    email:this.state.email,
                    code:this.state.code
                }    
                axios.post('http://192.168.230.243:3019/yanzheng/genggai',post)
                 .then((res)=>{
                     console.log(res);
                     alert('验证成功！');
                    //  window.location.href='http://localhost:3000/#/Zhaohuimima/genggai';
                    this.props.history.push('/Zhaohuimima/genggai');
                 }).catch((err)=>{
                     console.log(err);
                     alert('验证失败！(不存在改用户或是验证码失效或无效！)');
                 })
             }else{
                 alert('请入正确内容！');
             }
      }

      onsubmit1(e){
            e.preventDefault();

            if(this.state.email === '' || this.state.email.length < 8 
            || this.state.email.indexOf('@qq.com') !== this.state.email.length-7){
                     alert('请输入绑定的qq邮箱号！');
                     return;
            }
           var post1={
                email:this.state.email,
                username:this.state.username
            }
            axios.post('http://192.168.230.243:3019/yanzheng',post1)
            .then((res)=>{
               console.log(res);
               alert('验证码发送成功！(验证码有效时间5分钟！)');
               this.setState({
                yanzhengma:'已发送'
            });
            setTimeout(()=>{this.setState({yanzhengma:'获取验证码'})},1000*60*5);
            })
            .catch((err)=>{
                console.log(err);
                alert('验证码发送失败！');
            });
            
      }

      render(){
          return(
        //       <div>
        //         {/* <form onSubmit={this.onsubmit1}> */}
        //              {/* <div> */}
        //              <input type='text' name='username' onChange={this.onChange} placeholder='请输入验证码'></input><br></br>
        //               {/* <button onClick={this.onsubmit}>获取验证码</button> */}
        //              {/* </div> */}
                     
                    
        //                  <input type='submit'>验证</input>
                     
        //         {/* </form> */}
        //  </div>
        <div>
        <form onSubmit={this.onSubmit}>
            <div>
                <input type="text" name="username"  onChange={this.onChange} placeholder='请输入用户名' />
                <input type='text' name='email' onChange={this.onChange} placeholder='请输入绑定的qq邮箱号'></input>
                <input type='text' name='code' onChange={this.onChange} placeholder='请输入验证码' ></input>
                <button onClick={this.onsubmit1}>{this.state.yanzhengma}</button>
            </div>
          
            <button type="submit" onClick={this.onSubmit} >确认</button>
        </form>
    </div> 
          
            
          );
      }


}

export default withRouter(S);