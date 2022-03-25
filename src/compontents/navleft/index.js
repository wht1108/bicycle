import { Menu } from "antd"
import "./index.less"
import MenuConfig from "../../config/menuConfig"
import { NavLink } from "react-router-dom";
const { SubMenu } = Menu;
const renderMenu = (data) => {
    return data.map(item => {
        if (item.children) {
            return <SubMenu key={item.key} title={item.title}>
                {renderMenu(item.children)}
            </SubMenu>
        }
        return <Menu.Item key={item.key}>
            <NavLink to={item.key}>{item.title}</NavLink>
            </Menu.Item>
    })
}
const NavLeft = () => {
    return (
        <div>
            <div className="logo">
                <img src="./assets/logo-ant.svg"></img>
                <h1>My Bike</h1>
            </div>
            <Menu theme="dark">
                {renderMenu(MenuConfig)}
            </Menu>
        </div>
    );
}

export default NavLeft;