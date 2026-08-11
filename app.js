/**
 * NexGen Signal - Premium Mini App
 * Version: 2.0
 */

// ==================== CONFIG ====================
const CONFIG = {
    CRYPTO_API: 'https://api.coingecko.com/api/v3',
    FEAR_GREED_API: 'https://api.alternative.me/fng/',
    USD_TO_TOMAN: 580000,
    FREE_SIGNALS: 3,
    PRO_PRICE_USD: 15,
    VIP_PRICE_USD: 49
};

// ==================== STATE ====================
const state = {
    language: 'en',
    currentScreen: 'dashboard',
    userPlan: 'free',
    signalsUsed: 2,
    prices: {},
    portfolio: [],
    favorites: ['BTC', 'ETH', 'SOL'],
    balanceHidden: false
};

// ==================== TRANSLATIONS ====================
const i18n = {
    en: {
        home: 'Home', markets: 'Markets', signals: 'Signals',
        portfolio: 'Portfolio', profile: 'Profile',
        total_portfolio: 'Total Portfolio',
        buy: 'Buy', sell: 'Sell', swap: 'Swap', more: 'More',
        market_overview: 'Market Overview', see_all: 'See All',
        gold: 'Gold', usd_rate: 'USD/IRR',
        fear_greed: 'Fear & Greed Index', yesterday: 'Yesterday',
        btc_chart: 'BTC/USDT', latest_news: 'Latest News',
        search_placeholder: 'Search coins...',
        trading_signals: 'Trading Signals', ai_powered: 'AI-Powered Analysis',
        today: 'today', upgrade_title: 'Unlock Pro',
        upgrade_desc: 'Unlimited signals, advanced analytics & more',
        my_portfolio: 'My Portfolio', total_value: 'Total Value',
        total_pnl: 'Total P/L', add_asset: 'Add Asset',
        select_coin: 'Select Coin', amount: 'Amount',
        buy_price_usd: 'Buy Price (USD)', add_asset_btn: 'Add Asset',
        subscription: 'Subscription', current_plan: 'Current Plan: Free',
        price_alerts: 'Price Alerts', alerts_active: '3 active alerts',
        referral_program: 'Referral Program', earn_commission: 'Earn 20% commission',
        settings: 'Settings', language_notification: 'Language & Notifications',
        support: 'Support', help_center: 'Help Center & FAQ',
        invite_earn: 'Invite & Earn',
        referral_desc: 'Share your link and earn 20% commission on every subscription!',
        referrals: 'Referrals', earned: 'Earned',
        trades: 'Trades', win_rate: 'Win Rate'
    },
    fa: {
        home: 'خانه', markets: 'بازارها', signals: 'سیگنال‌ها',
        portfolio: 'پورتفولیو', profile: 'پروفایل',
        total_portfolio: 'ارزش کل پورتفولیو',
        buy: 'خرید', sell: 'فروش', swap: 'تبدیل', more: 'بیشتر',
        market_overview: 'نمای کلی بازار', see_all: 'مشاهده همه',
        gold: 'طلا', usd_rate: 'دلار/تومان',
        fear_greed: 'شاخص ترس و طمع', yesterday: 'دیروز',
        btc_chart: 'بیتکوین/تتر', latest_news: 'آخرین اخبار',
        search_placeholder: 'جستجوی ارز...',
        trading_signals: 'سیگنال‌های معاملاتی', ai_powered: 'تحلیل با هوش مصنوعی',
        today: 'امروز', upgrade_title: 'ارتقا به پرو',
        upgrade_desc: 'سیگنال نامحدود، تحلیل پیشرفته و بیشتر',
        my_portfolio: 'پورتفولیوی من', total_value: 'ارزش کل',
        total_pnl: 'سود/ضرر کل', add_asset: 'افزودن دارایی',
        select_coin: 'انتخاب ارز', amount: 'مقدار',
        buy_price_usd: 'قیمت خرید (دلار)', add_asset_btn: 'افزودن دارایی',
        subscription: 'اشتراک', current_plan: 'پلن فعلی: رایگان',
        price_alerts: 'هشدار قیمت', alerts_active: '۳ هشدار فعال',
        referral_program: 'سیستم رفرال', earn_commission: 'کسب ۲۰٪ کمیسیون',
        settings: 'تنظیمات', language_notification: 'زبان و اعلان‌ها',
        support: 'پشتیبانی', help_center: 'مرکز راهنما و سوالات',
        invite_earn: 'دعوت کنید و کسب درآمد کنید',
        referral_desc: 'لینک خود را به اشتراک بگذارید و ۲۰٪ کمیسیون از هر اشتراک دریافت کنید!',
        referrals: 'دعوت‌شدگان', earned: 'درآمد',
        trades: 'معاملات', win_rate: 'نرخ برد'
    }
};

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    initTelegram();
    initNavigation();
    initEventListeners();
    loadData();
    animateOnLoad();
});

function initTelegram() {
    if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        tg.enableClosingConfirmation();

        if (tg.initDataUnsafe?.user) {
            state.userId = tg.initDataUnsafe.user.id;
        }

        document.documentElement.style.setProperty(
            '--tg-theme-bg-color', tg.backgroundColor || '#0A0F1C'
        );
    }
}

function initNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const screen = btn.dataset.screen;
            switchScreen(screen);

            if (window.Telegram?.WebApp) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }
        });
    });
}

function switchScreen(screenId) {
    if (state.currentScreen === screenId) return;

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-screen="${screenId}"]`)?.classList.add('active');

    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.style.transform = 'translateY(20px)';
    });

    const newScreen = document.getElementById(`screen-${screenId}`);
    if (newScreen) {
        requestAnimationFrame(() => {
            newScreen.classList.add('active');
            newScreen.style.transform = 'translateY(0)';
        });
    }

    state.currentScreen = screenId;
}

function initEventListeners() {
    // Language toggle
    document.getElementById('lang-toggle')?.addEventListener('click', toggleLanguage);

    // Balance toggle
    document.getElementById('toggle-balance')?.addEventListener('click', toggleBalance);

    // Quick actions
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => handleAction(btn.dataset.action));
    });

    // Chart tabs
    document.querySelectorAll('.chart-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateChart(tab.dataset.period);
        });
    });

    // Market tabs
    document.querySelectorAll('.market-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.market-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterMarkets(tab.dataset.filter);
        });
    });

    // Search
    document.getElementById('search-input')?.addEventListener('input', (e) => {
        searchCoins(e.target.value);
    });

    // Signal filters
    document.querySelectorAll('.signal-filter').forEach(filter => {
        filter.addEventListener('click', () => {
            document.querySelectorAll('.signal-filter').forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            filterSignals(filter.dataset.type);
        });
    });

    // Add asset modal
    document.getElementById('add-asset-btn')?.addEventListener('click', openModal);
    document.getElementById('close-modal')?.addEventListener('click', closeModal);
    document.querySelector('.modal-overlay')?.addEventListener('click', closeModal);
    document.getElementById('submit-asset')?.addEventListener('click', submitAsset);

    // Copy referral
    document.getElementById('copy-referral-btn')?.addEventListener('click', copyReferral);

    // See all buttons
    document.querySelectorAll('.see-all-btn').forEach(btn => {
        btn.addEventListener('click', () => switchScreen('markets'));
    });
}

// ==================== LANGUAGE ====================
function toggleLanguage() {
    state.language = state.language === 'en' ? 'fa' : 'en';
    document.querySelector('.lang-text').textContent = state.language.toUpperCase();
    document.documentElement.dir = state.language === 'fa' ? 'rtl' : 'ltr';
    updateTranslations();
    saveState();
}

function t(key) {
    return i18n[state.language]?.[key] || i18n.en[key] || key;
}

function updateTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });
}

// ==================== BALANCE ====================
function toggleBalance() {
    state.balanceHidden = !state.balanceHidden;
    const balanceEl = document.getElementById('total-balance');
    const changeEl = document.querySelector('.balance-change');

    if (state.balanceHidden) {
        balanceEl.textContent = '••••••';
        changeEl.style.opacity = '0';
    } else {
        balanceEl.textContent = '$24,562.80';
        changeEl.style.opacity = '1';
    }
}

// ==================== ACTIONS ====================
function handleAction(action) {
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }

    switch (action) {
        case 'buy':
        case 'sell':
            switchScreen('markets');
            break;
        case 'swap':
            // Show swap modal
            break;
        case 'more':
            switchScreen('profile');
            break;
    }
}

// ==================== DATA LOADING ====================
async function loadData() {
    await Promise.all([
        loadPrices(),
        loadFearGreed(),
        loadNews(),
        initCharts()
    ]);
    renderAll();
}

async function loadPrices() {
    try {
        const response = await axios.get(`${CONFIG.CRYPTO_API}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 50,
                sparkline: false
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
                image: coin.image
            };
        });
    } catch (error) {
        console.error('Price fetch error:', error);
        useMockPrices();
    }
}

function useMockPrices() {
    state.prices = {
        BTC: { symbol: 'BTC', name: 'Bitcoin', price: 65432.12, change: 2.34 },
        ETH: { symbol: 'ETH', name: 'Ethereum', price: 3456.78, change: -1.23 },
        SOL: { symbol: 'SOL', name: 'Solana', price: 178.45, change: 5.67 },
        BNB: { symbol: 'BNB', name: 'BNB', price: 567.89, change: 0.89 },
        XRP: { symbol: 'XRP', name: 'XRP', price: 0.62, change: -0.45 },
        ADA: { symbol: 'ADA', name: 'Cardano', price: 0.45, change: 1.23 },
        DOGE: { symbol: 'DOGE', name: 'Dogecoin', price: 0.12, change: 3.45 },
        DOT: { symbol: 'DOT', name: 'Polkadot', price: 7.89, change: -2.11 }
    };
}

async function loadFearGreed() {
    try {
        const response = await axios.get(CONFIG.FEAR_GREED_API);
        const data = response.data.data[0];
        state.fearGreed = {
            value: parseInt(data.value),
            label: getFearGreedLabel(parseInt(data.value))
        };
    } catch (error) {
        state.fearGreed = { value: 72, label: 'Greed' };
    }
}

function getFearGreedLabel(value) {
    if (state.language === 'fa') {
        if (value <= 25) return 'ترس شدید';
        if (value <= 45) return 'ترس';
        if (value <= 55) return 'خنثی';
        if (value <= 75) return 'طمع';
        return 'طمع شدید';
    }
    if (value <= 25) return 'Extreme Fear';
    if (value <= 45) return 'Fear';
    if (value <= 55) return 'Neutral';
    if (value <= 75) return 'Greed';
    return 'Extreme Greed';
}

function loadNews() {
    state.news = [
        { time: '2 min', title: 'Bitcoin Breaks $65K Resistance', source: 'CryptoNews', icon: '₿' },
        { time: '15 min', title: 'Ethereum ETF Approval Expected', source: 'Bloomberg', icon: 'Ξ' },
        { time: '1 hour', title: 'Whale Moves 5000 BTC', source: 'Whale Alert', icon: '🐋' }
    ];
}

// ==================== RENDERING ====================
function renderAll() {
    renderQuickStats();
    renderMarkets();
    renderSignals();
    renderPortfolio();
    renderNews();
    renderFearGreed();
    updateTranslations();
}

function renderQuickStats() {
    const btc = state.prices.BTC;
    const eth = state.prices.ETH;

    if (btc) {
        document.getElementById('btc-price').textContent = `$${btc.price.toLocaleString()}`;
        const changeEl = document.getElementById('btc-change');
        changeEl.textContent = `${btc.change >= 0 ? '+' : ''}${btc.change?.toFixed(2)}%`;
        changeEl.className = `market-badge ${btc.change >= 0 ? 'positive' : 'negative'}`;
    }

    if (eth) {
        document.getElementById('eth-price').textContent = `$${eth.price.toLocaleString()}`;
        const changeEl = document.getElementById('eth-change');
        changeEl.textContent = `${eth.change >= 0 ? '+' : ''}${eth.change?.toFixed(2)}%`;
        changeEl.className = `market-badge ${eth.change >= 0 ? 'positive' : 'negative'}`;
    }

    // Market prices
    document.getElementById('gold-price').textContent = '$2,350';
    document.getElementById('gold-toman').textContent = `${(2350 * CONFIG.USD_TO_TOMAN * 0.03215 / 1000).toFixed(0)}K تومان`;
    document.getElementById('dollar-price').textContent = `${(CONFIG.USD_TO_TOMAN / 1000).toFixed(0)}K`;
}

function renderMarkets() {
    const list = document.getElementById('markets-list');
    if (!list) return;

    const coins = Object.values(state.prices).slice(0, 20);

    list.innerHTML = coins.map(coin => `
        <div class="market-item" data-symbol="${coin.symbol}">
            <div class="market-item-icon">${coin.symbol?.charAt(0)}</div>
            <div class="market-item-info">
                <div class="market-item-name">${coin.name}</div>
                <div class="market-item-symbol">${coin.symbol}</div>
            </div>
            <div class="market-item-price">
                <div class="market-item-usd">$${coin.price?.toLocaleString()}</div>
                <div class="market-item-change ${coin.change >= 0 ? 'positive' : 'negative'}">
                    ${coin.change >= 0 ? '+' : ''}${coin.change?.toFixed(2)}%
                </div>
            </div>
            <button class="market-item-fav ${state.favorites.includes(coin.symbol) ? 'active' : ''}"
                    onclick="toggleFavorite('${coin.symbol}', event)">
                ${state.favorites.includes(coin.symbol) ? '★' : '☆'}
            </button>
        </div>
    `).join('');
}

function renderSignals() {
    const list = document.getElementById('signals-list');
    if (!list) return;

    const signals = [
        { symbol: 'BTC', pair: 'BTC/USDT', type: 'buy', entry: 65432, target: 68000, stop: 63500, confidence: 87 },
        { symbol: 'ETH', pair: 'ETH/USDT', type: 'sell', entry: 3456, target: 3200, stop: 3650, confidence: 72 },
        { symbol: 'SOL', pair: 'SOL/USDT', type: 'buy', entry: 178, target: 200, stop: 165, confidence: 81 }
    ];

    list.innerHTML = signals.map(sig => `
        <div class="signal-card" data-type="${sig.type}">
            <div class="signal-card-header">
                <div class="signal-coin">
                    <div class="signal-coin-icon">${sig.symbol.charAt(0)}</div>
                    <div>
                        <div class="signal-coin-name">${sig.symbol}</div>
                        <div class="signal-coin-pair">${sig.pair}</div>
                    </div>
                </div>
                <div class="signal-badge ${sig.type}">${sig.type.toUpperCase()}</div>
            </div>
            <div class="signal-details">
                <div class="signal-detail">
                    <div class="signal-detail-label">Entry</div>
                    <div class="signal-detail-value">$${sig.entry.toLocaleString()}</div>
                </div>
                <div class="signal-detail">
                    <div class="signal-detail-label">Target</div>
                    <div class="signal-detail-value" style="color: var(--success)">$${sig.target.toLocaleString()}</div>
                </div>
                <div class="signal-detail">
                    <div class="signal-detail-label">Stop Loss</div>
                    <div class="signal-detail-value" style="color: var(--danger)">$${sig.stop.toLocaleString()}</div>
                </div>
            </div>
            <div class="signal-confidence">
                <span class="confidence-label">Confidence</span>
                <div class="confidence-bar">
                    <div class="confidence-fill ${sig.confidence >= 80 ? 'high' : sig.confidence >= 60 ? 'medium' : 'low'}"
                         style="width: ${sig.confidence}%"></div>
                </div>
                <span class="confidence-value">${sig.confidence}%</span>
            </div>
        </div>
    `).join('');

    document.getElementById('signals-used').textContent = state.signalsUsed;
    document.getElementById('signals-limit').textContent = CONFIG.FREE_SIGNALS;
}

function renderPortfolio() {
    const list = document.getElementById('portfolio-list');
    if (!list) return;

    if (state.portfolio.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💼</div>
                <p>Your portfolio is empty</p>
            </div>
        `;
        return;
    }

    list.innerHTML = state.portfolio.map(item => {
        const currentPrice = state.prices[item.symbol]?.price || item.buyPrice;
        const value = item.amount * currentPrice;
        const pnl = (currentPrice - item.buyPrice) * item.amount;
        const pnlPercent = ((currentPrice - item.buyPrice) / item.buyPrice) * 100;

        return `
            <div class="portfolio-item">
                <div class="portfolio-item-icon">${item.symbol.charAt(0)}</div>
                <div class="portfolio-item-info">
                    <div class="portfolio-item-symbol">${item.symbol}</div>
                    <div class="portfolio-item-amount">${item.amount} units</div>
                </div>
                <div class="portfolio-item-value">
                    <div class="portfolio-item-usd">$${value.toLocaleString()}</div>
                    <div class="portfolio-item-pnl ${pnl >= 0 ? 'positive' : 'negative'}">
                        ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)} (${pnlPercent.toFixed(2)}%)
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Update summary
    let totalValue = 0, totalPnl = 0;
    state.portfolio.forEach(item => {
        const currentPrice = state.prices[item.symbol]?.price || item.buyPrice;
        totalValue += item.amount * currentPrice;
        totalPnl += (currentPrice - item.buyPrice) * item.amount;
    });

    document.getElementById('portfolio-value').textContent = `$${totalValue.toLocaleString()}`;
    const pnlEl = document.getElementById('portfolio-pnl');
    pnlEl.textContent = `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`;
    pnlEl.className = `summary-value ${totalPnl >= 0 ? 'positive' : 'negative'}`;
}

function renderNews() {
    const list = document.getElementById('news-list');
    if (!list) return;

    list.innerHTML = state.news.map(item => `
        <div class="news-item">
            <div class="news-icon">${item.icon}</div>
            <div class="news-content">
                <div class="news-title">${item.title}</div>
                <div class="news-meta">
                    <span>${item.source}</span>
                    <span>•</span>
                    <span>${item.time} ago</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderFearGreed() {
    const fg = state.fearGreed || { value: 50, label: 'Neutral' };
    document.getElementById('fg-value').textContent = fg.value;
    document.getElementById('fg-label').textContent = fg.label;

    // Rotate needle: 0 = left (-90deg), 100 = right (90deg)
    const rotation = (fg.value / 100) * 180 - 90;
    document.getElementById('fg-needle').style.transform = `rotate(${rotation}deg)`;
}

// ==================== CHARTS ====================
let priceChart = null;
let portfolioChart = null;

async function initCharts() {
    initPriceChart();
    initPortfolioChart();
}

function initPriceChart() {
    const ctx = document.getElementById('price-chart')?.getContext('2d');
    if (!ctx) return;

    // Generate mock data for last 7 days
    const labels = [];
    const data = [];
    let price = 64000;

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en', { month: 'short', day: 'numeric' }));
        price += (Math.random() - 0.45) * 1000;
        data.push(price);
    }

    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                data,
                borderColor: '#00D4FF',
                backgroundColor: createGradient(ctx, '#00D4FF'),
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#00D4FF',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#9CA3AF',
                    bodyColor: '#FFFFFF',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: (ctx) => `$${ctx.parsed.y.toLocaleString()}`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#6B7280', font: { size: 11 } }
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: {
                        color: '#6B7280',
                        font: { size: 11 },
                        callback: (v) => `$${(v/1000).toFixed(0)}K`
                    }
                }
            }
        }
    });
}

function createGradient(ctx, color) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, `${color}40`);
    gradient.addColorStop(1, `${color}00`);
    return gradient;
}

function initPortfolioChart() {
    const ctx = document.getElementById('portfolio-chart')?.getContext('2d');
    if (!ctx) return;

    portfolioChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['BTC', 'ETH', 'SOL', 'Others'],
            datasets: [{
                data: [45, 30, 15, 10],
                backgroundColor: ['#F7931A', '#627EEA', '#00D4FF', '#8B5CF6'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#FFFFFF',
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                }
            }
        }
    });
}

function updateChart(period) {
    // Update chart based on period
    if (!priceChart) return;

    const multiplier = { '1D': 1, '1W': 7, '1M': 30, '1Y': 365 }[period] || 1;
    const labels = [];
    const data = [];
    let price = 64000;

    for (let i = multiplier; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en', { month: 'short', day: 'numeric' }));
        price += (Math.random() - 0.45) * 500;
        data.push(price);
    }

    priceChart.data.labels = labels;
    priceChart.data.datasets[0].data = data;
    priceChart.update('active');
}

// ==================== FILTERS ====================
function searchCoins(query) {
    const items = document.querySelectorAll('.market-item');
    const q = query.toLowerCase();

    items.forEach(item => {
        const symbol = item.dataset.symbol?.toLowerCase() || '';
        const name = item.querySelector('.market-item-name')?.textContent.toLowerCase() || '';
        item.style.display = (symbol.includes(q) || name.includes(q)) ? 'flex' : 'none';
    });
}

function filterMarkets(filter) {
    const items = document.querySelectorAll('.market-item');
    const coins = Object.values(state.prices);

    items.forEach((item, index) => {
        const coin = coins[index];
        if (!coin) return;

        let show = true;
        if (filter === 'gainers') show = coin.change > 0;
        if (filter === 'losers') show = coin.change < 0;
        if (filter === 'favorites') show = state.favorites.includes(coin.symbol);

        item.style.display = show ? 'flex' : 'none';
    });
}

function filterSignals(type) {
    document.querySelectorAll('.signal-card').forEach(card => {
        if (type === 'all') {
            card.style.display = 'block';
        } else {
            card.style.display = card.dataset.type === type ? 'block' : 'none';
        }
    });
}

function toggleFavorite(symbol, event) {
    event.stopPropagation();
    const index = state.favorites.indexOf(symbol);
    if (index > -1) {
        state.favorites.splice(index, 1);
    } else {
        state.favorites.push(symbol);
    }
    renderMarkets();
    saveState();
}

// ==================== MODAL ====================
function openModal() {
    document.getElementById('add-asset-modal')?.classList.add('active');
}

function closeModal() {
    document.getElementById('add-asset-modal')?.classList.remove('active');
}

function submitAsset() {
    const symbol = document.getElementById('coin-select')?.textContent || 'BTC';
    const amount = parseFloat(document.getElementById('input-amount')?.value);
    const price = parseFloat(document.getElementById('input-price')?.value);

    if (!amount || !price) {
        alert('Please fill all fields');
        return;
    }

    state.portfolio.push({ symbol, amount, buyPrice: price });
    renderPortfolio();
    closeModal();
    saveState();

    // Clear inputs
    document.getElementById('input-amount').value = '';
    document.getElementById('input-price').value = '';
}

// ==================== REFERRAL ====================
function copyReferral() {
    const input = document.getElementById('referral-link');
    if (input) {
        navigator.clipboard.writeText(input.value).then(() => {
            const btn = document.getElementById('copy-referral-btn');
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
        });
    }
}

// ==================== ANIMATION ====================
function animateOnLoad() {
    document.querySelectorAll('.market-card, .action-btn, .section').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, i * 50);
    });
}

// ==================== STATE ====================
function saveState() {
    localStorage.setItem('nexgen_state', JSON.stringify({
        language: state.language,
        portfolio: state.portfolio,
        favorites: state.favorites,
        userPlan: state.userPlan
    }));
}

function loadState() {
    try {
        const saved = JSON.parse(localStorage.getItem('nexgen_state'));
        if (saved) {
            state.language = saved.language || 'en';
            state.portfolio = saved.portfolio || [];
            state.favorites = saved.favorites || ['BTC', 'ETH', 'SOL'];
            state.userPlan = saved.userPlan || 'free';

            document.querySelector('.lang-text').textContent = state.language.toUpperCase();
            document.documentElement.dir = state.language === 'fa' ? 'rtl' : 'ltr';
        }
    } catch (e) {}
}

// Load state on init
loadState();

// ==================== REFRESH ====================
setInterval(() => {
    loadPrices().then(() => {
        renderQuickStats();
        renderMarkets();
    });
}, 60000);

// Expose for Telegram integration
window.NexGenApp = {
    setPlan: (plan) => {
        state.userPlan = plan;
        document.getElementById('profile-plan').textContent = plan.toUpperCase();
        saveState();
    },
    addSignal: (signal) => {
        // Handle external signal
        console.log('New signal:', signal);
    }
};
