const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField, Attachment} = require('discord.js');
const database = require('../../Schemas/guild')
const ms = require('ms')
const moment = require('moment')
const bansDatabase = require('../../Schemas/bans')

module.exports = {
    name: 'unban',
    description: "unban a user",
    type: ApplicationCommandType.ChatInput,
    staff: true,
    options: [{
        name: 'userid',
        description: 'The ID of the user you want to ban',
        type: ApplicationCommandOptionType.String,
        required: true
    }, {
        name: 'reason', 
        description: 'The reason for the unban',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    cooldown: 2000,
    run: async (client, interaction) => {
        let userID = interaction.options.getString('userid')
        let reason = interaction.options.getString('reason')

        const bansDB = await bansDatabase.findOne({UserID: userID})
        if(!bansDB) {
            return interaction.reply({content: 'That user is not banned'})
        }

        let name;
        if(bansDB.username !== null) name = `${bansDB.username}`
        else name = `${bansDB.UserID}`


        await database.find({}).then(guilds => {
            guilds.forEach(guild => {
                if(guild.PublicLogsChannelID) {
                let channel = client.channels.cache.get(guild.PublicLogsChannelID)
                if(!channel) return
                let embed = new EmbedBuilder()
                .setTitle(`🥳 User Unbanned`)
                .addFields(
                    {name: '----------------\n**Staff Member**', value: `${interaction.user.username}[${interaction.user.id}]`},
                    {name: 'Unbanned User:', value: `${name}\n----------------`},
                    {name: 'Reason:', value: reason + '\n----------------'},
                )
                .setColor(client.config.Setup.EmbedColor)
                .setFooter({text: client.config.Setup.EmbedFooter})
                channel.send({embeds: [embed]})
                }
            })
        })

        let embed = new EmbedBuilder()
        .setTitle(`🥳 User Unbanned`)
        .addFields(
            {name: '----------------\n**Staff Member**', value: `${interaction.user.username}[${interaction.user.id}]`},
            {name: 'Unbanned User:', value: `${name}\n----------------`},
            {name: 'Reason:', value: reason + '\n----------------'},
        )
        .setColor(client.config.Setup.EmbedColor)
        .setFooter({text: client.config.Setup.EmbedFooter})
        interaction.reply({embeds: [embed]})

        await bansDatabase.findOneAndDelete({UserID: userID}).catch((err => null))
        client.guilds.cache.forEach(async guild => {
                guild.members.unban(userID)
        })
    }
};