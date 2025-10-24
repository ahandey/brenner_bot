// Require the necessary discord.js classes
const { ChannelType } = require("discord.js");

// When message is recieved, run this code (always)
module.exports = {
	events: [
		{
			name: "messageCreate",
			once: false,
			async execute(message) {
                // Don't respond to bots
				if (message.author.bot) return;
				
				// Check for forum messages
                // If it's not a guild thread, return
                switch (message.channel.type) {
					default:
						return;

					case ChannelType.GuildPublicThread:
					case ChannelType.GuildPrivateThread:
						break;
				}
				// Get parent channel
				const parent = channel.guild.channels.cache.get(channel.parentId);
				// If there's no parent or the parent is not a forum, return
				if (!parent || parent.type != ChannelType.GuildForum) return;
                
				// Reply
				message.channel.send(`Testing: "${message.content}"`);

                // Log message info
				console.log(`Forum message "${message.content}" in thread ${message.channel.name}`);
			}
		}
	]
};