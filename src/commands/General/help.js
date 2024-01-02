const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ButtonStyle, StringSelectMenuBuilder, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");

module.exports = {
    name: 'help',
    description: "Run the help command",
    type: ApplicationCommandType.ChatInput,
    cooldown: 1000,
    run: async (client, interaction) => {

        const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Nothing selected')
                .addOptions(
                    {
                        label: 'General',
                        description: 'View the general Commands',
                        value: 'general',
                        emoji: '🥇'
                    },
                    {
                        label: 'Staff',
                        description: 'View the staff commands',
                        value: 'staff',
                        emoji: '⤴️'
                    }, {
                        label: 'Owner',
                        description: 'View the Owner commands',
                        value: 'owner',
                        emoji: '👑'
                    }
                ),
        );

        const embed = new EmbedBuilder()
        .setTitle('👋 Help Menu')
        .setDescription(`*Please Select A Category Below*\n\n > 🥇 - General Commands\n > ⤴️ - Staff Commands\n > 👑 - Owner Commands`)
        .setColor(client.config.Setup.EmbedColor)
        .setFooter({text: client.config.Setup.EmbedFooter})
        .setTimestamp()
        interaction.reply({embeds: [embed], components: [row]})
    }
};