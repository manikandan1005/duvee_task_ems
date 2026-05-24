"use client";
import { useState, useEffect } from "react";
import { Table, Input, Select, Button, Tag, Space, Popconfirm, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Option } = Select;

export default function EmployeeList() {
  const [data, setData]     = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/employees").then(r => r.json()).then(setData);

    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const removeEmp = async (employeeId: string) => {
    const res = await fetch("/api/employees", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId }),
    });
    if (res.ok) {
      setData(d => d.filter(e => e.employeeId !== employeeId));
      message.success("Employee removed");
    } else {
      message.error("Failed to delete");
    }
  };

  const filtered = data.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || [e.firstName, e.lastName, e.phone, e.team, e.email]
      .some(v => v?.toLowerCase().includes(q));
    const matchStatus = !status || e.status === status;
    return matchSearch && matchStatus;
  });

  const columns = [
    {
      title: "Name",
      render: (_: any, e: any) => (
        <div>
          <p className="font-medium">{e.firstName} {e.lastName}</p>
          <p className="text-xs text-gray-400">{e.employeeId}</p>
        </div>
      ),
    },
    { title: "Phone",       dataIndex: "phone" },
    { title: "Email",       dataIndex: "email",       ellipsis: true },
    { title: "Designation", dataIndex: "designation" },
    { title: "Shift",       dataIndex: "shiftTiming" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: string) => (
        <Tag color={s === "Active" ? "green" : s === "Inactive" ? "red" : "orange"}>{s}</Tag>
      ),
    },
    {
      title: "Action",
      render: (_: any, e: any) => {
        const isAdmin = currentUser?.role === "admin";
        const isOwn = currentUser?.employeeId === e.employeeId;

        if (!isAdmin && !isOwn) return null;

        return (
          <Space>
            <Button size="small" icon={<EditOutlined />} onClick={() => router.push(`/employees/edit?id=${e.employeeId}`)} />
            {isAdmin && (
              <Popconfirm title="Delete this employee?" onConfirm={() => removeEmp(e.employeeId)} okText="Yes" cancelText="No">
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employees</h1>
        {currentUser?.role === "admin" && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/employees/add")}>
            Add Employee
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search name, phone, email, team..."
          className="w-64"
          onChange={e => setSearch(e.target.value)}
          allowClear
        />
        <Select placeholder="Filter by status" allowClear className="w-40"
          onChange={v => setStatus(v ?? "")}>
          <Option value="Active">Active</Option>
          <Option value="Inactive">Inactive</Option>
          <Option value="On Leave">On Leave</Option>
        </Select>
      </div>

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="employeeId"
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
        bordered
        size="middle"
      />
    </div>
  );
}