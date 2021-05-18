import React, { Component } from 'react'
import {Card,Icon,Form,Input,Cascader,Button,message} from 'antd'
import LinkButton from '../../components/link-button'
import {reqCategorys,reqAddOrUpdateProduct} from '../../api/index'
import PictureWall from './picturewall'
import RichTextEditor from './rich-text-editor'


const {TextArea} = Input

class addupdate extends Component {

    state = {
        options : []
    }

    constructor (props) {
        super(props)
        // 创建用来保存ref标识的标签对象的容器
        // 保存照片墙标签的容器
        this.pw = React.createRef()
        // 保存文本框标签的容器
        this.editor = React.createRef()
    }

    initOptions = async (categorys)=>{
        const options = categorys.map(c=>({
            value:c._id,
            label:c.name,
            isLeaf:false,
        }))
        //如果是二级分类商品的更新
        const {isUpdate,product} = this
        const {pCategoryId} = product

        if(isUpdate && pCategoryId!=='0') {
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            // 生成二级下拉列表的options
            const childOptions = subCategorys.map(c => ({
              value: c._id,
              label: c.name,
              isLeaf: true
            }))

            // 找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value===pCategoryId)
      
            // 关联对应的一级option上
            targetOption.children = childOptions
        }

        // 更新options状态
        this.setState({
            options
        })
    }
    getCategorys = async (parentId) =>{
        const result = await reqCategorys(parentId)
        let options
        if(result.status===0){
            const categorys = result.data
            // 如果是一级分类列表
            if(parentId==='0'){
                this.initOptions(categorys)
            }else{
                return categorys // 返回二级列表 ==> 当前async函数返回的promsie就会成功且value为categorys
            }
        }
       
    }

    /*
    用加载下一级列表的回调函数
   */
    loadData = async selectedOptions =>{
        //得到选择的option对象
        const targetOption = selectedOptions[0]
        // 显示 loading
        targetOption.loading = true
        // 根据选中的分类,请求获取二级分类列表
     
        const subCategorys = await this.getCategorys(targetOption.value)
        // 隐藏loading
        targetOption.loading = false
        // 二级分类数组的数据
      
        if (subCategorys&&subCategorys.length>0){
            // 生成一个二级列表的options
            const childOptions = subCategorys.map(c=>({
                value:c._id,
                label:c.name,
                isLeaf:true
            }))

            //关联倒当前option上
            targetOption.children = childOptions
      
            }else{// 当前选中的分类没有二级分类
                targetOption.isLeaf =  true
            }
            console.log(this.state.options)
            // 更新options状态
            this.setState({
                options:[...this.state.options],
            })
    }
    


    submit = ()=>{
        // 进行表单验证,如果通过了,才发送请求
        this.props.form.validateFields(async (error,values)=>{
            if(!error){
                const {name,desc,price,categoryIds} = values
                // categoryIds [pCategoryId,CategoryId]
                // 修改商品的一级分类与二级分类
                let pCategoryId, categoryId
                if(categoryIds.length===1){
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                }else{
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs =  this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                console.log(detail)
                const product = {name,desc,price,imgs,detail, pCategoryId,categoryId} 
                console.log("submit:")
                console.log(product)
                // 如果是更新, 需要添加_id
                if(this.isUpdate){
                    product._id = this.product._id
                }

                //2. 调用接口请求函数去添加/更新
                const result = await reqAddOrUpdateProduct(product)
                console.log("result:")
                console.log(result)
                // 3. 根据结果提示
                if (result.status===0) {
                    message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
                }
            }
        })
    }


    /*
    验证价格的自定义验证函数
   */
    validatePrice = (rule,value,callback)=>{
        if(value*1>0){
            callback()
        }else{
            callback('价格必须大于0')
        }
    }

    componentDidMount(){
        this.getCategorys('0')
    }

    componentWillMount(){
        
        // 取出携带的state
        const product = this.props.location.state
        // 保存是否是更新的标识
        this.isUpdate = !!product
        // 保存商品(如果没有, 保存是{})
        this.product = product || {}
    }

    render() {

        const {isUpdate,product} = this
        const {pCategoryId,categoryId,imgs,detail} = product

        console.log("product:")
        console.log(product)
         // 用来接收级联分类ID的数组
        const categoryIds = []
        if(isUpdate){
            //商品是一个一级分类的商品
            if(pCategoryId==='0'){
                categoryIds.push(categoryId)
            }else{
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        

        
       const title = (
           <span>
                <LinkButton>
                <Icon type="arrow-left"
                     style={{marginRight:10, fontSize:20}}
                    onClick={()=>this.props.history.goBack()}>
                </Icon>
                    添加商品
                </LinkButton>
           </span>
          
       )    

       const formItemLayout = {
           labelCol :{span:2},
           wrapperCol :{span:8}
       }
       const {getFieldDecorator} = this.props.form


        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Form.Item   
                        label="商品名称">
                        {
                            getFieldDecorator('name',{
                                initialValue:product.name,
                                rules:[
                                    {required:true,message:'必须输入商品名称'}
                                ]
                            })(<Input planceholder="请输入商品名称"/>)
                        }
                    </Form.Item>

                    <Form.Item 
                        label="商品描述">
                            {   
                                 getFieldDecorator('desc',{
                                    initialValue:product.desc,
                                    rules:[
                                        {required:true,message:'必须输入商品描述'}
                                    ]
                                })(<TextArea planceholder="请输入商品描述" autosize={{minRows:2,maxRows:6}}/>)
                            }
                    </Form.Item>

                    <Form.Item 
                        label="商品价格">
                              {   
                                 getFieldDecorator('price',{
                                    initialValue:product.price,
                                    rules:[
                                        {required:true,message:'必须输入商品价格'},
                                        {validator:this.validatePrice}
                                        
                                    ]
                                })( <Input type="number"  addonAfter="元" />)
                            }
                    </Form.Item>

                    <Form.Item 
                        label="商品分类">
                              {   
                                 getFieldDecorator('categoryIds',{
                                    initialValue: categoryIds,
                                    rules:[
                                        {required:true,message:'必须输入商品分类'},
                                    ]
                                })( <Cascader 
                                        placeholder='请指定商品分类'
                                        options = {this.state.options} /*需要显示的列表数据数组*/
                                        loadData= {this.loadData} /*当选择某个列表项, 加载下一级列表的监听回调*/
                                        
                                    />)
                            }
                    </Form.Item>           

                    <Form.Item 
                        label="商品图片">
                            {/*  */}
                        <PictureWall ref={this.pw} imgs={imgs}/>
                    </Form.Item>
                   
                     
                    <Form.Item label="商品详情"
                        labelCol={{span:2}} wrapperCol={{span:20}}
                    >
                            
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Form.Item>

                    <Form.Item>
                        <Button type='primary'onClick={this.submit}>提交</Button>
                    </Form.Item>

                </Form>
            </Card>
        )
    }
}

export default Form.create()(addupdate)