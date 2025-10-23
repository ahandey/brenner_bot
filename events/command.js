// Require the necessary discord.js classes
const { Events } = require('discord.js');

// When interacted with, run this code (always)
module.exports = {
	events: [
		{
			name: Events.InteractionCreate,
			once: false,
			async execute(interaction) {
                // If it's not a command, return
                if (!interaction.isChatInputCommand()) return;
                
                // Find the command in the command list
                const command = this.commands.get(interaction.commandName);

                // If no command is found, log an error and return
                if (!command) {
                    console.error(`No command with name "/${interaction.commandName}"`);
                    return;
                }

                try {
                    // Run the command
                    await command.execute.apply(this, [interaction]);
                } catch (error) {
                    console.error(error);

                    // If there was a reply, or a reply is being processed, add a follow-up to it
                    if (interaction.replied || interaction.deferred) {
                        await interaction.followUp({
                            content: 'There was an error while executing this command!',
                            flags: MessageFlags.Ephemeral,
                        });
                    } else { // Reply
                        await interaction.reply({
                            content: 'There was an error while executing this command!',
                            flags: MessageFlags.Ephemeral,
                        });
                    }
                }
			}
		}
	]
};