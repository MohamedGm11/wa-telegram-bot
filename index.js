const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fetch = require("node-fetch");

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "./whatsapp-session" }),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

const TELEGRAM_BOT_TOKEN = "ضع_توكن_البوت_هنا";
const TELEGRAM_CHAT_ID = "ضع_آي_دي_المجموعة_هنا";

client.on("qr", (qr) => {
  console.log("امسح كود الـ QR التالي من لوحة تحكم Render (Logs):");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("متصل بنجاح وجاهز لمراقبة رسائل الواتساب!");
});

client.on("message", async (msg) => {
  if (msg.body) {
    const textToSend = `رسالة جديدة من القناة:\n\n${msg.body}`;

    try {
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
    } catch (error) {
      console.error("خطأ في إرسال الرسالة لتلجررام:", error);
    }
  }
});

client.initialize();
