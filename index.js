const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fetch = require("node-fetch");

// ضع التوكن ورقم المجموعة واسم القناة هنا
const TELEGRAM_BOT_TOKEN = "8997117325:AAEbJU-Pu63s5WChYeKT2SVf6cuxoU63Dck";
const TELEGRAM_CHAT_ID = "-1004384489208";
const TARGET_CHANNEL_NAME = "Now Exchange";

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "./whatsapp-session" }),
  puppeteer: { args: ["--no-sandbox", "--disable-setuid-sandbox"] },
});

client.on("qr", (qr) => {
  console.log("افتح واتساب في تليفونك وامسح هذا الكود (زي واتساب ويب):");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("تم الربط! البوت يراقب القناة الآن...");
});

client.on("message", async (msg) => {
  try {
    const chat = await msg.getChat();

    // إذا كان اسم المحادثة يطابق اسم القناة، ابعث الرسالة لتلجرام
    if (chat.name === TARGET_CHANNEL_NAME && msg.body) {
      const textToSend = `رسالة جديدة:\n\n${msg.body}`;

      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: textToSend,
          }),
        },
      );
      console.log("تم تحويل رسالة بنجاح!");
    }
  } catch (error) {
    console.error("خطأ:", error);
  }
});

client.initialize();
