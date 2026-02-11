import "./Portal.scss";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Users from "./users";
import { PageContextProvider } from "Common/PageContext";
import ProfilePage from "components/App/Navbar/profile";
import Dashboard from "./Dashboard";
import NEO_Upcoming from "./NEOUpcoming";
import NEO_Historical from "./NEO_Historical";
import NEO_Detail from "./NEO_Detail";


const Inventory: React.FC = () => {
  return (
    <div className="portal">
      <PageContextProvider>
        <Routes>
    <Route path="/profile" element={<ProfilePage />} />
        <Route path="dashboard/*" element={<Dashboard />} />
          <Route path="users/*" element={<Users />} />
               <Route path="neo-upcoming/*" element={<NEO_Upcoming />} />
                      <Route path="neo-historical/*" element={<NEO_Historical />} />
                       <Route path="neo-detail/:id" element={<NEO_Detail />} />
        </Routes>
      </PageContextProvider>
    </div>
  );
};

export default Inventory;
