const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// إعدادات لجلب البيانات من Binance
const SYMBOLS = ['BTCUSDT', 'DOGEUSDT', 'PEPEUSDT', 'SHIBUSDT', 'XAUUSDT'];

app.get('/api/prices', async (req, res) => {
    try {
        const promises = SYMBOLS.map(symbol => 
            axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`)
        );
        const results = await Promise.all(promises);
        const prices = results.map(r => ({
            symbol: r.data.symbol,
            price: parseFloat(r.data.price).toFixed(r.data.symbol === 'XAUUSDT' ? 2 : 6)
        }));
        res.json(prices);
    } catch (error) {
        res.status(500).json({ error: 'خطأ في جلب البيانات من Binance' });
    }
});

// واجهة المستخدم (HTML)
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>رادار سيزر للميم والذهب</title>
        <style>
            body { background: #0f172a; color: #f8fafc; font-family: sans-serif; text-align: center; padding: 20px; }
            .card { background: #1e293b; padding: 20px; border-radius: 15px; margin: 10px auto; max-width: 400px; border: 1px solid #334155; }
            .price { font-size: 24px; color: #38bdf8; font-weight: bold; }
            .symbol { color: #94a3b8; font-size: 14px; }
            .live { color: #22c55e; font-size: 12px; margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <h1>🚀 رادار سيزر فانتوم</h1>
        <div class="live">● مباشر من Binance</div>
        <div id="prices-container">تحميل الأسعار...</div>

        <script>
            async function updatePrices() {
                try {
                    const response = await fetch('/api/prices');
                    const data = await response.json();
                    const container = document.getElementById('prices-container');
                    container.innerHTML = data.map(item => \`
                        <div class="card">
                            <div class="symbol">\${item.symbol}</div>
                            <div class="price">$\${item.price}</div>
                        </div>
                    \`).join('');
                } catch (e) { console.error('خطأ في التحديث'); }
            }
            setInterval(updatePrices, 3000);
            updatePrices();
        </script>
    </body>
    </html>
    `);
});

// --- التعديل السحري لـ Vercel ---
module.exports = app;

// للتشغيل المحلي فقط
if (process.env.NODE_ENV !== 'production') {
    const PORT = 3000;
    app.listen(PORT, () => console.log(`السيرفر شغال على http://localhost:${PORT}`));
}