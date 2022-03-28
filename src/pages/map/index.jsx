import { Card, DatePicker, Form, Select, Button, message } from "antd";
import { forwardRef, useEffect, useRef, useState } from "react";
import Axios from "../../axios";
const Option = Select.Option;
let map;
const params = {};
const Map = () => {
    const form = useRef();
    const [count, setCount] = useState(0)
    const onsubmit = () => {
        let list = form.current.getFieldsValue();
        Axios.ajax({
            url: "user/list1",
            data: { params: list },
        }).then(res => {
            if (res.code === 0) {
                message.success("成功");
            }
        })
    }
    useEffect(() => {
        Axios.ajax({
            url: "/map/bike_list",
            data: {
                params: params
            }
        }).then(res => {
            if (res.code === 0) {
                setCount(res.result.total_count);
                renderMap(res);
            }
        })
    }, [])
    //渲染地图数据
    const renderMap = res => {
        let list = res.result.route_list;//路线列表
        map = new window.BMapGL.Map("container");
        let gps1 = list[0].split(",");//起点
        let startPoint = new window.BMapGL.Point(gps1[0], gps1[1]);//起点坐标
        let gps2 = list[list.length - 1].split(",");//终点
        let endPoint = new window.BMapGL.Point(gps2[0], gps2[1]);//终点坐标
        map.centerAndZoom(endPoint, 11);//以endPoint坐标点居中

        let startPointIcon = new window.BMapGL.Icon("/assets/start_point.png", new window.BMapGL.Size(36, 42), {
            imageSize: new window.BMapGL.Size(36, 42),//偏移量
            anchor: new window.BMapGL.Size(18, 42)
        })//路径 空间大小 图片大小  
        let bikeMakerStart = new window.BMapGL.Marker(startPoint, { icon: startPointIcon });//覆盖物
        map.addOverlay(bikeMakerStart);//通过addOverlay添加到地图上去

        let endPointIcon = new window.BMapGL.Icon("/assets/end_point.png", new window.BMapGL.Size(36, 42), {
            imageSize: new window.BMapGL.Size(36, 42),
            anchor: new window.BMapGL.Size(18, 42)//偏移量
        })//路径 空间大小 图片大小  车辆终点
        let bikeMakerEnd = new window.BMapGL.Marker(endPoint, { icon: endPointIcon });//覆盖物
        map.addOverlay(bikeMakerEnd);//通过addOverlay添加到地图上去

        //绘制车辆行驶路线
        let routeList = [];
        list.forEach((item) => {
            let p = item.split(",");
            routeList.push(new window.BMapGL.Point(p[0], p[1]))
        })
        let polyLine = new window.BMapGL.Polyline(routeList, {
            strokeColor: "#ef4136",//颜色
            strokeWeight: 2,//粗细
            strokeOpacity: 1//透明度
        })//绘制线
        map.addOverlay(polyLine);//任何组件控件都是通过addOverlay添加的

        //绘制服务区
        let serverPointList = [];
        let serverceList = res.result.service_list;
        serverceList.forEach(item => {
            serverPointList.push(new window.BMapGL.Point(item.lon, item.lat))
        })
        let polyServiceLine = new window.BMapGL.Polygon(serverPointList, {
            strokeColor: "#ef4136",//颜色
            strokeWeight: 2,//粗细
            strokeOpacity: 1,//透明度
            fillColor: "#ff8605",
            fillOpacity: 0.4
        })
        map.addOverlay(polyServiceLine);

        //添加地图中的自行车图标
        let bikeList = res.result.bike_list;
        let bikeIcon = new window.BMapGL.Icon("./assets/bike.jpg", new window.BMapGL.Size(36, 42), {
            imageSize: new window.BMapGL.Size(36, 42),
            anchor: new window.BMapGL.Size(18, 42)//偏移量
        })
        bikeList.forEach(item => {
            let p = item.split(",");
            let point = new window.BMapGL.Point(p[0], p[1]);
            let bikeMarker = new window.BMapGL.Marker(point, { icon: bikeIcon });
            map.addOverlay(bikeMarker);
        });
    }
    return (
        <div style={{ width: "100%" }}>
            <Card>
                <FormList onsubmit={onsubmit} ref={form} />
            </Card>
            <Card>
                <div>共{count}辆车</div>
                <div id="container" style={{ height: 500 }}></div>
            </Card>
        </div>
    );
}
const FormList = forwardRef((props, ref) => {
    const { onsubmit } = props;
    return (
        <Form layout="inline" ref={ref}>
            <Form.Item label="城市" name="city" initialValue={""}>
                <Select style={{ width: 100 }}>
                    <Option value="">全部</Option>
                    <Option value="1">北京</Option>
                    <Option value="2">天津</Option>
                    <Option value="3">上海</Option>
                    <Option value="4">深圳</Option>
                </Select>
            </Form.Item>
            <Form.Item label="订单时间" name="start_time">
                <DatePicker />
            </Form.Item>
            <Form.Item label="-" name="end_time" colon={false}>
                <DatePicker />
            </Form.Item>
            <Form.Item label="订单状态" name="order_state" initialValue={""}>
                <Select style={{ width: 100 }}>
                    <Option value="">全部</Option>
                    <Option value="1">进行中</Option>
                    <Option value="2">进行中（临时停车）</Option>
                    <Option value="3">行程结束</Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" style={{ margin: "0 15px" }} onClick={onsubmit}>查询</Button>
                <Button onClick={() => ref.current.resetFields()}>重置</Button>
            </Form.Item>
        </Form>
    )
});
export default Map;