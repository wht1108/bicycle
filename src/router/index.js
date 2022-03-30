import { Redirect, Route } from "react-router-dom";
import { HashRouter as Router, Switch } from "react-router-dom";
import Admin from "../admin";
import App from "../App";
import Home from "../pages/home"
import City from "../pages/city";
import Order from "../pages/order";
import OrderDetail from "../pages/order/detail";
import Common from "../common";
import User from "../pages/user";
import Map from "../pages/map";
import Bar from "../pages/bar";
import Permission from "../pages/permission";
import Nomatch from "../pages/nomatch";
const Routers = () => {
    return (
        <Router>
            <App>
                <Switch>
                    <Route path="/common" render={() =>
                        <Common>
                            <Route path="/common/order/detail/:orderId" component={OrderDetail} />
                        </Common>
                    } />
                    <Route path="/" render={() =>
                        <Admin>
                            <Switch>
                                <Route path="/home" component={Home} />
                                <Route path="/city" component={City}></Route>
                                <Route path="/order" component={Order}></Route>
                                <Route path="/user" component={User}></Route>
                                <Route path="/bikeMap" component={Map}></Route>
                                <Route path="/bar" component={Bar}></Route>
                                <Route path="/permission" component={Permission}></Route>
                                <Redirect to="/home"/>
                                <Route component={Nomatch} />
                            </Switch>
                        </Admin>
                    } />

                </Switch>
            </App>
        </Router>
    );
}

export default Routers;