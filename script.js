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

const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const loading = document.getElementById('loading');
const outputSection = document.getElementById('outputSection');

// Add language translations
const translations = {
    ms: {
        settings: '⚙️ Tetapan',
        apiKeyLabel: 'Kunci API OpenRouter:',
        apiKeyPlaceholder: 'Masukkan kunci API anda',
        noApiKey: 'Belum ada kunci API?',
        getApiKey: 'Dapatkan di sini',
        saveSettings: 'Simpan Tetapan',
        close: 'Tutup',
        productLabel: 'Apakah produk atau perkhidmatan anda?',
        productPlaceholder: 'contoh: Kelas Yoga, Pembuat Kopi, Perkhidmatan Reka Bentuk Web',
        generateBtn: 'Jana Salinan Iklan ✨',
        loading: 'Sedang menjana salinan iklan yang menarik... 🤖',
        headline: '📢 Tajuk Utama',
        problem: '😟 Masalah',
        solution: '✅ Penyelesaian',
        benefits: '🎯 Faedah',
        offer: '🎁 Tawaran',
        cta: '🔥 Seruan Tindakan',
        copyBtn: 'Salin Semua Teks 📋',
        copied: 'Disalin! 👍',
        errors: {
            noApiKey: 'Sila tetapkan kunci API anda dalam tetapan terlebih dahulu',
            noProduct: 'Sila masukkan produk atau perkhidmatan!',
            parseError: 'Gagal menganalisis kandungan yang dijana',
            apiError: 'Ralat API:',
            defaultError: 'Ralat tidak dijangka berlaku',
            rateLimit: 'Had penggunaan harian telah dicapai. Sila cuba lagi esok atau naik taraf ke pelan berbayar.'
        },
        cooldown: {
            wait: 'Sila tunggu %ss...',
            ready: 'Jana Salinan Iklan ✨'
        }
    },
    en: {
        settings: '⚙️ Settings',
        apiKeyLabel: 'OpenRouter API Key:',
        apiKeyPlaceholder: 'Enter your API key',
        noApiKey: "Don't have an API key?",
        getApiKey: 'Get one here',
        saveSettings: 'Save Settings',
        close: 'Close',
        productLabel: "What's your product or service?",
        productPlaceholder: 'e.g., Yoga Classes, Coffee Maker, Web Design Services',
        generateBtn: 'Generate Ad Copy ✨',
        loading: 'Creating your compelling ad copy... 🤖',
        headline: '📢 Headline',
        problem: '😟 Problem',
        solution: '✅ Solution',
        benefits: '🎯 Benefits',
        offer: '🎁 Offer',
        cta: '🔥 Call to Action',
        copyBtn: 'Copy All Text 📋',
        copied: 'Copied! 👍',
        errors: {
            noApiKey: 'Please set your API key in settings first',
            noProduct: 'Please enter a product or service!',
            parseError: 'Failed to parse the generated content',
            apiError: 'API Error:',
            defaultError: 'An unexpected error occurred',
            rateLimit: 'Daily usage limit reached. Please try again tomorrow or upgrade to a paid plan.'
        },
        cooldown: {
            wait: 'Please wait %ss...',
            ready: 'Generate Ad Copy ✨'
        }
    }
};

// Add language selection handling
let currentLanguage = 'ms';
const languageSelect = document.getElementById('languageSelect');

function updateUILanguage(lang) {
    currentLanguage = lang;
    const t = translations[lang];
    
    // Update all UI elements
    document.getElementById('settingsTitle').textContent = t.settings;
    document.getElementById('apiKeyLabel').textContent = t.apiKeyLabel;
    document.getElementById('apiKey').placeholder = t.apiKeyPlaceholder;
    document.getElementById('noApiKeyText').textContent = t.noApiKey;
    document.getElementById('getApiKeyLink').textContent = t.getApiKey;
    document.getElementById('saveSettings').textContent = t.saveSettings;
    document.getElementById('closeModal').textContent = t.close;
    document.getElementById('productLabel').textContent = t.productLabel;
    document.getElementById('product').placeholder = t.productPlaceholder;
    document.getElementById('generateBtn').textContent = t.generateBtn;
    document.getElementById('loadingText').textContent = t.loading;
    document.getElementById('headlineTitle').textContent = t.headline;
    document.getElementById('problemTitle').textContent = t.problem;
    document.getElementById('solutionTitle').textContent = t.solution;
    document.getElementById('benefitsTitle').textContent = t.benefits;
    document.getElementById('offerTitle').textContent = t.offer;
    document.getElementById('ctaTitle').textContent = t.cta;
    document.getElementById('copyBtn').textContent = t.copyBtn;
}

languageSelect.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    updateUILanguage(currentLanguage);
    
    // Update button text if in cooldown
    if (generateBtn.disabled) {
        const timeLeft = parseInt(generateBtn.textContent.match(/\d+/)[0]);
        generateBtn.textContent = currentLanguage === 'ms' ? 
            `Sila tunggu ${timeLeft}s...` :
            `Please wait ${timeLeft}s...`;
    }
});

// Update timeout settings
const TIMEOUT_SETTINGS = {
    default: 30000,    // 30 seconds
    retry: {
        count: 2,      // Number of retries
        delay: 1000    // Delay between retries
    }
};

// Add retry logic to fetchWithTimeout
async function fetchWithTimeout(resource, options = {}) {
    const { timeout = TIMEOUT_SETTINGS.default } = options;
    let attempts = 0;
    
    while (attempts < TIMEOUT_SETTINGS.retry.count) {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);
            
            const response = await fetch(resource, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(id);
            return response;
        } catch (error) {
            attempts++;
            if (attempts === TIMEOUT_SETTINGS.retry.count) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, TIMEOUT_SETTINGS.retry.delay));
        }
    }
}

// Add rate limit tracking
const RATE_LIMIT = {
    lastRequest: 0,
    minInterval: 2000, // Minimum 2 seconds between requests
    dailyLimit: 50,    // Example daily limit
    dailyCount: 0,
    resetTime: null
};

// Update generateAdCopy function
async function generateAdCopy(product) {
    // Check rate limits
    const now = Date.now();
    if (now - RATE_LIMIT.lastRequest < RATE_LIMIT.minInterval) {
        throw new Error(currentLanguage === 'ms' ? 
            'Terlalu banyak permintaan. Sila tunggu sebentar.' :
            'Too many requests. Please wait a moment.');
    }
    
    if (RATE_LIMIT.dailyCount >= RATE_LIMIT.dailyLimit) {
        const resetTime = RATE_LIMIT.resetTime || new Date(new Date().setHours(24,0,0,0));
        throw new Error(translations[currentLanguage].errors.rateLimit);
    }

    RATE_LIMIT.lastRequest = now;
    RATE_LIMIT.dailyCount++;
    
    const t = translations[currentLanguage];
    const prompt = currentLanguage === 'ms' ? 
        `Cipta salinan iklan yang menarik untuk ${product} menggunakan format TEPAT berikut dalam Bahasa Malaysia:

Tajuk Utama: [Tulis tajuk utama yang menarik perhatian]
Masalah: [Kenalpasti masalah atau kesukaran utama]
Penyelesaian: [Persembahkan penyelesaian menggunakan ${product}]
Faedah:
- [Faedah utama 1]
- [Faedah utama 2]
- [Faedah utama 3]
Tawaran:
- [Tawaran menarik 1]
- [Tawaran menarik 2]
- [Tawaran menarik 3]
Seruan Tindakan: [Tambah seruan tindakan yang kuat]` :
        `Create a compelling ad copy for ${product} using the EXACT format below in English:

Headline: [Write an attention-grabbing headline]
Problem: [Identify the main problem or pain point]
Solution: [Present the solution using ${product}]
Benefits:
- [Key benefit 1]
- [Key benefit 2]
- [Key benefit 3]
Offer:
- [Compelling offer point 1]
- [Compelling offer point 2]
- [Compelling offer point 3]
Call to Action: [Add a strong call to action]`;

    try {
        const response = await fetchWithTimeout("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "HTTP-Referer": "https://openrouter.ai/docs",
                "X-Title": "AI Ad Copy Generator",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "google/learnlm-1.5-pro-experimental:free",
                messages: [{
                    role: "user",
                    content: prompt
                }],
                temperature: 0.7,
                max_tokens: 1000
            }),
            timeout: 60000
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error Response:', errorData);

            // Handle specific error cases
            if (response.status === 429) {
                throw new Error('RATE_LIMIT');
            }
            
            throw new Error(currentLanguage === 'ms' ? 
                `Ralat API: ${errorData.error?.message || response.statusText}` :
                `API Error: ${errorData.error?.message || response.statusText}`
            );
        }

        const data = await response.json().catch(() => null);
        console.log('API Response:', data);

        if (!data || !data.choices || !Array.isArray(data.choices) || !data.choices[0]?.message?.content) {
            throw new Error(currentLanguage === 'ms' ? 
                'Format respons API tidak lengkap atau tidak sah' :
                'Invalid or incomplete API response format'
            );
        }

        const content = data.choices[0].message.content.trim();
        if (!content) {
            throw new Error(currentLanguage === 'ms' ? 
                'Respons API kosong' :
                'Empty API response'
            );
        }

        // Add validation for parsed content
        const parsedContent = parseAdCopy(content);
        if (!parsedContent.headline || !parsedContent.problem || !parsedContent.solution) {
            console.error('Parsed content validation failed:', parsedContent);
            throw new Error(currentLanguage === 'ms' ? 
                'Gagal menghasilkan salinan iklan yang lengkap' :
                'Failed to generate complete ad copy'
            );
        }

        return parsedContent;

    } catch (error) {
        console.error('Generation Error:', error);
        
        // Handle specific error types
        if (error.message === 'RATE_LIMIT') {
            throw new Error(translations[currentLanguage].errors.rateLimit);
        }
        
        if (error.name === 'AbortError') {
            throw new Error(currentLanguage === 'ms' ? 
                'Permintaan tamat masa. Sila cuba lagi.' :
                'Request timed out. Please try again.'
            );
        }

        // For network errors
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            throw new Error(currentLanguage === 'ms' ? 
                'Ralat rangkaian. Sila periksa sambungan internet anda.' :
                'Network error. Please check your internet connection.'
            );
        }

        throw new Error(currentLanguage === 'ms' ? 
            `Gagal menjana salinan iklan: ${error.message}` :
            `Failed to generate ad copy: ${error.message}`
        );
    }
}

function parseAdCopy(content) {
    try {
        const sections = {
            headline: '',
            problem: '',
            solution: '',
            benefits: [],
            offer: [],
            cta: ''
        };

        // Split content and remove empty lines
        const lines = content.split('\n').filter(line => line.trim());
        
        if (lines.length < 4) {
            throw new Error(currentLanguage === 'ms' ? 
                'Kandungan yang dijana terlalu pendek' :
                'Generated content is too short'
            );
        }

        let currentSection = null;

        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            
            // Add debug logging
            console.log('Processing line:', line);

            // Match section headers with more flexible patterns
            if (/(tajuk\s*utama|headline)\s*:/i.test(lowerLine)) {
                currentSection = 'headline';
                sections.headline = line.split(/:\s*/)[1]?.trim() || '';
            } else if (/(masalah|problem)\s*:/i.test(lowerLine)) {
                currentSection = 'problem';
                sections.problem = line.split(/:\s*/)[1]?.trim() || '';
            } else if (/(penyelesaian|solution)\s*:/i.test(lowerLine)) {
                currentSection = 'solution';
                sections.solution = line.split(/:\s*/)[1]?.trim() || '';
            } else if (/(faedah|benefits)\s*:/i.test(lowerLine)) {
                currentSection = 'benefits';
            } else if (/(tawaran|offer)\s*:/i.test(lowerLine)) {
                currentSection = 'offer';
            } else if (/(seruan tindakan|call to action)\s*:/i.test(lowerLine)) {
                currentSection = 'cta';
                const ctaMatch = line.match(/(?:seruan tindakan:|call to action:)(.*)/i);
                sections.cta = ctaMatch ? ctaMatch[1].trim() : '';
            } else if (line.trim()) {
                if (currentSection === 'benefits' && 
                    (line.trim().startsWith('🔹') || 
                     line.trim().startsWith('-') || 
                     line.trim().startsWith('•') ||
                     line.trim().startsWith('✓'))) {
                    let benefit = line.replace(/^[🔹\-•✓]/, '').trim();
                    benefit = benefit.replace(/#\w+/g, '').trim();
                    benefit = benefit.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]\s*$/g, '').trim();
                    if (benefit) {
                        sections.benefits.push(benefit);
                    }
                } else if (currentSection === 'offer') {
                    let offerPoint = line.trim();
                    offerPoint = offerPoint.replace(/^[🔹\-•✓]/, '').trim();
                    offerPoint = offerPoint.replace(/#\w+/g, '').trim();
                    offerPoint = offerPoint.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]\s*$/g, '').trim();
                    if (offerPoint) {
                        sections.offer.push(offerPoint);
                    }
                } else if (currentSection === 'cta' && !sections.cta) {
                    // If CTA section is empty, use the full line
                    sections.cta = line.trim();
                }
            }
        }

        // Validate parsed content
        if (!sections.headline || !sections.problem || !sections.solution) {
            console.error('Invalid parsed sections:', sections);
            throw new Error(currentLanguage === 'ms' ? 
                'Format kandungan tidak lengkap' :
                'Incomplete content format'
            );
        }

        return sections;
    } catch (error) {
        console.error('Parsing Error:', error);
        throw new Error(currentLanguage === 'ms' ? 
            `Gagal menganalisis kandungan: ${error.message}` :
            `Failed to parse content: ${error.message}`
        );
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
    
    const offerElement = document.getElementById('offer');
    offerElement.innerHTML = '';
    const offerList = document.createElement('ul');
    adCopy.offer.forEach(offerPoint => {
        const li = document.createElement('li');
        li.textContent = offerPoint;
        offerList.appendChild(li);
    });
    offerElement.appendChild(offerList);
    
    document.getElementById('cta').textContent = adCopy.cta;
}

// Update the showError function to handle timeout errors better
function showError(message) {
    const t = translations[currentLanguage].errors;
    let translatedMessage = t[message] || message;
    
    // Handle specific error types
    if (message.includes('rate limit') || message === t.rateLimit) {
        translatedMessage = t.rateLimit;
    } else if (message.includes('timed out') || message.includes('tamat masa')) {
        translatedMessage = currentLanguage === 'ms' ? 
            'Permintaan tamat masa. Sila cuba lagi.' : 
            'Request timed out. Please try again.';
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = `⚠️ ${translatedMessage}`;
    
    // For rate limit errors, keep the message longer
    const timeout = message === t.rateLimit ? 10000 : 5000;
    
    const inputSection = document.querySelector('.input-section');
    inputSection.insertBefore(errorDiv, inputSection.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, timeout);
    
    // Disable the generate button for rate limit errors
    if (message === t.rateLimit) {
        generateBtn.disabled = true;
        setTimeout(() => {
            generateBtn.disabled = false;
            generateBtn.textContent = translations[currentLanguage].generateBtn;
        }, 60000); // Re-enable after 1 minute
    }
}

// Add these constants at the top with other constants
const COOLDOWN_TIME = 60; // 1 minute in seconds
let cooldownTimer = null;
let isGenerating = false;

// Add this function to handle the cooldown timer
function startCooldown() {
    let timeLeft = COOLDOWN_TIME;
    generateBtn.disabled = true;
    
    cooldownTimer = setInterval(() => {
        timeLeft--;
        generateBtn.textContent = currentLanguage === 'ms' ? 
            `Sila tunggu ${timeLeft}s...` :
            `Please wait ${timeLeft}s...`;

        if (timeLeft <= 0) {
            clearInterval(cooldownTimer);
            generateBtn.disabled = false;
            generateBtn.textContent = translations[currentLanguage].generateBtn;
        }
    }, 1000);
}

// Update the generateBtn click handler
generateBtn.addEventListener('click', async () => {
    if (!API_KEY) {
        openSettings();
        showError('Please set your API key in settings first');
        return;
    }
    
    if (isGenerating) {
        return;
    }
    
    const product = document.getElementById('product').value;
    if (!product) {
        showError('Please enter a product or service!');
        return;
    }

    isGenerating = true;
    loading.style.display = 'block';
    outputSection.style.display = 'none';

    try {
        const adCopy = await generateAdCopy(product);
        displayAdCopy(adCopy);
        outputSection.style.display = 'block';
        startCooldown(); // Start the cooldown timer after successful generation
    } catch (error) {
        showError(error.message);
        console.error('Generation Error:', error);
        generateBtn.disabled = false;
        generateBtn.textContent = translations[currentLanguage].generateBtn;
    } finally {
        loading.style.display = 'none';
        isGenerating = false;
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

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Existing initialization
    currentLanguage = languageSelect.value;
    updateUILanguage(currentLanguage);
    
    // Clear any existing cooldown
    if (cooldownTimer) {
        clearInterval(cooldownTimer);
        cooldownTimer = null;
    }
    generateBtn.disabled = false;
    generateBtn.textContent = translations[currentLanguage].generateBtn;
});

// Add rate limit reset at midnight
function setupRateLimitReset() {
    const now = new Date();
    const tomorrow = new Date(now.setHours(24,0,0,0));
    const timeUntilReset = tomorrow - now;
    
    setTimeout(() => {
        RATE_LIMIT.dailyCount = 0;
        RATE_LIMIT.resetTime = new Date(new Date().setHours(24,0,0,0));
        setupRateLimitReset(); // Setup next reset
    }, timeUntilReset);
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', setupRateLimitReset);
 
