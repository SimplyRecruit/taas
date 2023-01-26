import { Form, Input, Button, Typography, Space, Col, Row, Checkbox, Card } from 'antd';
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
        <Row justify="space-around" align="middle" style={{ minHeight: '100vh', backgroundImage: 'url(https://img.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148902771.jpg?w=2000)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 250 }} >
                <Card>
                    <Typography.Title level={2}>Sign In</Typography.Title>
                    <Space align="start" size="small" />
                    <Form
                        form={form}
                        name="basic"
                        layout="vertical"
                        style={{ maxWidth: 250 }}
                        initialValues={formData}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please enter your email!' }]}
                        >
                            <Input type="email" placeholder="Enter your email" />
                        </Form.Item>
                        <Form.Item
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
                                style={{ padding: 0 }}
                                type="ghost"
                            >
                                Forgot password?
                            </Button>
                        </Link>
                    </Form>
                </Card>
            </div>
        </Row>
    );
};

export default LoginPage;
