import React, { useState } from "react";
import { FloatButton, theme as antdTheme } from "antd";
import { RobotOutlined, CloseOutlined } from "@ant-design/icons";

import { ProChat } from "@ant-design/pro-chat";

const AIAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { token } = antdTheme.useToken();

  return (
    <>
      <FloatButton
        icon={open ? <CloseOutlined /> : <RobotOutlined />}
        type="primary"
        tooltip={open ? "Close Assistant" : "AI Assistant"}
        style={{ right: 80, bottom: 32 }}
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div
          style={{
            position: "fixed",
            right: 32,
            bottom: 90,
            width: 380,
            height: 520,
            zIndex: 200,
            borderRadius: token.borderRadiusLG,
            border: `1px solid ${token.colorBorder}`,
            backgroundColor: token.colorBgContainer,
            boxShadow: token.boxShadowSecondary,
            overflow: "hidden",
          }}
        >
   <ProChat
  locale="en-US"
  request={async (messages) => {
    return new Response("Hello! How can I help you?");
  }}
/>
        </div>
      )}
    </>
  );
};

export default AIAssistant;