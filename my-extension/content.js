// // Function to extract text from the webpage
// function extractText() {
//     return document.body.innerText || document.body.textContent;
//   }
  
//   // Function to count words in a given text
//   function countWords(text) {
//     const words = text.trim().split(/\s+/);
//     return words.length;
//   }
  
//   // Extract text from the webpage
//   const pageText = extractText();
  
//   // Count the words in the extracted text
//   const wordCount = countWords(pageText);
  
//   // Log the word count for debugging
//   console.log('Word count:', wordCount);
  
//   // Send the word count to the background script
//   browser.runtime.sendMessage({wordCount: wordCount});
  