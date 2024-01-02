const { EmbedBuilder, ApplicationCommandOptionType, ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const database = require('../../Schemas/blacklisted')
module.exports = {
    name: 'blacklist-add',
    description: "Blacklist a user",
    type: ApplicationCommandType.ChatInput,
    owner: true,
    options: [{
        name: 'userid',
        description: 'the ID of the user you want to blacklist',
        type: ApplicationCommandOptionType.String,
        required: true,
    }],
    cooldown: 2000,
    run: async (client, interaction) => {
        let user = interaction.options.getString('userid')
        let db = await database.findOne({UserID: user})
        if(db) {
            return interaction.reply({content: 'That user is already blacklisted.', ephemeral: true})
         }

        interaction.reply({content: `Added \`${user}\` to the blacklist.`})
        await database.create({UserID: user, isBlacklisted: true}).catch((err ) => null)
    }
};