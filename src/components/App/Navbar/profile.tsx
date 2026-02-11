import React, { useState, useEffect } from "react";
import { 
  Card, 
  Avatar, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Upload, 
  message,
  Row,
  Col,
  Space,
  theme
} from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  SaveOutlined, 
  ArrowLeftOutlined,
  EditOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const { useToken } = theme;

interface UserModel {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  secretKey: string;
  avatar: string | null;
}

const ProfilePage: React.FC = () => {
  const { token } = useToken();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  
  const userData = localStorage.getItem("currentUser");
  const user: UserModel = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
      });
      setAvatar(user.avatar);
    }
  }, [form, user]);

  const handleAvatarChange = async (file: File) => {
    setAvatarLoading(true);
    try {
      if (!user) {
        message.error("User not logged in");
        setAvatarLoading(false);
        return false;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');

        try {
          // Update avatar in users database
          const usersData = localStorage.getItem('portfolio_users_database');
          if (usersData) {
            const users = JSON.parse(usersData);
            const userIndex = users.findIndex((u: any) => u.id === user.id);
            
            if (userIndex !== -1) {
              users[userIndex].avatar = cleanBase64;
              localStorage.setItem('portfolio_users_database', JSON.stringify(users));
              
              setAvatar(cleanBase64);
              const updatedUser = { ...user, avatar: cleanBase64 };
              localStorage.setItem("currentUser", JSON.stringify(updatedUser));
              window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
              message.success("Avatar updated successfully");
            } else {
              message.error("User not found in database");
            }
          }
        } catch (error) {
          console.error("Error updating avatar:", error);
          message.error("Failed to update avatar");
        }
        setAvatarLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error updating avatar:", error);
      message.error("Error updating avatar");
      setAvatarLoading(false);
    }
    return false;
  };

  const onSave = async (values: any) => {
    setLoading(true);
    try {
      // Update user profile in localStorage database
      const usersData = localStorage.getItem('portfolio_users_database');
      if (usersData) {
        const users = JSON.parse(usersData);
        const userIndex = users.findIndex((u: any) => u.id === user.id);
        
        if (userIndex !== -1) {
          // Update the user
          users[userIndex] = {
            ...users[userIndex],
            ...values,
            modifiedDate: new Date().toISOString(),
            modifiedBy: "user"
          };
          
          localStorage.setItem('portfolio_users_database', JSON.stringify(users));
          
          // Update current user in localStorage
          const updatedUser = { ...user, ...values };
          localStorage.setItem("currentUser", JSON.stringify(updatedUser));
          window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
          
          message.success("Profile updated successfully");
        } else {
          message.error("User not found in database");
        }
      }
    } catch (error) {
      message.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getAvatarSrc = () => {
    if (avatar) {
      return `data:image/png;base64,${avatar}`;
    }
    return undefined;
  };

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <div className="profile-header">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
            className="back-button"
          />
          <Text strong className="profile-title">Profile Settings</Text>
        </div>

        <div className="avatar-section">
          <Upload 
            showUploadList={false} 
            beforeUpload={handleAvatarChange} 
            accept="image/*"
            disabled={avatarLoading}
          >
            <div className="avatar-wrapper">
              <Avatar
                size={64}
                src={getAvatarSrc()}
                icon={!avatar && <UserOutlined />}
                className="user-avatar"
                style={{ backgroundColor: avatar ? 'transparent' : token.colorPrimary }}
              >
                {!avatar && user && `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`.toUpperCase()}
              </Avatar>
              <div className="avatar-edit-icon">
                <EditOutlined style={{ color: token.colorWhite, fontSize: 12 }} />
              </div>
            </div>
          </Upload>
          {avatarLoading && <div>Uploading...</div>}
        </div>

        <Form form={form} layout="vertical" onFinish={onSave}>
          <Row gutter={12}>
            <Col xs={24} sm={12}>
              <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined />} size="middle" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined />} size="middle" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="userName" label="Username" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} size="middle" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined />} size="middle" />
          </Form.Item>

          <Form.Item className="form-actions">
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                icon={<SaveOutlined />}
              >
                Save
              </Button>
              <Button onClick={() => navigate(-1)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;