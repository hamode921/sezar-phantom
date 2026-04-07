const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>VICTUS RADAR PRO - BY SEZAR</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <style>
            body { background: #000; color: #fff; font-family: monospace; margin: 0; padding: 10px; display: flex; flex-direction: column; align-items: center; }
            .victus-frame { width: 100%; max-width: 450px; border: 2px solid #333; padding: 15px; background: #000; box-shadow: 0 0 20px #000; }
            .gold-header { border: 2px double #fbbf24; padding: 10px; text-align: center; margin-bottom: 15px; }
            .gold-header h2 { font-size: 14px; margin: 0; color: #00d2ff; letter-spacing: 1px; }
            .gold-header p { font-size: 10px; margin: 5px 0 0 0; color: #fbbf24; font-weight: bold; }
            .user-id { color: #555; font-size: 10px; text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #333; padding-bottom: 5px; }
            .coin-id { font-size: 35px; color: #00d2ff; font-weight: bold; text-align: center; margin: 10px 0; }
            .price-dash { border: 1px dashed #444; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; background: #050505; }
            .stat-line { display: flex; justify-content: space-around; font-size: 14px; padding-bottom: 10px; border-bottom: 1px solid #222; margin-bottom: 15px; }
            .wall-title { font-size: 13px; font-weight: bold; border-bottom: 1px solid currentColor; padding-bottom: 5px; margin-bottom: 10px; text-align: center; }
            .wall-row { display: flex; justify-content: space-between; font-size: 13px; padding: 5px 0; border-bottom: 1px solid #111; color: #bbb; }
            .sig-box { padding: 15px; text-align: center; font-weight: bold; font-size: 18px; margin: 15px 0; border-radius: 4px; transition: 0.5s; }
            .btn-back { background: #111; color: #444; border: 1px solid #222; padding: 12px; width: 100%; cursor: pointer; font-family: monospace; font-size: 12px; }
            .footer-nav { display: flex; gap: 8px; margin-top: 15px; width: 100%; max-width: 450px; }
            .nav-btn { flex: 1; text-decoration: none; padding: 12px; font-size: 12px; font-weight: bold; color: white; border-radius: 4px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px; }
            .bg-tg { background: #0088cc; } .bg-gm { background: #ea4335; }
            #list-view { width: 100%; max-width: 450px; }
            .coin-card { border: 1px solid #222; padding: 15px; margin-bottom: 8px; display: flex; justify-content: space-between; background: #080808; cursor: pointer; }
        </style>
    </head>
    <body>
        <div id="list-view">
            <div class="gold-header"><h2>🚀 VICTUS RADAR PRO - BY SEZAR PHANTOM 🛰️</h2></div>
            <div id="items-container">[ SCANNING... ]</div>
        </div>
        <div id="radar-view" style="display:none;">
            <div class="victus-frame">
                <div class="gold-header">
                    <h2>🚀 VICTUS RADAR PRO - BY SEZAR PHANTOM 🛰️</h2>
                    <p>TG: @es44se | ✉ sezarphantom@gmail.com</p>
                </div>
                <div class="user-id">USER: SEZAR_PHANTOM | ID: 49D7A958EEFA</div>
                <div id="active-coin" class="coin-id">BTC</div>
                <div class="price-dash">PRICE: <span id="val-price">$0.00</span></div>
                <div class="stat-line">
                    <span style="color:#ef4444;">SELL: <span id="val-s">--%</span></span>
                    <span style="color:#22c55e;">BUY: <span id="val-b">--%</span></span>
                </div>
                <div><div class="wall-title" style="color:#ef4444;">🔴 HEAVY SELL WALLS (Targets):</div><div id="list-s"></div></div>
                <div style="margin-top:15px;"><div class="wall-title" style="color:#22c55e;">🟢 HEAVY BUY WALLS (Supports):</div><div id="list-b"></div></div>
                <div id="val-sig" class="sig-box">SIGNAL: ANALYZING</div>
                <button class="btn-back" onclick="closeRadar()">[ RETURN TO COMMAND CENTER ]</button>
            </div>
        </div>
        <div class="footer-nav">
            <a href="https://t.me/es44se" class="nav-btn bg-tg"><i class="fab fa-telegram"></i> Telegram</a>
            <a href="mailto:sezarphantom@gmail.com" class="nav-btn bg-gm"><i class="fas fa-envelope"></i> Email</a>
        </div>
        <script>
            const coins = ['BTCUSDT', 'DOGEUSDT', 'PEPEUSDT', 'SHIBUSDT', 'ETHUSDT'];
            let current = ''; let timer;
            async function getList() {
                if(current) return;
                const r = await Promise.all(coins.map(s => fetch('https://api.binance.com/api/v3/ticker/price?symbol='+s).then(res=>res.json())));
                document.getElementById('items-container').innerHTML = r.map(i => \`
                    <div class="coin-card" onclick="openRadar('\${i.symbol}')"><b>\${i.symbol.replace('USDT','')}</b><span style="color:#00d2ff;">$\${parseFloat(i.price).toLocaleString()}</span></div>
                \`).join('');
            }
            async function openRadar(s) {
                current = s; document.getElementById('list-view').style.display='none'; document.getElementById('radar-view').style.display='block';
                document.getElementById('active-coin').innerText = s.replace('USDT',''); update(); timer = setInterval(update, 3000);
            }
            function closeRadar() { current = ''; clearInterval(timer); document.getElementById('list-view').style.display='block'; document.getElementById('radar-view').style.display='none'; }
            
            async function update() {
                try {
                    const [pR, dR] = await Promise.all([
                        fetch('https://api.binance.com/api/v3/ticker/price?symbol='+current).then(res=>res.json()),
                        fetch('https://api.binance.com/api/v3/depth?limit=500&symbol='+current).then(res=>res.json())
                    ]);
                    const p = parseFloat(pR.price);
                    document.getElementById('val-price').innerText = '$' + p.toLocaleString();
                    
                    const bVol = dR.bids.reduce((a,b)=>a+parseFloat(b[1]),0);
                    const sVol = dD = dR.asks.reduce((a,b)=>a+parseFloat(b[1]),0);
                    const bP = ((bVol/(bVol+sVol))*100).toFixed(1);
                    const sP = (100-bP).toFixed(1);
                    document.getElementById('val-b').innerText = bP + '%';
                    document.getElementById('val-s').innerText = sP + '%';

                    const sig = document.getElementById('val-sig');
                    if(bP > 53) { sig.innerText = 'SIGNAL: BULLISH (BUY)'; sig.style.background='#22c55e'; sig.style.color='#000'; }
                    else if(sP > 53) { sig.innerText = 'SIGNAL: BEARISH (SELL)'; sig.style.background='#ef4444'; sig.style.color='#fff'; }
                    else { sig.innerText = 'SIGNAL: NEUTRAL'; sig.style.background='#333'; sig.style.color='#fff'; }

                    const getWalls = (data, isBuy) => {
                        const step = p > 1000 ? 500 : p*0.05;
                        const targets = [p+(step), p+(step*2), p+(step*3), p-(step), p-(step*2), p-(step*3)];
                        const walls = [];
                        for(let i=1; i<=4; i++) {
                            const targetP = isBuy ? p-(step*i) : p+(step*i);
                            const match = data.find(w => Math.abs(parseFloat(w[0]) - targetP) < step*0.5);
                            walls.push({ price: targetP, vol: match ? parseFloat(match[1]).toFixed(1) : "0.0" });
                        }
                        return walls;
                    };

                    const finalS = getWalls(dR.asks, false);
                    const finalB = getWalls(dR.bids, true);

                    document.getElementById('list-s').innerHTML = finalS.map(w => \`<div class="wall-row"><span>🚀 $\${parseInt(w.price).toLocaleString()}</span><span>Vol: \${w.vol}M</span></div>\`).join('');
                    document.getElementById('list-b').innerHTML = finalB.map(w => \`<div class="wall-row"><span>🛡️ $\${parseInt(w.price).toLocaleString()}</span><span>Vol: \${w.vol}M</span></div>\`).join('');
                } catch(e) {}
            }
            setInterval(getList, 8000); getList();
        </script>
    </body>
    </html>
    `);
});

module.exports = app;