/*
要求: 能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise

基本要求: 能根据接口文档定义接口请求函数 
 */
import ajax from './ajax'
import jsonp from 'jsonp'
import {message} from 'antd'


const BASE=''
// 登陆
export const reqLogin = (username,password) => ajax('/login',{username,password},'POST')
// 添加用户
export const reqAddUser = (user) =>ajax('/manage/user/add',user,'POST')

// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE +'/manage/category/list',{parentId})

// 添加分类
export const reqAddCategory = (categoryName,parentId) =>ajax(BASE+'/manage/category/add',{categoryName,parentId}, 'POST')

// 更新分类
export const reqUpdateCategory =  ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')
 
// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})



// json 请求的接口请求函数
export const reqWeather = (cityZip=500108) =>{
    return new Promise((resolve,reject)=>{
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=fe50ea97786c41ea5e378c7adb716553&city=${cityZip}`
        //发送jsonp请求
        jsonp(url,{},(err,data)=>{
            
            //如果成功了
            if(!err&&data.info==='OK'){
                const {city,weather} = data.lives[0]
                resolve({city,weather})
            }else{
                //如果失败了
                message.error('获取天气信息失败!')
            }
        })
    })
}

// 获取商品分页列表
// pageNum 当前总页数,pageSize 每一页的记录数
export const reqProduct = (pageNum,pageSize) => ajax(BASE+'/manage/product/list',{pageNum,pageSize})

// 获取商品分页列表 (根据商品名称/商品描述)
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType}) => ajax(BASE+'/manage/product/search',
{
    pageNum,
    pageSize,
    [searchType]:searchName
})

// 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + ( product._id?'update':'add'), product, 'POST')


//更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId,status) =>ajax(BASE+'/manage/product/updateStatus',{productId,status},'POST')

// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')