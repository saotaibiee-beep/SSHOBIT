import { NextResponse } from 'next/server';
export async function GET(){return NextResponse.json({ready:Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY&&process.env.PAYPAL_CLIENT_ID&&process.env.PAYPAL_CLIENT_SECRET)},{headers:{'Cache-Control':'no-store'}});}
