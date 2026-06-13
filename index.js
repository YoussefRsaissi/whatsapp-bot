const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "wapik-bot" })
});

// Group ID
const groupId = "GROUP_ID@g.us";

// seznam zaměstnanců (jméno;číslo)
const employees = fs.existsSync('employees.txt')
    ? fs.readFileSync('employees.txt', 'utf-8').split('\n').filter(line => line.trim())
    : [];

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log("✅ Connected to WhatsApp!");

    try {
        // načti skupinu
        const group = await client.getChatById(groupId);
        const inviteCode = await group.getInviteCode();
        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

        console.log("🔗 Group invite link:", inviteLink);

        // rozeslat link všem zaměstnancům
        for (let line of employees) {
            if (!line.includes(';')) continue;
            const [name, number] = line.split(';');
            const cleanNumber = number.trim();

            try {
                await client.sendMessage(
                    `${cleanNumber}@c.us`,
                    `Dear ${name.trim()},\n\nThis is the NEW official WhatsApp group for all FIRMA employees.\nPlease join the group as soon as possible using this link: ${inviteLink}`
                );
                console.log(`📩 Sent to: ${name.trim()} (${cleanNumber})`);
            } catch (err) {
                console.log(`❌ Failed: ${name.trim()} (${cleanNumber})`);
            }
        }

        console.log("\n✅ All invite messages have been processed.");

    } catch (err) {
        console.error("❌ Error with group:", err);
    }
});

client.initialize();
