// components/NASA/NEO_Upcoming.tsx
import React, { useState, useEffect, Fragment } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { 
  Button, 
  message, 
  Tooltip, 
  Tag, 
  Space, 
  Alert,
  DatePicker,
  Modal
} from "antd";
import { 
  CalendarOutlined, 
  WarningOutlined, 
  ReloadOutlined,
  ExportOutlined,
  RocketOutlined,
  EyeOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import { CustomForm } from "../../Common/CustomForm/CustomForm";
import { ADD_FORM_PATH, EDIT_FORM_PATH } from "../../Constants/Constants";
import { CREATE_STRING, EDIT_STRING } from "Constants/StringConstants";
import ContentModal from "Common/ContentModal";
import DataTable from "Common/dataTable";
import SearchBy from "Common/SearchBy";
import { nasaApi, NEOObject } from 'components/App/Services/nasaApi';
import dayjs from 'dayjs';
import ActionsBar from "./actionsBar";


export interface UpcomingApproach {
  id: string;
  name: string;
  close_approach_date: string;
  estimated_diameter_min: number;
  estimated_diameter_max: number;
  relative_velocity: string;
  miss_distance: string;
  is_potentially_hazardous_asteroid: boolean;
  orbiting_body?: string;
  risk_tier: 'Low' | 'Medium' | 'High';
  last_updated: string;
}

const convertNEOToUpcomingApproach = (neo: NEOObject): UpcomingApproach => {
  const calculateRiskTier = (missDistance: number): 'Low' | 'Medium' | 'High' => {
    if (missDistance < 1000000) return 'High';
    if (missDistance < 5000000) return 'Medium';
    return 'Low';
  };

  const missDistance = parseFloat(neo.miss_distance?.kilometers || '0');
  
  return {
    id: neo.id?.toString() || Math.random().toString(36).substr(2, 9),
    name: neo.name || 'Unknown Object',
    close_approach_date: neo.close_approach_date || 'Unknown',
    estimated_diameter_min: neo.estimated_diameter?.meters?.estimated_diameter_min || 0,
    estimated_diameter_max: neo.estimated_diameter?.meters?.estimated_diameter_max || 0,
    relative_velocity: neo.relative_velocity?.kilometers_per_second || '0',
    miss_distance: neo.miss_distance?.kilometers || '0',
    is_potentially_hazardous_asteroid: neo.is_potentially_hazardous_asteroid || false,
    orbiting_body: neo.orbiting_body || 'Earth',
    risk_tier: calculateRiskTier(missDistance),
    last_updated: new Date().toISOString()
  };
};

const NEO_Upcoming: React.FC = () => {

  const navigate = useNavigate();
  const [approaches, setApproaches] = useState<UpcomingApproach[]>([]);
  const [filteredApproaches, setFilteredApproaches] = useState<UpcomingApproach[]>([]);
  const [selectedApproach, setSelectedApproach] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected'>('connected');
  const [selectedAsteroidId, setSelectedAsteroidId] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const searchOptions = ['name', 'close_approach_date', 'orbiting_body'];

  useEffect(() => {
    fetchApproaches();
  }, []);

  useEffect(() => {
    setFilteredApproaches(approaches);
  }, [approaches]);

  const fetchApproaches = async () => {
    setLoading(true);
    try {
      console.log("Fetching upcoming approaches from NASA API...");
      const nasaData = await nasaApi.getUpcomingApproaches();
      console.log("NASA API response:", nasaData.length, "objects");
      
      const convertedData = nasaData.map(convertNEOToUpcomingApproach);
      setApproaches(convertedData);
      setApiStatus('connected');
      
      if (convertedData.length === 0) {
        message.warning("No upcoming approaches found in NASA data");
      } else {
        message.success(`Loaded ${convertedData.length} upcoming approaches from NASA`);
      }
    } catch (error) {
      console.error("Error fetching from NASA:", error);
      message.error("Failed to load NASA data. Please check your connection.");
      setApiStatus('disconnected');
      setApproaches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchBy: string, searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredApproaches(approaches);
      return;
    }

    setSearchLoading(true);

    try {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = approaches.filter((approach: UpcomingApproach) => {
        const value = approach[searchBy as keyof UpcomingApproach];
        
        if (value === undefined || value === null) return false;

        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTermLower);
        }
        if (typeof value === 'boolean') {
          return value.toString() === searchTermLower;
        }
        if (typeof value === 'number') {
          return value.toString().includes(searchTermLower);
        }
        
        return false;
      });
      
      setFilteredApproaches(filtered);
      if (filtered.length === 0) {
        message.warning("No approaches found matching your search");
      } else {
        message.success(`Found ${filtered.length} approach(es)`);
      }
    } catch (error) {
      console.error("Search error:", error);
      message.error("Search error occurred");
      setFilteredApproaches(approaches);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleResetSearch = () => {
    setFilteredApproaches(approaches);
  };
  const handleViewDetails = () => {
    if (selectedApproach.length === 0) {
      message.warning("Please select an asteroid first");
      return;
    }
    
    if (selectedApproach.length > 1) {
      message.warning("Please select only one asteroid to view details");
      return;
    }
    
    const asteroidId = selectedApproach[0];
    const selectedAsteroid = approaches.find(a => a.id === asteroidId);
    
    if (!selectedAsteroid) {
      message.error("Selected asteroid not found");
      return;
    }
    
    setSelectedAsteroidId(asteroidId);
    
    navigate(`/inventory/neo-detail/${asteroidId}`);
  };
  const handleQuickView = () => {
    if (selectedApproach.length === 0) {
      message.warning("Please select an asteroid first");
      return;
    }
    
    if (selectedApproach.length > 1) {
      message.warning("Please select only one asteroid to view");
      return;
    }
    
    const asteroidId = selectedApproach[0];
    const selectedAsteroid = approaches.find(a => a.id === asteroidId);
    
    if (!selectedAsteroid) {
      message.error("Selected asteroid not found");
      return;
    }
    
    setSelectedAsteroidId(asteroidId);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
  };

  const deleteApproach = async (id: string | number) => {
    message.info("Cannot delete NASA data. This is read-only information.");
  };

  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(filteredApproaches, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `nasa_upcoming_approaches_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      message.success("Data exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      message.error("Failed to export data");
    }
  };


  const ActionBarMiddleOption = (
    <SearchBy
      searchBy={searchOptions}
      onSearch={handleSearch}
      onReset={handleResetSearch}
      placeholder="Search upcoming approaches..."
      loading={loading || searchLoading}
    />
  );

  const ActionBarLeftOption = (
    <Fragment key="leftOptions">
      <Space size="small">
        <Tooltip title="Refresh NASA Data" placement="bottom">
          <Button
            icon={<ReloadOutlined style={{ fontSize: "14px" }} />}
            onClick={fetchApproaches}
            loading={loading}
            type="primary"
            size="small"
            style={{ fontSize: '12px' }}
          >
            Refresh
          </Button>
        </Tooltip>
        
        <Tooltip title="Export Data to JSON" placement="bottom">
          <Button
            icon={<ExportOutlined style={{ fontSize: "14px" }} />}
            onClick={handleExportData}
            type="default"
            size="small"
            style={{ fontSize: '12px' }}
            disabled={approaches.length === 0}
          >
            Export
          </Button>
        </Tooltip>
        <Tooltip title="View selected asteroid details" placement="bottom">
          <Button
            icon={<EyeOutlined style={{ fontSize: "14px" }} />}
            onClick={handleViewDetails}
            type="primary"
            size="small"
            style={{ fontSize: '12px',  }}
            disabled={selectedApproach.length !== 1}
          >
            View Details
          </Button>
        </Tooltip>
        
       
      </Space>
    </Fragment>
  );
 const ActionBarRightOption = (
    <Fragment key="rightOptions">
        <Tooltip title="Quick view selected asteroid" placement="bottom">
          <Button
            icon={<InfoCircleOutlined style={{ fontSize: "8px" }} />}
            onClick={handleQuickView}
            type="default"
            size="small"
            style={{ fontSize: '12px' }}
            disabled={selectedApproach.length !== 1}
          >
            Quick View
          </Button>
        </Tooltip>
    </Fragment>
  );


  const UpcomingColumns = () => [
    {
      title: 'Date',
      dataIndex: 'close_approach_date',
      key: 'date',
      width: 120,
      sorter: (a: UpcomingApproach, b: UpcomingApproach) => 
        new Date(a.close_approach_date).getTime() - new Date(b.close_approach_date).getTime(),
      render: (text: string) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontSize: '12px' }}>{text}</span>
          <span style={{ fontSize: '10px', color: '#999' }}>
            {dayjs(text).format('MMM D, YYYY')}
          </span>
        </Space>
      ),
    },
    {
      title: 'Object',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text: string, record: UpcomingApproach) => (
        <Space direction="vertical" size={0}>
          <strong style={{ fontSize: '12px' }}>{text}</strong>
          <Button
            type="link"
            size="small"
            style={{ fontSize: '10px', padding: 0, height: 'auto' }}
            onClick={() => navigate(`/inventory/neo-detail/${record.id}`)}
          >
            View Details →
          </Button>
        </Space>
      ),
    },
    {
      title: 'Size (m)',
      key: 'size',
      width: 140,
      render: (_: any, record: UpcomingApproach) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontSize: '12px' }}>
            {record.estimated_diameter_min.toFixed(0)} - {record.estimated_diameter_max.toFixed(0)}
          </span>
          <span style={{ fontSize: '10px', color: '#999' }}>
            Avg: {((record.estimated_diameter_min + record.estimated_diameter_max) / 2).toFixed(0)}m
          </span>
        </Space>
      ),
      sorter: (a: UpcomingApproach, b: UpcomingApproach) => 
        a.estimated_diameter_max - b.estimated_diameter_max,
    },
    {
      title: 'Speed (km/s)',
      key: 'speed',
      width: 120,
      render: (_: any, record: UpcomingApproach) => (
        <span style={{ fontSize: '12px' }}>
          {parseFloat(record.relative_velocity).toFixed(1)}
        </span>
      ),
      sorter: (a: UpcomingApproach, b: UpcomingApproach) => 
        parseFloat(a.relative_velocity) - parseFloat(b.relative_velocity),
    },
    {
      title: 'Miss Distance',
      key: 'distance',
      width: 150,
      render: (_: any, record: UpcomingApproach) => {
        const distance = parseFloat(record.miss_distance);
        return (
          <Space direction="vertical" size={0}>
            <span style={{ fontSize: '12px' }}>
              {(distance / 1000000).toFixed(2)}M km
            </span>
            <span style={{ fontSize: '10px', color: '#999' }}>
              {(distance / 149600000).toFixed(3)} AU
            </span>
          </Space>
        );
      },
      sorter: (a: UpcomingApproach, b: UpcomingApproach) => 
        parseFloat(a.miss_distance) - parseFloat(b.miss_distance),
    },
    {
      title: 'Risk Tier',
      key: 'risk',
      width: 100,
      render: (_: any, record: UpcomingApproach) => {
        let color = 'green';
        if (record.risk_tier === 'High') color = 'red';
        else if (record.risk_tier === 'Medium') color = 'orange';
        
        return (
          <Tag color={color} style={{ fontSize: '11px', padding: '2px 8px', width: '70px', textAlign: 'center' }}>
            {record.risk_tier}
          </Tag>
        );
      },
      filters: [
        { text: 'High', value: 'High' },
        { text: 'Medium', value: 'Medium' },
        { text: 'Low', value: 'Low' },
      ],
      onFilter: (value: any, record: UpcomingApproach) => record.risk_tier === value,
    },
    {
      title: 'Hazard',
      dataIndex: 'is_potentially_hazardous_asteroid',
      key: 'hazard',
      width: 90,
      render: (hazardous: boolean, record: UpcomingApproach) => {
        return hazardous ? 
          <Tag color="red" icon={<WarningOutlined />} style={{ fontSize: '11px', padding: '2px 8px' }}>Hazard</Tag> :
          <Tag color="green" style={{ fontSize: '11px', padding: '2px 8px' }}>Safe</Tag>;
      },
      filters: [
        { text: 'Hazardous', value: true },
        { text: 'Safe', value: false },
      ],
      onFilter: (value: any, record: UpcomingApproach) => record.is_potentially_hazardous_asteroid === value,
    },
    {
      title: 'Body',
      dataIndex: 'orbiting_body',
      key: 'orbiting_body',
      width: 100,
      render: (text: string) => <span style={{ fontSize: '12px' }}>{text}</span>,
      filters: [
        { text: 'Earth', value: 'Earth' },
        { text: 'Mars', value: 'Mars' },
        { text: 'Venus', value: 'Venus' },
      ],
      onFilter: (value: any, record: UpcomingApproach) => record.orbiting_body === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: UpcomingApproach) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => navigate(`/inventory/neo-detail/${record.id}`)}
            style={{ padding: 0, fontSize: '12px' }}
          >
            Details
          </Button>
        </Space>
      ),
    }
  ];

  const selectedAsteroid = selectedAsteroidId 
    ? approaches.find(a => a.id === selectedAsteroidId)
    : null;

  return (
    <Fragment>
      <Modal
        title={selectedAsteroid ? `Quick View: ${selectedAsteroid.name}` : "Asteroid Details"}
        open={showDetailsModal}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>,
          <Button 
            key="details" 
            type="primary"
            onClick={() => {
              handleCloseModal();
              if (selectedAsteroidId) {
                navigate(`/inventory/neo-detail/${selectedAsteroidId}`);
              }
            }}
          >
            View Full Details
          </Button>
        ]}
        width={600}
      >
        {selectedAsteroid ? (
          <div style={{ padding: '6px 0' }}>
            <Alert
              message={
                <Space>
                  <strong>Status:</strong>
                  <Tag color={selectedAsteroid.is_potentially_hazardous_asteroid ? "red" : "green"}>
                    {selectedAsteroid.is_potentially_hazardous_asteroid ? "POTENTIALLY HAZARDOUS" : "NOT HAZARDOUS"}
                  </Tag>
                  <Tag color={selectedAsteroid.risk_tier === 'High' ? 'red' : 
                              selectedAsteroid.risk_tier === 'Medium' ? 'orange' : 'green'}>
                    {selectedAsteroid.risk_tier} RISK
                  </Tag>
                </Space>
              }
              type={selectedAsteroid.is_potentially_hazardous_asteroid ? "warning" : "info"}
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <h4>Approach Information</h4>
                <p><strong>Date:</strong> {selectedAsteroid.close_approach_date}</p>
                <p><strong>Orbiting Body:</strong> {selectedAsteroid.orbiting_body}</p>
                <p><strong>Relative Velocity:</strong> {parseFloat(selectedAsteroid.relative_velocity).toFixed(1)} km/s</p>
                <p><strong>Miss Distance:</strong> {(parseFloat(selectedAsteroid.miss_distance) / 1000000).toFixed(2)} million km</p>
              </div>
              
              <div>
                <h4>Size Information</h4>
                <p><strong>Diameter Range:</strong> {selectedAsteroid.estimated_diameter_min.toFixed(0)} - {selectedAsteroid.estimated_diameter_max.toFixed(0)} meters</p>
                <p><strong>Average Diameter:</strong> {((selectedAsteroid.estimated_diameter_min + selectedAsteroid.estimated_diameter_max) / 2).toFixed(0)} meters</p>
              </div>
              
              <Alert
                message="Full NASA Data Available"
                description="Click 'View Full Details' to see complete orbital data, close approach history, and detailed risk assessment from NASA's database."
                type="success"
                showIcon
              />
            </Space>
          </div>
        ) : (
          <Alert
            message="No asteroid selected"
            description="Please select an asteroid from the table first."
            type="warning"
            showIcon
          />
        )}
      </Modal>
   <ActionsBar left={ActionBarLeftOption}  right={ActionBarRightOption}  middle={ActionBarMiddleOption} />
      <DataTable<UpcomingApproach>
        data={filteredApproaches}
        rowKey={(r: any) => r.id}
        columns={UpcomingColumns()}
        scroll={{ x: "1400", y: 500 }}
        onRowSelectionChange={(selectedRowKeys: any) =>
          setSelectedApproach(selectedRowKeys)
        }
        onDelete={deleteApproach}
        isLoading={loading || searchLoading}
        showViewSecretKey={false}
        showEdit={false} 
        showDelete={false}   
    
      />
       <Routes>
        <Route
          path={ADD_FORM_PATH}
          element={
            <ContentModal formTitle={`${CREATE_STRING} New Approach`}>
              <Alert
                message="NASA Data is Read-Only"
                description="Upcoming approaches data is fetched directly from NASA's API and cannot be modified. Use the NASA API for real-time data."
                type="info"
                showIcon
              />
            </ContentModal>
          }
        />
        <Route
          path={`${EDIT_FORM_PATH}/:id`}
          element={
            <ContentModal formTitle={`${EDIT_STRING} Approach`}>
              <Alert
                message="NASA Data is Read-Only"
                description="NASA asteroid data is maintained by NASA's Near Earth Object program and cannot be edited through this interface."
                type="info"
                showIcon
              />
            </ContentModal>
          }
        />
      </Routes>
    </Fragment>
  );
};

export default NEO_Upcoming;