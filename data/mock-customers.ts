import { CustomerDetails } from '@/types/customer';

export const mockCustomers: CustomerDetails[] = [
  {
    customer: {
      id: 1,
      name: "TechCorp Solutions",
      website: "https://techcorp-solutions.com",
      contact_email: "contact@techcorp-solutions.com",
      facebook: "https://facebook.com/techcorpsolutions",
      twitter: "https://twitter.com/techcorp",
      linkedin: "https://linkedin.com/company/techcorp-solutions",
      instagram: "https://instagram.com/techcorp"
    },
    classification: {
      id: 1,
      customer_id: 1,
      dork_id: 1,
      has_metal_tin_clues: "Yes",
      compatible_with_masas_products: "High",
      compatibility_score: 85,
      should_send_intro_email: "Yes",
      description: "Leading technology solutions provider with strong metal manufacturing focus",
      detailed_compatibility_score: 87
    },
    dork: {
      id: 1,
      country_code: "US",
      industry_id: 1,
      content: "metal manufacturing technology solutions",
      is_analyzed: 1
    },
    industry: {
      id: 1,
      industry: "Manufacturing"
    },
    latest_email: {
      id: 1,
      customer_id: 1,
      content: "Thank you for your interest in our metal manufacturing solutions. We would love to discuss how our technology can help optimize your production processes."
    }
  },
  {
    customer: {
      id: 2,
      name: "Global Steel Industries",
      website: "https://globalsteel.com",
      contact_email: "info@globalsteel.com",
      facebook: "https://facebook.com/globalsteel",
      twitter: "https://twitter.com/globalsteel",
      linkedin: "https://linkedin.com/company/global-steel-industries",
      instagram: null
    },
    classification: {
      id: 2,
      customer_id: 2,
      dork_id: 2,
      has_metal_tin_clues: "Yes",
      compatible_with_masas_products: "Medium",
      compatibility_score: 72,
      should_send_intro_email: "Yes",
      description: "International steel manufacturing company with modern facilities",
      detailed_compatibility_score: 74
    },
    dork: {
      id: 2,
      country_code: "CA",
      industry_id: 1,
      content: "steel manufacturing automation",
      is_analyzed: 1
    },
    industry: {
      id: 1,
      industry: "Manufacturing"
    },
    latest_email: {
      id: 2,
      customer_id: 2,
      content: "We are exploring automation solutions for our steel manufacturing processes. Your technology looks promising."
    }
  },
  {
    customer: {
      id: 3,
      name: "Precision Metals Ltd",
      website: "https://precisionmetals.co.uk",
      contact_email: "sales@precisionmetals.co.uk",
      facebook: null,
      twitter: "https://twitter.com/precisionmetals",
      linkedin: "https://linkedin.com/company/precision-metals-ltd",
      instagram: null
    },
    classification: {
      id: 3,
      customer_id: 3,
      dork_id: 3,
      has_metal_tin_clues: "Yes",
      compatible_with_masas_products: "High",
      compatibility_score: 91,
      should_send_intro_email: "Yes",
      description: "UK-based precision metal manufacturing with advanced technology needs",
      detailed_compatibility_score: 93
    },
    dork: {
      id: 3,
      country_code: "GB",
      industry_id: 1,
      content: "precision metal manufacturing UK",
      is_analyzed: 1
    },
    industry: {
      id: 1,
      industry: "Manufacturing"
    },
    latest_email: {
      id: 3,
      customer_id: 3,
      content: "Your precision manufacturing solutions align perfectly with our requirements. Let's schedule a meeting."
    }
  },
  {
    customer: {
      id: 4,
      name: "Innovation Tech Solutions",
      website: "https://innovationtech.de",
      contact_email: "kontakt@innovationtech.de",
      facebook: "https://facebook.com/innovationtech",
      twitter: null,
      linkedin: "https://linkedin.com/company/innovation-tech-solutions",
      instagram: "https://instagram.com/innovationtech"
    },
    classification: {
      id: 4,
      customer_id: 4,
      dork_id: 4,
      has_metal_tin_clues: "No",
      compatible_with_masas_products: "Low",
      compatibility_score: 35,
      should_send_intro_email: "No",
      description: "Software development company with limited manufacturing focus",
      detailed_compatibility_score: 32
    },
    dork: {
      id: 4,
      country_code: "DE",
      industry_id: 2,
      content: "software development innovation",
      is_analyzed: 1
    },
    industry: {
      id: 2,
      industry: "Technology"
    },
    latest_email: {
      id: 4,
      customer_id: 4,
      content: "Thank you for reaching out, but we focus on software development rather than manufacturing."
    }
  },
  {
    customer: {
      id: 5,
      name: "MetalWorks International",
      website: "https://metalworks.com.au",
      contact_email: "info@metalworks.com.au",
      facebook: "https://facebook.com/metalworksau",
      twitter: "https://twitter.com/metalworks_au",
      linkedin: "https://linkedin.com/company/metalworks-international",
      instagram: "https://instagram.com/metalworks_au"
    },
    classification: {
      id: 5,
      customer_id: 5,
      dork_id: 5,
      has_metal_tin_clues: "Yes",
      compatible_with_masas_products: "High",
      compatibility_score: 88,
      should_send_intro_email: "Yes",
      description: "Australian metal manufacturing leader with global operations",
      detailed_compatibility_score: 90
    },
    dork: {
      id: 5,
      country_code: "AU",
      industry_id: 1,
      content: "metal manufacturing Australia",
      is_analyzed: 1
    },
    industry: {
      id: 1,
      industry: "Manufacturing"
    },
    latest_email: {
      id: 5,
      customer_id: 5,
      content: "We're interested in upgrading our manufacturing processes. Your solutions look promising for our operations."
    }
  },
  {
    customer: {
      id: 6,
      name: "Advanced Manufacturing Co",
      website: "https://advancedmanufacturing.com",
      contact_email: "contact@advancedmanufacturing.com",
      facebook: null,
      twitter: null,
      linkedin: "https://linkedin.com/company/advanced-manufacturing-co",
      instagram: null
    },
    classification: {
      id: 6,
      customer_id: 6,
      dork_id: 6,
      has_metal_tin_clues: "Yes",
      compatible_with_masas_products: "Medium",
      compatibility_score: 65,
      should_send_intro_email: "Yes",
      description: "Advanced manufacturing company with mixed technology portfolio",
      detailed_compatibility_score: 67
    },
    dork: {
      id: 6,
      country_code: "US",
      industry_id: 1,
      content: "advanced manufacturing technology",
      is_analyzed: 1
    },
    industry: {
      id: 1,
      industry: "Manufacturing"
    },
    latest_email: {
      id: 6,
      customer_id: 6,
      content: "We're evaluating new manufacturing technologies. Please send more information about your solutions."
    }
  },
  {
    customer: {
      id: 7,
      name: "Digital Solutions Inc",
      website: "https://digitalsolutions.io",
      contact_email: "hello@digitalsolutions.io",
      facebook: "https://facebook.com/digitalsolutions",
      twitter: "https://twitter.com/digitalsol",
      linkedin: "https://linkedin.com/company/digital-solutions-inc",
      instagram: "https://instagram.com/digitalsolutions"
    },
    classification: {
      id: 7,
      customer_id: 7,
      dork_id: 7,
      has_metal_tin_clues: "No",
      compatible_with_masas_products: "Low",
      compatibility_score: 28,
      should_send_intro_email: "No",
      description: "Digital marketing agency with no manufacturing focus",
      detailed_compatibility_score: 25
    },
    dork: {
      id: 7,
      country_code: "US",
      industry_id: 3,
      content: "digital marketing solutions",
      is_analyzed: 1
    },
    industry: {
      id: 3,
      industry: "Marketing"
    },
    latest_email: {
      id: 7,
      customer_id: 7,
      content: "Thanks for reaching out, but we provide digital marketing services, not manufacturing solutions."
    }
  },
  {
    customer: {
      id: 8,
      name: "Industrial Metals Group",
      website: "https://industrialmetals.fr",
      contact_email: "contact@industrialmetals.fr",
      facebook: null,
      twitter: null,
      linkedin: "https://linkedin.com/company/industrial-metals-group",
      instagram: null
    },
    classification: {
      id: 8,
      customer_id: 8,
      dork_id: 8,
      has_metal_tin_clues: "Yes",
      compatible_with_masas_products: "High",
      compatibility_score: 94,
      should_send_intro_email: "Yes",
      description: "French industrial metals manufacturer with advanced automation needs",
      detailed_compatibility_score: 96
    },
    dork: {
      id: 8,
      country_code: "FR",
      industry_id: 1,
      content: "industrial metals manufacturing France",
      is_analyzed: 1
    },
    industry: {
      id: 1,
      industry: "Manufacturing"
    },
    latest_email: {
      id: 8,
      customer_id: 8,
      content: "Votre technologie de fabrication métallique nous intéresse beaucoup. Pouvez-vous nous envoyer plus d'informations?"
    }
  }
];

export const industries = [
  { id: 1, industry: "Manufacturing" },
  { id: 2, industry: "Technology" },
  { id: 3, industry: "Marketing" },
  { id: 4, industry: "Healthcare" },
  { id: 5, industry: "Finance" }
];

export const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "AU", name: "Australia" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "IN", name: "India" }
]; 