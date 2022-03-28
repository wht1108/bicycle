import {Card} from "antd";
import { useEffect,useState} from "react";
import Axios from "../../axios";
import "./detail.less";
let map;
const OrderDetail = (props) => {
    const [info,setInfo]=useState({});
    useEffect(()=>{
      let orderId=props.match.params.orderId;
      Axios.ajax({
          url:"order/detail",
          data:{params:{orderId}}
      }).then(res=>{
          if(res.code===0){
              setInfo(res.result);
              renderMap(res.result);
          }
      })
    },[]);
    const renderMap = (result) => {
        console.log(result);
        map = new window.BMapGL.Map("orderDetailMap");
        map.centerAndZoom(new window.BMapGL.Point(116.404, 39.915), 11);
        //添加地图控件
        addMapControl();
        //调用路线图绘制方法
        drawBikeRoute(result.position_list);
        ////调用绘制服务区方法
        drawServiceArea(result.area);
    }
    //添加地图控件
     const addMapControl = () => {
        map.addControl(new window.BMapGL.ScaleControl({ anchor: window.BMAP_ANCHOR_TOP_RIGHT }));
        map.addControl(new window.BMapGL.ZoomControl({ anchor: window.BMAP_ANCHOR_TOP_RIGHT }));
    }
    //绘制用户的行驶路线
    const drawBikeRoute = (positionList) => {
        let startPoint = "";
        let endPoint = "";
        if (positionList.length > 0) {
            let first = positionList[0];
            let last = positionList[positionList.length - 1];
            //坐标点
            startPoint = new window.BMapGL.Point(first.lon, first.lat);
            //Icon空间大小和图标大小
            let startIcon = new window.BMapGL.Icon("/assets/start_point.png", new window.BMapGL.Size(36, 42), {
                imageSize: new window.BMapGL.Size(36, 42),
                anchor: new window.BMapGL.Size(36, 42)
            })
            let startMarker = new window.BMapGL.Marker(startPoint, { icon: startIcon });
            map.addOverlay(startMarker);
            //结束坐标
            endPoint = new window.BMapGL.Point(last.lon, last.lat);
            //Icon空间大小和图标大小
            let endIcon = new window.BMapGL.Icon("/assets/end_point.png", new window.BMapGL.Size(36, 42), {
                imageSize: new window.BMapGL.Size(36, 42),
                anchor: new window.BMapGL.Size(36, 42)
            })
            let endMarker = new window.BMapGL.Marker(endPoint, { icon: endIcon });
            map.addOverlay(endMarker);

            //连接路线图
            let trackPoint = [];
            for (let i = 0; i < positionList.length; i++) {
                let point = positionList[i];
                trackPoint.push(new window.BMapGL.Point(point.lon, point.lat));
            }
            let polyline = new window.BMapGL.Polyline(trackPoint, {
                strokeColor: "#f00",
                strokeWeight: 3,
                strokeOpacity: 1
            })
            map.addOverlay(polyline);
            // map.centerAndZoom(endPoint, 11);
        }

    }
    const drawServiceArea = (positionList) => {
        //连接路线图
        let trackPoint = [];
        for (let i = 0; i < positionList.length; i++) {
            let point = positionList[i];
            trackPoint.push(new window.BMapGL.Point(point.lon, point.lat));
        }
        //绘制服务区
        let polygon = new window.BMapGL.Polygon(trackPoint, {
            strokeColor: "#CE0000",
            strokeWeight: 4,
            strokeOpacity: 1,
            fillColor: "#ff8605",
        });
        map.addOverlay(polygon);
    }
    return (
        <div style={{width:"100%"}}>
            <Card>
                <div id="orderDetailMap" className="order-map"></div>
                <div className="detail-items">
                    <div className="item-title">基础信息</div>
                    <ul className="detail-form">
                        <li>
                            <div className="detail-form-left">用车模式</div>
                            <div className="detail-form-content">{info.mode === 1 ? "服务区模式" : "停车点"}</div>
                        </li>
                        <li>
                            <div className="detail-form-left">订单编号</div>
                            <div className="detail-form-content">{info.order_sn}</div>
                        </li>
                        <li>
                            <div className="detail-form-left">车辆编号</div>
                            <div className="detail-form-content">{info.bike_sn}</div>
                        </li>
                        <li>
                            <div className="detail-form-left">用户姓名</div>
                            <div className="detail-form-content">{info.user_name}</div>
                        </li>
                        <li>
                            <div className="detail-form-left">手机号码</div>
                            <div className="detail-form-content">{info.mobile}</div>
                        </li>
                    </ul>
                </div>
                <div className="detail-items">
                    <div className="item-title">行驶轨迹</div>
                    <ul className="detail-form">
                        <li>
                            <div className="detail-form-left">行程起点</div>
                            <div className="detail-form-content">{info.start_location}</div>
                        </li>
                        <li>
                            <div className="detail-form-left">行程终点</div>
                            <div className="detail-form-content">{info.end_location}</div>
                        </li>
                        <li>
                            <div className="detail-form-left">行驶里程</div>
                            <div className="detail-form-content">{info.distance / 1000}公里</div>
                        </li>
                    </ul>
                </div>
            </Card>
        </div>
    );
}

export default OrderDetail;