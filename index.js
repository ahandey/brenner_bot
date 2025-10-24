// File and path information (node.js)
const fs = require('node:fs');
const path = require('node:path');

// Require the necessary discord.js classes
const { Client, IntentsBitField, Collection, REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');

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

// Add behaviors (commands and actions)
// For every .js file in the behavior folder
const behaviorPath = path.join(__dirname, 'behavior');
const behaviorFiles = fs.readdirSync(behaviorPath).filter((file) => file.endsWith('.js'));
for (const file of behaviorFiles) {
	// Get the commands and actions defined by the file
	const filePath = path.join(behaviorPath, file);
	const { commands, actions } = require(filePath);

	// Add the commands
	for (const command of commands) {
		env.commands.set(command.name, command);
	}

	// Add the actions
	for (const action of actions) {
		// If the action is to happen once, do it, otherwise do it every time
		client[action.isOnce?"once":"on"](action.trigger, (...args) => action.execute.apply(env, args));
	}
}

// Reload commands through Discord API
// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);
// and deploy commands
(async () => {
	try {
        // get commands
        const commands = Array.from(env.commands.values()).map(command => command.data.toJSON());
        
		console.log(`Started refreshing ${commands.length} guild (/) commands.`);
		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
		console.log(`Successfully reloaded ${data.length} guild (/) commands.`);
	} catch (error) {
		// Catch and log errors
		console.error(error);
	}
})();

// Log in to Discord with your client's token
client.login(token);