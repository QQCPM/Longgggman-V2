import axios from 'axios';

const API_BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

class DictionaryAPI {
  async searchWord(word) {
    try {
      const response = await axios.get(`${API_BASE_URL}/${word.toLowerCase()}`);
      const data = response.data[0];
      
      return {
        word: data.word,
        phonetic: data.phonetic || data.phonetics?.[0]?.text || `/${word}/`,
        meanings: data.meanings.map(meaning => ({
          partOfSpeech: meaning.partOfSpeech,
          definitions: meaning.definitions.map(def => ({
            definition: def.definition,
            example: def.example || null
          }))
        }))
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`No definition found for "${word}"`);
      }
      throw new Error('Dictionary service unavailable');
    }
  }

  async getWordSuggestions(partialWord) {
    // This would require a different API or service
    // For now, return empty array
    return [];
  }

  async getWordOfTheDay() {
    // Mock implementation - in real app, this would come from an API
    const wordsOfTheDay = [
      {
        word: 'serendipity',
        phonetic: '/ˌsɛrənˈdɪpɪti/',
        meanings: [{
          partOfSpeech: 'noun',
          definitions: [{
            definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
            example: 'A fortunate stroke of serendipity brought the two old friends together.'
          }]
        }]
      },
      {
        word: 'ephemeral',
        phonetic: '/ɪˈfɛmərəl/',
        meanings: [{
          partOfSpeech: 'adjective',
          definitions: [{
            definition: 'Lasting for a very short time.',
            example: 'The beauty of cherry blossoms is ephemeral, lasting only a few weeks.'
          }]
        }]
      },
      {
        word: 'ubiquitous',
        phonetic: '/juːˈbɪkwɪtəs/',
        meanings: [{
          partOfSpeech: 'adjective',
          definitions: [{
            definition: 'Present, appearing, or found everywhere.',
            example: 'Smartphones have become ubiquitous in modern society.'
          }]
        }]
      }
    ];

    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return wordsOfTheDay[dayOfYear % wordsOfTheDay.length];
  }
}

export const dictionaryAPI = new DictionaryAPI();