//此组件模块因为对react-hook-from还不能熟练操作而没用它来设计from表单，只用了它的css文件！（以后有时间再练习使用）

import React from "react";
import { useForm } from "react-hook-form";
import axios from 'axios'
import '../style.css';
import { json } from "body-parser";

export default function App() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: "bill",
      lastName: "luo",
      email: "test@test.com",
      isDeveloper: true
    }
  });
  const onSubmit = data => {
    // var s=JSON.stringify(data);
    alert(JSON.stringify(data));
     console.log(JSON.stringify(data.firstName));
    //  console.log()
    axios.post('http://192.168.230.243:3019/',JSON.stringify(data)).then(function(res){
        console.log('res:',res);
    }).catch(err=>console.log(err));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="firstName">First Name</label>
      <input name="firstName" placeholder="bill" ref={register} />
      <label htmlFor="lastName">Last Name</label>
      <input name="lastName" placeholder="luo" ref={register} />
      <label htmlFor="email">Email</label>
      <input
        name="email"
        placeholder="bluebill1049@hotmail.com"
        type="email"
        ref={register}
      />
      <label>Is developer?</label>
      <input name="isDeveloper" type="checkbox" ref={register} />
      <input type="submit" />
    </form>
  );
}

