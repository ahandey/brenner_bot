// File and path information (node.js)
const fs = require('node:fs');
const path = require('node:path');

// Require the necessary discord.js classes
const { Client, IntentsBitField, Collection } = require('discord.js');
const { token } = require('./config.json');

// Create an IntentBitField to keep track of intents
const intents = new IntentsBitField();
intents.add(IntentsBitField.Flags.Guilds);
intents.add(IntentsBitField.Flags.GuildMessages);
intents.add(IntentsBitField.Flags.MessageContent);

// Create a new client instance
const client = new Client({ intents: intents });

// Environmnt object for events to interact with
const env = {
    // Client for sending messages
    client: null,

	// Commands
	commands: new Collection()
};

// For every folder in the commands folder
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
	// For every .js file in the folder
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		// Add the command defined by the file
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			env.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// For every .js file in the events folder
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
	// For every event defined by the file
	const filePath = path.join(eventsPath, file);
	const { events } = require(filePath);
	for (const event of events) {
		// If the event is to happen once, do it, otherwise do it every time
		if (event.once) {
			client.once(event.name, (...args) => event.execute.apply(env, args));
		} else {
			client.on(event.name, (...args) => event.execute.apply(env, args));
		}
	}
}

// Log in to Discord with your client's token
client.login(token);