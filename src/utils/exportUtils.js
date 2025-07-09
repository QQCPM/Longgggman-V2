export const exportUtils = {
  // Export words as JSON
  exportAsJSON: (words, userEmail) => {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      userEmail: userEmail,
      totalWords: words.length,
      words: words
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wordwise-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  // Export words as CSV
  exportAsCSV: (words, userEmail) => {
    const headers = ['Word', 'Phonetic', 'Part of Speech', 'Definition', 'Example', 'Difficulty', 'Topic', 'Word Type', 'Date Added', 'Review Count'];
    
    const csvContent = [
      headers.join(','),
      ...words.map(word => [
        `"${word.word}"`,
        `"${word.phonetic || ''}"`,
        `"${word.partOfSpeech}"`,
        `"${word.definition.replace(/"/g, '""')}"`,
        `"${(word.example || '').replace(/"/g, '""')}"`,
        `"${word.categories.difficulty}"`,
        `"${word.categories.topic}"`,
        `"${word.categories.word_type}"`,
        `"${new Date(word.dateAdded).toLocaleDateString()}"`,
        word.reviewCount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wordwise-words-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },

  // Export words as flashcards (text format)
  exportAsFlashcards: (words, userEmail) => {
    const flashcardContent = words.map(word => 
      `FRONT: ${word.word}\n` +
      `BACK: ${word.definition}\n` +
      `PRONUNCIATION: ${word.phonetic || 'N/A'}\n` +
      `EXAMPLE: ${word.example || 'N/A'}\n` +
      `CATEGORY: ${word.categories.difficulty} | ${word.categories.topic}\n` +
      `${'='.repeat(50)}\n`
    ).join('\n');

    const blob = new Blob([flashcardContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wordwise-flashcards-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  },

  // Import words from JSON
  importFromJSON: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          if (data.version !== '1.0') {
            reject(new Error('Unsupported file version'));
            return;
          }
          
          if (!Array.isArray(data.words)) {
            reject(new Error('Invalid file format'));
            return;
          }
          
          resolve(data.words);
        } catch (error) {
          reject(new Error('Failed to parse JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  // Generate study sheet
  generateStudySheet: (words, filterBy = null) => {
    let filteredWords = words;
    
    if (filterBy) {
      const [category, value] = filterBy.split(':');
      filteredWords = words.filter(word => word.categories[category] === value);
    }

    const studyContent = `
WORDWISE STUDY SHEET
Generated: ${new Date().toLocaleDateString()}
Total Words: ${filteredWords.length}
${filterBy ? `Filter: ${filterBy.replace(':', ' - ')}` : 'All Words'}

${'='.repeat(80)}

${filteredWords.map((word, index) => `
${index + 1}. ${word.word.toUpperCase()}
   Pronunciation: ${word.phonetic || 'N/A'}
   Part of Speech: ${word.partOfSpeech}
   Definition: ${word.definition}
   ${word.example ? `Example: ${word.example}` : ''}
   Category: ${word.categories.difficulty} | ${word.categories.topic}
   ${'-'.repeat(60)}
`).join('\n')}

END OF STUDY SHEET
`;

    const blob = new Blob([studyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wordwise-studysheet-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }
};