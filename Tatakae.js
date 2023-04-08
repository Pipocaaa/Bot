const { Client, Intents, MessageAttachment } = require('discord.js');
const http = require('http');
const fs = require('fs');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const cards = ["Naruto Uzumaki", "Sasuke Uchiha", "Monkey D. Luffy", "Ichigo Kurosaki", "Goku", "Vegeta", "Edward Elric", "Light Yagami", "Eren Yeager", "Levi Ackerman", "Erza Scarlet", "Natsu Dragneel", "Kirito", "Asuna Yuuki", "Saitama", "Genos", "Kaneki Ken", "Touka Kirishima", "Ryuko Matoi", "Satsuki Kiryuin"];

let currentCard = null;

client.once('ready', () => {
  console.log('Bot is ready.');

  // Schedule card renewal
  setInterval(() => {
    currentCard = shuffle(cards)[0];
    console.log(`Current card: ${currentCard}`);
  }, 60 * 60 * 1000); // Renew every hour
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!card')) {
    if (!currentCard) {
      await message.channel.send('Nenhuma carta disponível no momento. Tente novamente mais tarde.');
      return;
    }
    const hiddenCard = currentCard.replace(/[^\s]/g, '_');
    const attachment = new MessageAttachment(`./cards/${currentCard}.jpg`);
    await message.channel.send(hiddenCard, attachment);
  } else if (message.content.toLowerCase() === currentCard?.toLowerCase()) {
    currentCard = null;
    await message.channel.send(`Parabéns, ${message.author.username}, você acertou!`);
  }
});

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Create a web server to avoid the bot sleeping on Heroku
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Ping');
  res.end();
}).listen(process.env.PORT || 8080);

// Login with the bot token
client.login('MTA5MTU4OTA3NTUzNTkyOTM0NA.Gax5Zi.2PWQm-41utLu5W6cd6V9dnDgBqL2WExgnxM1JA');
