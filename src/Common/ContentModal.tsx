import "./contentmodal.scss";
import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";

interface ContentModalProps {
  children?: React.ReactNode;
  formTitle?: string;
  width?: string;
  height?: string;
}

const ContentModal: React.FC<ContentModalProps> = ({ 
  children, 
  formTitle, 
  width, 
  height 
}) => {
  const navigate = useNavigate();
  const [modalVisibility, setModalVisibility] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCancel = () => {
    navigate(-1);
    setModalVisibility(false);
  };

  return (
    <Modal
      visible={modalVisibility}
      className="form-input-modal"
      centered
      title={formTitle}
      footer={[]}
      onCancel={handleCancel}
      width={isSmallScreen ? "90%" : width}
      bodyStyle={{
        maxHeight: isSmallScreen ? "70vh" : height,
        overflowY: "auto",
        overflowX: "hidden",
        padding: isSmallScreen ? "10px" : "20px",
        marginTop: isSmallScreen ? "2vh" : "5vh",
        marginBottom: isSmallScreen ? "2vh" : "5vh",
      }}
    >
      {children}
    </Modal>
  );
};

export default ContentModal;