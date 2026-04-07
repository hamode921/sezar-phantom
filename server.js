const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SEZAR PRO RADAR</title>
        <style>
            :root { --blue: #00d2ff; --purple: #9d50bb; --bg: #020617; }
            body { background: var(--bg); color: white; font-family: monospace; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; }
            .logo { font-size: 40px; font-weight: 900; background: linear-gradient(to right, var(--blue), var(--purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 20px 0; }
            #list { width: 100%; max-width: 400px; }
            .coin-card { background: #111827; padding: 18px; border-radius: 12px; margin-bottom: 12px; border: 1px solid #1f2937; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
            .coin-card:active { transform: scale(0.98); background: #1f2937; }
            .sym { font-weight: bold; font-size: 18px; }
            .prc { color: var(--blue); font-size: 18px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="logo">SEZAR PRO</div>
        <div id="list">جاري تشغيل الرادار...</div>

        <script>
            const coins = ['BTCUSDT', 'DOGEUSDT', 'PEPEUSDT', 'SHIBUSDT', 'ETHUSDT'];
            
            async function loadPrices() {
                let html = '';
                for (let s of coins) {
                    try {
                        const r = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=' + s);
                        const d = await r.json();
                        const p = parseFloat(d.price).toFixed(d.price < 1 ? 6 : 2);
                        html += \`
                            <div class="coin-card" onclick="alert('سيزر، جاري تطوير صفحة الحيتان لهذه العملة.. انتظرني!')">
                                <span class="sym">\${s.replace('USDT','')}</span>
                                <span class="prc">$\${p}</span>
                            </div>
                        \`;
                    } catch(e) { console.log("Error"); }
                }
                document.getElementById('list').innerHTML = html;
            }

            // تحديث كل 5 ثواني عشان ما ننحظر
            setInterval(loadPrices, 5000);
            loadPrices();
        </script>
    </body>
    </html>
    `);
});

module.exports = app;