let currentWordCount = 0;

// Listen for messages from content scripts
browser.runtime.onMessage.addListener((message) => {
  if (message.wordCount !== undefined) {
    console.log('Word count received:', message.wordCount);
    currentWordCount = message.wordCount;
  }
});

// Listen for requests from the popup script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command === 'getWordCount') {
    sendResponse({wordCount: currentWordCount});
  }
});

