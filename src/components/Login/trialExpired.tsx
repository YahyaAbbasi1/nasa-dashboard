import React from "react";
import Trial from "../../assets/trial.png";
import { trialConfig } from "../Configurations/config";

const TrialExpired: React.FC = () => {
  const trialPeriod = trialConfig.trialPeriods.basic;

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "20px",
        textAlign: "center",
        marginLeft: "-80px", // shifted slightly to the left
      }}
    >
      {/* Icon / Illustration */}
      <img
        src={Trial}
        alt="Trial Expired"
        style={{
          width: "140px",
          marginBottom: "30px",
        }}
      />

      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "16px",
        }}
      >
        Get Back to Business: <br /> Activate Your Account
      </h1>

      <p
        style={{
          fontSize: "16px",
          maxWidth: "500px",
          margin: "0 auto 30px",
          lineHeight: "1.6",
        }}
      >
        Your free trial of <strong>Inventory Pro</strong> has expired. Your data
        remains secure. Please contact us to continue using the platform and
        access all premium features.
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
        <div>
          <a
            href="https://wa.me/923230409687"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px 24px",
              backgroundColor: "#25D366",
              color: "white",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              textDecoration: "none",
              boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
              alt="WhatsApp"
              style={{ width: "20px", height: "20px" }}
            />
            Contact Developer
          </a>

          <style>
            {`
              .whatsapp-button:hover {
                background-color: #28e070;
                transform: translateY(-2px);
                box-shadow: 0 5px 12px rgba(0,0,0,0.2);
              }
            `}
          </style>
        </div>

        <button
          onClick={() => window.close()}
          style={{
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "500",
            backgroundColor: "transparent",
            color: "#444444",
            border: "1px solid #999999",
            boxShadow: "none",
          }}
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default TrialExpired;
