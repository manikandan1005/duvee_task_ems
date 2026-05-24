"use client";
import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const onFinish = async (values: any) => {
    try {
      const res  = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      const employeeId=data.user?.employeeId ;
      console.log(employeeId);
        localStorage.setItem("employeeId", employeeId);

      if (data.status === true) {
        localStorage.setItem("user", JSON.stringify(data.user));
        message.success("Login successful!");
        router.push("/employees");
      } else {
        message.error(data.message ?? "Login failed");
      }
    } catch {
      message.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card title="Login" style={{ width: 350 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="username" rules={[{ required: true, message: "Enter email" }]}>
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Enter password" }]}>
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item>
            <div className="flex gap-2">
              <Button type="primary" htmlType="submit" block>Login</Button>
              <Button block onClick={() => router.push("/register")}>Register</Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}