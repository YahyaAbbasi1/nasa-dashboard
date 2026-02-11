// services/nasaApi.ts
const NASA_API_KEY = 'K0FAIDP04XwD9stoAJi4Z1JZtd5gutbbf87bvf16';
const NEO_BASE_URL = 'https://api.nasa.gov/neo/rest/v1';

export interface NEOObject {
  id: string;
  name: string;
  designation: string;
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
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  orbiting_body: string;
}

export interface FeedResponse {
  element_count: number;
  near_earth_objects: {
    [date: string]: NEOObject[];
  };
}

export interface NEOWSDashboardData {
  totalObjects: number;
  hazardousObjects: number;
  closestApproach: number;
  highestVelocity: number;
  riskScore: number;
  objectsToday: NEOObject[];
  dailyCounts: { date: string; count: number }[];
  avgMissDistanceTrend: { date: string; avgDistance: number }[];
  hazardousRatio: number;
}

// Helper function to format dates in YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper function to add days to a date
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const nasaApi = {
  // Test NASA API connectivity
  testConnection: async (): Promise<{ success: boolean; data?: FeedResponse; error?: string }> => {
    try {
      const today = new Date();
      const startDate = formatDate(today);
      const endDate = formatDate(addDays(today, 1)); // Test with 2 days range
      
      const url = `${NEO_BASE_URL}/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`;
      
      console.log('Testing NASA API connection...', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('NASA API Test Failed:', response.status, errorText);
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }
      
      const data = await response.json();
      console.log('NASA API Test Success:', data.element_count, 'objects found');
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('NASA API Test Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Get NEO feed for date range (MAX 7 DAYS)
  getNEOFeed: async (startDate: string, endDate: string): Promise<FeedResponse> => {
    try {
      // Validate date range doesn't exceed 7 days
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays > 7) {
        console.warn(`Date range exceeds 7 days (${diffDays} days). Adjusting to last 7 days.`);
        // Adjust to last 7 days
        const adjustedEndDate = formatDate(end);
        const adjustedStartDate = formatDate(addDays(end, -7));
        
        console.log(`Adjusted range: ${adjustedStartDate} to ${adjustedEndDate}`);
        
        const url = `${NEO_BASE_URL}/feed?start_date=${adjustedStartDate}&end_date=${adjustedEndDate}&api_key=${NASA_API_KEY}`;
        console.log('Fetching NASA NEO data (adjusted):', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('NASA API Error:', response.status, errorText);
          throw new Error(`NASA API Error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('NASA API Success (adjusted):', data.element_count, 'objects retrieved');
        return data;
      }
      
      const url = `${NEO_BASE_URL}/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`;
      console.log('Fetching NASA NEO data:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('NASA API Error:', response.status, errorText);
        throw new Error(`NASA API Error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('NASA API Success:', data.element_count, 'objects retrieved');
      return data;
    } catch (error) {
      console.error('NEO Feed Error:', error);
      // Return mock data for development
      console.log('Using mock data as fallback');
      return {
        element_count: 84,
        near_earth_objects: {
          [startDate]: mockNEOData,
          [endDate]: mockNEOData.slice(0, 3)
        }
      };
    }
  },

  // Get NEO by ID
// In nasaApi.ts
getNEOById: async (id: string): Promise<any> => {
  try {
    // USE YOUR ACTUAL API KEY HERE
    const NASA_API_KEY = 'PQMMFeO1HxPBEeQjSkmEPLlrKAgHnTm2QX9cWpW8';
    const url = `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${NASA_API_KEY}`;
    
    console.log('🔗 NASA API URL:', url);
    
    const response = await fetch(url);
    
    console.log('📡 NASA API Response Status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ NASA API Error:', response.status, errorText);
      throw new Error(`NASA API Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ NASA API Success - Data keys:', Object.keys(data));
    return data;
    
  } catch (error) {
    console.error('💥 NASA NEO Detail Fetch Error:', error);
    // Throw the error so the component can catch it
    throw error;
  }
},
  // Get dashboard data
  getDashboardData: async (): Promise<NEOWSDashboardData> => {
    try {
      // Get data for last 7 days (maximum allowed by NASA)
      const today = new Date();
      const endDate = formatDate(today);
      const startDate = formatDate(addDays(today, -7));
      
      console.log(`Fetching NASA dashboard data from ${startDate} to ${endDate} (7 days max)`);
      
      const feed = await nasaApi.getNEOFeed(startDate, endDate);
      
      // Process data
      const allObjects = Object.values(feed.near_earth_objects).flat();
      const todayStr = formatDate(today);
      const objectsToday = feed.near_earth_objects[todayStr] || [];
      
      console.log(`Processed: ${allObjects.length} total objects, ${objectsToday.length} today`);
      
      // Calculate metrics
      const hazardousObjects = allObjects.filter(obj => obj.is_potentially_hazardous_asteroid).length;
      
      const closestApproach = allObjects.length > 0 ? 
        Math.min(...allObjects.map(obj => parseFloat(obj.miss_distance.kilometers))) : 0;
      
      const highestVelocity = allObjects.length > 0 ? 
        Math.max(...allObjects.map(obj => parseFloat(obj.relative_velocity.kilometers_per_second))) : 0;
      
      // Calculate risk scores for today's objects
      let totalRiskScore = 0;
      objectsToday.forEach(obj => {
        const avgDiameter = (obj.estimated_diameter.meters.estimated_diameter_min + 
                           obj.estimated_diameter.meters.estimated_diameter_max) / 2;
        const velocity = parseFloat(obj.relative_velocity.kilometers_per_second);
        const missDistance = parseFloat(obj.miss_distance.kilometers);
        const riskScore = (avgDiameter * velocity) / (missDistance || 1);
        totalRiskScore += riskScore;
      });
      
      const avgRiskScore = objectsToday.length > 0 ? totalRiskScore / objectsToday.length : 0;
      
      // Daily counts
      const dailyCounts = Object.entries(feed.near_earth_objects)
        .map(([date, objects]) => ({
          date,
          count: objects.length
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
      
      // Average miss distance trend
      const avgMissDistanceTrend = Object.entries(feed.near_earth_objects)
        .map(([date, objects]) => {
          const avgDistance = objects.length > 0 ?
            objects.reduce((sum, obj) => sum + parseFloat(obj.miss_distance.kilometers), 0) / objects.length : 0;
          return { date, avgDistance };
        })
        .sort((a, b) => a.date.localeCompare(b.date));
      
      // Hazardous ratio
      const hazardousRatio = allObjects.length > 0 ? 
        (hazardousObjects / allObjects.length) * 100 : 0;
      
      return {
        totalObjects: allObjects.length,
        hazardousObjects,
        closestApproach: isFinite(closestApproach) ? closestApproach : 0,
        highestVelocity: isFinite(highestVelocity) ? highestVelocity : 0,
        riskScore: avgRiskScore,
        objectsToday,
        dailyCounts,
        avgMissDistanceTrend,
        hazardousRatio
      };
    } catch (error) {
      console.error('Dashboard Data Error:', error);
      // Return mock dashboard data
      return {
        totalObjects: 245,
        hazardousObjects: 12,
        closestApproach: 1200000,
        highestVelocity: 25.8,
        riskScore: 42.5,
        objectsToday: mockNEOData,
        dailyCounts: [
          { date: formatDate(addDays(new Date(), -6)), count: 15 },
          { date: formatDate(addDays(new Date(), -5)), count: 22 },
          { date: formatDate(addDays(new Date(), -4)), count: 18 },
          { date: formatDate(addDays(new Date(), -3)), count: 25 },
          { date: formatDate(addDays(new Date(), -2)), count: 20 },
          { date: formatDate(addDays(new Date(), -1)), count: 28 },
          { date: formatDate(new Date()), count: 32 },
        ],
        avgMissDistanceTrend: [
          { date: formatDate(addDays(new Date(), -6)), avgDistance: 5500000 },
          { date: formatDate(addDays(new Date(), -5)), avgDistance: 4800000 },
          { date: formatDate(addDays(new Date(), -4)), avgDistance: 6200000 },
          { date: formatDate(addDays(new Date(), -3)), avgDistance: 3900000 },
          { date: formatDate(addDays(new Date(), -2)), avgDistance: 7100000 },
          { date: formatDate(addDays(new Date(), -1)), avgDistance: 4500000 },
          { date: formatDate(new Date()), avgDistance: 5200000 },
        ],
        hazardousRatio: 4.9
      };
    }
  },

  // Get upcoming approaches (next 7 days - MAX ALLOWED)
  getUpcomingApproaches: async (): Promise<NEOObject[]> => {
    try {
      const today = new Date();
      const startDate = formatDate(today);
      const endDate = formatDate(addDays(today, 7)); // NASA allows max 7 days
      
      console.log(`Fetching upcoming approaches from ${startDate} to ${endDate}`);
      
      const feed = await nasaApi.getNEOFeed(startDate, endDate);
      return Object.values(feed.near_earth_objects).flat();
    } catch (error) {
      console.error('Upcoming Approaches Error:', error);
      return mockNEOData;
    }
  },

  // Get historical approaches - Since NASA only allows 7 days, we'll get last 7 days
  getHistoricalApproaches: async (): Promise<NEOObject[]> => {
    try {
      const today = new Date();
      const endDate = formatDate(today);
      const startDate = formatDate(addDays(today, -7)); // Only last 7 days allowed
      
      console.log(`Fetching historical approaches from ${startDate} to ${endDate} (7 days max)`);
      
      const feed = await nasaApi.getNEOFeed(startDate, endDate);
      return Object.values(feed.near_earth_objects).flat();
    } catch (error) {
      console.error('Historical Approaches Error:', error);
      return [...mockNEOData, ...mockNEOData.slice(0, 3)];
    }
  }
};

// Mock data for fallback
const mockNEOData: NEOObject[] = [
  {
    id: '54016461',
    name: '(2020 YR3)',
    designation: '2020 YR3',
    close_approach_date: formatDate(new Date()),
    close_approach_date_full: '2024-Feb-08 14:22',
    epoch_date_close_approach: 1705414920000,
    relative_velocity: {
      kilometers_per_second: '13.17',
      kilometers_per_hour: '47412.0',
      miles_per_hour: '29456.0'
    },
    miss_distance: {
      astronomical: '0.204',
      lunar: '79.36',
      kilometers: '30518125.0',
      miles: '18963091.25'
    },
    estimated_diameter: {
      kilometers: {
        estimated_diameter_min: 0.15,
        estimated_diameter_max: 0.34
      },
      meters: {
        estimated_diameter_min: 150,
        estimated_diameter_max: 340
      }
    },
    is_potentially_hazardous_asteroid: false,
    orbiting_body: 'Earth'
  },
  {
    id: '54019406',
    name: '(2024 AC1)',
    designation: '2024 AC1',
    close_approach_date: formatDate(new Date()),
    close_approach_date_full: '2024-Feb-08 15:44',
    epoch_date_close_approach: 1705419840000,
    relative_velocity: {
      kilometers_per_second: '8.44',
      kilometers_per_hour: '30384.0',
      miles_per_hour: '18880.0'
    },
    miss_distance: {
      astronomical: '0.199',
      lunar: '77.41',
      kilometers: '29773906.25',
      miles: '18500750.0'
    },
    estimated_diameter: {
      kilometers: {
        estimated_diameter_min: 0.08,
        estimated_diameter_max: 0.18
      },
      meters: {
        estimated_diameter_min: 80,
        estimated_diameter_max: 180
      }
    },
    is_potentially_hazardous_asteroid: false,
    orbiting_body: 'Earth'
  },
  {
    id: '54016462',
    name: '(2021 AB1)',
    designation: '2021 AB1',
    close_approach_date: formatDate(addDays(new Date(), 1)),
    close_approach_date_full: '2024-Feb-09 10:30',
    epoch_date_close_approach: 1705414920000,
    relative_velocity: {
      kilometers_per_second: '25.8',
      kilometers_per_hour: '92880.0',
      miles_per_hour: '57700.0'
    },
    miss_distance: {
      astronomical: '0.089',
      lunar: '34.62',
      kilometers: '13313500.0',
      miles: '8272600.0'
    },
    estimated_diameter: {
      kilometers: {
        estimated_diameter_min: 0.45,
        estimated_diameter_max: 1.01
      },
      meters: {
        estimated_diameter_min: 450,
        estimated_diameter_max: 1010
      }
    },
    is_potentially_hazardous_asteroid: true,
    orbiting_body: 'Earth'
  }
];