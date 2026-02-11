import React, { useState } from "react";
import { Key } from "antd/es/table/interface";

import ProTable from "@ant-design/pro-table";
import { Button, Tooltip, Popconfirm, Modal, ConfigProvider } from "antd";
import { DeleteOutlined, EditOutlined, KeyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Grid, Row, Col, Pagination } from "antd";
import DataCard from "./cardView";
import {
  EDIT_FORM_PATH,
  TABLE_PAGE_SIZE_OPTIONS,
} from "../Constants/Constants";

interface DataItem {
  id: string | number;
  [key: string]: any;
}

const { useBreakpoint } = Grid;

interface DataTableProps<T extends DataItem> {
  data: T[];
  columns: any[];
  rowKey?: any;
  showViewSecretKey?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  isLoading?: boolean;
  scroll?: { x?: string | number; y: string | number };
  pagination?: {
    current: number;
    pageSize: number;
    total?: number;
    showTotal?: (total: number, range: [number, number]) => React.ReactNode;
  };
  onChange?: (pagination: any, filters: any, sorter: any) => void;
  onViewSecretKey?: (id: string | number) => Promise<{ secretKey: string }>;
  onRow?: (row: T, rowIndex: number | undefined) => any;
  onDelete?: (id: string | number) => void;
  onRowSelectionChange?: (keys: Key[]) => void;
  customPagination?: any;
}

const DataTable = <T extends DataItem>({
  data,
  columns,
  isLoading,
  showEdit,
  showDelete,
  rowKey,
  showViewSecretKey,
  onRow,
  onDelete,
  scroll,
  pagination,
  onChange,
  onViewSecretKey,
  onRowSelectionChange,
  customPagination,
}: DataTableProps<T>) => {
  let navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [currentPage, setCurrentPage] = useState(pagination?.current || 1);
  const [loadingSecretKey, setLoadingSecretKey] = useState<number | null>(null);
  const [pageSize, setPageSize] = useState(pagination?.pageSize || 25);
  const screens = useBreakpoint();

  const handleRowSelectionChange = (keys: Key[]) => {
    setSelectedRowKeys(keys);
    if (onRowSelectionChange) {
      onRowSelectionChange(keys);
    }
  };

  const handleEdit = (record: T) => {
    const uniqueId = rowKey(record) || record.id;
    const newSelectedKeys = [uniqueId];
    setSelectedRowKeys(newSelectedKeys);

    if (onRowSelectionChange) {
      onRowSelectionChange(newSelectedKeys);
    }

    navigate(`${EDIT_FORM_PATH.slice(1)}/${uniqueId}`);
  };

  const handleViewSecretKey = async (record: T) => {
    if (!onViewSecretKey) return;
    
    setLoadingSecretKey(Number(record.id));

    try {
      const response = await onViewSecretKey(record.id);
      
      Modal.info({
        title: 'User Secret Key',
        content: (
          <div>
            <p><strong>User:</strong> {record.userName || record.name || record.id}</p>
            <div style={{ 
              background: '#f6ffed', 
              border: '1px solid #b7eb8f',
              padding: '16px',
              borderRadius: '6px',
              margin: '16px 0'
            }}>
              <p><strong>Secret Key:</strong> {response.secretKey}</p>
              <p style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                ⚠️ This secret key is required for password recovery. Keep it secure!
              </p>
            </div>
          </div>
        ),
        width: 500,
        okText: 'Close'
      });
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: 'Failed to retrieve secret key. Please try again.',
      });
    } finally {
      setLoadingSecretKey(null);
    }
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    if (onChange) {
      onChange({ current: page, pageSize: pageSize || 25 }, {}, {});
    }
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

  const handleCardSelect = (id: string | number, checked: boolean) => {
    const newSelectedKeys = checked
      ? [...selectedRowKeys, id]
      : selectedRowKeys.filter((key) => key !== id);

    setSelectedRowKeys(newSelectedKeys);

    if (onRowSelectionChange) {
      onRowSelectionChange(newSelectedKeys);
    }
  };

  const handleDelete = (id: string | number) => {
    const newSelectedKeys = [id];
    setSelectedRowKeys(newSelectedKeys);

    if (onRowSelectionChange) {
      onRowSelectionChange(newSelectedKeys);
    }

    if (onDelete) {
      onDelete(id);
    }
  };

  const actionColumn = {
    title: "Actions",
    fixed: "left",
    key: "actions",
    
    width: showViewSecretKey ? 100 : 80, 
    render: (_: any, record: T) => (
      <div style={{ display: "flex", gap: "4px" }}>
        {showViewSecretKey && onViewSecretKey && (
          <Tooltip title="View Secret Key">
            <Button
              type="default"
              icon={<KeyOutlined />}
              onClick={() => handleViewSecretKey(record)}
              size="small"
              loading={loadingSecretKey === record.id}
            />
          </Tooltip>
        )}

        {showEdit !== false && (
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>
        )}

        {showDelete !== false && (
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure to delete this item?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                icon={<DeleteOutlined />}
                type="primary"
                danger
                size="small"
              />
            </Popconfirm>
          </Tooltip>
        )}
      </div>
    ),
  };

  const wrapTextRender = (text: any) => (
    <div style={{ 
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      wordBreak: 'break-word',
      padding: '4px 0',
      lineHeight: '1.2', 
      fontSize: '12px' 
    }}>
      {text}
    </div>
  );

  const wrappedColumns = columns.map(column => ({
    ...column,
    render: (text: any, record: T, index: number) => {
      if (column.render) {
        const renderedContent = column.render(text, record, index);
        return typeof renderedContent === 'string' 
          ? wrapTextRender(renderedContent) 
          : renderedContent;
      }
      return wrapTextRender(text);
    },
    ellipsis: true,
  }));

 
  const compactTheme = {
    token: {
      fontSize: 12,
      padding: 4,
      paddingXS: 2,
      paddingSM: 4,
      paddingMD: 6,
      paddingLG: 8,
      marginXS: 2,
      marginSM: 4,
      margin: 6,
      lineHeight: 1.2,
    },
    components: {
      Table: {
        cellPaddingBlock: 4,    
        cellPaddingInline: 8,  
        cellPaddingBlockMD: 6,
        cellPaddingInlineMD: 8,
        cellPaddingBlockSM: 4,
        cellPaddingInlineSM: 6,
      },
    },
  };

  return (
    <ConfigProvider theme={compactTheme}>
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: 0
      }}>
        {screens.md ? (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: 0 
          }}>
            <ProTable<T>
              rowKey={rowKey || "id"}
              columns={[actionColumn, ...wrappedColumns]}
              dataSource={data}
              loading={isLoading}
              scroll={{
                ...scroll,
                x: scroll?.x || 1000,
                y: scroll?.y || 'calc(100vh - 200px)', 
              }}
              bordered={true}
              pagination={{
                ...pagination,
                current: currentPage,
                pageSize: pageSize,
                position: ["bottomCenter"], 
                size: "small",
                ...customPagination,
                pageSizeOptions: TABLE_PAGE_SIZE_OPTIONS,
                showSizeChanger: true,
                onChange: handlePageChange,
              }}
              onRow={onRow}
              rowSelection={
                onRowSelectionChange
                  ? {
                      selectedRowKeys,
                      onChange: handleRowSelectionChange,
                    }
                  : undefined
              }
              tableLayout="fixed"
              search={false}
              options={{
                density: false, 
                fullScreen: true,
                setting: true,
                reload: false,
              }}
              style={{ 
                flex: 1, 
                minHeight: 0,
                '--antd-table-padding-vertical': '4px',
                '--antd-table-padding-horizontal': '8px',
              } as React.CSSProperties}
              className="compact-table"
              locale={{
                filterTitle: "Filter menu",
                filterConfirm: "OK",
                filterReset: "Reset",
                selectAll: "Select all",
                selectInvert: "Invert selection",
              }}
            />
          </div>
        ) : (
          <Row gutter={[8, 8]}>
            {data
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((item) => (
                <Col key={item.id} xs={24} sm={12} md={8}>
                  <DataCard
                    data={[item]}
                    columns={columns}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    total={pagination?.total}
                    onPageChange={handlePageChange}
                    isSelected={selectedRowKeys.includes(item.id)}
                    onSelect={(id: string | number, checked: boolean) =>
                      handleCardSelect(id, checked)
                    }
                  />
                </Col>
              ))}
          </Row>
        )}

        {!screens.md && (
          <div style={{ textAlign: "center", marginTop: "8px" }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={pagination?.total}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={TABLE_PAGE_SIZE_OPTIONS}
              size={screens.sm ? "small" : "default"}
            />
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default DataTable;