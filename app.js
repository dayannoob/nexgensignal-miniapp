/**
 * NexGen Signal - Mini App
 * Professional Crypto Trading Dashboard
 */

// ==================== CONFIGURATION ====================
const CONFIG = {
    API_BASE_URL: 'https://api.nexgensignal.com', // Your backend API
    CRYPTO_API: 'https://api.coingecko.com/api/v3',
    FEAR_GREED_API: 'https://api.alternative.me/fng/',
    REFERRAL_COMMISSION: 20, // 20% commission
    FREE_SIGNALS_LIMIT: 3,
    PRO_MONTHLY_USD: 15,
    VIP_MONTHLY_USD: 49,
    PRO_MONTHLY_TOMAN: 600000,
    VIP_MONTHLY_TOMAN: 2000000,
    USD_TO_TOMAN: 580000 // Approximate rate
};

// ==================== STATE ====================
const state = {
    language: 'en',
    userPlan: 'free',
    signalsToday: 0,
    portfolio: [],
    prices: {},
    theme: 'dark'
};

// ==================== TRANSLATIONS ====================
const translations = {
    en: {
        dashboard: 'Dashboard',
        prices: 'Prices',
        signals: 'Signals',
        portfolio: 'Portfolio',
        market_overview: 'Market Overview',
        gold: 'Gold',
        usd_rate: 'USD/IRR',
        eur_rate: 'EUR/IRR',
        fear_greed: 'Fear & Greed Index',
        btc_chart: 'BTC Price Chart',
        latest_news: 'Latest News',
        search_placeholder: 'Search coin...',
        trading_signals: 'Trading Signals',
        today_signals: "Today's Signals",
        unlock_unlimited: 'Unlock Unlimited Signals',
        my_portfolio: 'My Portfolio',
        total_value: 'Total Value',
        total_pnl: 'Total P/L',
        add_holding: 'Add Holding',
        symbol: 'Symbol',
        amount: 'Amount',
        buy_price: 'Buy Price (USD)',
        add: 'Add',
        leaderboard: 'Leaderboard',
        referral: 'Referral Program',
        education: 'Education',
        alerts: 'Price Alerts',
        settings: 'Settings',
        support: 'Support',
        invite_friends: 'Invite Friends & Earn',
        referrals: 'Referrals',
        earned: 'Earned',
        referral_info: 'Share your link and earn 20% commission on every subscription!',
        top_traders: 'Top Traders This Month',
        buy: 'BUY',
        sell: 'SELL',
        hold: 'HOLD',
        target: 'Target',
        stop_loss: 'Stop Loss',
        confidence: 'Confidence'
    },
    fa: {
        dashboard: 'داشبورد',
        prices: 'قیمت‌ها',
        signals: 'سیگنال‌ها',
        portfolio: 'پورتفولیو',
        market_overview: 'نمای کلی بازار',
        gold: 'طلای جهانی',
        usd_rate: 'دلار/تومان',
        eur_rate: 'یورو/تومان',
        fear_greed: 'شاخص ترس و طمع',
        btc_chart: 'نمودار قیمت بیتکوین',
        latest_news: 'آخرین اخبار',
        search_placeholder: 'جستجوی ارز...',
        trading_signals: 'سیگنال‌های معاملاتی',
        today_signals: 'سیگنال‌های امروز',
        unlock_unlimited: 'باز کردن سیگنال نامحدود',
        my_portfolio: 'پورتفولیوی من',
        total_value: 'ارزش کل',
        total_pnl: 'سود/ضرر کل',
        add_holding: 'افزودن دارایی',
        symbol: 'نماد',
        amount: 'تعداد',
        buy_price: 'قیمت خرید (دلار)',
        add: 'افزودن',
        leaderboard: 'لیدربورد',
        referral: 'سیستم رفرال',
        education: 'آموزش',
        alerts: 'هشدار قیمت',
        settings: 'تنظیمات',
        support: 'پشتیبانی',
        invite_friends: 'دوستان را دعوت کنید و کسب درآمد کنید',
        referrals: 'دعوت‌شدگان',
        earned: 'درآمد',
        referral_info: 'لینک خود را به اشتراک بگذارید و 20% کمیسیون از هر اشتراک دریافت کنید!',
        top_traders: 'برترین تریدرهای این ماه',
        buy: 'خرید',
        sell: 'فروش',
        hold: 'نگهداری',
        target: 'هدف',
        stop_loss: 'حد ضرر',
        confidence: 'اطمینان'
    }
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initTelegramWebApp();
    initEventListeners();
    loadUserData();
    loadPrices();
    loadFearGreedIndex();
    loadNews();
    initCharts();
    updateUI();
});

// Initialize Telegram Web App
function initTelegramWebApp() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();

        // Apply theme
        if (tg.colorScheme === 'dark') {
            document.body.classList.add('dark-theme');
        }

        // Get user data
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            state.userId = tg.initDataUnsafe.user.id;
            state.username = tg.initDataUnsafe.user.username;
        }

        // Haptic feedback
        tg.HapticFeedback.impactOccurred('light');
    }
}

// ==================== EVENT LISTENERS ====================
function initEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Language toggle
    document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);

    // Portfolio modal
    document.getElementById('add-portfolio-btn').addEventListener('click', openPortfolioModal);
    document.getElementById('close-modal').addEventListener('click', closePortfolioModal);
    document.getElementById('submit-portfolio').addEventListener('click', submitPortfolio);

    // Search
    document.getElementById('search-coin').addEventListener('input', filterCoins);

    // More menu items
    document.getElementById('leaderboard-link').addEventListener('click', (e) => {
        e.preventDefault();
        showLeaderboard();
    });
    document.getElementById('referral-link').addEventListener('click', (e) => {
        e.preventDefault();
        showReferral();
    });

    // Referral copy
    document.getElementById('copy-referral').addEventListener('click', copyReferralLink);
}

// ==================== TAB NAVIGATION ====================
function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });

    // Haptic feedback
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
}

// ==================== LANGUAGE ====================
function toggleLanguage() {
    state.language = state.language === 'en' ? 'fa' : 'en';
    document.getElementById('lang-toggle').textContent = state.language.toUpperCase();

    // Set direction
    document.documentElement.dir = state.language === 'fa' ? 'rtl' : 'ltr';

    updateUI();
    saveUserData();
}

function t(key) {
    return translations[state.language][key] || translations['en'][key] || key;
}

function updateUI() {
    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
}

// ==================== DATA LOADING ====================
async function loadPrices() {
    try {
        // Load crypto prices from CoinGecko
        const response = await axios.get(`${CONFIG.CRYPTO_API}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 50,
                page: 1,
                sparkline: false,
                price_change_percentage: '24h'
            }
        });

        state.prices = {};
        response.data.forEach(coin => {
            state.prices[coin.symbol.toUpperCase()] = {
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol.toUpperCase(),
                price: coin.current_price,
                change: coin.price_change_percentage_24h,
                marketCap: coin.market_cap,
                volume: coin.total_volume,
                image: coin.image
            };
        });

        updateQuickStats();
        updatePricesList();

        // Load gold and dollar prices
        await loadMarketPrices();

    } catch (error) {
        console.error('Error loading prices:', error);
        // Use mock data as fallback
        loadMockPrices();
    }
}

async function loadMarketPrices() {
    // These would come from your backend API
    // For now, using approximate values
    state.marketPrices = {
        gold: 2350, // USD per ounce
        goldToman: Math.round(2350 * CONFIG.USD_TO_TOMAN * 0.03215), // Toman per gram
        dollar: Math.round(CONFIG.USD_TO_TOMAN),
        eur: Math.round(CONFIG.USD_TO_TOMAN * 1.08)
    };

    updateMarketCards();
}

function loadMockPrices() {
    state.prices = {
        'BTC': { symbol: 'BTC', name: 'Bitcoin', price: 65432.12, change: 2.34 },
        'ETH': { symbol: 'ETH', name: 'Ethereum', price: 3456.78, change: -1.23 },
        'SOL': { symbol: 'SOL', name: 'Solana', price: 178.45, change: 5.67 },
        'BNB': { symbol: 'BNB', name: 'BNB', price: 567.89, change: 0.89 }
    };
    updateQuickStats();
}

async function loadFearGreedIndex() {
    try {
        const response = await axios.get(CONFIG.FEAR_GREED_API);
        const data = response.data.data[0];

        const value = parseInt(data.value);
        const label = data.value_classification;

        document.getElementById('fg-value').textContent = value;
        document.getElementById('fg-label').textContent = getFearGreedLabel(value);

        updateFearGreedChart(value);
    } catch (error) {
        console.error('Error loading Fear & Greed:', error);
        // Default value
        document.getElementById('fg-value').textContent = '50';
        document.getElementById('fg-label').textContent = 'Neutral';
    }
}

function getFearGreedLabel(value) {
    if (value <= 25) return state.language === 'fa' ? 'ترس شدید' : 'Extreme Fear';
    if (value <= 45) return state.language === 'fa' ? 'ترس' : 'Fear';
    if (value <= 55) return state.language === 'fa' ? 'خنثی' : 'Neutral';
    if (value <= 75) return state.language === 'fa' ? 'طمع' : 'Greed';
    return state.language === 'fa' ? 'طمع شدید' : 'Extreme Greed';
}

async function loadNews() {
    // Mock news data - In production, fetch from your API
    const news = [
        {
            time: '2 min ago',
            title: 'Bitcoin Breaks $65,000 Resistance Level',
            source: 'CryptoNews'
        },
        {
            time: '15 min ago',
            title: 'Ethereum ETF Approval Expected Next Week',
            source: 'Bloomberg'
        },
        {
            time: '1 hour ago',
            title: 'Major Whale Moves 5000 BTC to Exchange',
            source: 'Whale Alert'
        }
    ];

    const newsFeed = document.getElementById('news-feed');
    newsFeed.innerHTML = news.map(item => `
        <div class="news-item">
            <div class="news-time">${item.time}</div>
            <div class="news-title">${item.title}</div>
            <div class="news-source">${item.source}</div>
        </div>
    `).join('');
}

// ==================== UI UPDATES ====================
function updateQuickStats() {
    const btc = state.prices['BTC'];
    const eth = state.prices['ETH'];

    if (btc) {
        document.getElementById('btc-price').textContent = `$${btc.price.toLocaleString()}`;
        const btcChange = document.getElementById('btc-change');
        btcChange.textContent = `${btc.change >= 0 ? '+' : ''}${btc.change?.toFixed(2)}%`;
        btcChange.className = `stat-change ${btc.change >= 0 ? 'positive' : 'negative'}`;
    }

    if (eth) {
        document.getElementById('eth-price').textContent = `$${eth.price.toLocaleString()}`;
        const ethChange = document.getElementById('eth-change');
        ethChange.textContent = `${eth.change >= 0 ? '+' : ''}${eth.change?.toFixed(2)}%`;
        ethChange.className = `stat-change ${eth.change >= 0 ? 'positive' : 'negative'}`;
    }
}

function updateMarketCards() {
    const mp = state.marketPrices;
    if (!mp) return;

    document.getElementById('gold-price').textContent = `$${mp.gold.toLocaleString()}/oz`;
    document.getElementById('gold-price-toman').textContent = `${mp.goldToman.toLocaleString()} تومان`;
    document.getElementById('dollar-price').textContent = `${mp.dollar.toLocaleString()} تومان`;
    document.getElementById('eur-price').textContent = `${mp.eur.toLocaleString()} تومان`;
}

function updatePricesList() {
    const list = document.getElementById('prices-list');
    const coins = Object.values(state.prices).slice(0, 20);

    list.innerHTML = coins.map((coin, index) => `
        <div class="price-item" data-symbol="${coin.symbol}">
            <div class="price-rank">${index + 1}</div>
            <div class="price-icon">${coin.symbol?.charAt(0)}</div>
            <div class="price-info">
                <div class="price-name">${coin.name}</div>
                <div class="price-symbol">${coin.symbol}</div>
            </div>
            <div class="price-value">
                <div class="price-usd">$${coin.price?.toLocaleString()}</div>
                <div class="price-change ${coin.change >= 0 ? 'positive' : 'negative'}">
                    ${coin.change >= 0 ? '+' : ''}${coin.change?.toFixed(2)}%
                </div>
            </div>
        </div>
    `).join('');
}

function filterCoins(e) {
    const search = e.target.value.toLowerCase();
    const items = document.querySelectorAll('.price-item');

    items.forEach(item => {
        const symbol = item.dataset.symbol.toLowerCase();
        const name = item.querySelector('.price-name').textContent.toLowerCase();
        item.style.display = (symbol.includes(search) || name.includes(search)) ? 'flex' : 'none';
    });
}

// ==================== CHARTS ====================
let priceChart = null;
let fgChart = null;

function initCharts() {
    // Initialize BTC price chart
    const priceCtx = document.getElementById('price-chart').getContext('2d');
    priceChart = new Chart(priceCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'BTC Price',
                data: [],
                borderColor: '#00D4FF',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: '#6B7280' }
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: '#6B7280' }
                }
            }
        }
    });

    loadChartData();

    // Initialize Fear & Greed gauge
    const fgCtx = document.getElementById('fg-chart').getContext('2d');
    fgChart = new Chart(fgCtx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [50, 50],
                backgroundColor: ['#00D4FF', '#1A2332'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            rotation: -90,
            circumference: 180,
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }
    });
}

function updateFearGreedChart(value) {
    if (fgChart) {
        fgChart.data.datasets[0].data = [value, 100 - value];

        // Color based on value
        let color;
        if (value <= 25) color = '#EF4444';
        else if (value <= 45) color = '#F59E0B';
        else if (value <= 55) color = '#9CA3AF';
        else if (value <= 75) color = '#10B981';
        else color = '#00D4FF';

        fgChart.data.datasets[0].backgroundColor[0] = color;
        fgChart.update();
    }
}

async function loadChartData() {
    try {
        const response = await axios.get(`${CONFIG.CRYPTO_API}/coins/bitcoin/market_chart`, {
            params: { vs_currency: 'usd', days: 7 }
        });

        const data = response.data.prices;
        const labels = data.map(p => {
            const date = new Date(p[0]);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        const prices = data.map(p => p[1]);

        priceChart.data.labels = labels;
        priceChart.data.datasets[0].data = prices;
        priceChart.update();
    } catch (error) {
        console.error('Error loading chart data:', error);
    }
}

// ==================== PORTFOLIO ====================
function openPortfolioModal() {
    document.getElementById('add-portfolio-modal').classList.add('active');
}

function closePortfolioModal() {
    document.getElementById('add-portfolio-modal').classList.remove('active');
}

async function submitPortfolio() {
    const symbol = document.getElementById('input-symbol').value.toUpperCase();
    const amount = parseFloat(document.getElementById('input-amount').value);
    const price = parseFloat(document.getElementById('input-price').value);

    if (!symbol || !amount || !price) {
        alert('Please fill all fields');
        return;
    }

    // Add to portfolio
    state.portfolio.push({ symbol, amount, buyPrice: price });
    saveUserData();
    updatePortfolioDisplay();
    closePortfolioModal();

    // Clear inputs
    document.getElementById('input-symbol').value = '';
    document.getElementById('input-amount').value = '';
    document.getElementById('input-price').value = '';
}

function updatePortfolioDisplay() {
    const list = document.getElementById('portfolio-list');
    let totalValue = 0;
    let totalPnl = 0;

    list.innerHTML = state.portfolio.map(item => {
        const currentPrice = state.prices[item.symbol]?.price || item.buyPrice;
        const value = item.amount * currentPrice;
        const pnl = (currentPrice - item.buyPrice) * item.amount;
        const pnlPercent = ((currentPrice - item.buyPrice) / item.buyPrice) * 100;

        totalValue += value;
        totalPnl += pnl;

        return `
            <div class="portfolio-item">
                <div class="portfolio-icon">${item.symbol.charAt(0)}</div>
                <div class="portfolio-info">
                    <div class="portfolio-symbol">${item.symbol}</div>
                    <div class="portfolio-amount">${item.amount} units</div>
                </div>
                <div class="portfolio-value">
                    <div class="portfolio-usd">$${value.toLocaleString()}</div>
                    <div class="portfolio-pnl ${pnl >= 0 ? 'positive' : 'negative'}">
                        ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)} (${pnlPercent.toFixed(2)}%)
                    </div>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('total-value').textContent = `$${totalValue.toLocaleString()}`;
    const totalPnlEl = document.getElementById('total-pnl');
    totalPnlEl.textContent = `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`;
    totalPnlEl.className = `summary-value ${totalPnl >= 0 ? 'positive' : 'negative'}`;
}

// ==================== MORE MENU ====================
function showLeaderboard() {
    document.getElementById('leaderboard-section').style.display = 'block';
    document.getElementById('referral-section').style.display = 'none';

    // Load leaderboard
    const list = document.getElementById('leaderboard-list');
    const mockData = [
        { rank: 1, name: 'CryptoKing', profit: '+45.2%', avatar: '👑' },
        { rank: 2, name: 'TraderPro', profit: '+38.7%', avatar: ' trader' },
        { rank: 3, name: 'WhaleHunter', profit: '+32.1%', avatar: ' whale' },
        { rank: 4, name: 'BullRunner', profit: '+28.5%', avatar: ' bull' },
        { rank: 5, name: 'MoonChaser', profit: '+24.3%', avatar: ' moon' }
    ];

    list.innerHTML = mockData.map(item => `
        <div class="leaderboard-item ${item.rank <= 3 ? `top-${item.rank}` : ''}">
            <div class="lb-rank ${item.rank === 1 ? 'gold' : item.rank === 2 ? 'silver' : item.rank === 3 ? 'bronze' : ''}">
                ${item.rank}
            </div>
            <div class="lb-avatar">${item.avatar}</div>
            <div class="lb-info">
                <div class="lb-name">${item.name}</div>
                <div class="lb-profit">${item.profit}</div>
            </div>
        </div>
    `).join('');
}

function showReferral() {
    document.getElementById('referral-section').style.display = 'block';
    document.getElementById('leaderboard-section').style.display = 'none';

    // Generate referral code
    const referralCode = `NEXGEN${state.userId || 'USER'}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    document.getElementById('referral-code').value = referralCode;
}

function copyReferralLink() {
    const input = document.getElementById('referral-code');
    input.select();
    document.execCommand('copy');

    const btn = document.getElementById('copy-referral');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
}

// ==================== USER DATA ====================
function loadUserData() {
    const saved = localStorage.getItem('nexgen_user');
    if (saved) {
        const data = JSON.parse(saved);
        state.language = data.language || 'en';
        state.portfolio = data.portfolio || [];
        state.userPlan = data.plan || 'free';

        document.getElementById('lang-toggle').textContent = state.language.toUpperCase();
        document.documentElement.dir = state.language === 'fa' ? 'rtl' : 'ltr';
        document.getElementById('user-plan').textContent = state.userPlan.toUpperCase();

        updateUI();
        updatePortfolioDisplay();
    }
}

function saveUserData() {
    localStorage.setItem('nexgen_user', JSON.stringify({
        language: state.language,
        portfolio: state.portfolio,
        plan: state.userPlan,
        userId: state.userId
    }));
}

// ==================== AUTO REFRESH ====================
setInterval(() => {
    loadPrices();
}, 60000); // Refresh every minute

// Export for Telegram Mini App integration
window.TelegramMiniApp = {
    getState: () => state,
    setPlan: (plan) => {
        state.userPlan = plan;
        document.getElementById('user-plan').textContent = plan.toUpperCase();
        saveUserData();
    }
};
