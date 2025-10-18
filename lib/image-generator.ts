// lib/image-generator.ts
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

// --- Helper function to create SVG text ---
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

    // Simple word wrapping logic
    for (const word of words) {
        const testLine = currentLine === '' ? word : currentLine + ' ' + word;
        // Rough estimate of text width. A more accurate measurement needs a browser/canvas.
        // We'll approximate by character count for simplicity.
        if (testLine.length * (fontSize * 0.6) > wrapWidth && currentLine !== '') {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine); // Add the last line

    // Calculate dynamic height based on number of lines
    const svgHeight = lines.length * (fontSize * lineHeight) + fontSize; // Add some padding

    const tspanElements = lines.map((line, index) => {
        const dy = index === 0 ? fontSize : fontSize * lineHeight; // First line uses font size, subsequent lines use line height
        return `<tspan x="50%" dy="${dy}" text-anchor="${alignment === 'start' ? 'start' : alignment === 'middle' ? 'middle' : 'end'}">${line}</tspan>`;
    }).join('');

    // Adjust x position for alignment if not centered
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


// --- Main function to generate the social post image ---
export async function generateSocialPost(
    reviewQuote: string,
    customerName: string,
    productName: string
): Promise<Buffer> {
    try {
        // 1. Get paths to our local images (ensure these exist in public/images)
        const productImagePath = path.join(process.cwd(), 'public/images', 'headset.jpg');
        const logoPath = path.join(process.cwd(), 'public/images', 'logo.png');

        // Read the local image files into buffers
        const productImageBuffer = await fs.readFile(productImagePath);
        const logoBuffer = await fs.readFile(logoPath);

        // 2. Choose one of seven templates randomly
        const templateChoice = Math.floor(Math.random() * 6) + 1; // Random number from 1 to 6

        let finalImageBuffer: Buffer;
        const canvasWidth = 1080;
        const canvasHeight = 1080;
        const brandColor = '#7E22CE'; // Accent purple from your Tailwind config

        // Base background for templates that don't cover it fully
        const baseBackground = sharp({
            create: { width: canvasWidth, height: canvasHeight, channels: 4, background: { r: 15, g: 15, b: 15, alpha: 1 } } // Dark background
        });

        // Resize logo once
        const resizedLogo = await sharp(logoBuffer).resize(120).toBuffer();


        switch (templateChoice) {
            case 1:
                // --- TEMPLATE 1: Image on Left, Text on Right (Original) ---
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
                // --- TEMPLATE 2: Image background, text overlay (Original) ---
                const quoteSvg2 = createTextSvg(`"${reviewQuote}"`, { fontSize: 48, fontWeight: 'bold', fill: '#FFFFFF', wrapWidth: 800, alignment: 'middle' });
                const customerSvg2 = createTextSvg(`- ${customerName}`, { fontSize: 32, fontWeight: 'normal', fill: '#FFFFFF', wrapWidth: 800, alignment: 'middle' });

                finalImageBuffer = await sharp(productImageBuffer)
                    .resize(canvasWidth, canvasHeight, { fit: 'cover' })
                    .blur(5) // Blur the background a bit to make text readable
                    .composite([
                        // Add a dark overlay for text contrast
                        { input: Buffer.from('<svg><rect x="0" y="0" width="1080" height="1080" fill="#000" opacity="0.6"/></svg>'), top: 0, left: 0 },
                        { input: resizedLogo, top: 50, left: 50 },
                        { input: quoteSvg2, top: 350, left: 140 }, // X is for wrapWidth, positioning is done in SVG
                        { input: customerSvg2, top: 800, left: 140 },
                    ])
                    .png()
                    .toBuffer();
                break;

            case 3:
                // --- TEMPLATE 3: Gradient Overlay ---
                const quoteSvg3 = createTextSvg(`"${reviewQuote}"`, { fontSize: 40, fontWeight: 'bold', fill: '#FFFFFF', wrapWidth: 800, alignment: 'middle' });
                const customerSvg3 = createTextSvg(`- ${customerName}`, { fontSize: 28, fontWeight: 'normal', fill: '#E0E0E0', wrapWidth: 800, alignment: 'middle' });

                finalImageBuffer = await sharp(productImageBuffer)
                    .resize(canvasWidth, canvasHeight, { fit: 'cover' })
                    .composite([
                        { // Gradient overlay from transparent to brandColor
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
                // --- TEMPLATE 4: Stacked Minimal ---
                const quoteSvg4 = createTextSvg(`"${reviewQuote}"`, { fontSize: 48, fontWeight: 'bold', fill: '#F5F5F5', wrapWidth: 900, alignment: 'middle' });
                const customerSvg4 = createTextSvg(`- ${customerName}`, { fontSize: 32, fontWeight: 'normal', fill: '#A3A3A3', wrapWidth: 900, alignment: 'middle' });

                finalImageBuffer = await baseBackground
                    .composite([
                        { input: await sharp(productImageBuffer).resize(400, 400, { fit: 'cover' }).toBuffer(), top: 100, left: (canvasWidth - 400) / 2 },
                        { input: resizedLogo, top: 50, left: 50 }, // Logo top-left
                        { input: quoteSvg4, top: 550, left: (canvasWidth - 900) / 2 },
                        { input: customerSvg4, top: 850, left: (canvasWidth - 900) / 2 },
                    ])
                    .png()
                    .toBuffer();
                break;

            case 5:
                // --- TEMPLATE 5: Circular Focus ---
                const quoteSvg5 = createTextSvg(`"${reviewQuote}"`, { fontSize: 36, fontWeight: 'bold', fill: '#F5F5F5', wrapWidth: 600, alignment: 'start' });
                const customerSvg5 = createTextSvg(`- ${customerName}`, { fontSize: 24, fontWeight: 'normal', fill: '#A3A3A3', wrapWidth: 600, alignment: 'start' });

                // Create a circular product image
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
                        { input: circleImage, top: 290, left: 80 }, // Adjusted position for text
                        { input: resizedLogo, top: 50, left: canvasWidth - 120 - 50 }, // Logo top-right
                        { input: quoteSvg5, top: 380, left: 450 },
                        { input: customerSvg5, top: 750, left: 450 },
                    ])
                    .png()
                    .toBuffer();
                break;

            case 6:
                // --- TEMPLATE 6: Bold Accent Bar ---
                const quoteSvg6 = createTextSvg(`"${reviewQuote}"`, { fontSize: 40, fontWeight: 'bold', fill: '#FFFFFF', wrapWidth: 900, alignment: 'middle' });
                const customerSvg6 = createTextSvg(`- ${customerName}`, { fontSize: 28, fontWeight: 'normal', fill: '#A3A3A3', wrapWidth: 900, alignment: 'middle' });

                finalImageBuffer = await baseBackground
                    .composite([
                        { // Accent bar for the quote
                            input: Buffer.from(`<svg><rect x="0" y="0" width="${canvasWidth}" height="350" fill="${brandColor}"/></svg>`),
                            top: 0, left: 0
                        },
                        { input: quoteSvg6, top: 100, left: (canvasWidth - 900) / 2 }, // Centered on the bar
                        { input: await sharp(productImageBuffer).resize(400, 400, { fit: 'cover' }).toBuffer(), top: 450, left: (canvasWidth - 400) / 2 },
                        { input: resizedLogo, top: 40, left: 40 }, // Logo top-left
                        { input: customerSvg6, top: 880, left: (canvasWidth - 900) / 2 },
                    ])
                    .png()
                    .toBuffer();
                break;


            default:
                // Fallback to Template 1 if for some reason choice is out of bounds
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