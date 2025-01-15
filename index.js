const express = require("express");

const bodyParser = require("body-parser");

const session = require("express-session");

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");

const OAuth2 = require("discord-oauth2");

const fs = require("fs");

const moment = require("moment");

// إعدادات التطبيق

const app = express();

const oauth = new OAuth2();



const PORT = 25565; // بورت الهوست

const DISCORD_CLIENT_ID = ""; // ايدي بوت

const DISCORD_CLIENT_SECRET = "";// سيكريت بوت

const DISCORD_BOT_TOKEN = "";// توكن بوت

const GUILD_ID = "";// ايدي سيرفر

const CHANNEL_ID = "";// ايدي روم تقديمات

const ADMIN_ID = ""; // ايدي حساب المسؤول

const ROLE_ID = ""; // ايدي رتبة التقديم



// إعداد Discord.js

const client = new Client({

  intents: [

    GatewayIntentBits.Guilds,

    GatewayIntentBits.GuildMessages,

    GatewayIntentBits.MessageContent,

  ],

});

client.once("ready", () => {

  console.log(`${client.user.tag} is online!`);

});

// تشغيل بوت Discord

client.login(DISCORD_BOT_TOKEN);

// إعداد Express.js

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(

  session({

    secret: "secret-key",

    resave: false,

    saveUninitialized: true,

  })

);



app.get("/", (req, res) => {

  const authUrl = oauth.generateAuthUrl({

    clientId: DISCORD_CLIENT_ID,

    redirectUri: `http://ايدي الهوست/callback`, // هنا تحط عنوان الهوست 

    scope: ["identify"],

  });

  res.redirect(authUrl);

});

// استلام رمز OAuth2

app.get("/callback", async (req, res) => {

  const code = req.query.code;

  if (!code) return res.redirect("/");

  const token = await oauth.tokenRequest({

    clientId: DISCORD_CLIENT_ID,

    clientSecret: DISCORD_CLIENT_SECRET,

    code,

    scope: "identify",

    grantType: "authorization_code",

    redirectUri: `http://ايدي الهوست/callback`, // هنا تحط ادريس الهوست

  });

  const user = await oauth.getUser(token.access_token);

  req.session.user = user;

  res.redirect("/application");

});

// صفحة التقديم

app.get("/application", (req, res) => {

  if (!req.session.user) return res.redirect("/");

  // تحميل الأسئلة من ملف JSON

  const questions = JSON.parse(fs.readFileSync("./questions.json", "utf8"));

    const lastSubmission = req.session.lastSubmission;

  const currentTime = moment();

  const timeDiff = lastSubmission ? currentTime.diff(moment(lastSubmission), "hours") : null;
  res.render("application.ejs", {

    user: req.session.user,

    questions: questions,


    canSubmit: timeDiff === null || timeDiff >= 12, // السماح بالتقديم إذا كانت الفترة أكثر من 12 ساعة

  
  });

});

// استلام التقديم

app.post("/submit", async (req, res) => {

  if (!req.session.user) return res.redirect("/");
const lastSubmission = req.session.lastSubmission;

  const currentTime = moment();

  const timeDiff = lastSubmission ? currentTime.diff(moment(lastSubmission), "hours") : null;

  if (timeDiff !== null && timeDiff < 12) {

    return res.send(`

      <h3> في حال تم رفضك لا يمكنك التقديم الا بعد 12 ساعة.</h3>

      <a href="/application">رجوع</a>

    `);

  }
  const { username, id, avatar } = req.session.user;

  const answers = Object.values(req.body);

  /*const embed = new EmbedBuilder()

    .setColor("#78B8E7")

    .setTitle("تقديم جديد")
    
    .setImage("https://media.discordapp.net/attachments/1323306887399079967/1329168990458744902/Minimalist_Black_White_The_End_Animation_Video.png?ex=67895c96&is=67880b16&hm=d7662bc6e8827b5253cb0596774edd63723caf07fe81ab3b0ae1d5e09ee6e9a5&") // هنا تحط رابط الصورة

    .setThumbnail(`https://cdn.discordapp.com/avatars/${id}/${avatar}.png`)

    .setFooter({ text: id });

  // إضافة الأسئلة والإجابات

  const questions = JSON.parse(fs.readFileSync("./questions.json", "utf8"));

  questions.forEach((question, index) => {

    embed.addFields([{ name: question, value: answers[index] || "لم تتم الإجابة" }]);

  });

  // إرسال الرسالة إلى قناة معينة في Discord

  const channel = client.channels.cache.get(CHANNEL_ID);

  const msg = await channel.send({ embeds: [embed], components: getActionRow() });

  // حفظ وقت الإرسال

  req.session.lastSubmission = moment().toISOString();

  res.send("تم إرسال التقديم بنجاح!.");

});

// إنشاء أزرار القبول والرفض

function getActionRow() {

  return new ActionRowBuilder().addComponents(

    new ButtonBuilder().setCustomId("accept").setEmoji("<:emoji_66:1324795398463819919>").setStyle(ButtonStyle.Success),

    new ButtonBuilder().setCustomId("reject").setEmoji("<:emoji_86:1327373113779814530>").setStyle(ButtonStyle.Danger)

  );

}*/
    
const embed = new EmbedBuilder()

    .setColor("#78B8E7")

    .setTitle("تقديم جديد")

    .setImage("https://media.discordapp.net/attachments/1323306887399079967/1329168990458744902/Minimalist_Black_White_The_End_Animation_Video.png?ex=67895c96&is=67880b16&hm=d7662bc6e8827b5253cb0596774edd63723caf07fe81ab3b0ae1d5e09ee6e9a5&")

    .setThumbnail(`https://cdn.discordapp.com/avatars/${id}/${avatar}.png`)

    .setFooter({ text: id });

const questions = JSON.parse(fs.readFileSync("./questions.json", "utf8")); questions.forEach((question, index) => {

    embed.addFields([{ name: question, value: answers[index] || "لم تتم الإجابة" }]);

  });
    const channel = client.channels.cache.get(CHANNEL_ID);

const msg = await

channel.send({

    embeds: [embed],

    components: [getActionRow()], // تأكد من أن `components` هي مصفوفة من صفوف العمل.

  });
  req.session.lastSubmission = moment().toISOString();

  res.send("تم إرسال التقديم بنجاح! سيتم التواصل معك قريبًا.");

});

function getActionRow() {

  return new ActionRowBuilder().addComponents(

    new ButtonBuilder()

      .setCustomId("accept")

      .setEmoji("<:emoji_66:1324795398463819919>")

      .setStyle(ButtonStyle.Success),
new ButtonBuilder()

      .setCustomId("reject")

      .setEmoji("<:emoji_86:1327373113779814530>")

      .setStyle(ButtonStyle.Danger)

  );

}
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const { customId, message, user } = interaction;

  // تحقق من صلاحيات المستخدم
  if (user.id !== ADMIN_ID) {
    return interaction.reply({ content: "ايدي حساب المسؤول لا يطابق ايدي حسابك!", ephemeral: true });
  }

  const applicantId = message.embeds[0].footer.text;
  const guild = client.guilds.cache.get(GUILD_ID);

  // تحقق من وجود السيرفر
  if (!guild) {
    return interaction.reply({ content: "لم يتم العثور على السيرفر.", ephemeral: true });
  }

  // جلب العضو من السيرفر باستخدام fetch بدلاً من cache
  let member;
  try {
    member = await guild.members.fetch(applicantId);
  } catch (error) {
    console.error("Error fetching member:", error);
    return interaction.reply({ content: "حدث خطأ أثناء جلب العضو.", ephemeral: true });
  }

  // إذا لم يتم العثور على العضو، الرد برسالة خطأ
  if (!member) {
    return interaction.reply({ content: "لم يتم العثور على العضو في السيرفر.", ephemeral: true });
  }

  try {
    if (customId === "accept") {
      // تأكد من أن البوت لديه صلاحيات لإضافة الرتبة
      if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        return interaction.reply({ content: "ليس للبوت صلاحية إضافة الرتبة.", ephemeral: true });
      }

      // إضافة الرتبة للعضو
      await member.roles.add(ROLE_ID);
      await member.send("تم قبولك في الإدارة!");
      interaction.reply("تم قبول العضو بنجاح!");

      // تعطيل الأزرار بعد النقر
      await message.edit({ components: [] });
    } else if (customId === "reject") {
      await member.send("تم رفض طلبك. نتمنى لك التوفيق!");
      interaction.reply("تم رفض العضو بنجاح!");

      // تعطيل الأزرار بعد النقر
      await message.edit({ components: [] });
    }
  } catch (error) {
    console.error("Error handling the interaction:", error);
    interaction.reply({ content: "حدث خطأ أثناء معالجة التفاعل.", ephemeral: true });
  }
});

// بدء السيرفر

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));