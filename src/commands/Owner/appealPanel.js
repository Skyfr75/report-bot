const { EmbedBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: 'appealpanel',
    description: "sends the appeal panel embed!",
    type: ApplicationCommandType.ChatInput,
    owner: true,
    cooldown: 2000,
    run: async (client, interaction) => {
        
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('open')
            .setLabel('Create An Appeal Request!')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🎫'),
        )

        let embed = new EmbedBuilder()
        .setTitle('🎫 ・ Appeals')
        .setDescription(`**Please react with \`🎫\` to create an appeal request**`)
        .setColor(client.config.Setup.EmbedColor)
        .setFooter({text: client.config.Setup.EmbedFooter})
        interaction.reply({embeds: [embed], components: [button]})
    }
};