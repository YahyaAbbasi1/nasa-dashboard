import React, { useState } from "react";
import { Card, Space, Typography, Checkbox, Button, Pagination } from "antd";
import "./cardView.scss";

const { Text, Title } = Typography;

interface DataItem {
  id: string | number;
  [key: string]: any;
}

interface DataCardProps<T extends DataItem> {
  data: T[];
  columns: any[];
  isSelected: boolean;
  onSelect: (id: string | number, checked: boolean) => void; // Ensure onSelect takes two parameters
  currentPage?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number, pageSize?: number) => void;
}

const DataCard = <T extends DataItem>({
  data,
  columns,
  isSelected,
  onSelect,
  currentPage,
  pageSize,
  total,
  onPageChange,
}: DataCardProps<T>) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const item = data[0]; // Assuming single item per card

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="data-card-container">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card
          key={item.id}
          bordered={false}
          className="data-card"
          bodyStyle={{ padding: "16px", background: "#fff" }}
        >
          <div className="data-card-header">
            <Checkbox
              checked={isSelected}
              onChange={(e) => onSelect(item.id, e.target.checked)} // Pass both parameters
            />
            <Title level={4} className="data-card-title">
              {item.title}
            </Title>
          </div>
          <div className={`data-card-content ${isExpanded ? "expanded" : ""}`}>
            {isExpanded ? (
              columns.map((col) => (
                <p key={col.dataIndex}>
                  <Text strong>{col.title}:</Text>{" "}
                  <Text>{item[col.dataIndex]}</Text>
                </p>
              ))
            ) : (
              <>
                <p>
                  <Text strong>Id:</Text> <Text>{item.id}</Text>
                </p>
                <p>
                  <Text strong>Name:</Text> <Text>{item.name}</Text>
                </p>
              </>
            )}
          </div>
          <div className="data-card-footer">
            <Button
              type="link"
              onClick={toggleExpand}
              className="expand-button"
            >
              {isExpanded ? "Show Less" : "Show More"}
            </Button>
          </div>
        </Card>
      </Space>
      {total !== undefined && total > 0 && (
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger
          pageSizeOptions={["10", "25", "50", "100"]}
          size="small"
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "center",
          }}
        />
      )}
    </div>
  );
};

export default DataCard;
