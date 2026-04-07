const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>رادار SEZAR الفانتوم</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <style>
            :root { --neon-blue: #00d2ff; --neon-purple: #9d50bb; --bg-dark: #020617; }
            body { background: var(--bg-dark); color: white; font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
            .logo-container { margin-top: 30px; text-align: center; }
            .logo-text { font-size: 50px; font-weight: 900; letter-spacing: 4px; background: linear-gradient(to right, #00d2ff, #9d50bb); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 15px rgba(0,210,255,0.6)); margin: 0; }
            .sub-title { font-size: 12px; color: #94a3b8; letter-spacing: 3px; font-weight: bold; text-transform: uppercase; margin-top: -5px; }
            .radar-status { color: #22c55e; font-size: 13px; margin: 25px 0; background: rgba(34, 197, 94, 0.1); padding: 5px 15px; border-radius: 20px; border: 1px solid rgba(34, 197, 94, 0.2); }
            .dot { height: 8px; width: 8px; background-color: #22c55e; border-radius: 50%; display: inline-block; margin-left: 8px; animation: blink 1.2s infinite; }
            @keyframes blink { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } }
            #list { width: 100%; max-width: 380px; }
            .card { background: rgba(30, 41, 59, 0.4); backdrop-filter: blur(12px); padding: 18px 25px; border-radius: 20px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center; transition: all 0.4s; }
            .symbol { font-size: 18px; font-weight: 800; color: #f8fafc; }
            .price { color: var(--neon-blue); font-size: 22px; font-family: monospace; font-weight: bold; }
            .contact-section { margin-top: auto; padding-top: 30px; display: flex; gap: 15px; padding-bottom: 20px; }
            .contact-btn { text-decoration: none; padding: 12px 25px; border-radius: 12px; font-size: 14px; font-weight: bold; display: flex; align-items: center; gap: 10px; }
            .tg { background: #0088cc; color: white; }
            .gm { background: #ea4335; color: white; }
        </style>
    </head>
    <body>
        <div class="logo-container">
            <h1 class="logo-text">SEZAR</h1>
            <div class="sub-title">Phantom Radar Pro</div>
        </div>
        <div class="radar-status"><span class="dot"></span> جاري تتبع السوق مباشر</div>
        <div id="list"></div>
        <div class="contact-section">
            <a href="https://t.me/es44se" target="_blank" class="contact-btn tg"><i class="fab fa-telegram-plane"></i> Telegram</a>
            <a href="mailto:sezarphantom@gmail.com" class="contact-btn gm"><i class="fas fa-envelope"></i> Gmail</a>
        </div>
        <script>
            const symbols = ['BTCUSDT', 'DOGEUSDT', 'PEPEUSDT', 'SHIBUSDT', 'ETHUSDT'];
            async function getPrices() {
                try {
                    const responses = await Promise.all(symbols.map(s => fetch('https://api.binance.com/api/v3/ticker/price?symbol=' + s)));
                    const data = await Promise.all(responses.map(r => r.json()));
                    document.getElementById('list').innerHTML = data.map(item => \`
                        <div class="card">
                            <span class="symbol">\${item.symbol.replace('USDT','')}</span>
                            <span class="price">$\${parseFloat(item.price).toFixed(item.symbol.includes('USDT') && item.price < 1 ? 6 : 2)}</span>
                        </div>
                    \`).join('');
                } catch (e) {
                    document.getElementById('list').innerHTML = "<div style='color:#ef4444; text-align:center;'>فشل جلب البيانات.. تأكد من الإنترنت</div>";
                }
            }
            setInterval(getPrices, 2000);
            getPrices();
        </script>
    </body>
    </html>
    `);
});

module.exports = app;