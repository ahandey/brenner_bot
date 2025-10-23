// File and path information (node.js)
const fs = require('node:fs');
const path = require('node:path');

// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// For every file in the events folder
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
	// For every event defined by the file
	const filePath = path.join(eventsPath, file);
	const eventSet = require(filePath);
	for (const event of eventSet.event) {
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