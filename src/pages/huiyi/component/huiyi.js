import React,{Component} from 'react';
import axios from 'axios'
import laydate from 'layui-laydate';
import '../../../../node_modules/layui-laydate/src/theme/default/laydate.css'
import '../../../../node_modules/layui-laydate/src/laydate'
import { withRouter } from 'react-router';
class huiyi extends Component{
     constructor(props){
         super(props);
         this.state={
            id:'false',
            huiyiname:'',
            number:'',
            star_time:new Date(),
            end_time:new Date(),
            faqiren:'',
            status:'未通过',
            reply:'正在审核',
            s:[]
         };
         this.onChange=this.onChange.bind(this);
         this.onSubmit=this.onSubmit.bind(this);
         this.onFocus=this.onFocus.bind(this);
         this.onChange1=this.onChange1.bind(this);
     }
     componentDidMount(){
         if(this.props.location.state!==undefined){
              console.log(this.props.location.state.username);
              this.setState({id:this.props.location.state.username});
         }
        
     }
     onFocus(e){

        laydate.render({
            elem:'#test1',            //此处引入了layui-laydate组件组件模块来在点击input的同时生成日期表格进行选择日期（精确到了分秒），但是此处有一个小bug就是要点击该input使其两次聚焦才能显示出日历表格！（该问题有待优化）
            type:'datetime'
        });
        laydate.render({
            elem:'#test2',
            type:'datetime'
        })
     };
   
     onChange(e){
              //此处要注意在react中虽然建议我们使用className来定义标签（如input标签等）的类名，但是当我们在Setstate({[e.target.name]:e.target.value})中使用e.target.name时必须把触发该事件的标签的类名使用name来定义（若使用className来定义会导致Setstate({[e.target.name]:e.target.value})失效！因为此时你的标签里只有className没有name属性所以state中的相应属性无法改变！）
         this.setState({        
             [e.target.className]:e.target.value     //此处使用e.target.className,因为触发该事件的标签中只添加了className属性，所以使用e.target.className。(如果触发该事件的标签中只有name属性时，就只能使用Setstate({[e.target.name]:e.target.value})了哦！)
         },()=>{
            console.log(e.target.value);     //此处是因为setState()是异步加载，setState中有一个回调方法（在此处就是setState的第二个参数）。        
         });
         console.log(e.target.className);
         laydate.render({
             elem:'#test1',            //此处引入了layui-laydate组件组件模块来在点击input的同时生成日期表格进行选择日期（精确到了分秒），但是此处有一个小bug就是要点击该input使其两次聚焦才能显示出日历表格！（该问题有待优化）
             type:'datetime'
         });
         laydate.render({
             elem:'#test2',
             type:'datetime'
         })
     }
         //注意input标签的事件的触发顺序onfouce on
    onChange1(e){
        // e.preventDefault();
        //  if(this.state.id.length>0&&this.state.huiyiname.length>0&&this.state.number.length>0&&this.state.number[0]<'A'&&this.state.faqiren.length>0&&document.getElementById('test1').value!=''&&document.getElementById('test2').value!=''&&document.getElementById('test1').value<document.getElementById('test2').value){
            this.setState({        
                [e.target.className]:e.target.value     //此处使用e.target.className,因为触发该事件的标签中只添加了className属性，所以使用e.target.className。(如果触发该事件的标签中只有name属性时，就只能使用Setstate({[e.target.name]:e.target.value})了哦！)
            },()=>{
               console.log(e.target.value);     //此处是因为setState()是异步加载，setState中有一个回调方法（在此处就是setState的第二个参数）。        
            });
        var post={
             id:this.state.id,
             number:this.state.number,
             huiyiname:this.state.huiyiname,
            // id:document.getElementById('id').value,
            // huiyiname:document.getElementById('huiyiname').value,
            // number:document.getElementById('number').value,
            star_time:new Date(document.getElementById('test1').value),   //此处因为使用了layui-laydate组件导致了没有触发此处的onchange事件，但是可以使用js的dom操作（document.getElementsById()来获取相应id的元素标签）
            end_time:new Date(document.getElementById('test2').value),
            faqiren:this.state.faqiren,
            status:this.state.status,
            reply:this.state.reply
         }
        
        
         
         axios.post('http://192.168.230.243:3019/huiyi/biaodan',post,{withCredentials: true})   //此处要想在跨域请求中携带cookie必须给请求配置withCredentials:true,否则后端接收到的请求里是不包含cookie的，会造成从请求头里获取cookie里存储的token时出现undefined，然而后端只对存在token的cookie进行验证和返回结果的处理，造成bug的出现没有携带cookie的请求一样可以通过token验证机制（这个是因为在后端的token验证那块没有加对从cookie里获取到的token是不是undefined的判断造成的）;
            .then((res)=>{
                console.log(res);
                this.setState({s:JSON.parse(res.data)});
                // console.log(typeof new Date(array[0].star_time).valueOf());
                // console.log(new Date(document.getElementById('test1').value).getTime());
                // console.log(typeof document.getElementById('test1').value);
                // console.log(new Date(array[0].star_time).valueOf()<=new Date(this.state.star_time).getTime());
                // console.log(Date(array[0].star_time) instanceof Date);
                // if(new Date(array[0].star_time).valueOf()<=new Date(document.getElementById('test1').value).getTime()){
                //                 alert('时间冲突了！');
                //                  console.log('时间冲突！');
                //                 return;
                // }
             
                // array.forEach((element,index,array) => {
                //     console.log(array[index]);
                //     console.log(element);
                //     if(((new Date(array[index].end_time).getTime())<=(new Date(document.getElementById('test2').value).valueOf()))&&((new Date(array[index].end_time).getTime())>=(new Date(document.getElementById('test1').value).valueOf()))){
                //             // return;   //只能跳出foreach的本次循环，但是无法中止foreach循环（想要中止foreach循环必须使用抛出异常的方式来中止循环，这就是foreach和for循环的不同之处之一）
                //             throw new Error('End Loop');
                //             // alert('时间冲突了！');
                //             // this.setState({s:1});
                //             // return;

                //     }
                //     else if(((new Date(array[index].star_time).getTime())>=(new Date(document.getElementById('test1').value).valueOf()))&&((new Date(array[index].star_time).getTime())<=(new Date(document.getElementById('test2').value).valueOf())))
                //     {
                //             // alert('时间冲突了！');
                //             // this.setState({s:1});
                //             // return;
                //             throw new Error('End Loop');
                //     }
                // });
                // for(var i=0;i<res.data)
                //  axios.post('http://localhost:3016/huiyi/biaodan/tianjia',post)
                // .then((res)=>{
                //     console.log(res);
                //     alert('请求已发送！(即将返回主页面！)');
                //     window.location.href='http://localhost:3000/#/home';
                // }).catch((err)=>{
                //     console.log(err);
                //     alert('请求失败！');
                // })
            
            
            
        }).catch((err)=>{
            console.log(err);
            alert('token过期了！（请重新登录！）');
            // window.location.href='http://localhost:3000';
            this.props.history.push('/');
        })
        
         
      }
    
    onSubmit(e){
        e.preventDefault();
        if(this.state.id.length>0&&this.state.huiyiname.length>0
            &&this.state.number.length>0&&this.state.number[0]<'A'
            &&this.state.faqiren.length>0
            &&document.getElementById('test1').value!=''
            &&document.getElementById('test2').value!=''
            &&document.getElementById('test1').value<document.getElementById('test2').value){
              console.log(this.state.s);
              var b=0;
              for(var i=0;i<this.state.s.length;i++){
                if(((new Date(this.state.s[i].star_time).getTime())<=(
                    new Date(document.getElementById('test2').value).valueOf()))
                    &&((new Date(this.state.s.end_time).getTime())>=(
                    new Date(document.getElementById('test1').value).valueOf()))){
                       alert('时间冲突了（即将返回主页面，请重新预定会议！）');
                    //    window.location.href='http://localhost:3000/#/home';
                    this.props.history.push('/home');
                       return;
                }
                else if(((new Date(this.state.s[i].star_time).getTime())>=(
                    new Date(document.getElementById('test1').value).valueOf()))
                    &&((new Date(this.state.s[i].star_time).getTime())<=(
                    new Date(document.getElementById('test2').value).valueOf())))
                    {
                            alert('时间冲突了！（即将返回主页面，请重新预定会议！）');
                            // window.location.href='http://localhost:3000/#/home';
                            this.props.history.push('/home');
                            return;
                    }
            }
            var post={
            id:this.state.id,
            number:this.state.number,
            huiyiname:this.state.huiyiname,
           // id:document.getElementById('id').value,
           // huiyiname:document.getElementById('huiyiname').value,
           // number:document.getElementById('number').value,
           star_time:new Date(document.getElementById('test1').value),   //此处因为使用了layui-laydate组件导致了没有触发此处的onchange事件，但是可以使用js的dom操作（document.getElementsById()来获取相应id的元素标签）
           end_time:new Date(document.getElementById('test2').value),
           faqiren:document.getElementById('faqiren').value,
           status:this.state.status,
           reply:this.state.reply
        }
        //必须在需要进行token验证的axios请求中设置{withCredentials:true}属性，因为axios默认的是在请求头（即req）里不带浏览器中的cookie的，只有加上该属性此处的axios才会在请求头中带上cookie，这样才能在后端（express）中获取到req中的用于存储token的cookie，进而来进行验证。
        axios.post('http://192.168.230.243:3019/huiyi/biaodan/tianjia',post,
        {withCredentials:true}).then((res)=>{
            alert('请求已发送！(即将返回主页面！)');
            // window.location.href='http://localhost:3000/#/home';
            this.props.history.push('/home');
        }).catch((err)=>{
            console.log(err);
            alert('登陆过期了！（请进行登录！）');
            // window.location.href='http://localhost:3000/';
            this.props.history.push('/');
        })
          
        //    alert('请求已发送！(即将返回主页面！)');
        //    window.location.href='http://localhost:3000/#/home';
        // }else{
        //     alert('时间冲突了!（即将返回主页面,请重新选择预定时间!）');
        //     window.location.href='http://localhost:3000/#/home';
        // }
     }else{
        alert('格式错误！');
     }

    }
    render(){
        return (
          <div className='s' style={{width: '80%',height:'500px',
          backgroundColor:'blanchedalmond',position:'relative',
          left:'0',right:'0',margin:'0 20% 0  10%'}}>
                {/* <input className='id' type='text' id='id' onChange={this.onChange} autocomplete="off" placeholder='请输入会议id'></input> */}
                <input className='huiyiname' type='text' id='huiyiname' 
                onChange={this.onChange} autocomplete="off" placeholder='请输入会议房间名称'>
                </input>             
                <input className='number' type='text' id='number' 
                onChange={this.onChange} autocomplete="off" placeholder='请输入会议室人数上线'>
                </input>
                <input className='star_time' type='text' id='test1'
                 onChange={this.onChange} onFocus={this.onFocus} autocomplete="off" 
                 placeholder='请输入会议起始时间'>
                </input>
                <input className='end_time' type='text' id='test2' 
                onChange={this.onChange}   onFocus={this.onFocus} onBlur={this.onChange1} 
                autocomplete="off" placeholder='请输入会议结束时间'>
                </input>
                <input className='faqiren' type='text'  id='faqiren' 
                onChange={this.onChange}  autocomplete="off" placeholder='请输入会议发起人名称'></input>
                <button className='annu' onClick={this.onSubmit}>确认预定</button>
          </div>
        );
    }
}

export default withRouter(huiyi);