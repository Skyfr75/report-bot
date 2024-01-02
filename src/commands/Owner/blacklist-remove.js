const { EmbedBuilder, ApplicationCommandOptionType, ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const database = require('../../Schemas/blacklisted')
module.exports = {
    name: 'blacklist-remove',
    description: "unblacklist a user",
    type: ApplicationCommandType.ChatInput,
    owner: true,
    options: [{
        name: 'userid',
        description: 'the ID of the user you want to unblacklist',
        type: ApplicationCommandOptionType.String,
        required: true,
    }],
    cooldown: 2000,
    run: async (client, interaction) => {
        let user = interaction.options.getString('userid')
        let db = await database.findOne({UserID: user})
            if(!db) {
                return interaction.reply({content: 'That user is not blacklisted.', ephemeral: true})
            }

            interaction.reply({content: `remove \`${user}\` from the blacklist.`})
            await database.findOneAndDelete({UserID: user, isBlacklisted: true}).catch((err ) => null)
       
    }
};