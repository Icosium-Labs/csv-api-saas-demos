// Mock API service simulating CSV Gateway API endpoints

export interface StudentRecord {
  id: number;
  student_id: string;
  hours_studied: number;
  sleep_hours: number;
  attendance_percent: number;
  previous_scores: number;
  exam_score: number;
}

export interface PaginatedResponse {
  data: StudentRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AggregationResult {
  field: string;
  avg?: number;
  min?: number;
  max?: number;
  sum?: number;
  count?: number;
}

class CSVGatewayAPI {
  private baseUrl = '<Your API BASE URL>'; // Replace with your actual CSV Gateway API base URL

  // GET /api/data - List all records with pagination
  async getRecords(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: keyof StudentRecord;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<PaginatedResponse> {
    const url = new URL(`${this.baseUrl}/records`);
    
    // Add query parameters
    if (params.page) {
      url.searchParams.append('page', params.page.toString());
    }
    if (params.pageSize) {
      url.searchParams.append('limit', params.pageSize.toString());
    }
    if (params.sortBy) {
      const sortValue = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;
      url.searchParams.append('sort', sortValue);
    }
    if (params.search) {
      url.searchParams.append('q', params.search);
    }

    const response = await fetch(url.toString());
    const result = await response.json();
    
    // Transform API response to match our interface
    // API returns: { success: true, data: { items: [...], pagination: {...} } }
    const items = result.data?.items || result.data || result;
    const pagination = result.data?.pagination || {};
    
    return {
      data: items,
      total: pagination.total || items.length,
      page: pagination.page || params.page || 1,
      pageSize: pagination.limit || params.pageSize || 10,
      totalPages: pagination.total_pages || Math.ceil((pagination.total || items.length) / (pagination.limit || params.pageSize || 10)),
    };
  }

  // GET /api/data/:id - Get single record
  async getRecord(id: string): Promise<StudentRecord | null> {
    const response = await fetch(`${this.baseUrl}/records/${id}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  }

  // GET /api/aggregate - Aggregate data
  async aggregate(params: {
    field: keyof StudentRecord;
    operations?: ('avg' | 'min' | 'max' | 'sum' | 'count')[];
    groupBy?: keyof StudentRecord;
  }): Promise<AggregationResult> {
    const operations = params.operations || ['avg', 'min', 'max', 'count'];
    const url = new URL(`${this.baseUrl}/aggregate`);
    
    // Add query parameters
    url.searchParams.append('field', params.field);
    operations.forEach(op => {
      url.searchParams.append('function', op);
    });
    if (params.groupBy) {
      url.searchParams.append('groupBy', params.groupBy);
    }

    console.log('Aggregation API URL:', url.toString());

    const response = await fetch(url.toString());
    const result = await response.json();
    console.log('Aggregation API result:', result);

    // Transform API response to match our interface
    const aggregationResult: AggregationResult = { field: params.field };
    
    if (result.avg !== undefined) aggregationResult.avg = result.avg;
    if (result.min !== undefined) aggregationResult.min = result.min;
    if (result.max !== undefined) aggregationResult.max = result.max;
    if (result.sum !== undefined) aggregationResult.sum = result.sum;
    if (result.count !== undefined) aggregationResult.count = result.count;

    return aggregationResult;
  }

  // GET /api/search - Search records
  async search(query: string, page?: number, limit?: number): Promise<PaginatedResponse> {
    const url = new URL(`${this.baseUrl}/search`);
    url.searchParams.append('q', query);
    
    // Only add page and limit if provided
    if (page !== undefined) {
      url.searchParams.append('page', page.toString());
    }
    if (limit !== undefined) {
      url.searchParams.append('limit', limit.toString());
    }
    
    console.log('Search API URL:', url.toString());
    const response = await fetch(url.toString());
    const result = await response.json();

    console.log('Search API result:', result);
    // Transform API response to match our interface
    // API returns: { success: true, data: { items: [...], pagination: {...} } }
    const items = result.data?.items || result.data || result;
    const pagination = result.data?.pagination || {};
    
    return {
      data: items,
      total: pagination.total || items.length,
      page: pagination.page || page || 1,
      pageSize: pagination.limit || limit || 10,
      totalPages: pagination.total_pages || Math.ceil((pagination.total || items.length) / (pagination.limit || limit || 10)),
    };
  }

  // Custom: Get all data for charts
  async getAllData(): Promise<StudentRecord[]> {
    const response = await fetch(`${this.baseUrl}/records`);
    const result = await response.json();
    
    return Array.isArray(result) ? result : result.data.items || [];
  }

  // POST /api/data - Create new record
  async createRecord(record: Omit<StudentRecord, 'student_id'>): Promise<StudentRecord> {
    // Generate new student ID
    const newId = `S${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const newRecord: StudentRecord = {
      student_id: newId,
      ...record,
    };
    console.log('Creating record via API:', JSON.stringify(newRecord));
    const response = await fetch(`${this.baseUrl}/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRecord),
    });
    console.log('Create record API response status:', response.status);
    if (!response.ok) {
      throw new Error(`Failed to create record: ${response.statusText}`);
    }

    // Handle the API response structure similar to other methods
    const result = await response.json();
    console.log('Create record API result:', result);
    
    // Return the created record (could be from result.data or just result)
    return result.data || result || newRecord;
  }

  // PUT /api/data/:id - Update existing record
  async updateRecord(id: string, updates: Partial<StudentRecord>): Promise<StudentRecord | null> {
    // First get the existing record to merge with updates
    const existingRecord = await this.getRecord(id);
    if (!existingRecord) return null;

    const updatedRecord = { ...existingRecord, ...updates };

    const response = await fetch(`${this.baseUrl}/records/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedRecord),
    });

    if (!response.ok) {
      return null;
    }

    return updatedRecord;
  }

  // DELETE /api/data/:id - Delete record
  async deleteRecord(id: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/records/${id}`, {
      method: 'DELETE',
    });

    return response.ok;
  }

  // Custom: Get aggregated data for charts
  async getChartData(): Promise<{
    scoreVsAttendance: { attendance: number; score: number }[];
    avgScoreByStudyAndSleep: { hoursStudied: number; hoursSleep: number; avgScore: number }[];
  }> {
    const data = await this.getAllData();
    console.log('Fetched data for charts:', data);
    // Chart 1: Score vs Attendance (all data points)
    const scoreVsAttendance = data.map(r => ({
      attendance: r.attendance_percent,
      score: r.exam_score,
    }));

    // Chart 2: Average score by hours studied and hours slept (grouped)
    const groupedData = new Map<string, { totalScore: number; count: number }>();
    
    data.forEach(r => {
      const studyBucket = Math.floor(r.hours_studied);
      const sleepBucket = Math.floor(r.sleep_hours);
      const key = `${studyBucket}-${sleepBucket}`;
      
      if (!groupedData.has(key)) {
        groupedData.set(key, { totalScore: 0, count: 0 });
      }
      
      const group = groupedData.get(key)!;
      group.totalScore += r.exam_score;
      group.count += 1;
    });

    const avgScoreByStudyAndSleep = Array.from(groupedData.entries()).map(([key, value]) => {
      const [study, sleep] = key.split('-').map(Number);
      return {
        hoursStudied: study,
        hoursSleep: sleep,
        avgScore: value.totalScore / value.count,
      };
    });

    return {
      scoreVsAttendance,
      avgScoreByStudyAndSleep,
    };
  }
}

export const api = new CSVGatewayAPI();

