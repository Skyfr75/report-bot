const { ApplicationCommandType, EmbedBuilder} = require('discord.js');

module.exports = {
    name: 'discord',
    description: "Get an invite to our support server!",
    type: ApplicationCommandType.ChatInput,
    cooldown: 2000,
    run: async (client, interaction) => {
        let embed = new EmbedBuilder()
        .setTitle('🆘 Support Server')
        .setDescription(`You may join our support server by [Pressing Here](${client.config.Setup.supportServerInviteLink})`)
        .setColor(client.config.Setup.EmbedColor)
        .setFooter({text: client.config.Setup.EmbedFooter})
        .setTimestamp()
        interaction.reply({embeds: [embed]})
    }
};