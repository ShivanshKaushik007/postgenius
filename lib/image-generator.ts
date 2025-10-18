
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';


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
    const { fontSize, fontWeight, fill, wrapWidth, fontFamily = 'Arial, sans-serif', alignment = 'start', lineHeight = 1.2 } = options;

    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

  
    for (const word of words) {
        const testLine = currentLine === '' ? word : currentLine + ' ' + word;
       
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
        return `<tspan x="50%" dy="${dy}" text-anchor="${alignment === 'start' ? 'start' : alignment === 'middle' ? 'middle' : 'end'}">${line}</tspan>`;
    }).join('');

    let xOffset = alignment === 'start' ? '0' : '50%';
    if (alignment === 'end') xOffset = '100%';


    const svg = `
    <svg width="${wrapWidth}" height="${svgHeight}" viewBox="0 0 ${wrapWidth} ${svgHeight}">
        <style>
            .text-style {
                font-family: ${fontFamily};
                font-size: ${fontSize}px;
                font-weight: ${fontWeight};
                fill: ${fill};
                text-anchor: ${alignment};
            }
        </style>
        <text x="${xOffset}" y="0" class="text-style">
            ${tspanElements}
        </text>
    </svg>
    `;
    return Buffer.from(svg);
}


export async function generateSocialPost(
    reviewQuote: string,
    customerName: string,
    productName: string
): Promise<Buffer> {
    try {
       
        const productImagePath = path.join(process.cwd(), 'assets', 'headset.jpg');
        const logoPath = path.join(process.cwd(), 'assets', 'logo.png');

        
        const productImageBuffer = await fs.readFile(productImagePath);
        const logoBuffer = await fs.readFile(logoPath);

       
        const templateChoice = Math.floor(Math.random() * 7) + 1; 

        let finalImageBuffer: Buffer;
        const canvasWidth = 1080;
        const canvasHeight = 1080;
        const brandColor = '#7E22CE'; 

      
        const baseBackground = sharp({
            create: { width: canvasWidth, height: canvasHeight, channels: 4, background: { r: 15, g: 15, b: 15, alpha: 1 } } // Dark background
        });

      
        const resizedLogo = await sharp(logoBuffer).resize(120).toBuffer();

        switch (templateChoice) {
            case 1:
              
                const quoteSvg1 = createTextSvg(`"${reviewQuote}"`, { fontSize: 32, fontWeight: 'bold', fill: '#F5F5F5', wrapWidth: 450, alignment: 'start' });
                const customerSvg1 = createTextSvg(`- ${customerName}`, { fontSize: 24, fontWeight: 'normal', fill: '#A3A3A3', wrapWidth: 450, alignment: 'start' });

                finalImageBuffer = await baseBackground
                    .composite([
                        { input: await sharp(productImageBuffer).resize(540, 1080, { fit: 'cover' }).toBuffer(), top: 0, left: 0 },
                        { input: resizedLogo, top: 50, left: 590 },
                        { input: quoteSvg1, top: 300, left: 590 },
                        { input: customerSvg1, top: 700, left: 590 },
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
                            input: Buffer.from(`
                                <svg width="${canvasWidth}" height="${canvasHeight}">
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" style="stop-color:rgba(0,0,0,0.1);stop-opacity:1" />
                                            <stop offset="100%" style="stop-color:${brandColor};stop-opacity:0.6" />
                                        </linearGradient>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#gradient)" />
                                </svg>
                            `),
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
                
                const quoteSvg5 = createTextSvg(`"${reviewQuote}"`, { fontSize: 36, fontWeight: 'bold', fill: '#F5F5F5', wrapWidth: 600, alignment: 'start' });
                const customerSvg5 = createTextSvg(`- ${customerName}`, { fontSize: 24, fontWeight: 'normal', fill: '#A3A3A3', wrapWidth: 600, alignment: 'start' });

               
                const circleImage = await sharp(productImageBuffer)
                    .resize(500, 500, { fit: 'cover' })
                    .composite([{
                        input: Buffer.from(
                            `<svg><circle cx="250" cy="250" r="250" fill="#fff"/></svg>`
                        ),
                        blend: 'dest-in'
                    }])
                    .toBuffer();

                finalImageBuffer = await baseBackground
                    .composite([
                        { input: circleImage, top: 290, left: 80 }, 
                        { input: resizedLogo, top: 50, left: canvasWidth - 120 - 50 }, 
                        { input: quoteSvg5, top: 380, left: 350 },
                        { input: customerSvg5, top: 750, left: 450 },
                    ])
                    .png()
                    .toBuffer();
                break;

            case 6:
              
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

            case 7:
               
                const quoteSvg7 = createTextSvg(`"${reviewQuote}"`, { fontSize: 36, fontWeight: 'bold', fill: '#FFFFFF', wrapWidth: 450, alignment: 'start' });
                const customerSvg7 = createTextSvg(`- ${customerName}`, { fontSize: 24, fontWeight: 'normal', fill: '#E0E0E0', wrapWidth: 450, alignment: 'start' });

                const diagonalBackground = await sharp({
                    create: { width: canvasWidth, height: canvasHeight, channels: 4, background: { r: 15, g: 15, b: 15, alpha: 1 } }
                }).composite([
                    { 
                        input: await sharp(productImageBuffer).resize(canvasWidth, canvasHeight, { fit: 'cover' }).toBuffer(),
                        top: 0, left: 0,
                        blend: 'over',
                    }
                ]).toBuffer();


                finalImageBuffer = await sharp(diagonalBackground)
                    .composite([
                         
                        { input: Buffer.from(`<svg><rect x="0" y="0" width="${canvasWidth}" height="${canvasHeight}" fill="#000" opacity="0.4"/></svg>`), top: 0, left: 0 },
                       
                         { input: Buffer.from(`<svg><rect x="500" y="0" width="580" height="1080" fill="#1B1B1B" opacity="0.8"/></svg>`), top: 0, left: 500 },

                        { input: resizedLogo, top: 50, left: 50 },
                        { input: quoteSvg7, top: 380, left: 560 }, 
                        { input: customerSvg7, top: 750, left: 560 },
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