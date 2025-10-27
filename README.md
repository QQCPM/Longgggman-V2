# WordWise - Personal Dictionary & Learning Companion

A modern, interactive web application for building and managing your personal vocabulary collection with AI-powered categorization and smart learning features.

## Features

### **Smart Dictionary Search**
- Real-time word lookup using dictionary APIs
- Phonetic pronunciation with audio playback
- Multiple definitions and usage examples
- Word of the day feature

### **Personal Collection**
- Save words with definitions and examples
- AI-powered categorization (difficulty, topic, word type)
- Advanced filtering and search capabilities
- Export your collection in multiple formats

### **Intelligent Learning**
- Spaced repetition system for effective memorization
- Category-based review sessions
- Progress tracking and difficulty adjustment
- Personalized learning recommendations

### **Analytics & Progress**
- Comprehensive learning statistics
- Activity heatmaps and progress visualization
- Performance insights and recommendations
- Goal setting and tracking

### **User Authentication**
- Gmail OAuth integration
- Secure data storage per user
- Cross-device synchronization
- Data export/import capabilities

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Icons**: Lucide React
- **API**: Dictionary API (dictionaryapi.dev)
- **Storage**: localStorage with user-specific data isolation
- **Authentication**: Google OAuth 2.0
- **Styling**: Tailwind CSS with custom components

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wordwise-dictionary.git
cd wordwise-dictionary
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
`



## Configuration

### Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Update the `CLIENT_ID` in `src/services/authService.js`

### Dictionary API

The app uses the free Dictionary API from dictionaryapi.dev. No API key required.

## Usage

### Basic Workflow

1. **Sign In**: Use your Gmail account to sign in
2. **Search Words**: Enter words in the search bar to get definitions
3. **Save Words**: Click "Save Word" to add them to your collection
4. **Learn**: Use the Learn tab to practice words by category
5. **Track Progress**: View your statistics and learning progress

### Advanced Features

- **Export Data**: Export your word collection as JSON, CSV, or study sheets
- **Import Data**: Import previously exported word collections
- **Custom Categories**: Words are automatically categorized by difficulty, topic, and type
- **Review System**: Intelligent spaced repetition based on your performance

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

