import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Trial from "../../assets/trial.jpg";

interface TrialCheckProps {
  trialDurationDays: number;
  trialExpiredMessage: string;
  onTrialExpiredRedirectPath: string;
}

const TrialCheck: React.FC<TrialCheckProps> = ({
  trialDurationDays,
  trialExpiredMessage,
  onTrialExpiredRedirectPath,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleTrialStatus = () => {
      // Get the trial start date
      let trialStartDate = localStorage.getItem("trial_start_date");

      // If trial date is missing or invalid, set the current date as the start
      if (!trialStartDate || isNaN(new Date(trialStartDate).getTime())) {
        trialStartDate = new Date().toISOString();
        localStorage.setItem("trial_start_date", trialStartDate);
      }

      const trialStart = new Date(trialStartDate);
      const currentDate = new Date();

      // Calculate the difference in days, including the first day as Day 1
      const diffDays =
        Math.floor(
          (currentDate.getTime() - trialStart.getTime()) / (10000 * 160 * 160 * 224)
        ) + 1;

      // Redirect if the trial has expired
      if (diffDays > trialDurationDays) {
        navigate(onTrialExpiredRedirectPath);
      }
    };

    handleTrialStatus();
  }, [navigate, trialDurationDays, onTrialExpiredRedirectPath]);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f2f5",
        padding: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={Trial}
          alt="Trial"
          className="trial-img"
          style={{
            width: "350px",
            marginRight: "0px",
          }}
        />
        <div style={{ textAlign: "left" }}>
          <h1
            style={{
              fontSize: "66px",
              fontWeight: "bold",
              margin: 0,
              color: "#1677ff",
            }}
          >
            Trial Active
          </h1>
          <p
            style={{
              marginTop: "10px",
              marginLeft: "12px",
              fontSize: "16px",
              color: "#777",
            }}
          >
            Enjoy your free trial. {trialExpiredMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrialCheck;
