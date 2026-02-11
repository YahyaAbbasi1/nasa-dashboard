import React, { useState, useEffect, Fragment } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { UserForm } from "./forms/userForm";
import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button, message, Tooltip } from "antd"
import { CustomForm } from "../../Common/CustomForm/CustomForm";
import { ADD_FORM_PATH, EDIT_FORM_PATH } from "../../Constants/Constants";
import { CREATE_STRING, EDIT_STRING } from "Constants/StringConstants";
import ContentModal from "Common/ContentModal";
import DataTable from "Common/dataTable";
import UserColumns from "components/Tables/userTable";
import ActionsBar from "./actionsBar";
import SearchBy from "Common/SearchBy";
import { userModel } from "components/Models/userModel";

// Mock database key for localStorage
const USERS_STORAGE_KEY = 'portfolio_users_database';

// Default admin user (matching your login credentials)
const DEFAULT_USERS: userModel[] = [
  {
    id: 1,
    userName: "admin",
    password: "admin123", // Plain text password from your login
    passwordHash: "", // Empty for now, would be hashed in production
    firstName: "System",
    lastName: "Administrator",
    email: "admin@portfolio.com",
    avatar: "",
    createdDate: new Date().toISOString(),
    createdBy: "system",
    modifiedDate: new Date().toISOString(),
    modifiedBy: "system"
  }
];

// Initialize localStorage with default users
const initializeUsersDatabase = () => {
  if (!localStorage.getItem(USERS_STORAGE_KEY)) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  }
};

// Mock API functions to simulate backend
const mockApi = {
  // Get all users
  getUsers: async (): Promise<userModel[]> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    initializeUsersDatabase();
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    
    // Return users without passwords for security
    return users.map((user: userModel) => {
      const { password, passwordHash, ...userWithoutPassword } = user;
      return { ...userWithoutPassword, password: '', passwordHash: '' } as userModel;
    });
  },

  // Add new user
  addUser: async (userData: userModel): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    initializeUsersDatabase();
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    
    // Generate new ID
    const newId = users.length > 0 ? Math.max(...users.map((u: userModel) => Number(u.id))) + 1 : 1;
    
    const newUser: userModel = {
      ...userData,
      id: newId,
      passwordHash: userData.password, // For demo, just copy password to passwordHash
      createdDate: new Date().toISOString(),
      createdBy: "admin",
      modifiedDate: new Date().toISOString(),
      modifiedBy: "admin",
      avatar: userData.avatar || ""
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return true;
  },

  // Edit user
  editUser: async (id: number, userData: Partial<userModel>): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    initializeUsersDatabase();
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    
    const userIndex = users.findIndex((u: userModel) => u.id === id);
    
    if (userIndex !== -1) {
      const currentUser = users[userIndex];
      
      // Handle password updates
      const updatedPassword = userData.password || currentUser.password;
      
      const updatedUser: userModel = {
        ...currentUser,
        ...userData,
        id: currentUser.id, // Keep original ID
        password: updatedPassword,
        passwordHash: updatedPassword, // For demo, just copy password to passwordHash
        modifiedDate: new Date().toISOString(),
        modifiedBy: "admin",
        avatar: userData.avatar || currentUser.avatar || ""
      };
      
      users[userIndex] = updatedUser;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      return true;
    }
    
    return false;
  },

  // Delete user
  removeUser: async (id: string | number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    initializeUsersDatabase();
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    
    // Prevent deleting the admin user (id: 1)
    if (id === 1) {
      throw new Error("Cannot delete the admin user");
    }
    
    const filteredUsers = users.filter((u: userModel) => u.id !== id);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filteredUsers));
    return true;
  },

  // Get user by ID
  getUserById: async (userId: number): Promise<userModel | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    initializeUsersDatabase();
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const user = users.find((u: userModel) => u.id === userId);
    
    if (user) {
      const { password, passwordHash, ...userWithoutPasswords } = user;
      return { ...userWithoutPasswords, password: '', passwordHash: '' } as userModel;
    }
    
    return null;
  },

  // Search users
  search: async (table: string, searchTerm: string, columns: string[]): Promise<{ success: boolean; data: userModel[]; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    initializeUsersDatabase();
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    
    if (!searchTerm.trim()) {
      const usersWithoutPasswords = users.map((user: userModel) => {
        const { password, passwordHash, ...userWithoutPassword } = user;
        return { ...userWithoutPassword, password: '', passwordHash: '' } as userModel;
      });
      return { success: true, data: usersWithoutPasswords };
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const filteredUsers = users.filter((user: userModel) => {
      return columns.some(column => {
        const value = user[column as keyof userModel];
        return value && 
          typeof value === 'string' && 
          value.toLowerCase().includes(searchTermLower);
      });
    });
    
    const usersWithoutPasswords = filteredUsers.map((user: userModel) => {
      const { password, passwordHash, ...userWithoutPassword } = user;
      return { ...userWithoutPassword, password: '', passwordHash: '' } as userModel;
    });
    
    return { success: true, data: usersWithoutPasswords };
  }
};

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<userModel[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<userModel[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Search options for users
  const searchOptions = ['id', 'userName', 'firstName', 'lastName', 'email'];

  useEffect(() => {
    fetchUsers();
  }, []);

  // Initialize filtered users when users data changes
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersList = await mockApi.getUsers();
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = (searchBy: string, searchTerm: string) => {
    // If search term is empty, show all records
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    setSearchLoading(true);
    
    const performSearch = async () => {
      try {
        const results = await mockApi.search("users", searchTerm, [searchBy]);

        if (results.success) {
          setFilteredUsers(results.data);
          if (results.data.length === 0) {
            message.warning("No users found matching your search");
          } else {
            message.success(`Found ${results.data.length} user(s)`);
          }
        } else {
          message.error("Search failed: " + results.error);
          setFilteredUsers(users);
        }
      } catch (error) {
        console.error("Search error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        message.error("Search error: " + errorMessage);
        setFilteredUsers(users);
      } finally {
        setSearchLoading(false);
      }
    };

    performSearch();
  };

  const handleResetSearch = () => {
    setFilteredUsers(users);
  };

  const handleAddUser = async (user: userModel) => {
    try {
      // Ensure password exists
      if (!user.password || user.password.trim() === '') {
        throw new Error("Password is required");
      }

      await mockApi.addUser(user);
      await fetchUsers();
      message.success("User added successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Failed to add user:", error);
      message.error(
        error instanceof Error 
          ? error.message 
          : "Failed to add user. Please try again."
      );
    }
  };

  const handleEditUser = async (user: userModel) => {
    if (selectedUser.length) {
      try {
        const id = selectedUser[0];
        await mockApi.editUser(id, user);
        await fetchUsers();
        setSelectedUser([]);
        message.success("User updated successfully!");
        navigate(-1);
      } catch (error) {
        console.error("Failed to edit user:", error);
        message.error("Failed to edit user. Please try again.");
      }
    }
  };

  const deleteUser = async (id: string | number) => {
    try {
      await mockApi.removeUser(id);
      await fetchUsers();
      message.success("User deleted successfully!");
    } catch (error) {
      console.error("Failed to delete User:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete User";
      message.error(errorMessage);
    }
  };

  const handleViewSecretKey = async (userId: string | number): Promise<{ secretKey: string }> => {
    // Since secretKey is not in your userModel, return a mock response
    const user = await mockApi.getUserById(Number(userId));
    
    if (user) {
      // Generate a mock secret key based on user data
      const mockSecretKey = `sk_${user.userName}_${Math.random().toString(36).substring(2, 10)}`;
      return { secretKey: mockSecretKey };
    } else {
      throw new Error('User not found');
    }
  };

  const ActionBarMiddleOption = (
    <SearchBy
      searchBy={searchOptions}
      onSearch={handleSearch}
      onReset={handleResetSearch}
      placeholder="Search users..."
      loading={loading || searchLoading}
    />
  );

  return (
    <Fragment>
      <ActionsBar  middle={ActionBarMiddleOption} />
      <DataTable<userModel>
        data={filteredUsers}
        rowKey={(r: any) => r.id}
        onViewSecretKey={handleViewSecretKey} 
        columns={UserColumns()}
        showViewSecretKey={true}
        scroll={{ x: "120", y: 390 }}
        onRowSelectionChange={(selectedRowKeys: any) =>
          setSelectedUser(selectedRowKeys)
        }
        onDelete={deleteUser}
        isLoading={loading || searchLoading}
          showEdit={false} 
       showDelete={false}
      />
      <Routes>
        <Route
          path={ADD_FORM_PATH}
          element={
            <ContentModal formTitle={`${CREATE_STRING} New User`}>
              <CustomForm
                formSchema={UserForm()}
                onSubmit={handleAddUser}
              />
            </ContentModal>
          }
        />
        <Route
          path={`${EDIT_FORM_PATH}/:id`}
          element={
            <ContentModal formTitle={`${EDIT_STRING} User`}>
              <CustomForm
                formSchema={UserForm()}
                initialValues={
                  selectedUser &&
                  users.find((c) => c.id === selectedUser[0])
                }
                onSubmit={handleEditUser}
              />
            </ContentModal>
          }
        />
      </Routes>
    </Fragment>
  );
};

export default Users;