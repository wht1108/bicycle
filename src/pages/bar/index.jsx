import * as echarts from "echarts/lib/echarts";
import ReactEcharts from "echarts-for-react";
import {Card} from "antd";
import echartsTheme from "./echarts/echartTheme";
import { useEffect } from "react";
const Bar = () => {
    useEffect(()=>{
      echarts.registerTheme("My Bike",echartsTheme)
    },[])
    const getOption = () => {
        return {
            title: { text: "用户骑行订单" },
            legend: { data: ["OFO", "摩拜", "小蓝"] },
            tooltip: { trigger: "axis" },
            xAxis: { data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
            yAxis: { type: 'value' },
            series: [// 显示的数据
                { name: "OFO", type: "bar", data: [2000, 3000, 5500, 7000, 8000, 12000, 20000] },
                { name: "摩拜", type: "bar", data: [1500, 3000, 4500, 6000, 8000, 10000, 15000] },
                { name: "小蓝", type: "bar", data: [1000, 2000, 2500, 4000, 6000, 7000, 8000] },
            ]
        };
    };
    return ( 
        <div style={{width:"100%"}}>
            <Card title="用户骑行订单分析" style={{marginTop:10}}>
                <ReactEcharts option={getOption()} theme="My Bike" style={{height:450}}></ReactEcharts>
            </Card>
        </div>
     );
}
 
export default Bar;