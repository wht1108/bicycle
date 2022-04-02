import { Menu } from "antd"
import "./index.less"
import MenuConfig from "../../config/menuConfig"
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as action from "../../redux/actions";
const { SubMenu } = Menu;
const renderMenu = (data) => {
    return data.map(item => {
        if (item.children) {
            return <SubMenu key={item.key} title={item.title}>
                {renderMenu(item.children)}
            </SubMenu>
        }
        return <Menu.Item key={item.key} title={item.title}>
            <NavLink to={item.key}>{item.title}</NavLink>
        </Menu.Item>
    })
}
const NavLeft = (props) => {
    const [selectKeys, setselectKeys] = useState([]);
    useEffect(() => {
        let currentKey = window.location.hash.replace(/#|\?.*$/g, "");
        setselectKeys(currentKey);
    }, [setselectKeys]);
    const handleClick = (({ item, key }) => {
        console.log("item", item)
        props.changeName(item.props.title);
        setselectKeys(key);
    })
    return (
        <div>
            <div className="logo">
                <img src="./assets/logo-ant.svg"></img>
                <h1>My Bike</h1>
            </div>
            <Menu theme="dark" selectedKeys={selectKeys} onClick={handleClick}>
                {renderMenu(MenuConfig)}
            </Menu>
        </div>
    );
}

export default connect(null, action)(NavLeft);