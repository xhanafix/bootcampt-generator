# AI Ad Copy Generator 📝

A bilingual (English/Bahasa Malaysia) web application that generates compelling ad copy using AI. The application uses the OpenRouter API to generate customized advertising content for any product or service.

## Features ✨

- 🌐 Bilingual support (English and Bahasa Malaysia)
- 🤖 AI-powered ad copy generation
- 📋 Easy copy-to-clipboard functionality
- ⚙️ API key management
- 🔄 Rate limiting and cooldown system
- 🎨 Dark mode support
- 🛡️ Error handling and retry mechanism

## Structure 📂

The application consists of three main files:
- `index.html`: The main HTML structure
- `styles.css`: CSS styling and dark mode support
- `script.js`: Application logic and API integration

## Setup 🚀

1. Clone the repository
2. Get an API key from [OpenRouter](https://openrouter.ai/keys)
3. Open `index.html` in a web browser
4. Click the settings button (⚙️) and enter your API key
5. Start generating ad copy!

## Usage 💡

1. Select your preferred language (English/Bahasa Malaysia)
2. Enter your product or service in the input field
3. Click "Generate Ad Copy" button
4. Wait for the AI to generate your ad copy
5. Use the "Copy All Text" button to copy the generated content

## Generated Content Structure 📑

The generator creates ad copy with the following sections:
- 📢 Headline
- 😟 Problem
- ✅ Solution
- 🎯 Benefits
- 🎁 Offer
- 🔥 Call to Action

## Rate Limiting 🕒

- Minimum interval between requests: 2 seconds
- Daily limit: 50 requests
- Automatic reset at midnight
- Cooldown period after generation

## Error Handling 🛠️

The application handles various error scenarios:
- Network errors
- API rate limiting
- Timeout issues
- Invalid API responses
- Content parsing errors

## Browser Support 🌐

Works on modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Dependencies 📦

- No external libraries required
- Uses native Browser APIs
- Requires internet connection for API access

## Security Notes 🔒

- API keys are stored in browser's local storage
- Not recommended for shared computers
- Consider server-side implementation for production use

## Contributing 🤝

Feel free to submit issues and enhancement requests!

## License 📄

MIT License - feel free to use and modify for your purposes!

## Credits 👏

Created by [xhanafix](https://github.com/xhanafix)

---

For more information or support, please visit the [GitHub repository](https://github.com/xhanafix/ai-ad-copy-generator).