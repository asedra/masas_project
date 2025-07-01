import { NextRequest, NextResponse } from 'next/server';
import { getCustomersWithDetails, getIndustries, getCountries, testConnection } from '@/lib/database';
import { FilterOptions, SortOptions } from '@/types/customer';

export async function GET(request: NextRequest) {
  try {
    // Test database connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Parse filter parameters
    const compatibility_score_min = parseInt(searchParams.get('compatibility_score_min') || '0');
    const compatibility_score_max = parseInt(searchParams.get('compatibility_score_max') || '100');
    const detailed_score_min = parseInt(searchParams.get('detailed_score_min') || '0');
    const detailed_score_max = parseInt(searchParams.get('detailed_score_max') || '100');
    
    // Parse multiple industry and country selections
    const selectedIndustries: string[] = [];
    const selectedCountries: string[] = [];
    
    // Collect all industry parameters
    Array.from(searchParams.entries()).forEach(([key, value]) => {
      if (key.startsWith('industry_') && value) {
        selectedIndustries.push(value);
      }
    });
    
    // Collect all country parameters
    Array.from(searchParams.entries()).forEach(([key, value]) => {
      if (key.startsWith('country_') && value) {
        selectedCountries.push(value);
      }
    });
    
    // Parse sort parameters
    const sortField = searchParams.get('sort_field') as SortOptions['field'] || 'name';
    const sortDirection = searchParams.get('sort_direction') as 'asc' | 'desc' || 'asc';
    
    // Map frontend sort fields to database fields
    const sortFieldMap: Record<string, string> = {
      'name': 'c.name',
      'compatibility_score': 'cc.compatibility_score',
      'country': 'd.country_code',
      'industry': 'i.industry'
    };
    
    // Fetch customers from database
    const customers = await getCustomersWithDetails(
      {
        compatibility_score_min,
        compatibility_score_max,
        detailed_score_min,
        detailed_score_max,
        industry: selectedIndustries.length > 0 ? selectedIndustries : undefined,
        country: selectedCountries.length > 0 ? selectedCountries : undefined,
      },
      {
        field: sortFieldMap[sortField] || 'c.name',
        direction: sortDirection,
      }
    );
    
    // Fetch available industries and countries for filters
    const [availableIndustries, availableCountries] = await Promise.all([
      getIndustries(),
      getCountries()
    ]);
    
    // Return response with metadata
    return NextResponse.json({
      customers,
      total: customers.length,
      filters: {
        compatibility_score_min,
        compatibility_score_max,
        detailed_score_min,
        detailed_score_max,
        industry: selectedIndustries.join(', '),
        country: selectedCountries.join(', ')
      },
      sort: {
        field: sortField,
        direction: sortDirection
      },
      available_industries: availableIndustries,
      available_countries: availableCountries
    });
    
  } catch (error) {
    console.error('Error fetching customer details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 