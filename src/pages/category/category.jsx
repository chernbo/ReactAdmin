import React, { Component } from 'react'
import { Button, Card, Icon,message,Table,Modal } from 'antd';
import LinkButton from '../../components/link-button';
import {reqCategorys,reqAddCategory,reqUpdateCategory} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
export default class category extends Component {
    state = {
        loading:false, // 是否正在获取数据中
        categorys : [], // 一级分类列表
        subCategorys:[],// 二级分类列表
        parentId: '0',
        parentName: '',
        showStatus: 0, //标识添加/更新的对话框是否显示

    }
    // 初始化所有列的数组
    initColumns = ()=>{
        this.columns = [ 
            {
              title: '分类的名称',
              dataIndex: 'name',
            },
            {
              title: '操作',
              width:300,
              dataIndex:'',
              render: (category)=> // 返回需要显示的界面标签,render的默认参数是该元素标签参数
                 <span>
                     <LinkButton onClick={()=>this.showUpdate(category)}>修改分类</LinkButton>
                    {/*如何向事件回调函数传递参数: 先定义一个匿名函数, 在函数调用处理的函数并传入数据*/}
                    {this.state.parentId==='0'? <LinkButton onClick={()=>this.showSubCategorys(category)}>查看子分类</LinkButton> :null } 
                 </span>
            }
        ]; 
    }
    // 异步获取一级/二级分类列表显示
    getCategorys = async (parentId) =>{

        // 在发请求前, 显示loading
        this.setState({loading:true})
        // 如果parentId =没有传参数,以this.state.parentId为准
        console.log("传入"+parentId)
        parentId = parentId || this.state.parentId
        console.log("得到"+parentId)
        // 发起异步ajax请求, 获取数据
        const result = await reqCategorys(parentId)
        // 在请求完成后, 隐藏loading
        this.setState({loading: false})
        if(result.status===0){
            // 取出分类数组（可能是一级也可能是二级)
            const categorys = result.data
            console.log( categorys)
            if(parentId==='0'){
                // 更新一级分类状态
                this.setState({
                    categorys
                })
            }else{
                 // 更新二级分类状态
                 this.setState({
                     subCategorys:categorys
                 })
            }
        }else{
           
            message.error('获取分类列表失败')
        }
    }


    // 添加分类
    addCategory = () =>{
         // 进行表单验证, 只有通过了才处理,values有表单里面所有是数据,以object表示
        this.form.validateFields(async (err, values) => {
            // 添加项不为空
            if(!err){
                // 隐藏添加框
                this.setState({
                    showStatus :0
                })
                // 收集数据, 并提交添加分类的请求
                // const {parentId,categoryName} = this.form.getFieldsValue()
                const {parentId,categoryName} = values
                // 清除缓存输入数据
                this.form.resetFields()
                const result = await reqAddCategory(categoryName,parentId)
                if(result.status==0){
                    // 添加的分类就是当前分类列表下的分类
                    if(parentId===this.state.parentId){
                        this.getCategorys()
                    }else if(parentId==='0'){ // 在二级分类列表下添加一级分类, 重新获取一级分类列表, 但不需要显示一级列表:
                        this.getCategorys('0')   //加参数0表示更新一级分类内容,但不显示,不加0 表示更新this.state.parentId,
                                                // 但是this.state.parentId在二级分类的话是二级分类的父._id,则获取得到值为二级分类,
                                                // 更新也是二级分类,就不更新一级分类,但是我们需要在在二级分类列表下更新一级分类/
                    }
                }
            }
        })
    }




    // 修改分类
    UpdateCategory =  () =>{
        this.form.validateFields(async(err, values) => {
            if(!err){
                 //1 .隐藏确定框
                this.setState({
                    showStatus:0
                })
                // 2. 准备数据，发起请求
                const categoryId = this.category._id

                const {categoryName} = values
                // 异步请求更新分类
                const result = await reqUpdateCategory({categoryId,categoryName})
                // 清除缓存输入数据
                this.form.resetFields()
                if(result.status === 0){
                    this.getCategorys()
                }else{
                    message.error('修改分类列表失败')
                }
            }
        })
    }


    // 更新二级分类列表状态
    showSubCategorys = (category)=>{
        //更新状态
        this.setState({
            parentId: category._id, // 传入一级分类列表id,准备在getCategorys()更新parentId为一级分类_id
            parentName:category.name
        },()=>{
            this.getCategorys()
        })
      
    }

    // 退回一级分类列表状态
    showCategorys = () => {
        // 更新为显示一列表的状态
        this.setState({
          parentId: '0',
          parentName: '',
          subCategorys: []
        })
      }
    
    /*
    显示添加的确认框
     */
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    /*
  显示修改的确认框
   */
  showUpdate = (category) => {
    // 保存分类对象
    this.category = category
    // 更新状态
    this.setState({
      showStatus: 2
    })
  }

    
     /*
  响应点击取消: 隐藏确定框
   */
    handleCancel = () => {
        // 清除输入数据
        // this.form.resetFields()
        // 隐藏确认框
        this.setState({
        showStatus: 0
        })
    }



    // 第一次render()准备数据
    componentWillMount(){
        this.initColumns()
    }
    // 执行异步任务,发起异步ajax请求
    componentDidMount(){
        this.getCategorys('0') // 默认显示一级分类列表
    }



    render() {
        // 读取状态数据
        const {categorys,parentId,parentName,subCategorys,loading,showStatus} = this.state
        // 读取指定的分类
        const category = this.category || {}

        // card 左侧
        const title = parentId ==='0'? '一级分类列表':(
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type='arrow-right' style={{marginRight: 5}}/>
                <span>{parentName}</span>
            </span>
        )
        // card 右侧
        const extra = (
            <Button type="primary" onClick={this.showAdd}>
                <Icon  type='plus'/>
                添加
            </Button>
        )
        return (
            <div>
                   <Card title={title} extra={extra} >
                        <Table rowKey="_id"  
                            loading ={loading}
                            bordered 
                            dataSource={parentId==='0'?categorys:subCategorys} 
                            columns={this.columns} 
                            pagination={{defaultPageSize:5,showQuickJumper:true}}    
                        />
                    </Card>
                    {/* 对话框 */}
                    <Modal
                        title="添加分类"
                        visible={showStatus===1}
                        onCancel={this.handleCancel}    
                        onOk ={this.addCategory}
                    >
                    <AddForm
                        categorys = {categorys}
                        parentId = {parentId}
                        setForm={(form)=>{this.form = form}}
                        />
                    </Modal>


                    <Modal
                        title="更新分类"
                        visible={showStatus===2}
                        onCancel={this.handleCancel}    
                        onOk={this.UpdateCategory}
                    >
                    <UpdateForm
                    //  将子类的form对象,传递给父类category
                        categoryName = {category.name}
                        setForm={(form)=>{this.form = form}}/>
                    </Modal>
                 
            </div>
        )
    } 
} 
