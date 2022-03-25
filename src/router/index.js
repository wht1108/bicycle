import { Route } from "react-router-dom";
import {HashRouter as Router,Switch} from "react-router-dom";
import Admin from "../admin";
import App from "../App";
import Home from "../pages/home"
const  Routers= () => {
    return ( 
        <Router>
         <App>
             <Switch>
                 <Route to="/" render={()=>
                     <Admin>
                          <Route to="/home" component={Home}/>
                     </Admin>
                 }/>
             </Switch>
         </App>
        </Router>
     );
}
 
export default Routers;