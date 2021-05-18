import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'
import {BrowserRouter} from 'react-router-dom'

// 读取Local store中保存user, 保存到内存中 (页面刷新,关机都会重新在Local store中读取,保存在内存中)
const user = storageUtils.getUser()
memoryUtils.user = user

ReactDOM.render(
  <BrowserRouter>
      <App />
  </BrowserRouter>,
  document.getElementById('root')
);
