import React, { useState, useEffect } from "react";
import 'animate.css';
import "./Navbar.scss";
import { Avatar, Button, Dropdown, Menu, Typography, Upload, message, theme } from "antd";
import { LogoutOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title } = Typography;

interface UserModel {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  secretKey: string;
  avatar: string | null;
}

const NavBar: React.FC = () => {
  const userData = localStorage.getItem("currentUser");
  const user: UserModel | null = userData ? JSON.parse(userData) : null;
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);
  const { token } = theme.useToken(); 

  useEffect(() => {
    if (user?.id) {
      loadUserAvatar();
    }
    const handleUserUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.avatar !== undefined) {
        setAvatar(event.detail.avatar);
      }
    };

    window.addEventListener('userUpdated', handleUserUpdate as EventListener);
    
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate as EventListener);
    };
  }, [user?.id]);

  const loadUserAvatar = async () => {
    try {
      // Load from localStorage instead of Electron
      if (user?.avatar) {
        setAvatar(user.avatar);
      } else {
        // Try to load from users database
        const usersData = localStorage.getItem('portfolio_users_database');
        if (usersData) {
          const users = JSON.parse(usersData);
          const currentUser = users.find((u: any) => u.id === user?.id);
          if (currentUser?.avatar) {
            setAvatar(currentUser.avatar);
            // Update localStorage
            const updatedUser = { ...user, avatar: currentUser.avatar };
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
          }
        }
      }
    } catch (error) {
      console.error("Error loading avatar:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new CustomEvent('userUpdated', { detail: null }));
    window.location.reload();
  };

  const handleAvatarChange = async (file: File) => {
    try {
      if (!user) {
        message.error("User not logged in");
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
              
              // Update current user in localStorage
              const updatedUser = { ...user, avatar: cleanBase64 };
              localStorage.setItem("currentUser", JSON.stringify(updatedUser));
              
              // Trigger event for other components
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
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error updating avatar:", error);
      message.error("Error updating avatar");
    }
    return false;
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">My Profile</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        key="logout" 
        icon={<LogoutOutlined />} 
        danger
        onClick={handleLogout}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  const getAvatarSrc = () => {
    if (avatar) {
      return `data:image/png;base64,${avatar}`;
    }
    return undefined;
  };

  return (
    <div className="navbar">
      <Title level={3} className="navbar-title animate__animated animate__backInDown" style={{ margin: "0px" }}>
        Space Dashboard <span className="navbar-version"></span>
      </Title>

      <div className="navbar-user-controls">
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
          <Button type="text" className="user-profile-button">
            <Avatar
              size="small"
              src={getAvatarSrc()}
              icon={!avatar ? <UserOutlined /> : undefined}
              style={{ backgroundColor: !user?.avatar ? token.colorPrimary : undefined, }}
            />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};

export default NavBar;