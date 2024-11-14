# AI Ad Copy Generator 📝

A modern, dark-themed web application that generates compelling ad copy using OpenRouter's AI models. Built with vanilla JavaScript, HTML, and CSS.

## Features ✨

- **AI-Powered Copy Generation**: Uses OpenRouter's meta-llama model to create professional ad copy
- **Bilingual Support**: Supports both English 🇬🇧 and Bahasa Malaysia 🇲🇾
- **Dark Theme**: Modern dark theme for better readability
- **Structured Output**: Generates:
  - Attention-grabbing headlines
  - Problem identification
  - Solution presentation
  - Key benefits (bullet points)
  - Special offers (3 bullet points)
  - Strong call-to-action
- **Copy to Clipboard**: One-click copying of generated content
- **Rate Limit Handling**: Clear feedback for API usage limits
- **Cooldown Timer**: 1-minute cooldown between generations
- **Responsive Design**: Works on both desktop and mobile devices

## Setup 🚀

1. Clone the repository:
```bash
git clone https://github.com/xhanafix/bootcampt-generator.git
```

2. Open `index.html` in your web browser

3. Get your API key from [OpenRouter](https://openrouter.ai/keys)

4. Enter your API key in the settings panel

## Usage 💡

1. Click the ⚙️ Settings button to enter your OpenRouter API key
2. Select your preferred language (English/Bahasa Malaysia)
3. Enter your product or service in the input field
4. Click "Generate Ad Copy" to create your ad
5. Wait for the cooldown period (1 minute) between generations
6. Use the "Copy All Text" button to copy the generated content

## Technical Details 🔧

- **API**: OpenRouter API with meta-llama/llama-3.1-405b-instruct model
- **Storage**: Uses localStorage for API key persistence
- **Error Handling**: 
  - API rate limits
  - Network timeouts
  - Invalid responses
- **Timeout**: 60-second API request timeout
- **Cooldown**: 60-second cooldown between generations

## Security Note 🔒

The API key is stored in the browser's localStorage. While convenient, this is not 100% secure. For production use, consider implementing server-side storage and API key management.

## Contributing 🤝

Feel free to submit issues and pull requests.

## License 📄

MIT License

## Author 👨‍💻

Created by [xhanafix](https://github.com/xhanafix)

## Acknowledgments 🙏

- OpenRouter for providing the AI API
- All contributors and users of this tool 