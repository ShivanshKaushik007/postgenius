
# 🚀 PostGenius: Instant Review-to-Image Generator

Instantly transform positive customer reviews into beautiful, shareable social media graphics.  
PostGenius is a **full-stack Next.js application** that automates the creation of social proof, helping you build brand trust with engaging visual content.

---
![screenshot](/image.png)

## ✨ Overview

In today's market, **social proof is everything**.  
Manually creating graphics for every positive review is **time-consuming and tedious**.  

**PostGenius** solves this by providing:
- A simple **web interface** to input review details.  
- A **powerful backend service** that dynamically generates high-quality images using professional templates.  

This project leverages the **high-performance `sharp` library** for server-side image manipulation, all wrapped in a modern, type-safe Next.js application.

---

## 🌟 Key Features

-  **Dynamic Image Generation** – Creates PNG images on-the-fly from form inputs.  
-  **Multiple Design Templates** – Randomly selects from a variety of attractive templates.  
-  **High-Performance Backend** – Uses the `sharp` library for incredibly fast image processing.  
-  **SVG for Text Rendering** – Generates crisp, scalable text overlays.  
-  **Modern Tech Stack** – Built with Next.js, React, and TypeScript.  
-  **Easy to Customize** – Add your own templates, fonts, and branding.   

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)  
- **Language:** TypeScript  
- **Image Processing:** Sharp  
- **Styling:** Tailwind CSS  
- **Deployment:** Render

---

## 🚀 Getting Started

Follow these steps to set up **PostGenius** locally.

### Prerequisites
- Node.js **18.17 or later**
- npm (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ShivanshKaushik007/postgenius.git
   cd postgenius
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Add your asset images:**
   - Create an `images` folder inside the `public` directory.  
   - Place your **product image** inside and name it `headset.jpg`.  
   - Place your **logo** inside and name it `logo.png`.  

   Final paths:
   ```
   public/images/headset.jpg
   public/images/logo.png
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser 

---

## ⚙️ How It Works

1. **Frontend (`app/generate/page.tsx`)** – User enters review text, customer name, and product name.  
2. **API Request** – A POST request is sent to `/api/generate` with form data.  
3. **Backend (`app/api/generate/route.ts`)** – Runs on Node.js runtime for `sharp`.  
   - Receives JSON payload.  
   - Calls `generateSocialPost`.  
4. **Image Generation (`lib/image-generator.ts`)**  
   - Randomly selects a template.  
   - Loads assets (`headset.jpg`, `logo.png`).  
   - Converts text into SVG.  
   - Uses `sharp` to composite final PNG.  
5. **API Response** – Returns the PNG image buffer.  
6. **Frontend Display** – Renders the image via `URL.createObjectURL`.  
   - User can preview or download the generated image.  

---

## 🎨 Customization

- **Templates** – Modify `lib/image-generator.ts` to add or edit templates.  
- **Fonts & Colors** – Adjust text styles in `createTextSvg` function.  
- **Frontend UI** – Update `app/page.tsx` & `app/generate/page.tsx` with Tailwind CSS classes for layout and styling.  

---



Made By Shivansh kaushik for Minitaka
