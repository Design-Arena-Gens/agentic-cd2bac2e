import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getOrigin } from '@/lib/utils';

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 });
  }
  const stripe = new Stripe(secret, { apiVersion: '2023-10-16' });
  const origin = getOrigin(req) || 'https://agentic-cd2bac2e.vercel.app';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: 900,
          product_data: { name: 'AI Career Accelerator Pro (Lifetime)' },
        },
      },
    ],
    success_url: `${origin}/dashboard?upgrade=success`,
    cancel_url: `${origin}/?upgrade=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
