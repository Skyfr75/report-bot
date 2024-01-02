const { EmbedBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: 'reportpanel',
    description: "sends the report panel embed!",
    type: ApplicationCommandType.ChatInput,
    owner: true,
    cooldown: 2000,
    run: async (client, interaction) => {
        
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('report')
            .setLabel('Create A Report!')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('📛'),
        )

        let embed = new EmbedBuilder()
        .setTitle('📛 ・ Reports')
        .setDescription(`**Please react with \`📛\` to create a report**`)
        .setColor(client.config.Setup.EmbedColor)
        .setFooter({text: client.config.Setup.EmbedFooter})
        interaction.reply({embeds: [embed], components: [button]})
    }
};