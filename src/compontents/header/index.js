import { Col, Row } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Utils from "../../utils/utils.js"
import "./index.less";
const Header = () => {
    // const [weather,setWeather]=useState({});
    // useEffect(()=>{
    //     axios.get("https://devapi.qweather.com/v7/weather/now?location=101091101&key=fc482e17ef3c4151a0fcb989196e82d8")
    //     .then(res=>{
    //         console.log(res.data);
    //         setWeather(res.data.now);
    //     })
    // })
    const [time, setTime] = useState("");
    useEffect(() => {
        setInterval(() => {
            let data = new Date().getTime();
            setTime(Utils.formateDate(data));
        }, 1000);
    }, [time])
    return (
        <div className="header">
            <Row className="header-top">
                <Col span={24}>
                    <span>欢迎，秦皇岛 海港区</span>
                    <a href="#">退出</a>
                </Col>
            </Row>
            <Row className="breadcrumb">
                <Col span={4} className="breadcrumb-title">首页</Col>
                <Col span={20} className="weather">
                    <span className="date">{time}</span>
                    <span className="weather-img">
                        <i className="qi-100"></i>
                        {/* {weather.text} */}
                    </span>
                    <span className="weather-detail">
                        晴
                    </span>
                </Col>
            </Row>
        </div>
    );
}

export default Header;