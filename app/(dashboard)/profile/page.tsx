"use client";
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Avatar, Tag, Divider, Button, Spin } from "antd";
import { UserOutlined, BankOutlined, IdcardOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const InfoCard = ({ label, value }: { label: string; value?: string }) => (
  <Col xs={24} md={12}>
    <Card size="small">
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </Card>
  </Col>
);

export default function EmployeeProfile() {
  const [emp, setEmp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const employeeId = localStorage.getItem("employeeId");
    if (!employeeId) { router.push("/login"); return; }

    fetch(`/api/employees?id=${employeeId}`)
      .then(r => r.json())
      .then(data => { setEmp(data); setLoading(false); })
      .catch(() => { router.push("/login"); });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spin size="large" />
    </div>
  );

  if (!emp) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <Card className="w-full rounded-2xl shadow-lg" bordered={false}>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-5">
          <Avatar size={100} src={emp.profileImage || undefined} icon={<UserOutlined />} />
          <div>
            <h1 className="text-2xl font-bold">{emp.firstName} {emp.lastName}</h1>
            <p className="text-gray-500">{emp.designation} · {emp.team}</p>
            <div className="flex gap-2 mt-2">
              <Tag color="green">{emp.status}</Tag>
              <Tag color="blue">{emp.employmentType}</Tag>
              <Tag color="default">{emp.employeeId}</Tag>
            </div>
          </div>
        </div>

        <Divider />

        <h2 className="text-lg font-semibold mb-3">Employee Details</h2>
        <Row gutter={[12, 12]}>
          <InfoCard label="Employee ID"   value={emp.employeeId} />
          <InfoCard label="Email"         value={emp.email} />
          <InfoCard label="Phone"         value={emp.phone} />
          <InfoCard label="Gender"        value={emp.gender} />
          <InfoCard label="Date of Birth" value={emp.dateOfBirth} />
          <InfoCard label="Blood Group"   value={emp.bloodGroup} />
          <InfoCard label="Manager"       value={emp.managerName} />
          <InfoCard label="Shift Timing"  value={emp.shiftTiming} />
          <InfoCard label="Joining Date"  value={emp.joiningDate} />
        </Row>

        <Divider />

        <h2 className="text-lg font-semibold mb-3">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {(emp.skills ?? []).map((s: string, i: number) => (
            <Tag key={i} color="purple">{s}</Tag>
          ))}
        </div>

        <Divider />

        <h2 className="text-lg font-semibold mb-3">Education</h2>
        <Row gutter={[12, 12]}>
          <InfoCard label="Degree"          value={emp.education?.degree} />
          <InfoCard label="College"         value={emp.education?.college} />
          <InfoCard label="Year of Passing" value={emp.education?.yearOfPassing} />
        </Row>

        <Divider />

        <h2 className="text-lg font-semibold mb-3">Emergency Contact</h2>
        <Row gutter={[12, 12]}>
          <InfoCard label="Name"     value={emp.emergencyContact?.name} />
          <InfoCard label="Relation" value={emp.emergencyContact?.relation} />
          <InfoCard label="Phone"    value={emp.emergencyContact?.number} />
        </Row>

        <Divider />

        <h2 className="text-lg font-semibold mb-3">Bank Details</h2>
        <Row gutter={[12, 12]}>
          <Col xs={24} md={8}>
            <Card size="small">
              <BankOutlined className="text-lg mb-1" />
              <p className="text-gray-400 text-xs">Bank Name</p>
              <p className="font-medium">{emp.bankDetails?.bankName || "—"}</p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small">
              <IdcardOutlined className="text-lg mb-1" />
              <p className="text-gray-400 text-xs">Account Number</p>
              <p className="font-medium">{emp.bankDetails?.accountNumber || "—"}</p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small">
              <p className="text-gray-400 text-xs">IFSC Code</p>
              <p className="font-medium">{emp.bankDetails?.ifscCode || "—"}</p>
            </Card>
          </Col>
        </Row>

        <Divider />

        <h2 className="text-lg font-semibold mb-3">Documents</h2>
        <Row gutter={[12, 12]}>
          <InfoCard label="Aadhaar" value={emp.documents?.aadhaar} />
          <InfoCard label="PAN"     value={emp.documents?.pan} />
        </Row>

        <Divider />

        <div className="flex justify-end gap-3">
          <Button danger onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("employeeId");
            router.push("/login");
          }}>
            Logout
          </Button>
          <Button type="primary" onClick={() => router.push(`/employees/edit?id=${emp.employeeId}`)}>
            Edit Profile
          </Button>
        </div>

      </Card>
    </div>
  );
}