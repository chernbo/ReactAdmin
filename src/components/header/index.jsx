import React, { Component } from 'react'
import "./index.less"
import {reqWeather} from  "../../api/index"
import dateUtils from "../../utils/dataUtils"
import menuList from '../../config/menuConfig'
import imgURL from '../../assets/d00.gif'
import {withRouter} from 'react-router-dom'
import { Modal, Button } from 'antd';
import storageUtils from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'
import LinkButton from '../../components/link-button'


const { confirm } = Modal;
class Header extends Component {

    state = {
        currentTime: dateUtils(Date.now()), // 当前时间串
        dayPictureUrl:imgURL, //天气图片
        city:'',                //城市
        weather:'',          //天气文本
    }

    // 获取时间
    getTime = ()=>{
        // 每隔1s获取当前时间, 并更新状态数据currentTime
        this.intervaId = setInterval(()=>{
            const currentTime = dateUtils(Date.now())
            this.setState({currentTime})
        },1000)
    }

    // 获取城市和天气
    getWeather = async ()=>{
        //调用接口请求异步获取数据
        const {city,weather} = await reqWeather()
        console.log(city,weather)
        //更新状态
        this.setState({city,weather})
    }

    // 获取标题
    getTitle = ()=>{
        const path = this.props.location.pathname
        let title 
        menuList.forEach(item=>{
            if(item.key===path){
                title = item.title
            }else if(item.children){
                const cItem = item.children.find(cItem=>path.indexOf(cItem.key)===0)
                if(cItem){
                    title = cItem.title
                }
            }
        })
        return title
    }

    loginOut = ()=> {
        confirm({
          title: '确定退出码?',
          content: '确定退出码?',
          onOk:()=> {
            // 删除保存的user数据
            storageUtils.removeUser()
            memoryUtils.user = {}
            // 跳转到Login
            this.props.history.replace('/login')
          },
        });
      }







    /*
    第一次render()之后执行一次
    一般在此执行异步操作: 发ajax请求/启动定时器
     */   
    componentDidMount () {
        // 获取当前的时间
        this.getTime()
        // 获取当前天气
        this.getWeather()
      }

    // 当前组件卸载之前调用
    componentWillUnmount () {
       // 清除定时器
       clearInterval(this.intervalId)
     }


    render() {
       const title = this.getTitle()
       const {currentTime,dayPictureUrl,weather,city} = this.state
        return (
            <div className="header">
                <div className="header-top">
                    <span>
                        欢迎, 
                        admin
                    </span>
                    {/* <Button type="primary" onClick={this.showConfirm}>退出</Button> */}
                    <LinkButton onClick={this.loginOut}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                        <div className="header-bottom-left">
                            {title}
                        </div>
                        <div className="header-bottom-right">
                            <span>{currentTime} </span>
                            <img src={dayPictureUrl} alt="weather"/>
                            <span>{city}</span>
                            <span>{weather}</span>
                        </div>
                </div>
            </div>
        )
    }
}


export default  withRouter(Header)