const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEZAR WHALE ENGINE PRO</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { background: #000; color: #fff; font-family: monospace; margin: 0; padding: 10px; display: flex; flex-direction: column; align-items: center; }
        .victus-box { width: 100%; max-width: 450px; background: #000; border: 2px solid #333; padding: 15px; }
        .gold-header { border: 2px double #fbbf24; padding: 10px; text-align: center; margin-bottom: 15px; }
        .price-dash { border: 1px dashed #555; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 15px; background: #080808; }
        .sig-btn { padding: 20px; text-align: center; font-weight: bold; font-size: 18px; margin: 15px 0; border-radius: 4px; border: 1px solid #444; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
        .data-row { display: flex; justify-content: space-between; font-size: 13px; padding: 8px 0; border-bottom: 1px solid #111; }
        .list-item { border: 1px solid #222; padding: 15px; margin-bottom: 10px; display: flex; justify-content: space-between; cursor: pointer; background: #080808; width: 100%; max-width: 450px; }
        .back-btn { background: #1a1a1a; color: #666; border: 1px solid #333; padding: 10px; width: 100%; cursor: pointer; }
    </style>
</head>
<body>
    <div id="menu">
        <div class="gold-header"><h2>🚀 SEZAR WHALE ENGINE - SMART MONEY 🛰️</h2></div>
        <div id="list-cont">[ SCANNING LIQUIDITY... ]</div>
    </div>

    <div id="radar-ui" style="display:none;">
        <div class="victus-box">
            <div class="gold-header">
                <h2>🚀 VICTUS RADAR PRO - BY SEZAR PHANTOM 🛰️</h2>
                <p style="font-size:10px; color:#fbbf24;">SMART MONEY & ORDER FLOW ANALYZER</p>
            </div>
            <div id="coin-name" style="font-size:32px; color:#00d2ff; text-align:center;">---</div>
            <div class="price-dash">PRICE: <span id="p-val">$0.00</span></div>
            
            <div id="sig-val" class="sig-btn">INITIALIZING...</div>

            <div style="margin-top:20px;">
                <div style="color:#888; font-size:12px; border-bottom:1px solid #222; padding-bottom:5px;">WHALE DATA (MIN $1M)</div>
                <div class="data-row"><span>Buy Power:</span><span id="b-vol" style="color:#22c55e;">$0M</span></div>
                <div class="data-row"><span>Sell Power:</span><span id="s-vol" style="color:#ef4444;">$0M</span></div>
            </div>

            <button class="back-btn" style="margin-top:20px;" onclick="location.reload()">[ RETURN TO COMMAND ]</button>
        </div>
    </div>

    <script>
    const SYMBOLS = ['BTCUSDT','ETHUSDT','SOLUSDT','XAUUSDT'];
    const MIN_WHALE_USDT = 1000000;
    let lastPrice = 0;
    let active = '';

    async function init(){
        const r = await Promise.all(SYMBOLS.map(s => fetch('https://api.binance.com/api/v3/ticker/price?symbol='+s).then(res=>res.json())));
        document.getElementById('list-cont').innerHTML = r.map(i => \`
            <div class="list-item" onclick="startRadar('\${i.symbol}')"><b>\${i.symbol}</b><span>$\${parseFloat(i.price).toLocaleString()}</span></div>\`).join('');
    }

    function startRadar(s){
        active = s;
        document.getElementById('menu').style.display='none';
        document.getElementById('radar-ui').style.display='block';
        document.getElementById('coin-name').innerText = s;
        setInterval(scanMarket, 3000);
    }

    async function scanMarket() {
        try {
            const [pR, dR] = await Promise.all([
                fetch('https://api.binance.com/api/v3/ticker/price?symbol='+active).then(res=>res.json()),
                fetch('https://api.binance.com/api/v3/depth?symbol='+active+'&limit=100').then(res=>res.json())
            ]);

            let buyVolume = 0; let sellVolume = 0;
            let priceNow = parseFloat(pR.price);
            document.getElementById('p-val').innerText = '$' + priceNow.toLocaleString();

            dR.bids.forEach(b => {
                let vol = parseFloat(b[0]) * parseFloat(b[1]);
                if (vol > MIN_WHALE_USDT) buyVolume += vol;
            });
            dR.asks.forEach(a => {
                let vol = parseFloat(a[0]) * parseFloat(a[1]);
                if (vol > MIN_WHALE_USDT) sellVolume += vol;
            });

            document.getElementById('b-vol').innerText = '$' + (buyVolume/1000000).toFixed(2) + 'M';
            document.getElementById('s-vol').innerText = '$' + (sellVolume/1000000).toFixed(2) + 'M';

            let signal = "NEUTRAL ⚖️";
            let sigBox = document.getElementById("sig-val");
            let imbalance = buyVolume / (sellVolume + 1);

            let absorption = (buyVolume > sellVolume && priceNow <= lastPrice) || (sellVolume > buyVolume && priceNow >= lastPrice);
            let fakeBreak = Math.abs(priceNow - lastPrice) > (priceNow * 0.0001) && absorption;

            if (fakeBreak) {
                signal = "💥 FAKE BREAK (STRONG ENTRY)";
                sigBox.style.background = "#fbbf24"; sigBox.style.color = "#000";
            } else if (absorption) {
                signal = "🧲 ABSORPTION (SMART MONEY)";
                sigBox.style.background = "#9333ea"; sigBox.style.color = "#fff";
            } else if (imbalance > 2) {
                signal = "BUY 🚀 (IMBALANCE)";
                sigBox.style.background = "#22c55e"; sigBox.style.color = "#000";
            } else if (imbalance < 0.5) {
                signal = "SELL 🔻 (IMBALANCE)";
                sigBox.style.background = "#ef4444"; sigBox.style.color = "#fff";
            } else {
                sigBox.style.background = "#1e293b"; sigBox.style.color = "#fff";
            }

            sigBox.innerText = signal;
            lastPrice = priceNow;
        } catch (e) { }
    }

    init();
    </script>
</body>
</html>
`);
});

app.listen(3000, () => console.log("Sezar Whale Engine Running..."));