// Require the necessary discord.js classes
const { Events } = require('discord.js');

// When interacted with, run this code (always)
module.exports = {
	events: [
		{
			name: Events.MessageCreate,
			once: false,
			execute(message) {
				if (message.author.bot) return;

				console.log(`Read Message: "${message.content}"`);
			}
		}
	]
};