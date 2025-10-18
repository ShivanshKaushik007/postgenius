import { NextRequest, NextResponse } from 'next/server';
import { generateSocialPost } from '@/lib/image-generator';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { review_text, customer_name, product_name } = await req.json();

    if (!review_text || !customer_name || !product_name) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const imageBuffer: Buffer = await generateSocialPost(review_text, customer_name, product_name);

    // Ensure the buffer is valid and convert it to Uint8Array for Blob
    const uint8Array = new Uint8Array(imageBuffer);
    const blob = new Blob([uint8Array], { type: 'image/png' });

    return new NextResponse(blob, {
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