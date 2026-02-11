import {
  UserOutlined,
  DashboardOutlined, 
    RocketOutlined,
  HistoryOutlined,
  ProfileOutlined
} from "@ant-design/icons";
import { BASE_PATH } from "Constants/Constants";

const sections = [
   {
    label: "Dashboard",
    key: "dashboard",
    icon: < DashboardOutlined  />,
    url: `${BASE_PATH}/dashboard`,
  },
{
  label: "NEO Upcoming",
  key: "neo-upcoming",
  icon: <RocketOutlined />,
  url: `${BASE_PATH}/neo-upcoming`,
},
{
  label: "NEO Historical",
  key: "neo-historical",
  icon: <HistoryOutlined />,
  url: `${BASE_PATH}/neo-historical`,
},


  {
    label: "Users",
    key: "users",
    icon: <UserOutlined  />,
    url: `${BASE_PATH}/users`,
  },

 
];

export default sections;
