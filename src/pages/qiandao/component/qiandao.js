import react,{ Component} from 'react';
import QQMap from 'qqmap';     //引入腾讯地图模块（含几何计算类库）
export default class s extends Component{
    constructor(props){
        super(props);
        this.state={
            lng:116.39774322509766,
            lat:39.90736606309809,
            map:{}
        }
        // this.initQQMap=this.initQQMap.bind(this);
          this.dingwei=this.dingwei.bind(this);
        //   this.showPosition=this.showPosition.bind(this);
    }    
    componentDidMount(){     //（装载完成）在render之后调用（此处render之后调用：是指父子组件都render完之后才调用）
        this.initQQMap();
    }
    //地图初始化的方法
    // initQQMap=()=>{
    //     //设置中心坐标(横纬竖经)
    //     let tarLat = 39.90736606309809;     //纬度
    //     let tarLng = 116.39774322509766;    //经度
    //     //初始化地图
    //     QQMap.init('ZBGBZ-XNLKU-UREVP-4AAXA-AY3Y2-76FSZ',()=>{
    //            //初始化经纬度，最开始的点
    //            let myLatlng=new qq.maps.
    //     })
    // }


  initQQMap = () => {
    //设置中心坐标
    let tarLat = this.state.lat;
    let tarLng = this.state.lng;
    //初始化地图
    QQMap.init('ZBGBZ-XNLKU-UREVP-4AAXA-AY3Y2-76FSZ', ()=>{
        // 初始化经纬度，最开始的点
        let myLatlng = new window.qq.maps.LatLng(tarLat, tarLng);
        // 设置地图属性
        let myOptions = {
            zoom: 16,
            center: myLatlng,
            mapTypeId: window.qq.maps.MapTypeId.ROADMAP,
        };
        // 创建地图，绑定dom(此处的this.map相当于把map注册到了this里面，在其地方想调用时只需this.map即可！)
        this.map = new window.qq.maps.Map(
            document.getElementById('container'),
            myOptions,
        );
        this.setState({map:this.map});
        console.log(this.map);
        console.log(this.state.map);
        // 标注已经存在的点（使用qq.maps.Marker类创建一个Marker对象）
        let markerlast = new window.qq.maps.Marker({
            position: myLatlng,   //设置Marker的位置坐标
            map: this.map,    //设置显示Marker的地图
        });
        this.markerlast=markerlast;
        // *调用*检索(qq.maps.LatLngBounds类：用来描述一个矩形的地理坐标范围)
        let latlngBounds = new window.qq.maps.LatLngBounds();
        // 调用Poi检索类
        let searchService = [];//调用腾讯地图的搜索服务
        let markers = [];//用户搜索后显示的点的集合
        // 调用搜索服务
        searchService = new window.qq.maps.SearchService({      //Poi检索类（qq.maps.SearchService类），用于进行本地检索，周边检索等服务。
            complete: results=> {                      //此处是检索成功后的回调函数（Complete）(此处的result参数是用来接受SearchService类检索成功后返回的对象（该对象中的detail属性对象中涵盖了检索到的所有信息，这些信息使用pois数组来存储的）),SearchSerice类还有setError的方法（用于检索失败后的回调函数）          
                let pois = results.detail.pois;
                for (let i = 0, l = pois.length; i < l; i++) {
                    let poi = pois[i];
                    latlngBounds.extend(poi.latLng);       //扩展该范围边界，来包含指定的坐标点
                    let marker = new window.qq.maps.Marker({       
                        map: this.map,
                        position: poi.latLng,
                    });
                    marker.setTitle(i + 1);
                    markers.push(marker);
                }
                this.map.fitBounds(latlngBounds);    //使用fitBounds方法（该方法是异步方法）来确定地图的缩放级别，以达到包含所有的标记坐标点（这些点全部存储在latlngBounds变量中）
            },
        });
        // 将服务注册到this中，方便搜索方法调用
        this.searchService = searchService;
        this.markers = markers;
        // 给地图添加鼠标点击监听
        window.qq.maps.event.addListener(
            this.map,
            'click',
            event=> {
                // 清除初始化位置
                      // markerlast.position = event.latLng;
                markerlast.setMap(null);
                // 获取经纬度位置
                let lat = event.latLng.getLat();
                let lng = event.latLng.getLng();
                // 赋值至文本框内
                // this.props.form.setFieldsValue({ lat: lat, lng: lng });
                this.setState({
                    lat:lat
                });
                this.setState({lng:lng});
                // 绘制点击的点
                let marker = new window.qq.maps.Marker({
                    position: event.latLng,
                    map: this.map,
                });
                //给新创建的标签marker添加监听事件（当地图被再次点击时，该处的标签会触发该事件，来清除该处的标签）
                window.qq.maps.event.addListener(this.map, 'click', function(event) {
                    marker.setMap(null);
                });
                // 清空上一次搜索结果
                Array.from(this.markers).forEach(marker=>{
                    marker.setMap(null);
                });
             }
          );
      });
   }
        //搜索
    searchKeyword = () => {
        //获取文本框输入的值
        let keyword = document.getElementById('keyword').value;
        let region = document.getElementById('region').value;
        // 清空上一次搜索结果（此处Array.from()方法用于把类似数组或可迭代的对象创建创建出一个新的浅拷贝的数组实例）
        Array.from(this.markers).forEach(marker=>{         //qq.maps.Marker类（标注表示地图上的点，可自定义标注的图标）
            marker.setMap(null);             //setMap()方法是Marker类的方法，作用是在地图对上显示Marker(若设置为null,则从地图上移除Marker)
        });
        this.markerlast.setMap(null);
        //调用腾讯地图的搜索功能（以下两个方法都是SearchService类的方法）
        this.searchService.setLocation(region);     //setLocation()方法：设置默认检索范围（默认是全国），类型可以是坐标或指定的城市名称
        this.searchService.search(keyword);        //search（）方法：根据关键字发起检索
    }
     dingwei=(e)=>{
            var geolocation=new window.qq.maps.Geolocation("ZBGBZ-XNLKU-UREVP-4AAXA-AY3Y2-76FSZ","myapp");
            var options={
                timeout:11111,                 //timeout参数设置定位超时的时间，默认值为10秒
                enableHighAccuracy:true,      //enableHighAccuracy表示是否允许使用高精度，但这个参数在许多设备上设置了都没用，设备综合考虑电量，地理情况等，很多时候都是默认的设备自身来调整。（定位精度高，肯定就会多消耗资源）
                maximumAge:0                  //maximumAge参数指示可以返回的可能缓存位置的最长使用期限（一毫秒为单位），如果设置为0，则表示设备无法使用缓存的位置，必须尝试检索实际的当前位置。如果设置为Infinity,则设备必须返回缓存的位置。而不管其使用期限如何。
            };
            // geolocation.getLocation(showPosition,showErr,options);
            // function showPosition(position){                 //当使用qq.maps.Geolocation()类的getLocation()方法查询成功后，会返回一个对象（可以给getLocation(position)方法中设参数来接收该对象（我这里使用的是position参数来接受的（也可以设成其他变量名）））(该对象中包含了位置信息（国家，省市，区，行政区ID（前两位是省，中间两位是市，后两位是区）），经纬度（火星坐标，腾讯，高德通用），定位的误差范围（米），)
            //         console.log(position);
            //         let center=new window.qq.maps.LatLng(position.lat,position.lng);
            //         console.log(center);
            //         console.log(this.state.map);
            //         // let marker=new window.qq.maps.Marker({
            //         //     position:center,
            //         //     map:this.map
            //         // })
            //         // console.log(position)
            //         // console.log(JSON.parse(position));
            //         // let marker=new window.qq.maps.Marker({
            //         //     position:
            //         // })
            // }
            
            geolocation.getLocation((position)=>{
                console.log(position);
                geolocation.watchPosition(this.showwatchPosition);
                this.showwatchPosition=(position)=>{
                    console.log(position);
                let latlngBounds = new window.qq.maps.LatLngBounds();
                        let center=new window.qq.maps.LatLng(position.lat,position.lng);
                        console.log(center);
                        console.log(this.state.map);
                        this.markerlast.setMap(null);
                        latlngBounds.extend(center); 
                        let marker=new window.qq.maps.Marker({
                            position:center,
                            map:this.map
                        });
                        window.qq.maps.event.addListener(this.map, 'click', function(event) {
                            marker.setMap(null);
                        });
                        this.map.fitBounds(latlngBounds);
                    }
            },showErr,options);


            // geolocation.getIpLocation((position)=>{
            //     console.log(position);
            //                 let center=new window.qq.maps.LatLng(position.lat,position.lng);
            //                 let latlngBounds = new window.qq.maps.LatLngBounds();
            //                 console.log(center);                        
            //                 // console.log(position);
            //                 let marker=new window.qq.maps.Marker({
            //                     position:center,
            //                     map:this.map
            //                 })
            //                 window.qq.maps.event.addListener(this.map, 'click', function(event) {
            //                                     marker.setMap(null);
            //                });
            //             this.map.fitBounds(latlngBounds);
            // },showErr);
            // this.showPosition=function (position){
            //                 console.log(position);
            //                 let center=new window.qq.maps.LatLng(position.lat,position.lng);
            //                 let latlngBounds = new window.qq.maps.LatLngBounds();
            //                 console.log(center);                        
            //                 console.log(position);
            //                 let marker=new window.qq.maps.Marker({
            //                     position:center,
            //                     map:this.map
            //                 })
            //                 window.qq.maps.event.addListener(this.map, 'click', function(event) {
            //                                     marker.setMap(null);
            //                });
            //             this.map.fitBounds(latlngBounds);
            // }

            function showErr(results){
                console.log('定位失败！');
                console.log(results);
                
            }


     }    
    render(){
        return(
           <div className='k'>
               <div className='s'>
                    <h4>*搜索目标经度显示区*<input id='' 
                    style={{display:'inline-block',width:'260px',zIndex:'1'}} 
                    value={this.state.lat}></input> </h4>           
                    <h4>*搜索目标纬度显示区*<input id='' 
                    style={{display:'inline-block',width:'260px',zIndex:'1'}} 
                    value={this.state.lng}></input></h4>
               </div>
                 <div className='s1'>
                        搜索目标所在的城市:  <input id='region' 
                        style={{display:'inline-block',width:'20%',zIndex:'1'}} 
                        defaultValue={'北京'} placehoulder='城市'></input>
                        <span style={{margin:'0 0 0 25px'}}>搜索目标的具体名称:</span>
                        <input id='keyword' className='d' 
                        style={{display:'inline-block',width:'30%',zIndex:'1'}} 
                        defaultValue={'乐高'} placeholder='地址'>
                        </input>
                         <button className='s2' style={{zIndex:'888'}} 
                         onClick={this.searchKeyword} >位置搜索</button>
                 </div>
                 <button className='s3' onClick={this.dingwei} 
                 style={{width:'10%',height:'30%',zIndex:'1000'}}>位置定位</button>
                 <div  id='container' style={{height:500,width:1000}}>
                 </div>       
           </div>);

        }
}