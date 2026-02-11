import React from "react";
import { Typography, message, Button, theme, Tag, Tooltip, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { Formik, FormikHelpers } from "formik";
import { FormItem, SubmitButton, Form, Input } from "formik-antd";
import * as yup from "yup";
import 'animate.css';
import "./login.scss";
import Logo from "assets/logo.png";
import { UserOutlined, LockOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface LoginProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const validationSchema = yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });

  const onSubmit = async (
    values: { username: string; password: string },
    actions: FormikHelpers<any>
  ) => {
    try {
      if (values.username === "admin" && values.password === "admin123") {
        const user = {
          id: 1,
          username: "admin",
          role: "admin",
          firstName: "Admin",
          lastName: "User",
          email: "admin@portfolio.com"
        };

        localStorage.setItem("currentUser", JSON.stringify(user));
        setIsAuthenticated(true);
        navigate("/users");
        message.success("Login successful");
      } else {
        message.error("Invalid credentials");
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="decoration-circle"></div>
      
      <div className="login-glass-card">
<div style={{ 
  position: 'absolute', 
  top: '12px',      // Increased from 1px to align with card padding
  right: '12px',    // Increased from -1px to move it inside the card
  zIndex: 10,
  lineHeight: 1     // Prevents extra height issues
}}>
  <Tooltip 
    title={
      <div style={{ fontSize: '12px', padding: '4px' }}>
        <p style={{ marginBottom: '4px', fontWeight: 'bold' }}>Demo Environment</p>
        <p style={{ margin: 0 }}>• Frontend-only (localStorage)</p>
        <p style={{ margin: 0 }}>• Credentials: admin / admin123</p>
        <p style={{ margin: 0 }}>• Persistent browser storage</p>
      </div>
    } 
    placement="rightTop" // Changed to leftTop so it doesn't cover the icon
    color={token.colorPrimary}
    // Added a slight offset so the tooltip doesn't touch the icon
    mouseEnterDelay={0.2}
  >
    <InfoCircleOutlined 
      style={{ 
        fontSize: '18px', 
        color: token.colorTextDescription, 
        cursor: 'help',
        transition: 'color 0.3s'
      }} 
      onMouseEnter={(e) => e.currentTarget.style.color = token.colorPrimary}
      onMouseLeave={(e) => e.currentTarget.style.color = token.colorTextDescription}
    />
  </Tooltip>
</div>

        <div className="login-header">
          <div
            className="logo-wrapper animate__animated animate__fadeInDown animate__delay-0.2s"
            style={{
              backgroundColor: token.colorPrimary,
              WebkitMaskImage: `url(${Logo})`,
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              WebkitMaskSize: "contain",
              maskImage: `url(${Logo})`,
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskSize: "contain",
            }}
          />
          <Title 
            level={2} 
            className="welcome-text animate__animated animate__fadeInUp animate__delay-0.5s"
          >
            Welcome Back
          </Title>

          <Text 
            type="secondary" 
            className="subtitle-text animate__animated animate__fadeIn animate__delay-0.8s"
          >
            Please enter your credentials to continue
          </Text>
        </div>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="auth-form animate__animated animate__fadeInUp animate__delay-1.1s">
              <FormItem name="username">
                <Input
                  name="username"
                  placeholder="Username"
                  prefix={<UserOutlined className="input-icon" />}
                  className="modern-input"
                  size="large"
                />
              </FormItem>

              <FormItem name="password">
                <Input.Password
                  name="password"
                  placeholder="Password"
                  prefix={<LockOutlined className="input-icon" />}
                  className="modern-input"
                  size="large"
                />
              </FormItem>

              <div className="forgot-password">
                <Button
                  type="link"
                  style={{
                    color: token.colorPrimary,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = token.colorPrimaryHover)}
                  onMouseLeave={e => (e.currentTarget.style.color = token.colorPrimary)}
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </Button>
              </div>

              <SubmitButton
                className="primary-auth-btn"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Log In
              </SubmitButton>
       <Space style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
  <Button 
    size="small" 
    type="text"
    onClick={() => {
      setFieldValue('username', 'admin');
      setFieldValue('password', 'admin123');
      message.info('Credentials auto-filled');
    }}
    style={{ fontSize: '12px', padding: '0 8px', height: '22px' }}
  >
    Auto-fill
  </Button>
</Space>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;