// When interacted with, run this code (always)
module.exports = {
	events: [
		{
			name: "messageCreate",
			once: false,
			async execute(message) {
				if (message.author.bot) return;

				console.log(`Read Message: "${message.content}"`);
                await message.reply("Read This")
			}
		}
	]
};