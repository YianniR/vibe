document.getElementById('greetButton').addEventListener('click', () => {
    alert('Hello, World!');
  });
  
  document.getElementById('changeBgButton').addEventListener('click', () => {
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {command: 'changeBackground'});
    });
  });
  
  document.getElementById('fetchJokeButton').addEventListener('click', () => {
    fetch('https://official-joke-api.appspot.com/random_joke')
      .then(response => response.json())
      .then(data => {
        document.getElementById('joke').textContent = `${data.setup} - ${data.punchline}`;
      })
      .catch(error => console.error('Error fetching joke:', error));
  });
  
  document.getElementById('saveNoteButton').addEventListener('click', () => {
    const note = document.getElementById('note').value;
    browser.storage.local.set({note: note}, () => {
      console.log('Note saved:', note);
    });
  });
  
  document.getElementById('getNoteButton').addEventListener('click', () => {
    browser.storage.local.get('note', (data) => {
      console.log('Retrieved note:', data.note);
      document.getElementById('note').value = data.note || '';
    });
  });
  
  document.getElementById('getWordCountButton').addEventListener('click', () => {
    browser.runtime.sendMessage({command: 'getWordCount'}, (response) => {
      if (response && response.wordCount !== undefined) {
        document.getElementById('wordCount').textContent = `Word Count: ${response.wordCount}`;
      }
    });
  });
  