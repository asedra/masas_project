import { Pool } from 'pg';
import { CustomerDetails } from '@/types/customer';

// Database configuration
const dbConfig = {
  host: '10.255.101.4',
  port: 5432,
  database: 'masasdb',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

// Create a connection pool
const pool = new Pool(dbConfig);

// Test database connection
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT version()');
    client.release();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Get all customers with their related data
export async function getCustomersWithDetails(
  filters: {
    compatibility_score_min?: number;
    compatibility_score_max?: number;
    industry?: string[] | string;
    country?: string[] | string;
    detailed_score_min?: number;
    detailed_score_max?: number;
  } = {},
  sort: {
    field?: string;
    direction?: 'asc' | 'desc';
  } = {}
): Promise<CustomerDetails[]> {
  try {
    let query = `
      SELECT DISTINCT ON (c.id)
        c.id as customer_id,
        c.name,
        c.website,
        c.contact_email,
        c.facebook,
        c.twitter,
        c.linkedin,
        c.instagram,
        cc.id as classification_id,
        cc.has_metal_tin_clues,
        cc.compatible_with_masas_products,
        cc.compatibility_score,
        cc.should_send_intro_email,
        cc.description,
        cc.detailed_compatibility_score,
        d.id as dork_id,
        d.country_code,
        d.content as dork_content,
        d.is_analyzed,
        i.id as industry_id,
        i.industry,
        e.id as email_id,
        e.content as email_content,
        cs.status as status,
        cs.comment as status_comment
      FROM customers c
      LEFT JOIN customer_classifications cc ON c.id = cc.customer_id
      LEFT JOIN dorks d ON cc.dork_id = d.id
      LEFT JOIN industries i ON d.industry_id = i.id
      LEFT JOIN (
        SELECT DISTINCT ON (customer_id) 
          id, customer_id, content
        FROM email 
        ORDER BY customer_id, id DESC
      ) e ON c.id = e.customer_id
      LEFT JOIN (
        SELECT DISTINCT ON (customer_id)
          id, customer_id, status, comment, updated_at
        FROM customer_status
        ORDER BY customer_id, updated_at DESC
      ) cs ON c.id = cs.customer_id
      WHERE 1=1
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    // Apply filters
    if (filters.compatibility_score_min !== undefined && filters.compatibility_score_min !== null) {
      query += ` AND (cc.compatibility_score >= $${paramIndex} OR cc.compatibility_score IS NULL)`;
      queryParams.push(filters.compatibility_score_min);
      paramIndex++;
    }

    if (filters.compatibility_score_max !== undefined && filters.compatibility_score_max !== null) {
      query += ` AND (cc.compatibility_score <= $${paramIndex} OR cc.compatibility_score IS NULL)`;
      queryParams.push(filters.compatibility_score_max);
      paramIndex++;
    }

    if (filters.industry) {
      if (Array.isArray(filters.industry) && filters.industry.length > 0) {
        const placeholders = filters.industry.map(() => `$${paramIndex++}`).join(',');
        query += ` AND i.industry IN (${placeholders})`;
        queryParams.push(...filters.industry);
      } else if (typeof filters.industry === 'string') {
        query += ` AND i.industry = $${paramIndex}`;
        queryParams.push(filters.industry);
        paramIndex++;
      }
    }

    if (filters.country) {
      if (Array.isArray(filters.country) && filters.country.length > 0) {
        const placeholders = filters.country.map(() => `$${paramIndex++}`).join(',');
        query += ` AND d.country_code IN (${placeholders})`;
        queryParams.push(...filters.country);
      } else if (typeof filters.country === 'string') {
        query += ` AND d.country_code = $${paramIndex}`;
        queryParams.push(filters.country);
        paramIndex++;
      }
    }

    if (filters.detailed_score_min !== undefined && filters.detailed_score_min !== null) {
      query += ` AND (cc.detailed_compatibility_score >= $${paramIndex} OR cc.detailed_compatibility_score IS NULL)`;
      queryParams.push(filters.detailed_score_min);
      paramIndex++;
    }

    if (filters.detailed_score_max !== undefined && filters.detailed_score_max !== null) {
      query += ` AND (cc.detailed_compatibility_score <= $${paramIndex} OR cc.detailed_compatibility_score IS NULL)`;
      queryParams.push(filters.detailed_score_max);
      paramIndex++;
    }

    // Apply sorting
    const sortField = sort.field || 'c.name';
    const sortDirection = sort.direction || 'asc';
    query += ` ORDER BY c.id, cc.id DESC, ${sortField} ${sortDirection.toUpperCase()}`;

    const result = await pool.query(query, queryParams);

    // Transform the results to match our CustomerDetails interface
    const customers: CustomerDetails[] = result.rows.map(row => ({
      customer: {
        id: row.customer_id,
        name: row.name,
        website: row.website,
        contact_email: row.contact_email,
        facebook: row.facebook,
        twitter: row.twitter,
        linkedin: row.linkedin,
        instagram: row.instagram,
        status: row.status || null,
        status_comment: row.status_comment || null,
      },
      classification: row.classification_id ? {
        id: row.classification_id,
        customer_id: row.customer_id,
        dork_id: row.dork_id,
        has_metal_tin_clues: row.has_metal_tin_clues,
        compatible_with_masas_products: row.compatible_with_masas_products,
        compatibility_score: row.compatibility_score,
        should_send_intro_email: row.should_send_intro_email,
        description: row.description,
        detailed_compatibility_score: row.detailed_compatibility_score,
      } : null,
      dork: row.dork_id ? {
        id: row.dork_id,
        country_code: row.country_code,
        industry_id: row.industry_id,
        content: row.dork_content,
        is_analyzed: row.is_analyzed,
      } : null,
      industry: row.industry_id ? {
        id: row.industry_id,
        industry: row.industry,
      } : null,
      latest_email: row.email_id ? {
        id: row.email_id,
        customer_id: row.customer_id,
        content: row.email_content,
      } : null,
    }));

    return customers;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
}

// Get available industries
export async function getIndustries(): Promise<{ id: number; industry: string }[]> {
  try {
    const result = await pool.query('SELECT id, industry FROM industries ORDER BY industry');
    return result.rows;
  } catch (error) {
    console.error('Error fetching industries:', error);
    throw error;
  }
}

// Get available countries
export async function getCountries(): Promise<{ code: string; name: string }[]> {
  try {
    const result = await pool.query(`
      SELECT DISTINCT country_code as code, 
             CASE 
               WHEN country_code = 'US' THEN 'United States'
               WHEN country_code = 'CA' THEN 'Canada'
               WHEN country_code = 'GB' THEN 'United Kingdom'
               WHEN country_code = 'DE' THEN 'Germany'
               WHEN country_code = 'AU' THEN 'Australia'
               WHEN country_code = 'FR' THEN 'France'
               WHEN country_code = 'JP' THEN 'Japan'
               WHEN country_code = 'IN' THEN 'India'
               ELSE country_code
             END as name
      FROM dorks 
      WHERE country_code IS NOT NULL 
      ORDER BY name
    `);
    return result.rows;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
}

// Close the pool when the app shuts down
export async function closePool() {
  await pool.end();
}

export async function updateCustomerStatus(customer_id: number, status: string, comment?: string) {
  try {
    const now = new Date().toISOString();
    // Assuming you have a DB client instance named `db` (adjust as needed)
    await pool.query(
      `INSERT INTO customer_status (customer_id, status, comment, updated_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (customer_id) DO UPDATE
       SET status = EXCLUDED.status, comment = EXCLUDED.comment, updated_at = EXCLUDED.updated_at`,
      [customer_id, status, comment || null, now]
    );
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
} 