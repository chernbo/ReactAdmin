import { message } from "antd"
import { resolveOnChange } from "antd/lib/input/Input"
import axios from "axios"


// axios 返回promise 对象
export default function ajax(url,data,method="GET"){
    return new Promise((resolve,reject)=>{
        let promise
        if(method=="GET"){
            promise =  axios.get(url,{
                params:data  // 指定请求参数
            })
        }else{
            promise = axios.post(url,data)
        }
        promise.then(response =>{
            // response.data 是服务器返回的响应数据
            // response是整个响应报文内容
           resolve(response.data)
        }).catch(error=>{
            message.error('请求出错了:'+error.message)
        })
    })  
 
}