
export function extractImpactfulQuote(reviewText: string): string {
  const positiveKeywords = ["love", "amazing", "excellent", "phenomenal", "perfect", "fantastic", "wonderful", "best"];
   
  const sentences = reviewText.match(/[^.!?]+[.!?]+/g) || [reviewText];

  for (const sentence of sentences) {
    for (const keyword of positiveKeywords) {
      if (sentence.toLowerCase().includes(keyword)) {
        return sentence.trim();
      }
    }
  }

  
  return sentences[0]?.trim() || reviewText.trim();
}