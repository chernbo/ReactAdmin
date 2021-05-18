import React, { Component } from 'react'

import {
    Form,
    Input,
    Tree
}   from 'antd'
import menuList from '../../config/menuConfig'
const {TreeNode} = Tree;
const Item = Form.Item



export default class AutoForm extends Component {

    state = {
        checkedKeys:[]
    }

    // 初始化 menus 
    constructor (props){
        super(props)
        
        // 根据传入角色的menus生成初始状态
        const {menus} = this.props.role
        this.state = {
            checkedKeys:menus
        }
        // this.setState({
        //     checkedKeys:menus
        // })
    }

    /*
    为父组件提交获取最新menus数据的方法
   */
    getMenus = () => this.state.checkedKeys

    // 获取整个menuList
    getTreeNodes = (menuList) =>{
        return menuList.reduce((pre,item)=>{
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children):null}
                </TreeNode>
            )
            return pre
        },[])
    }

    //选中某个node时的回调
    onCheck = checkedKeys =>{
        console.log(checkedKeys);
        this.setState({checkedKeys});
    }

    componentWillMount(){
        this.treeNodes = this.getTreeNodes(menuList)
    }
    
    // 已挂载的组件接收新的 props 之前被调用
    UNSAFE_componentWillReceiveProps(nextProps){
        console.log('componentWillReceiveProps()', nextProps)
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys:menus
        })

    }

    render() {
        const {role} = this.props
        const {checkedKeys} = this.state 
        console.log(checkedKeys)
        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 },  // 左侧label的宽度
            wrapperCol: { span: 15 }, // 右侧包裹的宽度
        }
        return (
            <div>
                <Item label='角色名称' {...formItemLayout}>
                    <Input value={role.name} disabled/>
                </Item>
                <Tree
                checkable
                checkedKeys={checkedKeys}
                onCheck ={this.onCheck}
                defaultExpandAll={true}>
                
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode> 
                </Tree>
            </div>
    
        )
    }
}
    
