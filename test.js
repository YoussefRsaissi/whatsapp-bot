const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "test-session" })
});

// 👉 vlož sem své Group ID
const groupId = "GROUP_ID@g.us";

// 👉 vlož číslo, které chceš zkusit přidat (mezinárodní formát, bez +)
const testNumber = "420123456789"; // nahraď svým číslem

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log("✅ Připojeno k WhatsApp!");

    try {
        await client.addParticipant(groupId, `${testNumber}@c.us`);
        console.log(`➕ ÚSPĚCH: číslo ${testNumber} bylo přidáno do skupiny.`);
    } catch (err) {
        console.log(`❌ CHYBA: číslo ${testNumber} se nepodařilo přidat.`);
        console.error(err);
    }
});

client.initialize();
