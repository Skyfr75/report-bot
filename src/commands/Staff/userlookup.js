const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField, Attachment} = require('discord.js');
const database = require('../../Schemas/guild')
const ms = require('ms')
const moment = require('moment')
const bansDatabase = require('../../Schemas/bans')

module.exports = {
    name: 'userlookup',
    description: "Find a banned users information",
    type: ApplicationCommandType.ChatInput,
    staff: true,
    options: [{
        name: 'userid',
        description: 'The ID of the user you want to ban',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    cooldown: 2000,
    run: async (client, interaction) => {
        let userID = interaction.options.getString('userid')     
        
        let db = await bansDatabase.findOne({UserID: userID})

        if(!db) {
            return interaction.reply({content: `There is no ban for ${userID}`,ephemeral: true})
        }

        let Embed = new EmbedBuilder()
        .setTitle(`User Lookup`)
        .setDescription(`*UserID: ${userID}*, *Username: ${db.username}*`)
        .addFields(
            {name: "Staff Member", value: `${db.StaffMember}`},
            {name: 'Reason', value: `${db.Reason}`},
            {name: 'Date Of Ban', value: `${db.Date}`},
            {name: 'Duration Of Ban', value: `${db.Time}`}
        )
        .setColor(client.config.Setup.EmbedColor)
        .setFooter({text: client.config.Setup.EmbedFooter})
        interaction.reply({embeds: [Embed], ephemeral: true})
    }
};