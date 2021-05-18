import React, { Component } from 'react'
import 'antd/dist/antd.less';
import {BrowserRouter,Switch,Route} from 'react-router-dom'

import Login from "./pages/login/login"
import Admin from "./pages/admin/admin"



export default class App extends Component {
  render() {
    return (
        <div style={{height:"100%"}}>
           <BrowserRouter>
            <Switch>
                <Route path='/login' component={Login}></Route>
                <Route path="/" component={Admin}></Route>
            </Switch>
          </BrowserRouter>
        </div>
         
    )
  }
}
