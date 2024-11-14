const API_KEY_STORAGE_KEY = 'openrouter_api_key';
let API_KEY = localStorage.getItem(API_KEY_STORAGE_KEY);

// Settings Modal Elements
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeModal = document.getElementById('closeModal');
const saveSettings = document.getElementById('saveSettings');
const apiKeyInput = document.getElementById('apiKey');
const toggleApiKey = document.getElementById('toggleApiKey');

// Settings Modal Functions
function openSettings() {
    settingsModal.style.display = 'block';
    if (API_KEY) {
        apiKeyInput.value = API_KEY;
    }
}

function closeSettings() {
    settingsModal.style.display = 'none';
}

function saveApiKey() {
    const newApiKey = apiKeyInput.value.trim();
    if (newApiKey) {
        API_KEY = newApiKey;
        localStorage.setItem(API_KEY_STORAGE_KEY, API_KEY);
        closeSettings();
    } else {
        alert('Sila masukkan kunci API yang sah');
    }
}

function toggleApiKeyVisibility() {
    const type = apiKeyInput.type === 'password' ? 'text' : 'password';
    apiKeyInput.type = type;
    toggleApiKey.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
}

// Event Listeners for Settings
settingsBtn.addEventListener('click', openSettings);
closeModal.addEventListener('click', closeSettings);
saveSettings.addEventListener('click', saveApiKey);
toggleApiKey.addEventListener('click', toggleApiKeyVisibility);

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
        closeSettings();
    }
});

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const loading = document.getElementById('loading');
const outputSection = document.getElementById('outputSection');

async function generateAdCopy(product) {
    const prompt = `Cipta salinan iklan yang menarik untuk ${product} menggunakan format TEPAT berikut dalam Bahasa Malaysia:

Tajuk Utama: [Tulis tajuk utama yang menarik perhatian]

Masalah: [Kenalpasti masalah atau kesukaran utama]

Penyelesaian: [Persembahkan penyelesaian menggunakan ${product}]

Faedah:
- [Faedah utama 1]
- [Faedah utama 2]
- [Faedah utama 3]

Tawaran: [Berikan tawaran yang menarik]

Seruan Tindakan: [Tambah seruan tindakan yang kuat]

Buatkan ia santai, tambah emoji, dan mudah dibaca. Tulis seperti bercakap dengan kawan, tetapi KEKALKAN TAJUK BAHAGIAN yang tepat seperti di atas.`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'HTTP-Referer': 'https://openrouter.ai/docs',
                'X-Title': 'AI Ad Copy Generator'
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                temperature: 0.7,
                max_tokens: 1000,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (!data.choices?.[0]?.message?.content) {
            throw new Error('Unexpected API response format');
        }

        const content = data.choices[0].message.content;
        console.log('Content to parse:', content);

        return parseAdCopy(content);
    } catch (error) {
        console.error('API Error:', error);
        throw new Error(`Failed to generate ad copy: ${error.message}`);
    }
}

function parseAdCopy(content) {
    try {
        const sections = {
            headline: '',
            problem: '',
            solution: '',
            benefits: [],
            offer: '',
            cta: ''
        };

        // Split content into lines and remove empty lines
        const lines = content.split('\n').filter(line => line.trim());
        let currentSection = null;

        for (const line of lines) {
            const lowerLine = line.toLowerCase();

            // Match both English and Malay headers
            if (lowerLine.includes('tajuk utama:') || lowerLine.includes('headline:')) {
                currentSection = 'headline';
                sections.headline = line.split(/(?:tajuk utama:|headline:)/i)[1]?.trim() || '';
            } else if (lowerLine.includes('masalah:') || lowerLine.includes('problem:')) {
                currentSection = 'problem';
                sections.problem = line.split(/(?:masalah:|problem:)/i)[1]?.trim() || '';
            } else if (lowerLine.includes('penyelesaian:') || lowerLine.includes('solution:')) {
                currentSection = 'solution';
                sections.solution = line.split(/(?:penyelesaian:|solution:)/i)[1]?.trim() || '';
            } else if (lowerLine.includes('faedah:') || lowerLine.includes('benefits:')) {
                currentSection = 'benefits';
            } else if (lowerLine.includes('tawaran:') || lowerLine.includes('offer:')) {
                currentSection = 'offer';
                sections.offer = line.split(/(?:tawaran:|offer:)/i)[1]?.trim() || '';
            } else if (lowerLine.includes('seruan tindakan:') || lowerLine.includes('call to action:')) {
                currentSection = 'cta';
                sections.cta = line.split(/(?:seruan tindakan:|call to action:)/i)[1]?.trim() || '';
            } else if (line.trim()) {
                // Handle bullet points and content lines
                if (currentSection === 'benefits' && 
                    (line.trim().startsWith('🔹') || 
                     line.trim().startsWith('-') || 
                     line.trim().startsWith('•') ||
                     line.trim().startsWith('✓'))) {
                    // Clean up benefit text by removing hashtags and emojis at the end
                    let benefit = line.replace(/^[🔹\-•✓]/, '').trim();
                    benefit = benefit.replace(/#\w+/g, '').trim(); // Remove hashtags
                    benefit = benefit.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]\s*$/g, '').trim(); // Remove trailing emojis
                    if (benefit) {
                        sections.benefits.push(benefit);
                    }
                } else if (currentSection && currentSection !== 'benefits') {
                    // Clean up section text
                    let text = line.trim();
                    text = text.replace(/#\w+/g, '').trim(); // Remove hashtags
                    sections[currentSection] += (sections[currentSection] ? ' ' : '') + text;
                }
            }
        }

        // Clean up sections and provide defaults
        Object.keys(sections).forEach(key => {
            if (typeof sections[key] === 'string') {
                // Remove hashtags and clean up trailing emojis
                sections[key] = sections[key]
                    .replace(/#\w+/g, '')
                    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]\s*$/g, '')
                    .trim();
                
                // Provide default values in Malay
                if (!sections[key]) {
                    switch(key) {
                        case 'headline':
                            sections[key] = 'Tajuk utama tidak disediakan';
                            break;
                        case 'problem':
                            sections[key] = 'Masalah tidak dikenalpasti';
                            break;
                        case 'solution':
                            sections[key] = 'Penyelesaian tidak disediakan';
                            break;
                        case 'offer':
                            sections[key] = 'Tawaran tidak disediakan';
                            break;
                        case 'cta':
                            sections[key] = 'Seruan tindakan tidak disediakan';
                            break;
                    }
                }
            }
        });

        // Ensure we have at least one benefit
        if (sections.benefits.length === 0) {
            sections.benefits = ['Tiada faedah khusus disenaraikan'];
        }

        console.log('Parsed sections:', sections);
        return sections;
    } catch (error) {
        console.error('Parsing Error:', error);
        throw new Error('Gagal menganalisis kandungan yang dijana');
    }
}

function displayAdCopy(adCopy) {
    document.getElementById('headline').textContent = adCopy.headline;
    document.getElementById('problem').textContent = adCopy.problem;
    document.getElementById('solution').textContent = adCopy.solution;
    
    const benefitsList = document.getElementById('benefits');
    benefitsList.innerHTML = '';
    adCopy.benefits.forEach(benefit => {
        const li = document.createElement('li');
        li.textContent = benefit;
        benefitsList.appendChild(li);
    });
    
    document.getElementById('offer').textContent = adCopy.offer;
    document.getElementById('cta').textContent = adCopy.cta;
}

function showError(message) {
    const errorMessages = {
        'Please set your API key in settings first': 'Sila tetapkan kunci API anda dalam tetapan terlebih dahulu',
        'Please enter a product or service!': 'Sila masukkan produk atau perkhidmatan!',
        'Failed to parse the generated content': 'Gagal menganalisis kandungan yang dijana',
        'Unexpected API response format': 'Format respons API tidak dijangka',
        'No specific benefits listed': 'Tiada faedah khusus disenaraikan',
        'No headline provided': 'Tiada tajuk utama disediakan',
        'No problem identified': 'Tiada masalah dikenalpasti',
        'No solution provided': 'Tiada penyelesaian disediakan',
        'No call to action provided': 'Tiada seruan tindakan disediakan',
        'No specific offer provided': 'Tiada tawaran khusus disediakan'
    };

    const translatedMessage = errorMessages[message] || message;
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = `⚠️ ${translatedMessage}`;
    
    const inputSection = document.querySelector('.input-section');
    inputSection.insertBefore(errorDiv, inputSection.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

generateBtn.addEventListener('click', async () => {
    if (!API_KEY) {
        openSettings();
        showError('Please set your API key in settings first');
        return;
    }
    
    const product = document.getElementById('product').value;
    if (!product) {
        showError('Please enter a product or service!');
        return;
    }

    loading.style.display = 'block';
    outputSection.style.display = 'none';

    try {
        const adCopy = await generateAdCopy(product);
        displayAdCopy(adCopy);
        outputSection.style.display = 'block';
    } catch (error) {
        showError(error.message);
        console.error('Generation Error:', error);
    } finally {
        loading.style.display = 'none';
    }
});

copyBtn.addEventListener('click', () => {
    const sections = document.querySelectorAll('.copy-element');
    let fullText = '';
    
    sections.forEach(section => {
        const title = section.querySelector('h2').textContent;
        const content = section.querySelector('p, ul').textContent;
        fullText += `${title}\n${content}\n\n`;
    });

    navigator.clipboard.writeText(fullText).then(() => {
        copyBtn.textContent = 'Disalin! 👍';
        setTimeout(() => {
            copyBtn.textContent = 'Salin Semua Teks 📋';
        }, 2000);
    });
});

function showSecurityWarning() {
    const warning = document.createElement('div');
    warning.className = 'api-key-warning';
    warning.innerHTML = `
        ⚠️ Nota: Kunci API anda disimpan dalam storan tempatan pelayar. 
        Walaupun mudah, ini tidak 100% selamat. Jangan gunakan pada komputer yang dikongsi.
        Untuk penggunaan produksi, pertimbangkan untuk melaksanakan penyimpanan di pelayan.
    `;
    document.querySelector('.input-section').prepend(warning);
    setTimeout(() => warning.remove(), 5000);
} 