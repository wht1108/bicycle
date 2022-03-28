import { Row } from "antd"
import Header from "./compontents/header"
import "./style/common.less"
const Common = (props) => {
    return (
        <div>
            <Row className="simple-page">
                <Header menuType="second" />
            </Row>
            <Row className="content">
                {props.children}
            </Row>
        </div>
    )
}

export default Common;