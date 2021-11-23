import React,{Component} from 'react';
import {withRouter} from 'react-router-dom'
import '../xiaoxi.css';
import axios from 'axios';
let data1={
    username:''
},data2={
    id:'12345678'
};
let Myli=[];
// let Username='false';
class S extends Component{
    constructor(props){
        super(props);
        this.state={
                Username:'false'         
        };
        // this.getuser=this.getuser.bind(this);
        // this.getxiaoxi=this.getxiaoxi.bind(this);
    }
    // getuser(){
    //     return axios.post('http://localhost:3000/huiyi/faqiren',data1);
    // }
    // getxiaoxi(){
    //     return axios.post('http://localhost:3000/huiyi/xinxi',data2);
    // }
    componentWillMount(){
        // console.log(this.props.location.state);
        if(this.props.location.state!==undefined){
             data1.username=this.props.location.state.username;
             data2.id=this.props.location.state.username;
        }
        function getuser(){
            return axios.post('http://192.168.230.243:3019/huiyi/faqiren',data1);
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
        
    }    
    
    render(){
         let i=0;
          if(Myli.length>0){
            var person=(
                  <ul>
                       {
                           Myli.map((value)=>{
                                ++i;
                         if(i<=Myli.length){
                           return (
                                  //对map循环出来的每个属性插入标签元素
                                <li style={{width:'80%',border:'1px solid',height:'10%',
                                fontSize:'smaller',margin:'auto',position:'relative'}}>
                                      会议名称： {value.huiyiname}<span style={{marginLeft:'2%'}}>
                                      时间：</span>{value.star_time}~{value.end_time}<span 
                                       style={{marginLeft:'2%'}}>
                                      会议人数：</span>{value.number}<span style={{marginLeft:'2%'}}>
                                      会议发起人：</span>{this.state.Username}
                                      <button 
                                      style={{position:'absolute',right:'10%',width:'8%',top:'35%'}}>
                                      加入会议</button>
                                      <button style={{position:'absolute',right:'3px',width:'8%',top:'35%'}}>
                                      退出会议</button>
                                  </li>
                              )
                            }
                            // else{
                            //     // return (<p>会议发起人：{value.username}</p>)
                            //     // return (React.createElement('li','',value));
                            // }
                           })

                       }
                  </ul>
              )
          }
          return (
              <>
                    {person}        
              </>
          );
    };
}



// import Footer from './Footer';
// class P extends Component {
//   state = {
//     persons: [
//       {
//         name: "周家大小姐",
//       }, {
//         name: "陈家大小姐",
//       }, {
//         name: "王家大小姐",
//       }
//     ],
//     showPreson: false,
 
//   };
//   // 显示隐藏
//   click = () => {
//     const doesShow = this.state.showPreson;
//     this.setState({
//       showPreson: !doesShow
//     })
//   }
//   render() {
//     //定义一个空值,在else的时候使用
//     let persons = null;
//     if (this.state.showPreson) {
//       persons = (
//         <div>
//           {
//             this.state.persons.map((person) => {
//               return (
//                 // 对map 循环出来的每个属性插入标签元素
//                 <Footer name={person.name} v-if="showPreson" key={person.name} />
//               )
//             })
//           }
//         </div>
//       )
//     }
//     return (
//       <div className="App">
//         <button onClick={this.click}>显示与隐藏</button>
//         {/* 当showPreson为falser 的时候走这一步为空也就是隐藏 */}
//         {persons}
//       </div>
//     );
//   }
// }

export default withRouter(S);