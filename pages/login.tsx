import { Form, Input, Button, Typography, Space, Col, Row } from 'antd';
import Link from 'next/link';
import React, { useState } from 'react';


const LoginPage = () => {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const onFinish = (values: any) => {
        console.log('Success:', values);
        setFormData(values);
        // Perform login logic here
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Row justify="space-around" align="middle" style={{ minHeight: '100vh' }}>
            <Col >
                <Typography.Title level={2}>Sign In</Typography.Title>
                <Space align="start" size="small" />
                <Form
                    form={form}
                    name="basic"
                    layout="vertical"
                    initialValues={formData}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please enter your email!' }]}
                    >
                        <Input type="email" placeholder="Enter your email" />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password!' }]}
                    >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>
                    <Form.Item >
                        <Button block htmlType="submit" >Submit</Button>
                    </Form.Item>
                    <Link passHref href="/register">
                        <Button
                            type="ghost"
                        >
                            Forgot your password?
                        </Button>
                    </Link>
                </Form>
            </Col>
        </Row>
    );
};

export default LoginPage;
