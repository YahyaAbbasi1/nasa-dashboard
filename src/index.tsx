import "./index.scss";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, useNavigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import enUS from "antd/lib/locale/en_US";
import App from "./components/App/App";
import { Provider } from "react-redux";
import { store } from "../src/components/redux/store";

let globalNavigate: any;

const NavigateSetter = () => {
  globalNavigate = useNavigate();
  return null;
};

const AppInitializer = () => {
  useEffect(() => {
    setTrialStartDate();
  }, []);

  const setTrialStartDate = () => {
    const trialStartDate = localStorage.getItem("trial_start_date");
    if (!trialStartDate) {
      const currentDate = new Date().toISOString();
      localStorage.setItem("trial_start_date", currentDate);
    }
  };

  return null;
};

declare global {
  interface Window {
    Store: any;
  }
}

window.Store = store;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
     
        <Router>
          <NavigateSetter />
          <AppInitializer />
          <App />
        </Router>
    </Provider>
  </React.StrictMode>
);
