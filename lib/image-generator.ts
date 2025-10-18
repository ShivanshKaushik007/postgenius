import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

//unsplash image fetch
async function fetchUnsplashImage(query: string): Promise<Buffer | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.error("Unsplash Access Key is missing. Add UNSPLASH_ACCESS_KEY to your .env.local file.");
    return null;
  }

  const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=squarish`;

  try {
    const searchResponse = await fetch(unsplashUrl, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    });

    if (!searchResponse.ok) {
      console.error(`Unsplash API error: ${searchResponse.statusText}`);
      return null;
    }

    const searchData = await searchResponse.json();
    if (!searchData.results || searchData.results.length === 0) {
      console.warn(`No Unsplash images found for: "${query}"`);
      return null;
    }

    const imageUrl = searchData.results[0].urls.regular;
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    return Buffer.from(arrayBuffer);

  } catch (error: any) {
    console.error("Failed to fetch from Unsplash:", error.message);
    return null;
  }
}


function createTextSvg(
    text: string,
    options: {
        fontSize: number;
        fontWeight: string;
        fill: string;
        wrapWidth: number;
        fontFamily?: string;
        alignment?: 'start' | 'middle' | 'end';
        lineHeight?: number;
    }
): Buffer {
    const { fontSize, fontWeight, fill, wrapWidth, fontFamily = 'Inter, sans-serif', alignment = 'start', lineHeight = 1.2 } = options;
    const words = text.split(' ');
    let lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
        const testLine = currentLine === '' ? word : `${currentLine} ${word}`;
        if (testLine.length * (fontSize * 0.6) > wrapWidth && currentLine !== '') {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine);

    const svgHeight = lines.length * (fontSize * lineHeight) + fontSize;
    const tspanElements = lines.map((line, index) => {
        const dy = index === 0 ? fontSize : fontSize * lineHeight;
        return `<tspan x="50%" dy="${dy}" text-anchor="${alignment}">${line}</tspan>`;
    }).join('');
    
    let xOffset = alignment === 'start' ? '0' : '50%';
    if (alignment === 'end') xOffset = '100%';

    const svg = `
    <svg width="${wrapWidth}" height="${svgHeight}" viewBox="0 0 ${wrapWidth} ${svgHeight}">
        <style>
            .text-style { font-family: ${fontFamily}; font-size: ${fontSize}px; font-weight: ${fontWeight}; fill: ${fill}; text-anchor: ${alignment}; }
        </style>
        <text x="${xOffset}" y="0" class="text-style">${tspanElements}</text>
    </svg>`;
    return Buffer.from(svg);
}


export async function generateSocialPost(
    reviewQuote: string,
    customerName: string,
    productName: string
): Promise<Buffer> {
    try {
      
        let productImageBuffer = await fetchUnsplashImage(productName);

       
        if (!productImageBuffer) {
            console.log("Unsplash fetch failed. Using local fallback image.");
            const fallbackImagePath = path.join(process.cwd(), 'public/images', 'headset.jpg');
            try {
                productImageBuffer = await fs.readFile(fallbackImagePath);
            } catch (fallbackError) {
                console.error("Fallback image not found! Creating a plain background.");
                productImageBuffer = await sharp({
                    create: { width: 1080, height: 1080, channels: 4, background: { r: 30, g: 30, b: 35, alpha: 1 } }
                }).png().toBuffer();
            }
        }

        const logoPath = path.join(process.cwd(), 'public/images', 'logo.png');
        const logoBuffer = await fs.readFile(logoPath);
 
        const canvasWidth = 1080;
        const canvasHeight = 1080;
        const brandColor = '#7E22CE';

        const baseBackground = sharp({
            create: { width: canvasWidth, height: canvasHeight, channels: 4, background: { r: 15, g: 15, b: 15, alpha: 1 } }
        });

        const resizedLogo = await sharp(logoBuffer).resize(120).toBuffer();

        
        const templateChoice = Math.floor(Math.random() * 5) + 1;
        let finalImageBuffer: Buffer;
        
        
        switch (templateChoice) {
            case 1:
   
    const quoteSvg1 = createTextSvg(`"${reviewQuote}"`, { fontSize: 32, fontWeight: 'bold', fill: '#F5F5F5', wrapWidth: 600, alignment: 'start' });
    const customerSvg1 = createTextSvg(`- ${customerName}`, { fontSize: 24, fontWeight: 'normal', fill: '#A3A3A3', wrapWidth: 400, alignment: 'start' });

    finalImageBuffer = await baseBackground
        .composite([
            { input: await sharp(productImageBuffer).resize(540, 1080, { fit: 'cover' }).toBuffer(), top: 0, left: 0 },
            { input: resizedLogo, top: 50, left: 590 }, 
            { input: quoteSvg1, top: 300, left: 320 }, 
            { input: customerSvg1, top: 700, left: 570 }, 
        ])
        .png()
        .toBuffer();
    break;

            case 2:
             
                const quoteSvg2 = createTextSvg(`"${reviewQuote}"`, { fontSize: 48, fontWeight: 'bold', fill: '#FFFFFF', wrapWidth: 800, alignment: 'middle' });
                const customerSvg2 = createTextSvg(`- ${customerName}`, { fontSize: 32, fontWeight: 'normal', fill: '#FFFFFF', wrapWidth: 800, alignment: 'middle' });

                finalImageBuffer = await sharp(productImageBuffer)
                    .resize(canvasWidth, canvasHeight, { fit: 'cover' })
                    .blur(5)
                    .composite([
                        { input: Buffer.from('<svg><rect x="0" y="0" width="1080" height="1080" fill="#000" opacity="0.6"/></svg>'), top: 0, left: 0 },
                        { input: resizedLogo, top: 50, left: 50 },
                        { input: quoteSvg2, top: 350, left: 140 },
                        { input: customerSvg2, top: 800, left: 140 },
                    ])
                    .png()
                    .toBuffer();
                break;
            
        
            
            case 3:
                const quoteSvg3 = createTextSvg(`"${reviewQuote}"`, { fontSize: 40, fontWeight: 'bold', fill: '#FFFFFF', wrapWidth: 800, alignment: 'middle' });
                const customerSvg3 = createTextSvg(`- ${customerName}`, { fontSize: 28, fontWeight: 'normal', fill: '#E0E0E0', wrapWidth: 800, alignment: 'middle' });

                finalImageBuffer = await sharp(productImageBuffer)
                    .resize(canvasWidth, canvasHeight, { fit: 'cover' })
                    .composite([
                        { 
                            input: Buffer.from(`<svg width="${canvasWidth}" height="${canvasHeight}"><defs><linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:rgba(0,0,0,0.1);stop-opacity:1" /><stop offset="100%" style="stop-color:${brandColor};stop-opacity:0.6" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#gradient)" /></svg>`),
                            top: 0, left: 0
                        },
                        { input: resizedLogo, top: 50, left: (canvasWidth - 120) / 2 },
                        { input: quoteSvg3, top: 380, left: (canvasWidth - 800) / 2 },
                        { input: customerSvg3, top: 750, left: (canvasWidth - 800) / 2 },
                    ])
                    .png()
                    .toBuffer();
                break;

            case 4:
                const quoteSvg4 = createTextSvg(`"${reviewQuote}"`, { fontSize: 48, fontWeight: 'bold', fill: '#F5F5F5', wrapWidth: 900, alignment: 'middle' });
                const customerSvg4 = createTextSvg(`- ${customerName}`, { fontSize: 32, fontWeight: 'normal', fill: '#A3A3A3', wrapWidth: 900, alignment: 'middle' });

                finalImageBuffer = await baseBackground
                    .composite([
                        { input: await sharp(productImageBuffer).resize(400, 400, { fit: 'cover' }).toBuffer(), top: 100, left: (canvasWidth - 400) / 2 },
                        { input: resizedLogo, top: 50, left: 50 },
                        { input: quoteSvg4, top: 550, left: (canvasWidth - 900) / 2 },
                        { input: customerSvg4, top: 850, left: (canvasWidth - 900) / 2 },
                    ])
                    .png()
                    .toBuffer();
                break;


            case 5:
                const quoteSvg6 = createTextSvg(`"${reviewQuote}"`, { fontSize: 40, fontWeight: 'bold', fill: '#FFFFFF', wrapWidth: 900, alignment: 'middle' });
                const customerSvg6 = createTextSvg(`- ${customerName}`, { fontSize: 28, fontWeight: 'normal', fill: '#A3A3A3', wrapWidth: 900, alignment: 'middle' });

                finalImageBuffer = await baseBackground
                    .composite([
                        { 
                            input: Buffer.from(`<svg><rect x="0" y="0" width="${canvasWidth}" height="350" fill="${brandColor}"/></svg>`),
                            top: 0, left: 0
                        },
                        { input: quoteSvg6, top: 100, left: (canvasWidth - 900) / 2 },
                        { input: await sharp(productImageBuffer).resize(400, 400, { fit: 'cover' }).toBuffer(), top: 450, left: (canvasWidth - 400) / 2 },
                        { input: resizedLogo, top: 40, left: 40 },
                        { input: customerSvg6, top: 880, left: (canvasWidth - 900) / 2 },
                    ])
                    .png()
                    .toBuffer();
                break;
            
    
            default:
                const quoteSvgDefault = createTextSvg(`"${reviewQuote}"`, { fontSize: 32, fontWeight: 'bold', fill: '#F5F5F5', wrapWidth: 450, alignment: 'start' });
                const customerSvgDefault = createTextSvg(`- ${customerName}`, { fontSize: 24, fontWeight: 'normal', fill: '#A3A3A3', wrapWidth: 450, alignment: 'start' });

                finalImageBuffer = await baseBackground
                    .composite([
                        { input: await sharp(productImageBuffer).resize(540, 1080, { fit: 'cover' }).toBuffer(), top: 0, left: 0 },
                        { input: resizedLogo, top: 50, left: 590 },
                        { input: quoteSvgDefault, top: 300, left: 590 },
                        { input: customerSvgDefault, top: 700, left: 590 },
                    ])
                    .png()
                    .toBuffer();
                break;
        }

        return finalImageBuffer;

    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Could not generate the social post image.");
    }
}