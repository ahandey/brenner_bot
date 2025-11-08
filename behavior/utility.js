// Require necessary discord.js classes
const { Events, MessageFlags } = require("discord.js");
// Require helper classes
const { Command, Action } = require("./../helper.js");

const commands = [
    // [Slash Command]: /echo input:string
    new Command(
        Command.Type.SLASH,
        "echo",
        "Repeats the given input in the given channel",
        [
            {name: "input", type: "string", description: "The text to repeat"}
        ],
        [
            // No optional arguments
        ],
        // when called
        async function excecute(call, args, kwargs) {
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
    ),

    // [Message Context Menu Command]: cat
    new Command(
        Command.Type.MESSAGE_CONTEXT_MENU,
        "cat",
        "", [], [],
        async function execute(call) {
            // Get message text
            const value = call.targetMessage.content;

            // Start "typing" ephemeral reply
            await call.deferReply({ flags: MessageFlags.Ephemeral })

            // Send response
            await call.channel.send(value);

            // Send reply to user to indicate success
            await call.editReply(`Cat-ed: ${value}`);

            // Log interaction
            console.log(`cat "${value}"`);
        }
    )
];

const actions = [
    // Ready action
    new Action(
        // When ready
        Events.ClientReady,
        async function (client) {
            // Remember the client
            this.client = client;
            
            // Start Server Log
            console.clear();
            console.log(`Logged in as ${client.user.tag}`);
        }
    ).once() // Only run once
    ,
    // Handle commands
    new Action(
        // Trigger when interaction created
        Events.InteractionCreate,
        async function (interaction) {
            // Find the command in the command map
            const command = this.commands.get(interaction.commandName);

            // If no command is found, log an error and return
            if (!command) {
                console.error(`No command with name "${interaction.commandName}"`);
                return;
            }

            try {
                // Run the command
                return await command.execute(this, interaction);
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
                return;
            }
        }
    )
];

module.exports = { commands, actions };