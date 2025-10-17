
import { NextResponse } from 'next/server';
import { extractImpactfulQuote } from '@/lib/text-processing';
import { generateSocialPost } from '@/lib/image-generator';

export async function POST(request: Request) {
  try {
    
    const body = await request.json();
    const { review_text, customer_name, product_name } = body;

    if (!review_text || !customer_name || !product_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const quote = extractImpactfulQuote(review_text);

    const imageBuffer = await generateSocialPost(quote, customer_name, product_name);

    const base64Image = imageBuffer.toString('base64');

    return NextResponse.json({ image: base64Image });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}