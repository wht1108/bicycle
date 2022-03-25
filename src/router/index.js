import { Route } from "react-router-dom";
import { HashRouter as Router, Switch } from "react-router-dom";
import Admin from "../admin";
import App from "../App";
import Home from "../pages/home"
import Nomatch from "../pages/nomatch";
const Routers = () => {
    return (
        <Router>
            <App>
                <Switch>
                    <Route path="/" render={() =>
                        <Admin>
                            <Switch>
                                <Route path="/home" component={Home} />
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