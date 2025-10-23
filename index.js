// File and path information (node.js)
const fs = require('node:fs');
const path = require('node:path');

// Require the necessary discord.js classes
const { Client, IntentsBitField } = require('discord.js');
const { token } = require('./config.json');

// Create an IntentBitField to keep track of intents
const intents = new IntentsBitField();
intents.add(IntentsBitField.Flags.Guilds);
intents.add(IntentsBitField.Flags.GuildMessages);
intents.add(IntentsBitField.Flags.MessageContent);

// Create a new client instance
const client = new Client({ intents: intents });

// For every file in the events folder
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
	// For every event defined by the file
	const filePath = path.join(eventsPath, file);
	const { events } = require(filePath);
	for (const event of events) {
		// If the event is to happen once, do it, otherwise do it every time
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}
}

// Log in to Discord with your client's token
client.login(token);