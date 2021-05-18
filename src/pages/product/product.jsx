import React, { Component } from 'react'


import ProductHome from './home'
import ProductAddUpdate from './addupdate'
import ProductDetail from './detail'
import { Switch ,Redirect,Route } from 'react-router'


export default class product extends Component {
    render() {
        return (
            <Switch>
                {/* /product/home
                路由匹配是逐层匹配,先是App /=>admin的 
                /product=> product的 /product 由于只比较前缀所以/product/home匹配到了/product
                进入 ProductHome */}
                <Route path='/product' component={ProductHome} exact/>
                <Route path='/product/addupdate' component={ProductAddUpdate}/>
                <Route path='/product/detail' component={ProductDetail}/>
                <Redirect to='/product'/>
            
            </Switch>
        )
    }
}
