import React, { useState } from 'react';
import { Button, Form, Input, Modal, Typography, Card, Divider, Alert, theme } from 'antd';
import { UserOutlined, LockOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import FORGOT from "assets/forgot.png";

const { Title, Text } = Typography;

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [username, setUsername] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { token } = theme.useToken();

  const handleUsernameSubmit = async (values: { username: string }) => {
    setLoading(true);
    try {
      const { username } = values;
      
      // Check if user exists in localStorage database
      const usersData = localStorage.getItem('portfolio_users_database');
      if (!usersData) {
        throw new Error('No users found in database');
      }
      
      const users = JSON.parse(usersData);
      const user = users.find((u: any) => u.userName === username);
      
      if (user) {
        setUsername(username);
        setStep(2);
      } else {
        Modal.error({
          title: 'Error',
          content: 'User not found. Please check your username.',
        });
      }
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: error instanceof Error ? error.message : 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSecretKeySubmit = async (values: { secretKey: string }) => {
    setLoading(true);
    try {
      const { secretKey: enteredSecretKey } = values;
      
      // For portfolio demo, we'll accept any 3-word format
      const keyPattern = /^[a-z]+-[a-z]+-[a-z]+$/i;
      if (!keyPattern.test(enteredSecretKey)) {
        Modal.error({
          title: 'Invalid Format',
          content: 'Please enter your 3-word secret key in the format: word-word-word',
        });
        return;
      }
      
      // For demo purposes, we'll accept any valid format
      setSecretKey(enteredSecretKey);
      setStep(3);
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (values: { newPassword: string; confirmPassword: string }) => {
    setLoading(true);
    try {
      const { newPassword, confirmPassword } = values;
      
      if (newPassword !== confirmPassword) {
        Modal.error({
          title: 'Error',
          content: 'Passwords do not match',
        });
        return;
      }
      
      // Update password in localStorage database
      const usersData = localStorage.getItem('portfolio_users_database');
      if (!usersData) {
        throw new Error('No users found in database');
      }
      
      const users = JSON.parse(usersData);
      const userIndex = users.findIndex((u: any) => u.userName === username);
      
      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        users[userIndex].passwordHash = newPassword; // For demo purposes
        users[userIndex].modifiedDate = new Date().toISOString();
        users[userIndex].modifiedBy = 'system';
        
        localStorage.setItem('portfolio_users_database', JSON.stringify(users));
        setShowSuccess(true);
      } else {
        Modal.error({
          title: 'Error',
          content: 'User not found in database',
        });
      }
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: error instanceof Error ? error.message : 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 450, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: 15
        }}
        bodyStyle={{ padding: 32 }}
      >
        {/* Image at the top center */}
<div style={{ textAlign: "center", marginBottom: 24 }}>
  <img
    src={FORGOT}
    alt="Forgot Password"
    style={{
      maxWidth: "320px",
      maxHeight: "280px",
      width: "auto",
      height: "auto",
      margin: "0 auto",
      display: "block"
    }}
    className="animate__animated animate__fadeInDown animate__delay-0.2s"
  />
</div>
        
        <Title level={3} className='animate__animated animate__fadeInUp animate__delay-0.5s' style={{ textAlign: 'center', marginBottom: 8 }}>
          Password Recovery
        </Title>
        <Text className='animate__animated animate__fadeInUp animate__delay-0.5s' type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
          {step === 1 ? 'Enter your username' : 
           step === 2 ? 'Enter your secret key' : 
           'Create a new password'}
        </Text>

        {step === 1 ? (
          <Form
            name="forgot_password"
            onFinish={handleUsernameSubmit}
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Username" 
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                size="large"
              >
                Continue
              </Button>
            </Form.Item>
          </Form>
        ) : step === 2 ? (
          <Form
            name="secret_key"
            onFinish={handleSecretKeySubmit}
            layout="vertical"
          >
            <Alert
              message="Secret Key Required"
              description="Please enter the 3-word secret key that was provided when your account was created."
              type="info"
              showIcon
              style={{
                marginBottom: 24,
                borderColor: token.colorPrimary,
                backgroundColor: token.colorPrimaryBg,
                color: token.colorPrimaryText,
              }}
            />
            
            <Form.Item
              name="secretKey"
              rules={[
                { required: true, message: 'Please input your secret key!' },
                { 
                  pattern: /^[a-z]+-[a-z]+-[a-z]+$/i, 
                  message: 'Please enter in format: word-word-word' 
                }
              ]}
            >
              <Input 
                prefix={<KeyOutlined />} 
                placeholder="e.g., apple-dragon-sun" 
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                size="large"
              >
                Verify Secret Key
              </Button>
            </Form.Item>

            <Button 
              type="link" 
              onClick={() => setStep(1)}
              block
              style={{
                color: token.colorPrimary,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = token.colorPrimaryHover)}
              onMouseLeave={e => (e.currentTarget.style.color = token.colorPrimary)}
            >
              Back to Username
            </Button>
          </Form>
        ) : (
          <Form
            name="reset_password"
            onFinish={handlePasswordReset}
            layout="vertical"
          >
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: 'Please input your new password!' },
                { min: 8, message: 'Password must be at least 8 characters' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="New Password" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('The two passwords do not match!');
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Confirm New Password" 
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                size="large"
              >
                Reset Password
              </Button>
            </Form.Item>

            <Button 
              type="link" 
              onClick={() => setStep(2)}
              block
              style={{
                color: token.colorPrimary,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = token.colorPrimaryHover)}
              onMouseLeave={e => (e.currentTarget.style.color = token.colorPrimary)}
            >
              Back to Secret Key
            </Button>
          </Form>
        )}

        <Divider />
        <Button 
          style={{
            color: token.colorPrimary,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = token.colorPrimaryHover)}
          onMouseLeave={e => (e.currentTarget.style.color = token.colorPrimary)}
          type="link" 
          onClick={() => navigate('/login')}
          block
        >
          Back to Login
        </Button>

        <Modal
          title="Password Reset Successful"
          open={showSuccess}
          onOk={() => {
            setShowSuccess(false);
            navigate('/login');
          }}
          onCancel={() => {
            setShowSuccess(false);
            navigate('/login');
          }}
          footer={[
            <Button 
              key="ok" 
              type="primary" 
              onClick={() => {
                setShowSuccess(false);
                navigate('/login');
              }}
            >
              Return to Login
            </Button>
          ]}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <p>Your password has been successfully updated.</p>
          <p><strong>Demo Note:</strong> For this portfolio demo, passwords are stored locally in your browser.</p>
        </Modal>
      </Card>
    </div>
  );
};

export default ForgotPassword;