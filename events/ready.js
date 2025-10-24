// Require the necessary discord.js classes
const { Events } = require('discord.js');

// When the client is ready, run this code (only once).
module.exports = {
	events: [
		{
			name: Events.ClientReady,
			once: true,
			execute(client) {
				// Remember the client
                this.client = client;
                
                // Log client info
                console.log(`\nReady!\nLogged in as ${client.user.tag}`);
			}
		}
	]
};