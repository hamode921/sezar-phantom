const axios = require('axios');
const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

const DB_FILE = './database.json';

// --- إعدادات سيزر الشخصية ---
const BOT_TOKEN = '8445557428:AAHJt57oWFDa1Kg_OFzBteCBtUDpaqaAE_0'; 
const MY_CHAT_ID = '7794373062'; 
const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT'];
let marketData = {};

// دالات قاعدة البيانات
function loadDB() { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
function saveDB(data) { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); }

// دالة إرسال التنبيه (مع كسر الحظر)
async function sendAlert(message) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${MY_CHAT_ID}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;
    try {
        await axios.get(url, { timeout: 10000 });
        console.log("✅ Telegram Alert Sent!");
    } catch (e) {
        console.log("⚠️ Telegram blocked, but web is still running.");
    }
}

// دالة تحديث السوق
async function updateMarket() {
    for (let sym of symbols) {
        try {
            const res = await axios.get(`https://api.binance.com/api/v3/depth?symbol=${sym}&limit=100`);
            const data = res.data;
            let totalBuy = 0, totalSell = 0;
            data.asks.forEach(a => totalSell += parseFloat(a[0]) * parseFloat(a[1]));
            data.bids.forEach(b => totalBuy += parseFloat(b[0]) * parseFloat(b[1]));
            let buyPer = (totalBuy / (totalBuy + totalSell) * 100);
            
            marketData[sym] = { 
                price: parseFloat(data.bids[0][0]).toLocaleString(), 
                liquidity: buyPer.toFixed(1) 
            };

            // تنبيهات الحيتان (شراء > 70% | بيع < 30%)
            if (buyPer > 70) await sendAlert(`🟢 *تنبيه شراء حيتان!* \nالعملة: ${sym} \nالسيولة: ${buyPer.toFixed(1)}%`);
            if (buyPer < 30) await sendAlert(`🔴 *تنبيه بيع حيتان!* \nالعملة: ${sym} \nالسيولة: ${buyPer.toFixed(1)}%`);

        } catch (e) { console.log(`Error on ${sym}`); }
    }
}

// واجهة المتصفح (المحمية)
app.get('/', (req, res) => {
    const userCode = req.query.code;
    const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    let db = loadDB();

    if (!userCode || !db[userCode]) {
        return res.send(`
            <body style="background:#000; color:#0f0; text-align:center; padding-top:100px; font-family:Arial;">
                <h1>🔱 SEZAR PHANTOM PRIVATE 🔱</h1>
                <p>أدخل كود الاشتراك الخاص بك</p>
                <form action="/" method="get">
                    <input type="text" name="code" placeholder="ENTER CODE" style="padding:15px; width:250px; background:#111; color:#0f0; border:1px solid #0f0;">
                    <button type="submit" style="padding:15px 30px; background:#0f0; cursor:pointer; font-weight:bold;">UNLOCK</button>
                </form>
            </body>
        `);
    }

    if (db[userCode].used && db[userCode].deviceIp !== userIp) {
        return res.send("<h2 style='color:red; text-align:center; padding-top:100px;'>❌ هذا الكود مفعل على جهاز آخر!</h2>");
    }

    if (!db[userCode].used) {
        db[userCode].used = true;
        db[userCode].deviceIp = userIp;
        saveDB(db);
    }

    let rows = "";
    for (let sym in marketData) {
        let color = marketData[sym].liquidity > 50 ? "#0f0" : "#f00";
        rows += `<tr style="border-bottom:1px solid #333; height:50px;">
                    <td>${sym}</td>
                    <td>$${marketData[sym].price}</td>
                    <td style="color:${color}; font-weight:bold;">${marketData[sym].liquidity}%</td>
                 </tr>`;
    }

    res.send(`
        <body style="background:#000; color:#fff; text-align:center; font-family:Arial; padding:15px;">
            <h2 style="color:#0f0; border-bottom:2px solid #0f0; padding-bottom:10px;">🔱 رادار سيزر للمحترفين 🔱</h2>
            <table style="width:100%; max-width:600px; margin:auto; background:#111; border-radius:10px;">
                <tr style="background:#222; color:#0f0;"><th>Asset</th><th>Price</th><th>Buy Liq</th></tr>
                ${rows}
            </table>
            <p style="color:#444; font-size:12px; margin-top:20px;">Device Locked: ${userCode}</p>
            <script>setTimeout(()=>location.reload(), 20000);</script>
        </body>
    `);
});

app.listen(port, () => {
    console.log(`🚀 Sezar Ultimate is LIVE on port ${port}`);
    setInterval(updateMarket, 20000);
});