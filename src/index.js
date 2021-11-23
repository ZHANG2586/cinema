import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>    
    <App />
  </React.StrictMode>,  //<React.StrictMode />作用是对其包含的组件以及被包含组件的后代元素都会运行严格模式检查！（作用：识别不安全的生命周期。关于使用过时字符串ref API的警告。关于使用废弃的findDOMNode方法的警告。检测意外的副作用。检测过时的context API）
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
