// When message is recieved, run this code (always)
module.exports = {
	events: [
		{
			name: "messageCreate",
			once: false,
			async execute(message) {
                // Don't respond to bots
				if (message.author.bot) return;
				
                // Reply to message
                await message.reply(`You said "${message.content}"`);
                
                // Log message info
				console.log(`Read Message: "${message.content}"`);
			}
		}
	]
};