const { EmbedBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const database = require('../../Schemas/blacklisted');
module.exports = {
    name: 'blacklistview',
    description: "View all blacklisted users",
    type: ApplicationCommandType.ChatInput,
    owner: true,
    cooldown: 2000,
    run: async (client, interaction) => {
        let users = []
        let db = await database.find({})

        db.forEach(user => {
            users.push(user.UserID)
        })

        users = users.toString().replace(',', '\n')

        let embed = new EmbedBuilder()
        .setTitle("All Blacklisted Users")
        .setDescription(users)
        .setColor(client.config.Setup.EmbedColor)
        interaction.reply({embeds: [embed]})
    }
};