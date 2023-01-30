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
        <div className='center-column'
            style={{
                backgroundImage: 'url(https://img.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148902771.jpg?w=2000)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: "100vh"
            }}>
            <Card className='elevation' style={{ width: '100%', maxWidth: 300 }}>
                <Typography.Title level={2} style={{ marginTop: 0, marginBottom: 20 }}>Log In</Typography.Title>
                <Form
                    form={form}
                    name="basic"
                    layout="vertical"
                    style={{ width: '100%' }}
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
                        <Button block htmlType="submit">Submit</Button>
                    </Form.Item>
                    <Link passHref href="/forgot-password">
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
    );
};

export default LoginPage;
