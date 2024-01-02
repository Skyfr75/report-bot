const { ApplicationCommandType, EmbedBuilder} = require('discord.js');

module.exports = {
    name: 'invite',
    description: "Get a link to invite me!",
    type: ApplicationCommandType.ChatInput,
    cooldown: 2000,
    run: async (client, interaction) => {
        let embed = new EmbedBuilder()
        .setTitle(':tada: Invite Link')
        .setDescription(`You may invite me by [Pressing Here](https://discord.com/api/oauth2/authorize?client_id=${client.config.Bot.ClientID}&permissions=1008275042968277003&scope=bot%20applications.commands)`)
        .setColor(client.config.Setup.EmbedColor)
        .setFooter({text: client.config.Setup.EmbedFooter})
        .setTimestamp()
        interaction.reply({embeds: [embed]})
    }
};