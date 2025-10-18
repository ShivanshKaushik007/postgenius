"use client";

import { useState } from "react";
import Image from "next/image"; // Corrected import
import Link from "next/link";

export default function HomePage() {
  const [reviewText, setReviewText] = useState("I absolutely love this new wireless headset! The sound quality is crystal clear, and the battery life is just phenomenal.");
  const [customerName, setCustomerName] = useState("Jane D.");
  const [productName, setProductName] = useState("AuraWave Pro Headset");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Corrected handleSubmit function
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          review_text: reviewText,
          customer_name: customerName,
          product_name: productName,
        }),
      });

      if (response.ok) {
        const imageBlob = await response.blob();
        setGeneratedImage(URL.createObjectURL(imageBlob));
      } else {
        const errorData = await response.json();
        alert(`Failed to generate image: ${errorData.error || 'Unknown error'}`);
        console.error('API Error:', errorData);
      }
    } catch (error) {
      console.error('Network or client-side error:', error);
      alert('An unexpected error occurred. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#0F0F0F' }}>
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full bg-dark/80 backdrop-blur-lg border-b border-secondary z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Image 
            src="/logo.png" 
            alt="PostGenius Logo" 
            width={80}   
            height={80}
            className="h-12 w-auto" 
          />
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-muted hover:text-light transition-colors">Home</Link>
            <Link href="/#how-it-works" className="text-muted hover:text-light transition-colors">About</Link>
            <Link href="/#features" className="text-muted hover:text-light transition-colors">Features</Link>
          </div>
        </nav>
      </header>
      
      <main className="flex min-h-screen flex-col items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-2xl bg-[#1c1c22] rounded-lg shadow-md mt-16 p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-white">Generate Post</h1>
          
          {/* The Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="reviewText" className="block text-md font-medium text-white">Customer Review Text</label>
              <textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 p-3 border-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="customerName" className="block text-md font-medium text-white">Customer Name</label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 p-3 border-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="productName" className="block text-md font-medium text-white ">Product Name</label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 p-3 border-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {isLoading ? 'Generating...' : 'Generate Image'}
            </button>
          </form>

          {/* Display area for the generated image */}
          {generatedImage && (
            <div className="mt-8 border-t border-gray-700 pt-6">
              <h2 className="text-2xl font-bold mb-4 text-center text-white">Generated Post:</h2>
              <div className="flex justify-center">
                <Image 
                  src={generatedImage} 
                  alt="Generated social media post" 
                  className="rounded-lg shadow-lg" 
                  width={600}
                  height={600} // Set height to maintain aspect ratio
                />
              </div>
              <div className="mt-4 text-center">
                  <a href={generatedImage} download="social-post.png" className="inline-block bg-[#5227ff] text-white font-bold py-2 px-4 rounded hover:bg-[#5227ff]/80">
                      Download Image
                  </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}