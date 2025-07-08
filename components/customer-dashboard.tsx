'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink, Mail, Globe, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { CustomerDetails, FilterOptions, SortOptions } from '@/types/customer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface CustomerDashboardProps {
  initialData?: {
    customers: CustomerDetails[];
    total: number;
    available_industries: { id: number; industry: string }[];
    available_countries: { code: string; name: string }[];
  };
}

export function CustomerDashboard({ initialData }: CustomerDashboardProps) {
  const [customers, setCustomers] = useState<CustomerDetails[]>(initialData?.customers || []);
  const [loading, setLoading] = useState(!initialData);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetails | null>(null);
  const [comment, setComment] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    compatibility_score_min: 0,
    compatibility_score_max: 100,
    industry: null,
    country: null,
    detailed_score_min: 0,
    detailed_score_max: 100,
  });
  const [sort, setSort] = useState<SortOptions>({
    field: 'name',
    direction: 'asc',
  });
  const [industries, setIndustries] = useState<{ id: number; industry: string }[]>(initialData?.available_industries || []);
  const [countries, setCountries] = useState<{ code: string; name: string }[]>(initialData?.available_countries || []);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

  // Refs for dropdown containers
  const industryDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialData) {
      fetchCustomers();
    }
  }, []);

  // Handle clicking outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (industryDropdownRef.current && !industryDropdownRef.current.contains(event.target as Node)) {
        setFilters(prev => ({ ...prev, industryDropdownOpen: false }));
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setFilters(prev => ({ ...prev, countryDropdownOpen: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const paramsObj: Record<string, string> = {
        sort_field: sort.field,
        sort_direction: sort.direction,
      };
      if (filters.industry && filters.industry.length > 0) {
        filters.industry.forEach((ind, index) => {
          paramsObj[`industry_${index}`] = ind;
        });
      }
      if (filters.country && filters.country.length > 0) {
        filters.country.forEach((cnt, index) => {
          paramsObj[`country_${index}`] = cnt;
        });
      }
      if (filters.compatibility_score_min !== 0) paramsObj.compatibility_score_min = filters.compatibility_score_min.toString();
      if (filters.compatibility_score_max !== 100) paramsObj.compatibility_score_max = filters.compatibility_score_max.toString();
      if (filters.detailed_score_min !== undefined && filters.detailed_score_min !== 0) paramsObj.detailed_score_min = filters.detailed_score_min.toString();
      if (filters.detailed_score_max !== undefined && filters.detailed_score_max !== 100) paramsObj.detailed_score_max = filters.detailed_score_max.toString();
      if (dateRange.start) paramsObj.created_at_start = dateRange.start;
      if (dateRange.end) paramsObj.created_at_end = dateRange.end;
      const params = new URLSearchParams(paramsObj);

      const response = await fetch(`/api/customers/details?${params}`);
      const data = await response.json();
      setCustomers(data.customers);
      if (data.available_industries) setIndustries(data.available_industries);
      if (data.available_countries) setCountries(data.available_countries);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRowExpansion = (customerId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(customerId)) {
      newExpanded.delete(customerId);
    } else {
      newExpanded.add(customerId);
    }
    setExpandedRows(newExpanded);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getIntroEmailBadge = (shouldSend: string) => {
    return shouldSend === 'Yes' ? (
      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
        Send Email
      </Badge>
    ) : (
      <Badge variant="secondary">
        Skip
      </Badge>
    );
  };

  const SocialLinks = ({ customer }: { customer: CustomerDetails['customer'] }) => {
    const formatUrl = (url: string | null): string => {
      if (!url) return '';
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      return `https://${url}`;
    };

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string | null) => {
      if (!url) {
        e.preventDefault();
        return;
      }
      // Let the browser handle the link naturally with target="_blank"
    };

    return (
      <div className="flex gap-2">
        {customer.website && (
          <a 
            href={formatUrl(customer.website)} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => handleLinkClick(e, customer.website)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Globe className="h-4 w-4" />
          </a>
        )}
        {customer.facebook && (
          <a 
            href={formatUrl(customer.facebook)} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => handleLinkClick(e, customer.facebook)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Facebook className="h-4 w-4" />
          </a>
        )}
        {customer.twitter && (
          <a 
            href={formatUrl(customer.twitter)} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => handleLinkClick(e, customer.twitter)}
            className="text-blue-400 hover:text-blue-600 transition-colors"
          >
            <Twitter className="h-4 w-4" />
          </a>
        )}
        {customer.linkedin && (
          <a 
            href={formatUrl(customer.linkedin)} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => handleLinkClick(e, customer.linkedin)}
            className="text-blue-700 hover:text-blue-900 transition-colors"
          >
            <Linkedin className="h-4 w-4" />
        </a>
        )}
        {customer.instagram && (
          <a 
            href={formatUrl(customer.instagram)} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => handleLinkClick(e, customer.instagram)}
            className="text-pink-600 hover:text-pink-800 transition-colors"
          >
            <Instagram className="h-4 w-4" />
          </a>
        )}
      </div>
    );
  };

  const handleStatusUpdate = async (customerId: number, status: string, comment?: string) => {
    const res = await fetch("/api/customers/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: customerId, status, comment }),
    });
    if (res.ok) {
      setCustomers(prev =>
        prev.map(c =>
          c.customer.id === customerId
            ? {
                ...c,
                customer: {
                  ...c.customer,
                  status,
                  status_comment: status === "comment" ? comment : null,
                },
              }
            : c
        )
      );
    }
    setComment("");
    setSelectedCustomer(null);
    // Optionally show notification here
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Customer Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage and analyze your customer data</p>
            </div>
            <div className="text-sm text-muted-foreground bg-card px-3 py-2 rounded-md border">
              Showing {customers.length} customers
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Compatibility Score Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.compatibility_score_min}
                    onChange={(e) => setFilters(prev => ({ ...prev, compatibility_score_min: parseInt(e.target.value) || 0 }))}
                    className="flex h-10 w-20 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Min"
                  />
                  <span className="self-center text-muted-foreground">-</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.compatibility_score_max}
                    onChange={(e) => setFilters(prev => ({ ...prev, compatibility_score_max: parseInt(e.target.value) || 100 }))}
                    className="flex h-10 w-20 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Max"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Detailed Score Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.detailed_score_min}
                    onChange={e => setFilters(prev => ({ ...prev, detailed_score_min: parseInt(e.target.value) || 0 }))}
                    className="flex h-10 w-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Min"
                  />
                  <span className="self-center text-muted-foreground">-</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.detailed_score_max}
                    onChange={e => setFilters(prev => ({ ...prev, detailed_score_max: parseInt(e.target.value) || 100 }))}
                    className="flex h-10 w-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Industry
                </label>
                <div className="relative" ref={industryDropdownRef}>
                  <div 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    onClick={() => setFilters(prev => ({ ...prev, industryDropdownOpen: !prev.industryDropdownOpen }))}
                  >
                    <div className="flex flex-wrap gap-1 flex-1">
                      {filters.industry && filters.industry.length > 0 ? (
                        filters.industry.map((ind) => (
                          <Badge key={ind} variant="secondary" className="text-xs">
                            {ind}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFilters(prev => ({
                                  ...prev,
                                  industry: prev.industry?.filter(i => i !== ind) || null
                                }));
                              }}
                              className="ml-1 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">All Industries</span>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </div>
                  
                  {filters.industryDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-2">
                        <div className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm">
                          <input
                            type="checkbox"
                            id="all-industries"
                            checked={!filters.industry || filters.industry.length === 0}
                            onChange={() => setFilters(prev => ({ ...prev, industry: null }))}
                            className="rounded"
                          />
                          <label htmlFor="all-industries" className="text-sm cursor-pointer">All Industries</label>
                        </div>
                        {industries?.filter(industry => industry.industry && industry.industry.trim() !== '').map((industry) => (
                          <div key={industry.id} className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm">
                            <input
                              type="checkbox"
                              id={`industry-${industry.id}`}
                              checked={filters.industry?.includes(industry.industry) || false}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters(prev => ({
                                    ...prev,
                                    industry: [...(prev.industry || []), industry.industry]
                                  }));
                                } else {
                                  setFilters(prev => ({
                                    ...prev,
                                    industry: prev.industry?.filter(i => i !== industry.industry) || null
                                  }));
                                }
                              }}
                              className="rounded"
                            />
                            <label htmlFor={`industry-${industry.id}`} className="text-sm cursor-pointer">{industry.industry}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Country
                </label>
                <div className="relative" ref={countryDropdownRef}>
                  <div 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    onClick={() => setFilters(prev => ({ ...prev, countryDropdownOpen: !prev.countryDropdownOpen }))}
                  >
                    <div className="flex flex-wrap gap-1 flex-1">
                      {filters.country && filters.country.length > 0 ? (
                        filters.country.map((cnt) => {
                          const countryName = countries.find(c => c.code === cnt)?.name || cnt;
                          return (
                            <Badge key={cnt} variant="secondary" className="text-xs">
                              {countryName}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFilters(prev => ({
                                    ...prev,
                                    country: prev.country?.filter(c => c !== cnt) || null
                                  }));
                                }}
                                className="ml-1 hover:text-destructive"
                              >
                                ×
                              </button>
                            </Badge>
                          );
                        })
                      ) : (
                        <span className="text-muted-foreground">All Countries</span>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </div>
                  
                  {filters.countryDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-2">
                        <div className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm">
                          <input
                            type="checkbox"
                            id="all-countries"
                            checked={!filters.country || filters.country.length === 0}
                            onChange={() => setFilters(prev => ({ ...prev, country: null }))}
                            className="rounded"
                          />
                          <label htmlFor="all-countries" className="text-sm cursor-pointer">All Countries</label>
                        </div>
                        {countries?.filter(country => country.code && country.code.trim() !== '').map((country) => (
                          <div key={country.code} className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm">
                            <input
                              type="checkbox"
                              id={`country-${country.code}`}
                              checked={filters.country?.includes(country.code) || false}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters(prev => ({
                                    ...prev,
                                    country: [...(prev.country || []), country.code]
                                  }));
                                } else {
                                  setFilters(prev => ({
                                    ...prev,
                                    country: prev.country?.filter(c => c !== country.code) || null
                                  }));
                                }
                              }}
                              className="rounded"
                            />
                            <label htmlFor={`country-${country.code}`} className="text-sm cursor-pointer">{country.name}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Created At Range</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Start date"
                  />
                  <span className="self-center text-muted-foreground">-</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="End date"
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <Button type="button" onClick={fetchCustomers} className="w-full">
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Compatibility</TableHead>
                    <TableHead>Intro Email</TableHead>
                    <TableHead>Dork Content</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <p className="text-muted-foreground">Loading customers...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-2">
                          <p className="text-lg font-medium">No customers found</p>
                          <p className="text-sm text-muted-foreground">Try adjusting your filters to see more results.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers.map((customer) => (
                      <React.Fragment key={customer.customer.id}>
                        <TableRow>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRowExpansion(customer.customer.id)}
                              className="h-8 w-8 p-0"
                            >
                              {expandedRows.has(customer.customer.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="font-semibold">{customer.customer.name}</div>
                              <div className="text-sm text-muted-foreground">{customer.customer.contact_email}</div>
                              <SocialLinks customer={customer.customer} />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <Badge className={`${getScoreColor(customer.classification?.compatibility_score || 0)} font-medium`}>
                                {customer.classification?.compatibility_score || 0}%
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                Detailed: {customer.classification?.detailed_compatibility_score || 0}%
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getIntroEmailBadge(customer.classification?.should_send_intro_email || 'No')}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <p className="text-sm truncate" title={customer.dork?.content}>
                                {customer.dork?.content || 'N/A'}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {customer.dork?.country_code || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {customer.industry?.industry || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {customer.customer.created_at ? new Date(customer.customer.created_at).toLocaleDateString('tr-TR') : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-semibold">
                                {customer.customer.status === 'approve' ? 'Approved' : customer.customer.status === 'reject' ? 'Rejected' : customer.customer.status === 'comment' && customer.customer.status_comment ? 'Comment' : ''}
                              </span>
                              {customer.customer.status === 'approve' || customer.customer.status === 'reject' ? null : (
                                <div className="flex gap-2 mt-1">
                                  <Button
                                    type="button"
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleStatusUpdate(customer.customer.id, 'approve')}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleStatusUpdate(customer.customer.id, 'reject')}
                                  >
                                    Reject
                                  </Button>
                                  <Dialog onOpenChange={(open) => {
                                    if (open) setSelectedCustomer(customer);
                                  }}>
                                    <DialogTrigger asChild>
                                      <Button
                                        type="button"
                                        variant={customer.customer.status === 'comment' && customer.customer.status_comment ? undefined : 'outline'}
                                        size="sm"
                                        className={customer.customer.status === 'comment' && customer.customer.status_comment ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                                      >
                                        Comment
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                      <DialogHeader>
                                        <DialogTitle>Comment for {customer.customer.name}</DialogTitle>
                                      </DialogHeader>
                                      <textarea
                                        className="w-full border rounded p-2 mt-2"
                                        rows={3}
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        placeholder="Enter your comment..."
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleStatusUpdate(customer.customer.id, 'comment', comment)}
                                      >
                                        Submit
                                      </Button>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                        
                        {/* Expanded Row */}
                        <AnimatePresence>
                          {expandedRows.has(customer.customer.id) && (
                            <TableRow>
                              <TableCell colSpan={8} className="p-0">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="bg-muted p-6"
                                >
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                      <h4 className="font-semibold text-lg">Customer Details</h4>
                                      <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                          <span className="font-medium text-muted-foreground">Website:</span>
                                          <span>{customer.customer.website || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium text-muted-foreground">Email:</span>
                                          <span>{customer.customer.contact_email || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium text-muted-foreground">Description:</span>
                                          <span>{customer.classification?.description || 'N/A'}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <h4 className="font-semibold text-lg">Classification Details</h4>
                                      <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                          <span className="font-medium text-muted-foreground">Has Metal/Tin Clues:</span>
                                          <span>{customer.classification?.has_metal_tin_clues || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium text-muted-foreground">Compatible with Masas Products:</span>
                                          <span>{customer.classification?.compatible_with_masas_products || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium text-muted-foreground">Detailed Score:</span>
                                          <span>{customer.classification?.detailed_compatibility_score || 0}%</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              </TableCell>
                            </TableRow>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 