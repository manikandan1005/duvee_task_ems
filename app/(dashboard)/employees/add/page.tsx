"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, Select, DatePicker, Upload, Button, Card, Row, Col, Alert, Avatar, message, Spin } from "antd";
import { UploadOutlined, CheckCircleOutlined, UserOutlined, CameraOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Option } = Select;

export default function EmployeeForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState<{ id: string; name: string } | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.role === "admin") {
          setAuthorized(true);
        } else {
          message.error("Access denied. Admin role required.");
          router.push("/employees");
        }
      } catch {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!authorized) return (
    <div className="min-h-screen flex items-center justify-center"><Spin size="large" /></div>
  );

  const onFinish = async (values: any) => {
    setLoading(true); setError(null);
    try {
      const fd = new FormData();
      if (profileImageFile) {
        fd.append("profileImage", profileImageFile);
      }
      if (values.documents?.resume?.file?.originFileObj)
        fd.append("resume", values.documents.resume.file.originFileObj);

      ["firstName","lastName","email","phone","gender","bloodGroup",
       "designation","team","managerName","employmentType","shiftTiming","status"]
        .forEach(k => fd.append(k, values[k] ?? ""));

      fd.append("dateOfBirth", values.dateOfBirth?.format("YYYY-MM-DD") ?? "");
      fd.append("joiningDate",  values.joiningDate?.format("YYYY-MM-DD")  ?? "");
      fd.append("skills",           JSON.stringify(values.skills ?? []));
      fd.append("emergencyContact", JSON.stringify(values.emergencyContact ?? {}));
      fd.append("education",        JSON.stringify(values.education ?? {}));
      fd.append("bankDetails",      JSON.stringify(values.bankDetails ?? {}));
      fd.append("documents",        JSON.stringify({ aadhaar: values.documents?.aadhaar ?? "", pan: values.documents?.pan ?? "" }));

      const res  = await fetch("/api/employees", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        setSuccess({ id: data.data.employeeId, name: `${data.data.firstName} ${data.data.lastName}` });
        form.resetFields(); setPreview(""); setProfileImageFile(null);
        message.success("Employee registered!");
      } else {
        setError(data.message ?? "Something went wrong.");
      }
    } catch (e: any) {
      setError(e.message ?? "Network error.");
    } finally { setLoading(false); }
  };

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="max-w-sm w-full text-center shadow-lg rounded-2xl p-8">
        <CheckCircleOutlined style={{ fontSize: 56, color: "#22c55e" }} />
        <h2 className="mt-4 text-xl font-semibold">{success.name}</h2>
        <p className="text-gray-400 text-sm mb-6">{success.id}</p>
        <Button type="primary" onClick={() => setSuccess(null)}>Register Another</Button>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Employee Registration</h1>
        {error && <Alert type="error" message={error} closable onClose={() => setError(null)} className="mb-4" />}

        <Form form={form} layout="vertical" onFinish={onFinish} scrollToFirstError>

          <Card title="Personal Info" className="mb-4 rounded-xl shadow-sm">
            <Row gutter={[16, 0]}>

              {/* Profile Image */}
              <Col xs={24} md={24} className="flex justify-center mb-4">
                <Form.Item className="mb-0">
                  <Upload
                    beforeUpload={(file) => {
                      setProfileImageFile(file);
                      setPreview(URL.createObjectURL(file));
                      return false;
                    }}
                    maxCount={1}
                    accept="image/*"
                    showUploadList={false}
                  >
                    <div className="flex flex-col items-center gap-1 cursor-pointer">
                      <div className="relative">
                        <Avatar size={100} src={preview || undefined} icon={!preview ? <UserOutlined /> : undefined} />
                        <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                          <CameraOutlined style={{ color: "white", fontSize: 14 }} />
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">Click to upload photo</span>
                    </div>
                  </Upload>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "Required" }]}>
                  <Input placeholder="John" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: "Required" }]}>
                  <Input placeholder="Doe" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: "Required" }, { type: "email", message: "Invalid email" }]}>
                  <Input placeholder="john@company.com" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Phone" name="phone" rules={[{ required: true, message: "Required" }, { pattern: /^[6-9]\d{9}$/, message: "Invalid number" }]}>
                  <Input placeholder="9876543210" maxLength={10} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Gender" name="gender" rules={[{ required: true, message: "Required" }]}>
                  <Select placeholder="Select">
                    {["Male","Female","Other"].map(o => <Option key={o} value={o}>{o}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Date of Birth" name="dateOfBirth" rules={[{ required: true, message: "Required" }]}>
                  <DatePicker className="w-full" format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Blood Group" name="bloodGroup">
                  <Select placeholder="Select">
                    {["A+","A−","B+","B−","AB+","AB−","O+","O−"].map(o => <Option key={o} value={o}>{o}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Work Details" className="mb-4 rounded-xl shadow-sm">
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item label="Designation" name="designation" rules={[{ required: true, message: "Required" }]}>
                  <Input placeholder="e.g. Developer" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Team" name="team" rules={[{ required: true, message: "Required" }]}>
                  <Input placeholder="e.g. Engineering" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Manager Name" name="managerName">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Employment Type" name="employmentType" rules={[{ required: true, message: "Required" }]}>
                  <Select placeholder="Select">
                    {["Full Time","Part Time","Contract","Intern"].map(o => <Option key={o} value={o}>{o}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Shift Timing" name="shiftTiming">
                  <Input placeholder="9 AM – 6 PM" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Joining Date" name="joiningDate">
                  <DatePicker className="w-full" format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Skills" name="skills">
                  <Select mode="tags" placeholder="Type and press Enter" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Status" name="status" initialValue="Active">
                  <Select>
                    {["Active","Inactive","On Leave"].map(o => <Option key={o} value={o}>{o}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Emergency Contact" className="mb-4 rounded-xl shadow-sm">
            <Row gutter={[16, 0]}>
              <Col xs={24} md={8}>
                <Form.Item label="Name" name={["emergencyContact","name"]}><Input /></Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Relation" name={["emergencyContact","relation"]}>
                  <Select placeholder="Select">
                    {["Spouse","Parent","Sibling","Friend","Other"].map(o => <Option key={o} value={o}>{o}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Phone" name={["emergencyContact","number"]} rules={[{ pattern: /^[6-9]\d{9}$/, message: "Invalid number" }]}>
                  <Input maxLength={10} />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Education" className="mb-4 rounded-xl shadow-sm">
            <Row gutter={[16, 0]}>
              <Col xs={24} md={8}>
                <Form.Item label="Degree" name={["education","degree"]}><Input placeholder="e.g. B.Tech" /></Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="College" name={["education","college"]}><Input /></Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Year of Passing" name={["education","yearOfPassing"]} rules={[{ pattern: /^(19|20)\d{2}$/, message: "Invalid year" }]}>
                  <Input maxLength={4} />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Documents" className="mb-4 rounded-xl shadow-sm">
            <Row gutter={[16, 0]}>
              <Col xs={24} md={8}>
                <Form.Item label="Aadhaar" name={["documents","aadhaar"]} rules={[{ pattern: /^\d{12}$/, message: "Must be 12 digits" }]}>
                  <Input maxLength={12} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="PAN" name={["documents","pan"]} rules={[{ pattern: /^[A-Z]{5}[0-9]{4}[A-Z]$/, message: "Invalid PAN" }]}>
                  <Input maxLength={10} onChange={e => form.setFieldValue(["documents","pan"], e.target.value.toUpperCase())} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Resume" name={["documents","resume"]}>
                  <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.doc,.docx">
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Bank Details" className="mb-6 rounded-xl shadow-sm">
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item label="Bank Name" name={["bankDetails","bankName"]} rules={[{ required: true, message: "Required" }]}><Input /></Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Account Holder Name" name={["bankDetails","accountHolderName"]} rules={[{ required: true, message: "Required" }]}><Input /></Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Account Number" name={["bankDetails","accountNumber"]} rules={[{ required: true, message: "Required" }, { pattern: /^\d{9,18}$/, message: "Must be 9–18 digits" }]}>
                  <Input maxLength={18} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="IFSC Code" name={["bankDetails","ifscCode"]} rules={[{ required: true, message: "Required" }, { pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: "Invalid IFSC" }]}>
                  <Input maxLength={11} onChange={e => form.setFieldValue(["bankDetails","ifscCode"], e.target.value.toUpperCase())} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Account Type" name={["bankDetails","accountType"]}>
                  <Select placeholder="Select">
                    {["Savings","Current"].map(o => <Option key={o} value={o}>{o}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" size="large" loading={loading}>Submit Employee</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}