import React, { Component } from 'react'

import {reqAddRole, reqRoles,reqUpdateRole} from '../../api/role'
import formateDate from '../../utils/dataUtils'
import AddForm from './addRole'
import AuthForm from './autoForm'
import memoryUtils from "../../utils/memoryUtils"
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'
import storageUtils from '../../utils/storageUtils'

export default class role extends Component {

    state = {
        roles : [ ], //所以角色的列表
        role: {}, //选中的角色
        isShowAdd:false, // 是否显示showadd 对话框
        isShowAuth:false
    }

    constructor (props) {
      super(props)
      this.auth = React.createRef()
    }

    initColumn = () => {
   
        this.columns = [
          {
            title: '角色名称',
            dataIndex: 'name'
          },
          {
            title: '创建时间',
            dataIndex: 'create_time',
            render: (create_time) => formateDate(create_time)
          },
          {
            title: '授权时间',
            dataIndex: 'auth_time',
            render: formateDate
          },
          {
            title: '授权人',
            dataIndex: 'auth_name'
          },
        ]
      }
      
    getRoles = async() =>{
      const result = await reqRoles()

      if(result.status===0){
        const roles = result.data
       
        this.setState({
          roles
        })
      }else{
        message.error("获取角色列表失败")
      }
    }
    // 点击行,选择单选按钮
    onRow = (role)=>{
      return {
        onClick:event =>{ //点击行
          this.setState({
            role
          })
        }
      }
    }

    // 添加用户角色
    addRole = ()=>{
      // 进行表单验证,只能通过了才向下处理
      
      this.form.validateFields(async (error,values)=>{
        if(!error){
            // 隐藏确认框
            this.setState({
              isShowAdd:false
            })
            // 收集输入数据
            const {roleName} = values
            this.form.resetFields()
            
            // 请求添加
            const result = await reqAddRole(roleName)
            // 根据结果
            if(result.status==0){
              message.success('添加角色成功')
              // this.getRoles()
              const role = result.data
              // 更新状态,基于原来状态数据更新,不在原状态基础上改变,
              // 而是创建一个新数组状态
              this.setState (state=>({
                roles:[...state.roles,role]
              }))
            }else{
              message.success('添加角色失败')
            }
        }
      })
    }

    //更新角色
    updateRole = async()=>{
        // 隐藏确认框
        this.setState({
          isShowAuth: false
        })
        const role = this.state.role
        // 得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_name = memoryUtils.user.username
        role.auth_time = Date.now()
        // 请求更新
        const result = await reqUpdateRole(role)
        if(result.status===0){
          if(role._id){
            if(role._id===memoryUtils.user.role._id){
              memoryUtils.user ={}
              storageUtils.removeUser()
              this.props.history.replace('/login')
              message.success('当前用户角色权限成功')
            }
          }else{
            message.success('设置角色权限成功')
            this.setState({
              roles:[...this.state.roles]
            })
        }
      }
  
    }

    componentWillMount(){
      this.initColumn()
    }

    componentDidMount(){
      this.getRoles()
    }
    
    


    render() {

        const {roles,role,isShowAdd,isShowAuth} = this.state
        const title =(
            <span>
                <Button type='primary' onClick={()=>this.setState({isShowAdd:true})}>创建角色</Button>
                <Button type='primary'disabled={!role._id} onClick={()=>this.setState({isShowAuth:true})} >设置角色权限</Button>
            </span>

        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns} 
                    rowSelection={{
                      type:'radio',
                      selectedRowKeys:[role._id],
                      onSelect:(role)=>{
                        this.setState({ // 选择某个radio时回调
                          role
                        })
                      }
                    }}  
                    onRow={this.onRow} // 选择某一行也能选择radio
                />               
                <Modal
                  title='添加角色'
                  visible={isShowAdd}
                  onCancel={()=>{
                    this.setState({isShowAdd:false})
                    this.form.resetFields()
                  }}
                  onOk={this.addRole}
                >
                <AddForm 
                  setForm = {(form) => this.form = form}/>
                </Modal>
                
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk = {this.updateRole}
                    onCancel={() => {
                    this.setState({isShowAuth: false})
                  }}
                  >
                  <AuthForm ref={this.auth} role={role}/>
                </Modal>

            </Card>
        )
    }
}
