// Require the necessary discord.js classes
const { Events } = require('discord.js');

// When interacted with, run this code (always)
module.exports = {
	name: Events.InteractionCreate,
    once: false,
	execute(interaction) {
		console.log(interaction);
	},
};