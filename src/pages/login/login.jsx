import React, { Component } from 'react'
import './login.less'
import logo from '../../assets/logo.png'
import {reqLogin} from '../../api/index'
import { Form, Input, Button, message } from 'antd'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router'
class Login extends Component {


  
    handleSubmit = (event) => {

        // 阻止事件的默认行为,当点击提交按钮时阻止对表单的提交,来在控制台显示密码和用户名
        event.preventDefault()
        // 点击时,对表单项所有值进行验证
        this.props.form.validateFields(async (err,value)=>{
            // 检验成功
            if(!err){
                const {username, password} = value
            // 请求登录
            try{
                const result = await reqLogin(username,password)
                if(result.status===0){//登录成功
                    message.success('登录成功')
                }
                // 保存user
                const user = result.data
                memoryUtils.user = user     // 保存在内存中
                storageUtils.saveUser(user) //保存在存储中

                // 跳转到管理页面 (不需要回退到登录页面,所有不使用push,而是replace)
                this.props.history.replace('/')
            }catch (error){
                console.log('请求失败',error)
            }
            }else{
                console.log("检验失败!")
            }
        })
    }
    //自定义式验证
    validatePwd = (rule,value,callback) =>{
        console.log('validatePwd',rule,value)
        if(!value){
            callback('密码必须输入')
        }else if(value.length<4){
            callback('密码长度不能小于4位')
        }else if(value.length>12){
            callback('密码长度不能大于12位')
        }else if(!/^[a-z0-9A-Z_]+$/.test(value)){
            callback('密码必须为英文或下划线')
        }else{
            callback() //验证通过
        }
    }


    render(){
        // 得到form对象
        const form = this.props.form
        const {getFieldDecorator} = form;
        // 如果用户已经登录,自动跳转到管理页面
        if(memoryUtils.user&&memoryUtils.user._id){
            return <Redirect to="/"/>
        }
        return (
            <div className="login">
               <header className="login-header">
                <img src={logo} alt="logo"/>
                <h1>React 项目:后台管理系统</h1>
               </header>
               <section className="login-content">
                   <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item>
                        {
                            getFieldDecorator('username',{
                                // 声明式验证: 直接使用别人定义好的验证规则进行验证
                                rules:[
                                    {require:true,whitespace:true,message:"用户名不为空"},
                                    {min:4,message:"用户名至少4位"},
                                    {max:12,message:"用户名最多12位"},
                                    {pattern:/^[a-zA-Z0-9]+$/,message:"用户名必须是英文或或下划线"}
                                    ],
                                    initialValue:'admin' //设置初始值

                            })(
                                <Input
                                    placeholder="用户名"
                                />
                            )
                        }
                        </Form.Item>
                        <Form.Item>{
                            getFieldDecorator('password',{
                                rules:[{
                                    validator:this.validatePwd
                                }]
                            })(
                                <Input
                                    type="password"
                                    placeholder="密码"
                                />
                            )
                        }
                        </Form.Item>
                        <Form.Item>
                            <Button className="login-form-button" type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
               </section>
            </div>
        )
    }
}


// 包装组件Login得到form属性。

const WrapLogin = Form.create()(Login)

export default WrapLogin