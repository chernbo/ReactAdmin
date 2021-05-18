import React, { Component } from 'react'
import "./index.less"   
import { Menu, Icon, Switch } from 'antd';
import logo from "../../assets/logo.png"
import { Link,withRouter } from 'react-router-dom';
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils';


const { SubMenu } = Menu;
class leftNav extends Component {


    //判断当前登录用户对item是否有权限
    hasAuth = (item) =>{
        const {key,isPublic} = item

        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username
        /*
            
            1. 如果当前用户是admin
            2. 如果当前item是公开的
            3. 当前用户有此item的权限: key有没有menus中
        
        */
    if(username=='admin' ||isPublic||menus.indexOf(key)!==-1){
            return true
    }else if(item.children){// 4.如果当前用户有此item的某个子item的权限
            return !!item.children.find(child => menus.indexOf(child.key)!==-1)
    } 
    }

// 根据menu的数据数组生成对应的标签数组
// 使用map()+递归调用    

    getMenuNodes_map = (menuList)=>{
        // 得到当前请求的路由路径
        const path = this.props.location.pathname

        return menuList.map(item =>{
            if(this.hasAuth(item)){
                if(!item.children){
                    return (
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                }else{
                    // 查找与当前请求路径匹配的子菜单路径
                    const cItem  = item.children.find(elemnt=>path.indexOf(elemnt.key)==0)
                    // 如果子路径存在(被打开)
                    if(cItem){
                        this.openKey = item.key
                    }

                return (
                    <SubMenu
                            key={item.key}
                            title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                            }
                    >
                            {this.getMenuNodes_map(item.children)}
                    </SubMenu>
                )
            }
        }
        })
    }
// 使用reduce+递归调用
    getMenuNodes_reduce = (menuList)=>{
        return menuList.reduce((pre,cur)=>{
            if(!cur.children){
                pre.push((
                    <Menu.Item key={cur.key}>
                        <Link to={cur.key}>
                            <Icon type={cur.icon}/>
                            <span>{cur.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            }else{
                pre.push((
                    <SubMenu
                        key={cur.key}
                        title={
                        <span>
                            <Icon type={cur.icon} />
                            <span>{cur.title}</span>
                        </span>
                        }
                        >
                        {this.getMenuNodes_reduce(cur.children)}
                    </SubMenu>
                ))
            }
            return pre
        },[])
    }
    
    // 在第一次render之前准备数据(必须是同步的)
    componentWillMount(){
        this.menuNodes = this.getMenuNodes_map(menuList)
    }


    render() {

        // 得到需要打开的菜单项的key
        const openKey = this.openKey
        // 得到当前请求的路由路径
        let pathname = this.props.location.pathname
        if(pathname.indexOf('/product')===0){
            pathname = '/product'
        }
        return (                    
            <div className="left-nav">
                <Link to="/" className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultOpenKeys= {[openKey]}
                    // 选择默认渲染菜单项
                    selectedKeys={[pathname]}
                >   
                    {this.menuNodes}
                </Menu>
            </div>
        )
    }
}

/*
    withRouter高阶组件:
    非路由组件默认是没有history,location,match,而路由组件是有的
    需要使用withRouter包装非路由组件。就有三大属性了。
*/

export default withRouter(leftNav)

