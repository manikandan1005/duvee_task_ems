"use client";

import React from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  Card,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const EmployeeForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Card
        title="Employee Registration"
        className="max-w-6xl mx-auto shadow-lg rounded-xl"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="w-full"
        >
          <Row gutter={16}>
            {/* Employee ID */}
            <Col xs={24} md={12}>
              <Form.Item label="Employee ID">
                <Input value="Auto Generate" disabled />
              </Form.Item>
            </Col>

            {/* Profile Image */}
            <Col xs={24} md={12}>
              <Form.Item label="Profile Image" name="profileImage">
                <Upload>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>

            {/* Gender */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select Gender">
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* DOB */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Date Of Birth"
                name="dateOfBirth"
                rules={[{ required: true }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>

            {/* Blood Group */}
            <Col xs={24} md={12}>
              <Form.Item label="Blood Group" name="bloodGroup">
                <Select placeholder="Select Blood Group">
                  <Option value="O+">O+</Option>
                  <Option value="A+">A+</Option>
                  <Option value="B+">B+</Option>
                  <Option value="AB+">AB+</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Designation */}
            <Col xs={24} md={12}>
              <Form.Item label="Designation" name="designation">
                <Input placeholder="Enter Designation" />
              </Form.Item>
            </Col>

            {/* Team */}
            <Col xs={24} md={12}>
              <Form.Item label="Team" name="team">
                <Input placeholder="Enter Team Name" />
              </Form.Item>
            </Col>

            {/* Manager */}
            <Col xs={24} md={12}>
              <Form.Item label="Manager Name" name="managerName">
                <Input placeholder="Enter Manager Name" />
              </Form.Item>
            </Col>

            {/* Employment Type */}
            <Col xs={24} md={12}>
              <Form.Item label="Employment Type" name="employmentType">
                <Select placeholder="Select Type">
                  <Option value="Full Time">Full Time</Option>
                  <Option value="Part Time">Part Time</Option>
                  <Option value="Intern">Intern</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Shift Timing */}
            <Col xs={24} md={12}>
              <Form.Item label="Shift Timing" name="shiftTiming">
                <Input placeholder="9 AM - 6 PM" />
              </Form.Item>
            </Col>

            {/* Skills */}
            <Col xs={24} md={12}>
              <Form.Item label="Skills" name="skills">
                <Select mode="tags" placeholder="Add Skills">
                  <Option value="React">React</Option>
                  <Option value="Next.js">Next.js</Option>
                  <Option value="TypeScript">TypeScript</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Status */}
            <Col xs={24} md={12}>
              <Form.Item label="Status" name="status">
                <Select placeholder="Select Status">
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Emergency Contact */}
          <Card
            title="Emergency Contact"
            className="mt-6 mb-6 rounded-lg"
          >
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Name"
                  name={["emergencyContact", "name"]}
                >
                  <Input placeholder="Contact Name" />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label="Relation"
                  name={["emergencyContact", "relation"]}
                >
                  <Input placeholder="Father / Mother" />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label="Phone Number"
                  name={["emergencyContact", "number"]}
                >
                  <Input placeholder="9876543210" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Education */}
          <Card title="Education" className="mb-6 rounded-lg">
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Degree"
                  name={["education", "degree"]}
                >
                  <Input placeholder="BCA / BE" />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label="College"
                  name={["education", "college"]}
                >
                  <Input placeholder="College Name" />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label="Year Of Passing"
                  name={["education", "yearOfPassing"]}
                >
                  <Input placeholder="2024" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Documents */}
          <Card title="Documents" className="mb-6 rounded-lg">
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Aadhaar"
                  name={["documents", "aadhaar"]}
                >
                  <Input placeholder="Aadhaar Number" />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label="PAN"
                  name={["documents", "pan"]}
                >
                  <Input placeholder="PAN Number" />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label="Resume"
                  name={["documents", "resume"]}
                >
                  <Upload>
                    <Button icon={<UploadOutlined />}>
                      Upload Resume
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Bank Details */}
          <Card title="Bank Details" className="mb-6 rounded-lg">
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Bank Name"
                  name={["bankDetails", "bankName"]}
                >
                  <Input placeholder="SBI" />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label="Account Number"
                  name={["bankDetails", "accountNumber"]}
                >
                  <Input placeholder="XXXXXXXXXX" />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label="IFSC Code"
                  name={["bankDetails", "ifscCode"]}
                >
                  <Input placeholder="SBIN0001234" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" size="large">
              Submit Employee
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default EmployeeForm;