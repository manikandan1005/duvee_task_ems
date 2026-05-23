"use client";
import React from "react";
import { Form, Input, Button, Card } from "antd";
import { useRouter } from "next/navigation";

const Login = () => {
  const router=useRouter()
  const onFinish = async (values:any) => {
    console.log(values);
    if(!values.username || !values.password){
        alert("Please fill all fields")
        return;
    }
    try{
     const res= await fetch("/api/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(values)
      })
      const data= await res.json()
      if(data.status===true){
        router.push("/dashboard")
      }
    }
    catch(error){
    console.log(error);
    alert("Something went wrong")
    
  }
  }
  
    


  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <Card title="Login Form" style={{ width: 350 }}>
        <Form layout="vertical" onFinish={onFinish}>
          
          {/* Username */}
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please enter username" },
            ]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter password" },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          {/* Buttons */}
          <Form.Item>
            <div style={{ display: "flex", gap: "10px" }}>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>

              <Button type="default" block
              onClick={()=>router.push('/register')}>
                Create
              </Button>
            </div>
          </Form.Item>

        </Form>
      </Card>
    </div>
  );
};

export default Login;