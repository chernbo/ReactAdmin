import React, { Component } from 'react'
import {Card,Select,Input,Icon,message,Button,Table} from 'antd'
import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from '../../utils/constants'
import {reqProduct,reqSearchProducts, reqUpdateStatus} from '../../api/index' 
const Option = Select.Option


export default class home extends Component {
    state = {
        total:0,    // 商品的总数量
        products : [],  // 商品的数组
        loading: false,
        searchName:'',// 搜索的关键字
        searchType:'productName' // 根据那个字段搜索
    }

    // 获取指定页码的列表数据显示
    getProducts = async (pageNum) =>{
        this.pageNum = pageNum 
        this.setState({loading:true}) 
        const {searchName,searchType} = this.state
        //如果搜索的关键字有值,说明我们要做搜索分页
        let result 
        if(searchName){
            result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }else{
            result = await reqProduct(pageNum,PAGE_SIZE)
        }
        this.setState({loading: false}) // 隐藏loading
        if(result.status===0){
            //取出分页数据，更新状态，显示分页列表
            const {total,list} = result.data
            this.setState({
                total,
                products:list
            })
        }else{
            message.error('获取商品列表失败')
        }
    }
    // 更新指定商品的状态
    updateStatus = async (productId,status) =>{

        const result = await reqUpdateStatus(productId,status)
        if(result.status===0){
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }

    componentWillMount(){
        this.getProducts(1)
    }

    render() {
        const {products,total,loading,searchName,searchType} = this.state
        const title = (
            <span>
                <Select
                    value ={searchType}
                    style={{width:150}}
                    //当下拉框的值发生改变,触发事件回调函数,维持this.searchType的值保持为选中的value
                    onChange={value => this.setState({searchType:value})}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder = '关键字'
                    style={{width:150 ,margin:'0 15px'}}
                    value={searchName}
                    // 当输入框的值发生改变,触发事件回调函数，保证this.searchName的值为输入的value
                    onChange={event=>this.setState({searchName:event.target.value})}
                />
                <Button type="primary" onClick={()=>this.getProducts(1)}>搜索</Button>    
            </span>
        )
        
        const extra = (
                <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate')}>
                    <Icon type='plus'/>
                    添加商品
                </Button>
        )
        
          const columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
              title: '价格',
              dataIndex: 'price',
              render: (price)=>'￥'+price 
            },
            {
                width:100,
                title:'状态',
                // dataIndex:'status',
                render:(product)=>{ // 去掉dataIndex:"status"这样render的默认参数是该行数据对象。
                    const {status,_id} = product
                    const newStatus = status===1? 2:1
                    return (
                        <span>
                            <Button type='primary'
                            // 由于updateStatus有await,所以要等到updateStatus状态改变后
                            // 后面的代码才会执行。所以当await改变了原来status,就会重新渲染status.
                                onClick ={()=>this.updateStatus(_id,newStatus)}
                            >
                                {status===2? '上架':'下架'}
                            </Button>
                            <span>
                                {status===2? '已下架':'在售'}
                            </span>
                        </span>
                    )
                }
            },
            {
                width:100,
                title:'操作',
                dataIndex:'',
                render:(product)=>{
                    return (
                        <span>
                          <LinkButton onClick={()=>this.props.history.push('/product/detail',{product})}>详细</LinkButton>
                          <LinkButton onClick={()=>this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
                        </span>
                    )
                }  
             
            }
          ];


        return (

            <Card title={title} extra={extra}> 
            {/* 告诉pagination,数据条总数,getProducts()根据页码显示页面信息,每一页条数,
                pagination自动帮你显示页面,进行分页 */}
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={products} 
                    columns={columns} 
                    loading={loading}
                    pagination={{
                        current:this.pageNum, // 当前页数
                        total,
                        defaultPageSize:PAGE_SIZE,
                        showQuickJumper:true,
                        onChange:this.getProducts
                    }}
                    />;

            </Card>
        )
    }
}
