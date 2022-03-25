import { Row, Col } from "antd"
import Header from "./compontents/header";
import NavLeft from "./compontents/navleft";
import Footer from "./compontents/footer";
import "./style/common.less";
const Admin = (props) => {
    return (
            <Row className="containter">
                <Col span={4} className="nav-left">
                     <NavLeft></NavLeft>
                </Col>
                <Col span={20} className="main">
                    <Header></Header>
                    <div className="content">{props.children}</div>
                    <Footer></Footer>
                </Col>
            </Row>
    );
}

export default Admin;