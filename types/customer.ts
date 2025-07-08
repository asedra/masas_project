export interface Customer {
  id: number;
  name: string;
  website: string | null;
  contact_email: string | null;
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  instagram: string | null;
  status?: string | null;
  status_comment?: string | null;
}

export interface CustomerClassification {
  id: number;
  customer_id: number;
  dork_id: number;
  has_metal_tin_clues: string | null;
  compatible_with_masas_products: string | null;
  compatibility_score: number | null;
  should_send_intro_email: string | null;
  description: string | null;
  detailed_compatibility_score: number | null;
}

export interface Dork {
  id: number;
  country_code: string;
  industry_id: number | null;
  content: string;
  is_analyzed: number;
}

export interface Industry {
  id: number;
  industry: string;
}

export interface Email {
  id: number;
  customer_id: number;
  content: string;
}

export interface CustomerDetails {
  customer: Customer;
  classification: CustomerClassification | null;
  dork: Dork | null;
  industry: Industry | null;
  latest_email: Email | null;
}

export interface FilterOptions {
  compatibility_score_min: number;
  compatibility_score_max: number;
  industry: string[] | null;
  country: string[] | null;
  detailed_score_min?: number;
  detailed_score_max?: number;
  industryDropdownOpen?: boolean;
  countryDropdownOpen?: boolean;
}

export interface SortOptions {
  field: 'name' | 'compatibility_score' | 'country' | 'industry';
  direction: 'asc' | 'desc';
} 