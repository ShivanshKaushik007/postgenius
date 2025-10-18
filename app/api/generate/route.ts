import { NextRequest, NextResponse } from 'next/server';
import { generateSocialPost } from '@/lib/image-generator'; 

export const runtime = 'nodejs'; 

export async function POST(req: NextRequest) {
  try {
    const { review_text, customer_name, product_name } = await req.json();

   
    if (!review_text || !customer_name || !product_name) {
      return NextResponse.json({ error: 'Missing required fields: review_text, customer_name, and product_name.' }, { status: 400 });
    }

    const imageBuffer: Buffer = await generateSocialPost(review_text, customer_name, product_name);

    
    return new NextResponse(imageBuffer.buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate', 
      },
      status: 200,
    });

  } catch (e: unknown) {
  let errorMessage = 'An unknown error occurred.';
  if (e instanceof Error) {
    errorMessage = e.message;
  }
  console.error('API Error in /api/generate:', errorMessage);
  return NextResponse.json({ error: `Failed to generate image: ${errorMessage}` }, { status: 500 });
}
} 