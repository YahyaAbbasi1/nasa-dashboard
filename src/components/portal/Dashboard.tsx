// components/NASA/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Tag, 
  Button, 
  Typography, 
  Space, 
  Tooltip,
  Alert,
  message,
  Empty,
  Spin,
  Grid,
  Progress,
  Badge
} from 'antd';
import { 
  RadarChartOutlined, 
  WarningOutlined, 
  RocketOutlined, 
  CloseCircleOutlined,
  ReloadOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  LineChartOutlined,
  FireOutlined,
  GlobalOutlined,
  AlertOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';

import { nasaApi, NEOWSDashboardData } from 'components/App/Services/nasaApi';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// Custom color palette for NASA theme
const NASA_COLORS = {
  primary: '#0B3D91',
  secondary: '#FC3D21',
  accent: '#1E6DE8',
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  textPrimary: '#1A1A1A',
  textSecondary: '#666666'
};

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<NEOWSDashboardData | null>(null);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [apiStatus, setApiStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const screens = useBreakpoint();

  const loadData = async () => {
    setLoading(true);
    try {
      // First test API connection
      const connectionTest = await nasaApi.testConnection();
      
      if (!connectionTest.success) {
        setApiStatus('disconnected');
        message.warning('NASA API connection failed. Using mock data.');
      } else {
        setApiStatus('connected');
      }
      
      // Load dashboard data (will use real API or fallback to mock)
      const dashboard = await nasaApi.getDashboardData();
      
      setDashboardData(dashboard);
      setLastSync(new Date());
      
      if (apiStatus === 'connected') {
        message.success(`Real NASA data loaded: ${dashboard.totalObjects} NEOs tracked`);
      } else {
        message.info(`Using mock data: ${dashboard.totalObjects} simulated NEOs`);
      }
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      message.error('Failed to load dashboard data');
      setApiStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 10 minutes for real data, 30 seconds for mock
    const interval = apiStatus === 'connected' 
      ? setInterval(loadData, 10 * 60 * 1000) // 10 minutes for real data
      : setInterval(loadData, 30 * 1000); // 30 seconds for mock data
    
    return () => {
      clearInterval(interval);
    };
  }, [apiStatus]);

  const getApiStatusTag = () => {
    switch (apiStatus) {
      case 'connected':
        return (
          <Badge 
            status="success" 
            text={
              <span style={{ color: NASA_COLORS.success, fontWeight: 600 }}>
                <DatabaseOutlined /> Live Data
              </span>
            } 
          />
        );
      case 'disconnected':
        return (
          <Badge 
            status="warning" 
            text={
              <span style={{ color: NASA_COLORS.warning }}>
                <DatabaseOutlined /> Mock Data
              </span>
            } 
          />
        );
      default:
        return <Tag color="default" icon={<DatabaseOutlined />}>Connecting...</Tag>;
    }
  };

  // Enhanced sparkline chart for daily counts
  const renderDailyChart = (dailyCounts: { date: string; count: number }[]) => {
    if (!dailyCounts || dailyCounts.length === 0) {
      return (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description="No data available" 
          style={{ padding: '20px 0' }}
        />
      );
    }
    
    // Take only last 7 days
    const recentData = dailyCounts.slice(-7);
    const maxCount = Math.max(...recentData.map(d => d.count));
    const minCount = Math.min(...recentData.map(d => d.count));
    const average = recentData.reduce((sum, d) => sum + d.count, 0) / recentData.length;
    const todayCount = recentData[recentData.length - 1]?.count || 0;
    const trend = todayCount > average ? 'up' : 'down';
    
    return (
      <div style={{ padding: '8px 0' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <Text strong style={{ fontSize: '14px' }}>
            Today: <span style={{ color: NASA_COLORS.primary }}>{todayCount}</span>
          </Text>
          <Tag color={trend === 'up' ? 'red' : 'blue'} style={{ margin: 0 }}>
            {trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {Math.abs(((todayCount - average) / average) * 100).toFixed(1)}%
          </Tag>
        </div>
        
        <div style={{ 
          display: 'flex', 
          height: '80px', 
          alignItems: 'flex-end', 
          gap: 6,
          justifyContent: 'space-between'
        }}>
          {recentData.map((item, index) => {
            const heightPercentage = maxCount > 0 ? (item.count / maxCount) * 60 : 0;
            const isToday = item.date === new Date().toISOString().split('T')[0];
            const isAboveAverage = item.count > average;
            
            return (
              <Tooltip 
                key={index} 
                title={`${item.date}: ${item.count} objects`}
                placement="top"
              >
                <div 
                  style={{ 
                    flex: 1,
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    height: '100%'
                  }}
                >
                  <div style={{ 
                    fontSize: 10, 
                    marginBottom: 4,
                    color: isToday ? NASA_COLORS.primary : NASA_COLORS.textSecondary,
                    fontWeight: isToday ? 600 : 'normal',
                    textAlign: 'center'
                  }}>
                    {new Date(item.date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                  </div>
                  <div 
                    style={{ 
                      width: '100%',
                      height: `${heightPercentage}px`,
                      background: isToday 
                        ? `linear-gradient(to top, ${NASA_COLORS.secondary}, ${NASA_COLORS.accent})`
                        : isAboveAverage 
                          ? `linear-gradient(to top, #ff7a45, #ffa940)`
                          : `linear-gradient(to top, #73d13d, #95de64)`,
                      borderRadius: '4px 4px 0 0',
                      minHeight: '4px',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                  >
                    {isToday && (
                      <div style={{
                        position: 'absolute',
                        top: -20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: 10,
                        fontWeight: 600,
                        color: NASA_COLORS.primary
                      }}>
                        {item.count}
                      </div>
                    )}
                  </div>
                </div>
              </Tooltip>
            );
          })}
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: 8,
          fontSize: 11,
          color: NASA_COLORS.textSecondary
        }}>
          <span>Min: {minCount}</span>
          <span>Avg: {average.toFixed(0)}</span>
          <span>Max: {maxCount}</span>
        </div>
      </div>
    );
  };

  // Enhanced distance trend with gauge
  const renderDistanceTrend = (trendData: { date: string; avgDistance: number }[]) => {
    if (!trendData || trendData.length === 0) {
      return (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description="No trend data" 
          style={{ padding: '20px 0' }}
        />
      );
    }
    
    const recentData = trendData.slice(-7);
    const latestDistance = recentData[recentData.length - 1]?.avgDistance || 0;
    const normalizedDistance = latestDistance / 1000000;
    const safetyLevel = normalizedDistance < 2 ? 'CRITICAL' : normalizedDistance < 5 ? 'WARNING' : 'SAFE';
    
    return (
      <div style={{ padding: '8px 0' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <Text strong style={{ fontSize: '14px' }}>
            Current: <span style={{ 
              color: safetyLevel === 'CRITICAL' ? NASA_COLORS.error : 
                     safetyLevel === 'WARNING' ? NASA_COLORS.warning : NASA_COLORS.success
            }}>
              {normalizedDistance.toFixed(1)}M km
            </span>
          </Text>
          <Tag 
            color={
              safetyLevel === 'CRITICAL' ? 'red' : 
              safetyLevel === 'WARNING' ? 'orange' : 'green'
            }
            style={{ margin: 0, fontSize: '10px', fontWeight: 600 }}
          >
            {safetyLevel}
          </Tag>
        </div>
        
        <Progress
          percent={Math.min((normalizedDistance / 10) * 100, 100)}
          strokeColor={
            safetyLevel === 'CRITICAL' ? NASA_COLORS.error :
            safetyLevel === 'WARNING' ? NASA_COLORS.warning : NASA_COLORS.success
          }
          trailColor="#f0f0f0"
          size="small"
          showInfo={false}
          style={{ marginBottom: 16 }}
        />
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: 11,
          color: NASA_COLORS.textSecondary
        }}>
          <span>Close ({'<2M km'})</span>
          <span>Normal (2-5M km)</span>
          <span>Safe ({'>5M km'})</span>
        </div>
      </div>
    );
  };

  // Get critical alerts
  const getCriticalAlerts = () => {
    const alerts = [];
    
    if (dashboardData) {
      const today = new Date().toISOString().split('T')[0];
      const todayObjects = dashboardData.objectsToday || [];
      
      // Alert for hazardous ratio > 5%
      const hazardousRatio = dashboardData.hazardousRatio || 0;
      if (hazardousRatio > 5) {
        alerts.push({
          type: 'warning' as const,
          message: `Elevated Hazard Level: ${hazardousRatio.toFixed(1)}%`,
          description: `${dashboardData.hazardousObjects} potentially hazardous objects detected`,
          icon: <AlertOutlined />
        });
      }
      
      // Alert if any close approaches today (< 1M km)
      const closeApproaches = todayObjects.filter(obj => 
        parseFloat(obj.miss_distance.kilometers) < 1000000
      );
      
      if (closeApproaches.length > 0) {
        alerts.push({
          type: 'error' as const,
          message: `Close Approaches Today: ${closeApproaches.length} object(s)`,
          description: `Closest approach: ${(parseFloat(closeApproaches[0].miss_distance.kilometers) / 1000000).toFixed(2)}M km`,
          icon: <CloseCircleOutlined />
        });
      }
      
      // Alert for high velocity objects (> 20 km/s)
      const highVelocityObjects = todayObjects.filter(obj => 
        parseFloat(obj.relative_velocity.kilometers_per_second) > 20
      );
      
      if (highVelocityObjects.length > 0) {
        alerts.push({
          type: 'warning' as const,
          message: `High Velocity Objects: ${highVelocityObjects.length}`,
          description: `Fastest: ${parseFloat(highVelocityObjects[0].relative_velocity.kilometers_per_second).toFixed(1)} km/s`,
          icon: <ThunderboltOutlined />
        });
      }
    }
    
    // Alert if API is disconnected
    if (apiStatus === 'disconnected') {
      alerts.push({
        type: 'warning' as const,
        message: 'NASA API Not Connected',
        description: 'Displaying simulated data. No live updates from NASA.',
        icon: <DatabaseOutlined />
      });
    }
    
    return alerts;
  };

  const criticalAlerts = getCriticalAlerts();

  return (
    <div style={{ 
      padding: screens.xs ? 12 : 24
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: screens.xs ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: screens.xs ? 'flex-start' : 'center',
        marginBottom: 24,
        gap: screens.xs ? 16 : 0
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              background: `linear-gradient(135deg, ${NASA_COLORS.primary}, ${NASA_COLORS.accent})`,
              width: 40,
              height: 40,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
          
            }}>
              <RocketOutlined style={{ fontSize: 20 }} />
            </div>
            <div>
              <Title level={2} style={{ 
                margin: 0, 
                fontSize: screens.xs ? '20px' : '24px',
                background: `linear-gradient(135deg, ${NASA_COLORS.primary}, ${NASA_COLORS.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700
              }}>
                NEO Monitoring Dashboard
              </Title>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                Real-time tracking of Near-Earth Objects
              </Text>
            </div>
          </div>
        </div>
        
        <Space direction={screens.xs ? 'horizontal' : 'vertical'} align={screens.xs ? 'center' : 'end'} size="middle">
          <div>
            <Text type="secondary" style={{ fontSize: '11px' }}>
              Last updated
            </Text>
            <Text strong style={{ fontSize: '13px', display: 'block' }}>
              {lastSync.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </Text>
          </div>
          <Space>
            {getApiStatusTag()}
            <Tooltip title={apiStatus === 'connected' ? "Refresh NASA data" : "Refresh mock data"}>
              <Button 
                type="primary"
                icon={<ReloadOutlined />} 
                onClick={loadData}
                loading={loading}
                size="small"
                style={{
              

                  border: 'none'
                }}
              />
            </Tooltip>
          </Space>
        </Space>
      </div>

      {/* Critical Alerts - Compact */}
      {criticalAlerts.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Row gutter={[12, 12]}>
            {criticalAlerts.map((alert, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Alert
                  message={alert.message}
                  description={alert.description}
                  type={alert.type}
                  icon={alert.icon}
                  showIcon
                  style={{ 
                    borderRadius: 8,
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                />
              </Col>
            ))}
          </Row>
        </div>
      )}

      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px' 
        }}>
          <Spin size="large" tip="Loading NASA data..." />
        </div>
      ) : (
        <>
          {/* KPI Cards - Top Row */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card 
                hoverable 
                style={{ 
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                
                  height: '100%'
                }}
                bodyStyle={{ padding: 20 }}
              >
                <Statistic
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{
                        padding: 6,
                        borderRadius: 6
                      }}>
                        <RadarChartOutlined style={{ color: NASA_COLORS.primary }} />
                      </div>
                      <span>Total Objects</span>
                    </div>
                  }
                  value={dashboardData?.totalObjects || 0}
                  valueStyle={{ 
                    fontSize: '28px',
                    fontWeight: 700
                  }}
                  suffix={
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                      in 7 days
                    </Text>
                  }
                />
                <div style={{ 
                  marginTop: 12, 
                  paddingTop: 12, 
                
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Today: {dashboardData?.objectsToday?.length || 0}
                  </Text>
                  <Tag color="blue" style={{ margin: 0, fontSize: '11px' }}>
                    ACTIVE
                  </Tag>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} md={6}>
              <Card 
                hoverable 
                style={{ 
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
               
                  height: '100%'
                }}
                bodyStyle={{ padding: 20 }}
              >
                <Statistic
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{
                      
                        padding: 6,
                        borderRadius: 6
                      }}>
                        <WarningOutlined style={{ color: '#ff4d4f' }} />
                      </div>
                      <span>Hazardous</span>
                    </div>
                  }
                  value={dashboardData?.hazardousObjects || 0}
                  valueStyle={{ 
                    color: (dashboardData?.hazardousObjects || 0) > 0 ? '#ff4d4f' : '#52c41a',
                    fontSize: '28px',
                    fontWeight: 700
                  }}
                />
                <div style={{ 
                  marginTop: 12, 
                  paddingTop: 12, 
                  borderTop: '1px solid #f0f0f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {(dashboardData?.hazardousRatio || 0).toFixed(1)}% of total
                  </Text>
                  <Progress 
                    percent={dashboardData?.hazardousRatio || 0} 
                    size="small" 
                    showInfo={false}
                    strokeColor="#ff4d4f"
                    trailColor="#f0f0f0"
                    style={{ width: 60 }}
                  />
                </div>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} md={6}>
              <Card 
                hoverable 
                style={{ 
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              
                  height: '100%'
                }}
                bodyStyle={{ padding: 20 }}
              >
                <Statistic
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{
                    
                        padding: 6,
                        borderRadius: 6
                      }}>
                        <CloseCircleOutlined style={{ color: '#faad14' }} />
                      </div>
                      <span>Closest Approach</span>
                    </div>
                  }
                  value={dashboardData?.closestApproach ? (dashboardData.closestApproach / 1000000).toFixed(2) : 0}
                  suffix={
                    <Text style={{ fontSize: '14px', color: NASA_COLORS.textSecondary }}>
                      M km
                    </Text>
                  }
                  valueStyle={{ 
                    color: (dashboardData?.closestApproach || 0) < 2000000 ? '#faad14' : '#52c41a',
                    fontSize: '28px',
                    fontWeight: 700
                  }}
                />
                <div style={{ 
                  marginTop: 12, 
                  paddingTop: 12, 
                  borderTop: '1px solid #f0f0f0'
                }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Closest object approaching
                  </Text>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} md={6}>
              <Card 
                hoverable 
                style={{ 
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  height: '100%'
                }}
                bodyStyle={{ padding: 20 }}
              >
                <Statistic
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{
                        padding: 6,
                        borderRadius: 6
                      }}>
                        <ThunderboltOutlined style={{ color: '#722ed1' }} />
                      </div>
                      <span>Highest Velocity</span>
                    </div>
                  }
                  value={dashboardData?.highestVelocity ? dashboardData.highestVelocity.toFixed(1) : 0}
                  suffix={
                    <Text style={{ fontSize: '14px', color: NASA_COLORS.textSecondary }}>
                      km/s
                    </Text>
                  }
                  valueStyle={{ 
                    color: (dashboardData?.highestVelocity || 0) > 20 ? '#ff4d4f' : '#1890ff',
                    fontSize: '28px',
                    fontWeight: 700
                  }}
                />
                <div style={{ 
                  marginTop: 12, 
                  paddingTop: 12, 
                  borderTop: '1px solid #f0f0f0'
                }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Fastest object detected
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Charts and Today's Objects - Side by side on larger screens */}
          <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={16}>
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Card 
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <LineChartOutlined />
                        <span>Objects Per Day (Last 7 Days)</span>
                      </div>
                    }
                    style={{ 
                      borderRadius: 12,
                      border: 'none',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    
                      height: '100%'
                    }}
                    bodyStyle={{ padding: '16px 20px' }}
                  >
                    {renderDailyChart(dashboardData?.dailyCounts || [])}
                  </Card>
                </Col>
                
                <Col xs={24}>
                  <Card 
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <GlobalOutlined />
                        <span>Miss Distance Safety Level</span>
                      </div>
                    }
                    style={{ 
                      borderRadius: 12,
                      border: 'none',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                      height: '100%'
                    }}
                    bodyStyle={{ padding: '16px 20px' }}
                  >
                    {renderDistanceTrend(dashboardData?.avgMissDistanceTrend || [])}
                  </Card>
                </Col>
              </Row>
            </Col>
            
            <Col xs={24} lg={8}>
              <Card 
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FireOutlined />
                    <span>Today's Close Approaches</span>
                    <Tag color="blue" style={{ marginLeft: 'auto' }}>
                      {dashboardData?.objectsToday?.length || 0}
                    </Tag>
                  </div>
                }
                style={{ 
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  height: '100%'
                }}
                bodyStyle={{ padding: 0 }}
              >
                {dashboardData?.objectsToday && dashboardData.objectsToday.length > 0 ? (
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {dashboardData.objectsToday.slice(0, 10).map((obj, index) => (
                      <div
                        key={index}
                        style={{
                          padding: 16,
                        
                          transition: 'all 0.2s',
                          cursor: 'pointer'
                        }}
                      
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: 4 }}>
                              {obj.name}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>
                              {obj.designation}
                            </Text>
                          </div>
                          <Tag 
                            color={obj.is_potentially_hazardous_asteroid ? "red" : "green"}
                            style={{ fontSize: '10px', padding: '1px 6px', margin: 0 }}
                          >
                            {obj.is_potentially_hazardous_asteroid ? "HAZARD" : "SAFE"}
                          </Tag>
                        </div>
                        
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          marginTop: 12,
                          fontSize: '12px'
                        }}>
                          <div>
                            <div style={{ fontSize: '10px', color: NASA_COLORS.textSecondary }}>
                              Distance
                            </div>
                            <div style={{ fontWeight: 600 }}>
                              {(parseFloat(obj.miss_distance.kilometers) / 1000000).toFixed(2)}M km
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', color: NASA_COLORS.textSecondary }}>
                              Velocity
                            </div>
                            <div style={{ fontWeight: 600 }}>
                              {parseFloat(obj.relative_velocity.kilometers_per_second).toFixed(1)} km/s
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {dashboardData.objectsToday.length > 10 && (
                      <div style={{ 
                        padding: 16, 
                        textAlign: 'center',
                       
                      }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          +{dashboardData.objectsToday.length - 10} more objects
                        </Text>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ padding: 40, textAlign: 'center' }}>
                    <Empty 
                      image={Empty.PRESENTED_IMAGE_SIMPLE} 
                      description="No close approaches today"
                    />
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          {/* Footer */}
          <Alert
            message={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {apiStatus === 'connected' ? (
                  <>
                    <div style={{
                      background: '#52c41a',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite'
                    }} />
                    <span style={{ fontWeight: 600 }}>Connected to NASA NeoWS API</span>
                    <Tag color="success" style={{ marginLeft: 'auto' }}>LIVE</Tag>
                  </>
                ) : (
                  <>
                    <div style={{
                      background: '#faad14',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite'
                    }} />
                    <span style={{ fontWeight: 600 }}>Using Simulated NASA Data</span>
                    <Tag color="warning" style={{ marginLeft: 'auto' }}>OFFLINE</Tag>
                  </>
                )}
              </div>
            }
            description={
              <div style={{ fontSize: '12px', marginTop: 4 }}>
                {apiStatus === 'connected' ? (
                  <div>
                    Real-time near-Earth object tracking • Auto-refresh: 10 minutes • 
                    Data source:{' '}
                    <a 
                      href="https://api.nasa.gov" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: NASA_COLORS.primary }}
                    >
                      api.nasa.gov
                    </a>
                  </div>
                ) : (
                  <div>
                    Real NASA API:{' '}
                    <a 
                      href="https://api.nasa.gov/neo/rest/v1/feed" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: NASA_COLORS.primary }}
                    >
                      https://api.nasa.gov/neo/rest/v1/feed
                    </a>
                    {' '}• Using realistic simulation • Refresh to try reconnecting
                  </div>
                )}
              </div>
            }
            type={apiStatus === 'connected' ? 'success' : 'warning'}
            showIcon={false}
            style={{ 
              borderRadius: 8,
              border: 'none',
            }}
          />
        </>
      )}

      {/* Add pulse animation */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;