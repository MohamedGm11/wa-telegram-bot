const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fetch = require("node-fetch");
const http = require("http");

// 1. إنشاء سيرفر ويب بسيط لحل مشكلة (No open ports detected)
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WhatsApp Bot is Running Successfully!\n");
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Web server started on port ${PORT}`);
});

// ضع بياناتك هنا
const TELEGRAM_BOT_TOKEN = "8997117325:AAEbJU-Pu63s5WChYeKT2SVf6cuxoU63Dck";
const TELEGRAM_CHAT_ID = "-1004384489208";
const TARGET_CHANNEL_NAME = "Now Exchange";

// 2. إعدادات المتصفح المخففة جداً لحل مشكلة (Out of memory)
const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "./whatsapp-session" }),
  puppeteer: {
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage", // يمنع استهلاك الذاكرة العشوائية المؤقتة
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // يجبر كروم على العمل كعملية واحدة لتوفير الرام
      "--disable-gpu",
    ],
  },
});

client.on("qr", (qr) => {
  console.log("امسح كود الـ QR التالي من تطبيق واتساب:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("تم الربط! البوت يراقب القناة الآن...");
});

client.on("message", async (msg) => {
  try {
    const chat = await msg.getChat();

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
