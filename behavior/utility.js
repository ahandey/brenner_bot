// Require necessary discord.js classes
const { MessageFlags } = require("discord.js");
// Require helper classes
const { Command, Action } = require("./../helper.js");

const commands = [
    // /echo input:string
    new Command(
        "echo",
        [
            {name: "input", type: "string"}
        ],
        [
            // No optional arguments
        ],
        // when called
        async function excecute (args, kwargs) {
            // Get input argument
            const input = args.input;

            // Start "typing" ephemeral reply
            await call.deferReply({ flags: MessageFlags.Ephemeral })

            // Send response
            await call.channel.send(input);

            // Send reply to user to indicate success
            await call.editReply(`Echo-ed: ${input}`);

            // Log interaction
            console.log(`/echo input="${input}"`);
        }
    )
];

const actions = [
    // Ready action
    new Action(
        // When ready
        Events.ClientReady,
        async function (interaction) {
            // Remember the client
            this.client = client;
            
            // Log client info
            console.log(`\nReady!\nLogged in as ${client.user.tag}`);
        }
    ).once() // Only run once
    ,
    // Handle commands
    new Action(
        // Trigger when interaction created
        Events.InteractionCreate,
        async function (interaction) {
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
    )
];

module.exports = { commands, actions };