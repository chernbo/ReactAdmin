import React, { Component } from 'react'
import {
    Card,
    Button,
    Modal,
    message,
    Table,
} from 'antd'
import formateDate from '../../utils/dataUtils'
import LinkButton from '../../components/link-button'
import {reqUsers,reqDeleteUser,reqAddOrUpdateUser} from '../../api/user'
import UserForm from './user_form'


export default class user extends Component {


    state = {
        users: [], //所有用户列表
        roles:[],   // 所有角色列表
        isShow: false,  // 是否显示确认框
    }


    initColumns = ()=>{
        this.columns = [
            {
                title:'用户名',
                dataIndex:'username'
            },
            {
                title:'邮箱',
                dataIndex:'email'
            },
            {
                title:'电话',
                dataIndex:'phone'
            },
            {
                title:'注册时间',
                dataIndex:'create_time',
                render:formateDate
            },
            {
                title:'所属角色',
                dataIndex:'role_id',
                render:(role_id) =>this.roleNames[role_id]
            }, 
            {
                title:'操作',
                render:(user)=>(
                    <span>
                        <LinkButton onClick={()=>this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            }

        ]
    }
    // 删除用户
    deleteUser = async(user)=>{
        Modal.confirm({
            title: `确认删除${user.username}吗?`,
            onOk:async()=>{
                const result = await reqDeleteUser(user._id)
                if(result.status===0){
                    message.success('删除用户成功!')
                    this.getUsers()
                }
            }
        })
    }

    // 添加界面
       showAdd = () =>{
        this.user = null // 清空用户信息
        this.setState({
            isShow:true
        })
     
    }
    // 显示修改界面
    showUpdate = (user)=>{
        this.user = user //保存user
        this.setState({
            isShow:true
        })
    }



    //根据role的数组,生成包含所有角色名的对象([_id]=name)
    initRoleNames = (roles)=>{
        const roleNames = roles.reduce((pre,role)=>{
            pre[role._id] = role.name
            return pre
        },{ })
        return this.roleNames = roleNames
    }


    // 添加/更新用户
    addOrUpdateUser =async()=>{
        this.setState({isShow:false})

        //1.收集输入数据
        const user = this.form.getFieldsValue()
        // 清除输入数据缓存
        this.form.resetFields()
        // 如果是更新,需要给user 指定_id属性
        if(this.user){
            console.log(user)
            console.log(this.user)
            user._id = this.user._id
        }
        // 2.提交添加的请求
        const result = await reqAddOrUpdateUser(user)
        // 3. 更新列表显示
        if(result.status===0){
            message.success(`${this.user?'修改':'添加'}`)
            // 重新请求用户列表
            this.getUsers()
        }
    }

    getUsers = async()=>{
        const result = await reqUsers()
        if(result.status==0){
            const {users,roles} = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }else{
            message.error('获取用户列表失败')
        }
    }


    componentWillMount(){
        this.initColumns()
    }

    componentDidMount(){
        this.getUsers()
    }


    render() {
        const title = <Button type="primary" onClick={this.showAdd}>创建用户</Button>
        const {users,isShow,roles} = this.state
        const user = this.user||{}


        return (
           <Card title={title}>
               <Table
                bordered
                rowKey='_id'
                dataSource={users}
                columns={this.columns}
                pagination={{defaultPageSize:2}}
               >
               </Table>
               <Modal
                title={user._id?'修改用户':'创建用户'}
                visible={isShow}
                onOk ={this.addOrUpdateUser}
                onCancel={()=>{
                    this.form.resetFields()
                    this.setState({isShow:false})
                }}
               >
                <UserForm 
                  setForm ={form=>this.form = form}
                  user={user}
                  roles={roles}/>
               </Modal>
           </Card>
        )
    }
}
