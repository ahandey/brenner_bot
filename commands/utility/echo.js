// Require the necessary discord.js classes
const { SlashCommandBuilder, MessageFlags } = require('discord.js');

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
        interaction.channel.send(input);

        // Make ephemeral reply to user to indicate success
        interaction.reply({
            content: `Echo-ing: ${input}`,
            flags: MessageFlags.Ephemeral
        });

        // Log interaction
        console.log(`/echo input="${input}"`);
    }
};