
import ajax from '../ajax'
import jsonp from 'jsonp'
import {message} from 'antd'

const BASE=''
// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')
// 添加角色对象
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')
// 更新角色权限
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')
