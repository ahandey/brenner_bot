// Require the necessary discord.js classes
const { Events } = require('discord.js');

// When the client is ready, run this code (only once).
module.exports = {
	events: [
		{
			name: Events.ClientReady,
			once: true,
			execute(client) {
                this.client = client;
                
                // Send online message in "general"
				const channel = client.channels.cache.find(c => c.name == "general");
                channel.send("Hey There!");
                
                // Log client info
                console.log(`\nReady!\nLogged in as ${client.user.tag}`);
			}
		}
	]
};