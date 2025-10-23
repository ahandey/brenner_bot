// Require the necessary discord.js classes
const { SlashCommandBuilder } = require('discord.js');

// /echo input
module.exports = {
    data: new SlashCommandBuilder()
        .setName("echo")
        .setDescription("Reply with input")
        .addStringOption(
            (option) => option
                .setName("input")
                .setDescription("The text to echo")
                .setRequired(true)
        ),
    
    async execute(interaction) {
        // Get input value
        const input = interaction.options.getString("input");

        // Send response
        await interaction.channel.send(input);

        // Log interaction
        console.log(`Echo: "${input}"`);
    }
};