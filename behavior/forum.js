// Require the necessary discord.js classes
const { Events, ChannelType } = require("discord.js");
// Require helper classes
const { Action, MessageField, Async } = require("./../helper.js");
// Require config data
const { forumId } = require("./../config.json");

const actions = [
    // Reply to messages
    new Action(
        // When message created
        Events.MessageCreate,
        async function (message) {
            // Don't respond to bots
            if (message.author.bot) return;
            
            // Check for forum messages
            // If it's not a guild thread, return
            const channel = message.channel;
            switch (channel.type) {
                default:
                    return;

                case ChannelType.PublicThread:
                case ChannelType.PrivateThread:
                    break;
            }
            // If there's no parent or the parent is not the bot's forum, return
            if (channel.parentId != forumId) return;
            
            // Log message info
            console.log(`Recieved message "${message.content}" in thread "${channel.name}"`);

            // Reply
            const messageField = new MessageField(channel);
            messageField.startTyping();
            await Async.wait(15000);
            messageField.send("I see you");

            // Log message send info
            console.log(`Replied to "${message.content}" in thread "${channel.name}" in ${messageField.time} ms`);
        }
    )
];

module.exports = { commands: [], actions }