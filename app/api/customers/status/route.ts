import { NextRequest, NextResponse } from 'next/server';
import { updateCustomerStatus } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { customer_id, status, comment } = await request.json();
    if (!customer_id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const result = await updateCustomerStatus(customer_id, status, comment);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 