const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>VICTUS WHALE RADAR - BY SEZAR</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <style>
            body { background: #000; color: #fff; font-family: monospace; margin: 0; padding: 10px; display: flex; flex-direction: column; align-items: center; }
            .victus-box { width: 100%; max-width: 450px; background: #000; border: 2px solid #333; padding: 15px; }
            .header-info { border: 2px double #fbbf24; padding: 10px; text-align: center; margin-bottom: 15px; }
            .header-info h2 { font-size: 14px; margin: 0; color: #00d2ff; letter-spacing: 1px; }
            .header-info p { font-size: 10px; margin: 5px 0 0 0; color: #fbbf24; font-weight: bold; }
            .user-bar { border-bottom: 1px dashed #444; padding: 5px 0; margin-bottom: 10px; font-size: 11px; color: #888; text-align: center; }
            .coin-name { font-size: 32px; color: #00d2ff; font-weight: bold; text-align: center; margin: 10px 0; }
            .price-border { border: 1px dashed #555; padding: 12px; text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 15px; background: #080808; }
            .stats { display: flex; justify-content: space-around; font-size: 14px; padding: 10px 0; border-bottom: 1px solid #222; margin-bottom: 15px; }
            .s-val { color: #ef4444; } .b-val { color: #22c55e; }
            .section-title { font-size: 13px; font-weight: bold; border-bottom: 1px solid currentColor; padding-bottom: 5px; margin-bottom: 10px; text-align: center; }
            .data-row { display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; border-bottom: 1px solid #111; color: #ccc; }
            .signal-btn { padding: 14px; text-align: center; font-weight: bold; font-size: 18px; margin: 15px 0; border-radius: 4px; transition: 0.5s; }
            .back-nav { background: #1a1a1a; color: #666; border: 1px solid #434343; padding: 10px; width: 100%; cursor: pointer; font-family: monospace; font-size: 12px; }
            .footer-contact { display: flex; gap: 10px; margin-top: 15px; width: 100%; max-width: 450px; }
            .btn-link { flex: 1; text-decoration: none; padding: 12px; font-size: 12px; font-weight: bold; color: white; display: flex; align-items: center; justify-content: center; gap: 8px; border-radius: 5px; }
            .tg-color { background: #0088cc; } .gm-color { background: #ea4335; }
            #menu { width: 100%; max-width: 450px; }
            .list-item { border: 1px solid #222; padding: 15px; margin-bottom: 10px; display: flex; justify-content: space-between; cursor: pointer; background: #080808; }
        </style>
    </head>
    <body>
        <div id="menu">
            <div class="header-info"><h2>🚀 VICTUS WHALE RADAR - BY SEZAR PHANTOM 🛰️</h2></div>
            <div id="list-container">[ INITIALIZING SCANNER... ]</div>
        </div>
        <div id="radar-view" style="display:none;">
            <div class="victus-box">
                <div class="header-info">
                    <h2>🚀 VICTUS RADAR PRO - BY SEZAR PHANTOM 🛰️</h2>
                    <p>TG: @es44se | ✉ sezarphantom@gmail.com</p>
                </div>
                <div class="user-bar">USER: SEZAR_PHANTOM | ID: 49D7A958EEFA</div>
                <div id="active-coin" class="coin-name">BTC</div>
                <div class="price-border">PRICE: <span id="p-now">$0.00</span></div>
                <div class="stats">
                    <span>BUY: <span id="b-p" class="b-val">--%</span></span>
                    <span>SELL: <span id="s-p" class="s-val">--%</span></span>
                </div>
                <div style="margin-bottom:20px;"><div class="section-title" style="color:#ef4444;">🔴 HEAVY SELL WALLS (Targets > 500$):</div><div id="s-walls"></div></div>
                <div style="margin-bottom:20px;"><div class="section-title" style="color:#22c55e;">🟢 HEAVY BUY WALLS (Supports > 500$):</div><div id="b-walls"></div></div>
                <div id="sig-box" class="signal-btn">SIGNAL: ANALYZING</div>
                <button class="back-nav" onclick="showMain()">[ RETURN TO COMMAND CENTER ]</button>
            </div>
        </div>
        <div class="footer-contact">
            <a href="https://t.me/es44se" class="btn-link tg-color"><i class="fab fa-telegram"></i> Telegram</a>
            <a href="mailto:sezarphantom@gmail.com" class="btn-link gm-color"><i class="fas fa-envelope"></i> Email</a>
        </div>
        <script>
            const symbols = ['BTCUSDT', 'DOGEUSDT', 'PEPEUSDT', 'SHIBUSDT', 'ETHUSDT'];
            let active = ''; let loop;
            async function refreshList() {
                if(active) return;
                const res = await Promise.all(symbols.map(s => fetch('https://api.binance.com/api/v3/ticker/price?symbol='+s).then(r=>r.json())));
                document.getElementById('list-container').innerHTML = res.map(i => \`
                    <div class="list-item" onclick="openRadar('\${i.symbol}')">
                        <span style="font-weight:bold;">\${i.symbol.replace('USDT','')}</span>
                        <span style="color:#00d2ff;">$\${parseFloat(i.price).toLocaleString()}</span>
                    </div>\`).join('');
            }
            async function openRadar(s) {
                active = s; document.getElementById('menu').style.display = 'none'; document.getElementById('radar-view').style.display = 'block';
                document.getElementById('active-coin').innerText = s.replace('USDT',''); updateData(); loop = setInterval(updateData, 3000);
            }
            function showMain() { active = ''; clearInterval(loop); document.getElementById('menu').style.display = 'block'; document.getElementById('radar-view').style.display = 'none'; }
            
            function processWhales(data, isBuy, p) {
                const grouped = {};
                // فلتر الحيتان: فقط الأوامر اللي تبعد 500$ عن السعر الحالي للبيتكوين
                const filterDist = p > 1000 ? 500 : (p * 0.05);
                const step = p > 1000 ? 100 : (p * 0.01); // تجميع كل 100$ لتنظيف الضوضاء

                data.forEach(d => {
                    const price = parseFloat(d[0]);
                    const vol = parseFloat(d[1]);
                    if (isBuy ? (price < p - filterDist) : (price > p + filterDist)) {
                        const priceKey = Math.round(price / step) * step;
                        grouped[priceKey] = (grouped[priceKey] || 0) + vol;
                    }
                });
                return Object.entries(grouped)
                    .sort((a,b) => isBuy ? b[0]-a[0] : a[0]-b[0])
                    .slice(0, 5);
            }

            async function updateData() {
                try {
                    const [pR, dR] = await Promise.all([
                        fetch('https://api.binance.com/api/v3/ticker/price?symbol='+active).then(r=>r.json()),
                        fetch('https://api.binance.com/api/v3/depth?limit=1000&symbol='+active).then(r=>r.json())
                    ]);
                    const p = parseFloat(pR.price);
                    document.getElementById('p-now').innerText = '$' + p.toLocaleString();
                    
                    const finalAsks = processWhales(dR.asks, false, p);
                    const finalBids = processWhales(dR.bids, true, p);
                    
                    const bV = dR.bids.reduce((a,b)=>a+parseFloat(b[1]),0);
                    const sV = dR.asks.reduce((a,b)=>a+parseFloat(b[1]),0);
                    const bP = ((bV/(bV+sV))*100).toFixed(1);
                    const sP = (100 - bP).toFixed(1);
                    
                    document.getElementById('b-p').innerText = bP + '%';
                    document.getElementById('s-p').innerText = sP + '%';
                    
                    const sig = document.getElementById('sig-box');
                    if(bP > 55) { sig.innerText = 'WHALE SIGNAL: BULLISH'; sig.style.background='#22c55e'; sig.style.color='#000'; }
                    else if(sP > 55) { sig.innerText = 'WHALE SIGNAL: BEARISH'; sig.style.background='#ef4444'; sig.style.color='#fff'; }
                    else { sig.innerText = 'WHALE SIGNAL: NEUTRAL'; sig.style.background='#333'; sig.style.color='#fff'; }
                    
                    document.getElementById('s-walls').innerHTML = finalAsks.map(a => \`<div class="data-row"><span>🚀 $\${parseInt(a[0]).toLocaleString()}</span><span>Vol: \${a[1].toFixed(1)}M</span></div>\`).join('');
                    document.getElementById('b-walls').innerHTML = finalBids.map(b => \`<div class="data-row"><span>🛡️ $\${parseInt(b[0]).toLocaleString()}</span><span>Vol: \${b[1].toFixed(1)}M</span></div>\`).join('');
                } catch(e) {}
            }
            setInterval(refreshList, 8000); refreshList();
        </script>
    </body>
    </html>
    `);
});

module.exports = app;