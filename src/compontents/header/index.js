import { Col, Row } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Utils from "../../utils/utils.js"
import "./index.less";
const Header = (props) => {
    // const [weather,setWeather]=useState({});
    // useEffect(()=>{
    //     axios.get("https://devapi.qweather.com/v7/weather/now?location=101091101&key=fc482e17ef3c4151a0fcb989196e82d8")
    //     .then(res=>{
    //         console.log(res.data);
    //         setWeather(res.data.now);
    //     })
    // })
    const { menuType,menuName } = props;
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
                {
                    menuType ?
                        <Col span={6} className="logo">
                            <img src="/assets/logo-ant.svg" ></img>
                            <span>Bike 通用管理系统</span>
                        </Col> : null
                }
                <Col span={menuType ? 18 : 24}>
                    <span>欢迎，秦皇岛 海港区</span>
                    <a href="#" className={menuType ? menuType : ""}>退出</a>
                </Col>
            </Row>
            {
                menuType ? null :
                    <Row className="breadcrumb">
                        <Col span={4} className="breadcrumb-title">{menuName}</Col>
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
            }

        </div>
    );
}
const mapStateToProps=(state)=>({
    menuName:state.menuName,
})
export default connect(mapStateToProps)(Header);