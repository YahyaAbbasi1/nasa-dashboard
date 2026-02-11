// components/NASA/NEO_Detail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Alert,
  Button,
  Statistic,
  Descriptions,
  Divider,
  Progress,
  Timeline,
  Tabs,
  Tooltip,
  message,
  Spin,
  Badge
} from "antd";
import {
  RocketOutlined,
  WarningOutlined,
  SafetyOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  GlobalOutlined,
  CompassOutlined,
  RadiusUpleftOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
  DatabaseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from "@ant-design/icons";
import { nasaApi } from 'components/App/Services/nasaApi';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface NEOOrbitData {
  orbit_id: string;
  orbit_determination_date: string;
  first_observation_date: string;
  last_observation_date: string;
  data_arc_in_days: number;
  observations_used: number;
  orbit_uncertainty: string;
  minimum_orbit_intersection: string;
  jupiter_tisserand_invariant: string;
  epoch_osculation: string;
  eccentricity: string;
  semi_major_axis: string;
  inclination: string;
  ascending_node_longitude: string;
  orbital_period: string;
  perihelion_distance: string;
  perihelion_argument: string;
  aphelion_distance: string;
  perihelion_time: string;
  mean_anomaly: string;
  mean_motion: string;
  equinox: string;
}

interface NEODetail {
  id: string;
  name: string;
  designation: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    miles: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    feet: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
      miles_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
      miles: string;
    };
    orbiting_body: string;
  }>;
  orbital_data: NEOOrbitData;
  is_sentry_object: boolean;
  links?: {
    self: string;
  };
}

const NEO_Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [neoDetail, setNeoDetail] = useState<NEODetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (id) {
      fetchNeoDetail(id);
    }
  }, [id]);

  const fetchNeoDetail = async (neoId: string) => {
    setLoading(true);
    setError(null);
    setApiStatus('loading');
    
    try {
      message.loading({ content: 'Fetching NASA data...', key: 'neoDetail', duration: 0 });
      
      const fetchWithTimeout = async (): Promise<any> => {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('NASA API request timeout after 10s')), 10000);
        });
        
        const fetchPromise = nasaApi.getNEOById(neoId);
        return Promise.race([fetchPromise, timeoutPromise]);
      };
      
      const detail = await fetchWithTimeout();
      
      if (!detail) {
        throw new Error("NASA API returned empty response");
      }
      
      setNeoDetail(detail);
      setApiStatus('success');
      
      message.success({ 
        content: 'NASA data loaded!', 
        key: 'neoDetail',
        duration: 3 
      });
      
    } catch (error) {
      let errorMsg = "Failed to load asteroid details from NASA API";
      
      if (error instanceof Error) {
        errorMsg = error.message;
        
        if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
          errorMsg = "Network/CORS error";
        }
        
        if (errorMsg.includes('timeout')) {
          errorMsg = "NASA API request timed out";
        }
      }
      
      setError(errorMsg);
      setApiStatus('error');
      
      message.error({ 
        content: `NASA API Error: ${errorMsg}`, 
        key: 'neoDetail',
        duration: 5 
      });
      
      // Mock data for testing
      setNeoDetail({
        id: neoId,
        name: `Asteroid ${neoId}`,
        designation: `2024-TEST-${neoId}`,
        nasa_jpl_url: `https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${neoId}`,
        absolute_magnitude_h: 20.5,
        estimated_diameter: {
          kilometers: { estimated_diameter_min: 0.1, estimated_diameter_max: 0.3 },
          meters: { estimated_diameter_min: 100, estimated_diameter_max: 300 },
          miles: { estimated_diameter_min: 0.062, estimated_diameter_max: 0.186 },
          feet: { estimated_diameter_min: 328, estimated_diameter_max: 984 }
        },
        is_potentially_hazardous_asteroid: false,
        close_approach_data: [{
          close_approach_date: new Date().toISOString().split('T')[0],
          close_approach_date_full: `${new Date().toISOString().split('T')[0]} 12:00`,
          epoch_date_close_approach: Date.now(),
          relative_velocity: {
            kilometers_per_second: '10.5',
            kilometers_per_hour: '37800',
            miles_per_hour: '23488'
          },
          miss_distance: {
            astronomical: '0.1',
            lunar: '38.9',
            kilometers: '14960000',
            miles: '9290000'
          },
          orbiting_body: 'Earth'
        }],
        orbital_data: {
          orbit_id: "test_orbit",
          orbit_determination_date: new Date().toISOString().split('T')[0],
          first_observation_date: "2020-01-01",
          last_observation_date: new Date().toISOString().split('T')[0],
          data_arc_in_days: 365,
          observations_used: 50,
          orbit_uncertainty: "5",
          minimum_orbit_intersection: "0.05",
          jupiter_tisserand_invariant: "3.5",
          epoch_osculation: "2459000.5",
          eccentricity: "0.25",
          semi_major_axis: "1.5",
          inclination: "10.5",
          ascending_node_longitude: "45.0",
          orbital_period: "365.25",
          perihelion_distance: "1.0",
          perihelion_argument: "180.0",
          aphelion_distance: "2.0",
          perihelion_time: "2459000.5",
          mean_anomaly: "0.0",
          mean_motion: "0.9856",
          equinox: "J2000"
        },
        is_sentry_object: false
      } as NEODetail);
      
    } finally {
      setLoading(false);
    }
  };

  const getNextCloseApproach = () => {
    if (!neoDetail?.close_approach_data || neoDetail.close_approach_data.length === 0) {
      return null;
    }
    
    const sorted = [...neoDetail.close_approach_data].sort((a, b) => 
      new Date(a.close_approach_date).getTime() - new Date(b.close_approach_date).getTime()
    );
    
    const now = new Date();
    const futureApproach = sorted.find(approach => 
      new Date(approach.close_approach_date) > now
    );
    
    return futureApproach || sorted[sorted.length - 1];
  };

  const calculateRiskScore = (): number => {
    if (!neoDetail || !neoDetail.estimated_diameter) {
      return 0;
    }
    
    const approach = getNextCloseApproach();
    if (!approach) return 0;
    
    try {
      const avgDiameter = (neoDetail.estimated_diameter.meters.estimated_diameter_min + 
                          neoDetail.estimated_diameter.meters.estimated_diameter_max) / 2;
      const velocity = parseFloat(approach.relative_velocity.kilometers_per_second) || 0;
      const missDistance = parseFloat(approach.miss_distance.kilometers) || 1;
      
      return (avgDiameter * velocity) / missDistance;
    } catch (error) {
      console.error("Error calculating risk score:", error);
      return 0;
    }
  };

  const getRiskLevel = (score: number): { level: string; color: string; description: string } => {
    if (score > 100) return { 
      level: "Extreme", 
      color: "#ff4d4f", 
      description: "Very high risk - requires close monitoring" 
    };
    if (score > 50) return { 
      level: "High", 
      color: "#faad14", 
      description: "High risk - significant monitoring needed" 
    };
    if (score > 20) return { 
      level: "Medium", 
      color: "#1890ff", 
      description: "Moderate risk - standard monitoring" 
    };
    return { 
      level: "Low", 
      color: "#52c41a", 
      description: "Low risk - routine observation" 
    };
  };

  const getSizeCategory = (sizeInMeters: number): string => {
    if (sizeInMeters > 1000) return "Stadium-sized";
    if (sizeInMeters > 140) return "Building-sized";
    if (sizeInMeters > 30) return "House-sized";
    if (sizeInMeters > 10) return "Bus-sized";
    return "Car-sized";
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  const renderOverviewTab = () => {
    if (!neoDetail) return null;
    
    const approach = getNextCloseApproach();
    const riskScore = calculateRiskScore();
    const riskLevel = getRiskLevel(riskScore);
    const sizeCategory = getSizeCategory(neoDetail.estimated_diameter.meters.estimated_diameter_max);
    
    return (
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" bordered={false} style={{ background: '#fafafa', borderRadius: 8, height: '100%' }}>
            <Statistic
              title={<span style={{ fontSize: '12px' }}>Risk Score</span>}
              value={riskScore.toFixed(1)}
              valueStyle={{ 
                color: riskLevel.color,
                fontSize: '18px',
                fontWeight: 'bold'
              }}
              prefix={<Badge color={riskLevel.color} />}
            />
            <div style={{ marginTop: '4px' }}>
              <Tag color={riskLevel.color} style={{ fontSize: '11px', padding: '2px 6px' }}>
                {riskLevel.level}
              </Tag>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card size="small" bordered={false} style={{ background: '#fafafa', borderRadius: 8, height: '100%' }}>
            <Statistic
              title={<span style={{ fontSize: '12px' }}>Size Category</span>}
              value={sizeCategory}
              valueStyle={{ fontSize: '14px' }}
              prefix={<RadiusUpleftOutlined style={{ fontSize: '14px', marginRight: '4px' }} />}
            />
            <div style={{ marginTop: '4px', fontSize: '11px', color: '#666' }}>
              {neoDetail.estimated_diameter.meters.estimated_diameter_min.toFixed(0)}-{neoDetail.estimated_diameter.meters.estimated_diameter_max.toFixed(0)}m
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card size="small" bordered={false} style={{ background: '#fafafa', borderRadius: 8, height: '100%' }}>
            <Statistic
              title={<span style={{ fontSize: '12px' }}>Velocity</span>}
              value={approach ? parseFloat(approach.relative_velocity.kilometers_per_second).toFixed(1) : "0"}
              suffix="km/s"
              valueStyle={{ fontSize: '16px' }}
              prefix={<ThunderboltOutlined style={{ fontSize: '14px', marginRight: '4px' }} />}
            />
            <div style={{ marginTop: '4px', fontSize: '11px', color: '#666' }}>
              {approach ? parseFloat(approach.relative_velocity.kilometers_per_hour).toFixed(0) : "0"} km/h
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card size="small" bordered={false} style={{ background: '#fafafa', borderRadius: 8, height: '100%' }}>
            <Statistic
              title={<span style={{ fontSize: '12px' }}>Miss Distance</span>}
              value={approach ? (parseFloat(approach.miss_distance.kilometers) / 1000000).toFixed(2) : "0"}
              suffix="M km"
              valueStyle={{ fontSize: '16px' }}
              prefix={<CloseCircleOutlined style={{ fontSize: '14px', marginRight: '4px' }} />}
            />
            <div style={{ marginTop: '4px', fontSize: '11px', color: '#666' }}>
              {approach ? parseFloat(approach.miss_distance.lunar).toFixed(1) : "0"} lunar
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            size="small" 
            title={<span style={{ fontSize: '14px' }}>Size & Dimensions</span>}
            style={{ borderRadius: 8, height: '100%' }}
          >
            <Descriptions column={1} size="small" colon={false}>
              <Descriptions.Item label="Diameter Range">
                <Space size={4}>
                  <span>{neoDetail.estimated_diameter.meters.estimated_diameter_min.toFixed(0)}</span>
                  <ArrowUpOutlined style={{ fontSize: '10px', color: '#1890ff' }} />
                  <span>{neoDetail.estimated_diameter.meters.estimated_diameter_max.toFixed(0)} meters</span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Average Diameter">
                {((neoDetail.estimated_diameter.meters.estimated_diameter_min + 
                  neoDetail.estimated_diameter.meters.estimated_diameter_max) / 2).toFixed(0)} meters
              </Descriptions.Item>
              <Descriptions.Item label="Magnitude">
                {neoDetail.absolute_magnitude_h.toFixed(1)} H
              </Descriptions.Item>
              <Descriptions.Item label="NASA JPL">
                <a href={neoDetail.nasa_jpl_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px' }}>
                  View Details
                </a>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            size="small" 
            title={<span style={{ fontSize: '14px' }}>Next Close Approach</span>}
            style={{ borderRadius: 8, height: '100%' }}
          >
            {approach ? (
              <Descriptions column={1} size="small" colon={false}>
                <Descriptions.Item label="Date">
                  {approach.close_approach_date}
                </Descriptions.Item>
                <Descriptions.Item label="Time">
                  {approach.close_approach_date_full.split(' ')[1]}
                </Descriptions.Item>
                <Descriptions.Item label="Relative Velocity">
                  {parseFloat(approach.relative_velocity.kilometers_per_second).toFixed(1)} km/s
                </Descriptions.Item>
                <Descriptions.Item label="Miss Distance">
                  {(parseFloat(approach.miss_distance.kilometers) / 1000000).toFixed(2)} million km
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Alert
                message="No Close Approach Data"
                description="No future close approaches recorded"
                type="info"
                showIcon
              />
            )}
          </Card>
        </Col>
        
        <Col span={24}>
          <Card 
            size="small"
            title={<span style={{ fontSize: '14px' }}>Hazard Assessment</span>}
            style={{ borderRadius: 8 }}
          >
            <Row gutter={16} align="middle">
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <Progress
                    type="circle"
                    percent={Math.min(riskScore, 100)}
                    strokeColor={riskLevel.color}
                    size={80}
                    strokeWidth={10}
                    format={() => (
                      <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                        {riskScore.toFixed(0)}
                      </div>
                    )}
                  />
                  <div style={{ fontSize: '11px', marginTop: '4px', color: riskLevel.color }}>
                    {riskLevel.level}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={16}>
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Alert
                    message={
                      <Space>
                        <WarningOutlined />
                        <span>Potentially Hazardous</span>
                        <Tag 
                          color={neoDetail.is_potentially_hazardous_asteroid ? "red" : "green"}
                          style={{ fontSize: '11px', padding: '2px 6px' }}
                        >
                          {neoDetail.is_potentially_hazardous_asteroid ? "YES" : "NO"}
                        </Tag>
                      </Space>
                    }
                    description={neoDetail.is_potentially_hazardous_asteroid 
                      ? "Meets NASA's hazardous criteria based on size and approach distance"
                      : "Does not meet NASA's hazardous criteria"
                    }
                    type={neoDetail.is_potentially_hazardous_asteroid ? "warning" : "success"}
                    showIcon={false}
                  />
                  {neoDetail.is_sentry_object && (
                    <Alert
                      message={
                        <Space>
                          <SafetyOutlined />
                          <span>Sentry Object</span>
                        </Space>
                      }
                      description="Monitored for potential future Earth impact"
                      type="info"
                      showIcon={false}
                    />
                  )}
                  <div style={{ fontSize: '12px', marginTop: '8px' }}>
                    <strong>Assessment:</strong> {riskLevel.description}
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  };

  const renderOrbitTab = () => {
    if (!neoDetail?.orbital_data) {
      return (
        <Alert
          message="Orbital Data Unavailable"
          description="Detailed orbital data is not available for this asteroid from NASA."
          type="info"
          showIcon
        />
      );
    }

    const orbit = neoDetail.orbital_data;
    
    return (
      <Row gutter={[12, 12]}>
        <Col xs={24}>
          <Card size="small" title={<span style={{ fontSize: '14px' }}>Orbital Elements</span>} style={{ borderRadius: 8 }}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Descriptions column={1} size="small" colon={false}>
                  <Descriptions.Item label="Orbit ID">{orbit.orbit_id}</Descriptions.Item>
                  <Descriptions.Item label="Orbit Uncertainty">
                    <Tag color={parseInt(orbit.orbit_uncertainty) < 5 ? "green" : "orange"} style={{ fontSize: '11px', padding: '2px 6px' }}>
                      {orbit.orbit_uncertainty} (0=best)
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="MOID">{orbit.minimum_orbit_intersection} AU</Descriptions.Item>
                  <Descriptions.Item label="Observations">{orbit.observations_used}</Descriptions.Item>
                </Descriptions>
              </Col>
              <Col xs={24} sm={12}>
                <Descriptions column={1} size="small" colon={false}>
                  <Descriptions.Item label="Data Arc">{orbit.data_arc_in_days} days</Descriptions.Item>
                  <Descriptions.Item label="First Obs">{orbit.first_observation_date}</Descriptions.Item>
                  <Descriptions.Item label="Last Obs">{orbit.last_observation_date}</Descriptions.Item>
                  <Descriptions.Item label="Determined">{orbit.orbit_determination_date}</Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} sm={12}>
          <Card size="small" title={<span style={{ fontSize: '14px' }}>Orbital Parameters</span>} style={{ borderRadius: 8, height: '100%' }}>
            <Descriptions column={1} size="small" colon={false}>
              <Descriptions.Item label="Semi-major Axis">
                {parseFloat(orbit.semi_major_axis).toFixed(4)} AU
              </Descriptions.Item>
              <Descriptions.Item label="Eccentricity">
                {parseFloat(orbit.eccentricity).toFixed(4)}
              </Descriptions.Item>
              <Descriptions.Item label="Inclination">
                {parseFloat(orbit.inclination).toFixed(2)}°
              </Descriptions.Item>
              <Descriptions.Item label="Orbital Period">
                {parseFloat(orbit.orbital_period).toFixed(1)} days
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} sm={12}>
          <Card size="small" title={<span style={{ fontSize: '14px' }}>Additional Parameters</span>} style={{ borderRadius: 8, height: '100%' }}>
            <Descriptions column={1} size="small" colon={false}>
              <Descriptions.Item label="Perihelion">{parseFloat(orbit.perihelion_distance).toFixed(4)} AU</Descriptions.Item>
              <Descriptions.Item label="Aphelion">{parseFloat(orbit.aphelion_distance).toFixed(4)} AU</Descriptions.Item>
              <Descriptions.Item label="Mean Motion">{parseFloat(orbit.mean_motion).toFixed(4)}°/day</Descriptions.Item>
              <Descriptions.Item label="TJ Invariant">{orbit.jupiter_tisserand_invariant}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card size="small" title={<span style={{ fontSize: '14px' }}>Orbit Information</span>} style={{ borderRadius: 8 }}>
            <div style={{
              height: 120,
              backgroundColor: '#fafafa',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #f0f0f0',
              marginBottom: '12px'
            }}>
              <Space direction="vertical" align="center" size={8}>
                <CompassOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Orbit ID: {orbit.orbit_id}
                </Text>
              </Space>
            </div>
            <Alert
              message={`Orbit Classification: ${parseInt(orbit.orbit_uncertainty) < 5 ? "Well-characterized" : "Moderately uncertain"}`}
              description={`MOID: ${orbit.minimum_orbit_intersection} AU | Observations: ${orbit.observations_used}`}
              type={parseInt(orbit.orbit_uncertainty) < 5 ? "success" : "warning"}
              showIcon
            />
          </Card>
        </Col>
      </Row>
    );
  };

  const renderHistoryTab = () => {
    if (!neoDetail?.orbital_data) {
      return (
        <Alert
          message="Limited History Data"
          description="Detailed observation history is not available for this asteroid."
          type="info"
          showIcon
        />
      );
    }

    const orbit = neoDetail.orbital_data;
    
    return (
      <Row gutter={[12, 12]}>
        <Col xs={24}>
          <Card size="small" title={<span style={{ fontSize: '14px' }}>Observation Timeline</span>} style={{ borderRadius: 8 }}>
            <Timeline
              mode="left"
              items={[
                {
                  color: 'green',
                  children: (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>
                        First Observation
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {orbit.first_observation_date}
                      </div>
                    </div>
                  ),
                },
                {
                  color: 'blue',
                  children: (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>
                        Last Observation
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {orbit.last_observation_date}
                      </div>
                    </div>
                  ),
                },
                {
                  color: 'orange',
                  children: (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>
                        Orbit Determination
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {orbit.orbit_determination_date}
                      </div>
                    </div>
                  ),
                },
                {
                  children: (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>
                        Data Arc
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {orbit.data_arc_in_days} days
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24}>
          <Card size="small" title={<span style={{ fontSize: '14px' }}>Close Approach History</span>} style={{ borderRadius: 8 }}>
            {neoDetail.close_approach_data && neoDetail.close_approach_data.length > 0 ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Descriptions column={2} size="small" colon={false}>
                  <Descriptions.Item label="Total Approaches">
                    <Tag color="blue" style={{ fontSize: '11px', padding: '2px 6px' }}>{neoDetail.close_approach_data.length}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Closest Approach">
                    {Math.min(...neoDetail.close_approach_data.map(a => parseFloat(a.miss_distance.kilometers))).toLocaleString()} km
                  </Descriptions.Item>
                </Descriptions>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  <strong>Date Range:</strong> {neoDetail.close_approach_data[0].close_approach_date} to {
                    neoDetail.close_approach_data[neoDetail.close_approach_data.length - 1].close_approach_date
                  }
                </div>
              </Space>
            ) : (
              <Alert
                message="No Close Approach History"
                description="NASA has no recorded close approach data for this asteroid."
                type="info"
                showIcon
              />
            )}
          </Card>
        </Col>
      </Row>
    );
  };

  if (loading && apiStatus === 'loading') {
    return (
      <div style={{ 
        padding: 16, 
        textAlign: 'center',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Spin size="large" />
        <Title level={5} style={{ marginTop: 12, marginBottom: 4 }}>
          Fetching NASA Data...
        </Title>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          Loading asteroid details from NASA API
        </Text>
      </div>
    );
  }

  if (error && apiStatus === 'error') {
    return (
      <div style={{ padding: 16 }}>
        <Alert
          message="NASA API Error"
          description={
            <div style={{ fontSize: '12px' }}>
              <Paragraph style={{ fontSize: '12px', marginBottom: 8 }}>
                Failed to load asteroid details. Possible issues:
              </Paragraph>
              <ul style={{ marginBottom: 8, paddingLeft: 16 }}>
                <li>NASA API rate limit exceeded</li>
                <li>Network connectivity problem</li>
                <li>Invalid asteroid ID: {id}</li>
                <li>NASA server maintenance</li>
              </ul>
            </div>
          }
          type="error"
          showIcon
          action={
            <Space>
              <Button size="small" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button size="small" type="primary" onClick={() => id && fetchNeoDetail(id)}>
                Retry
              </Button>
            </Space>
          }
        />
      </div>
    );
  }

  if (!neoDetail) {
    return (
      <div style={{ padding: 16 }}>
        <Alert
          message="No Asteroid Data"
          description="Unable to load asteroid details from NASA."
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => navigate(-1)}>
              Back to List
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ 
      padding: 16,
      height: 'calc(100vh - 100px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ marginBottom: 16, flexShrink: 0 }}>
        <Space style={{ marginBottom: 12 }} wrap>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
            size="small"
          >
            Back
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={() => id && fetchNeoDetail(id)}
            loading={loading}
            size="small"
          >
            Refresh
          </Button>
          <Tooltip title="Export NASA asteroid data">
            <Button 
              icon={<DownloadOutlined />}
              onClick={() => {
                try {
                  const dataStr = JSON.stringify(neoDetail, null, 2);
                  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataUri);
                  linkElement.setAttribute('download', `nasa_neo_${neoDetail.id}_${new Date().toISOString().split('T')[0]}.json`);
                  linkElement.click();
                  message.success("NASA asteroid data exported!");
                } catch (error) {
                  message.error("Failed to export data");
                }
              }}
              size="small"
            >
              Export
            </Button>
          </Tooltip>
          <Button 
            type="link"
            href={neoDetail.nasa_jpl_url}
            target="_blank"
            icon={<DatabaseOutlined />}
            size="small"
          >
            NASA JPL
          </Button>
        </Space>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 8
        }}>
          <div>
            <Title level={4} style={{ margin: 0, fontSize: '18px' }}>
              <RocketOutlined style={{ marginRight: 6, fontSize: '16px' }} />
              {neoDetail.name} ({neoDetail.designation})
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              NASA ID: {neoDetail.id} • Magnitude: {neoDetail.absolute_magnitude_h.toFixed(1)} H
            </Text>
          </div>
          <Space wrap>
            <Tag 
              color={neoDetail.is_potentially_hazardous_asteroid ? "red" : "green"} 
              icon={<WarningOutlined />}
              style={{ fontSize: '11px', padding: '2px 6px' }}
            >
              {neoDetail.is_potentially_hazardous_asteroid ? "HAZARDOUS" : "SAFE"}
            </Tag>
            {neoDetail.is_sentry_object && (
              <Tag color="orange" icon={<SafetyOutlined />} style={{ fontSize: '11px', padding: '2px 6px' }}>
                SENTRY
              </Tag>
            )}
            <Tag 
              color={getRiskLevel(calculateRiskScore()).color}
              style={{ fontSize: '11px', padding: '2px 6px' }}
            >
              {getRiskLevel(calculateRiskScore()).level} RISK
            </Tag>
          </Space>
        </div>
      </div>


      {apiStatus === 'success' && (
        <Alert
          message="NASA Data Loaded"
          description={`Data includes ${neoDetail.close_approach_data?.length || 0} close approaches`}
          type="success"
          showIcon
          style={{ marginBottom: 6, flexShrink: 0, fontSize: '12px' }}
        />
      )}

      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        paddingRight: 4,
      }}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          size="small"
          items={[
            {
              key: 'overview',
              label: (
                <span>
                  <InfoCircleOutlined />
                  <span style={{ marginLeft: 4 }}>Overview</span>
                </span>
              ),
              children: renderOverviewTab()
            },
            {
              key: 'orbit',
              label: (
                <span>
                  <GlobalOutlined />
                  <span style={{ marginLeft: 4 }}>Orbit</span>
                </span>
              ),
              children: renderOrbitTab()
            },
            {
              key: 'history',
              label: (
                <span>
                  <HistoryOutlined />
                  <span style={{ marginLeft: 4 }}>History</span>
                </span>
              ),
              children: renderHistoryTab()
            }
          ]}
        />
      </div>

      {/* Footer */}
  
    </div>
  );
};

export default NEO_Detail;