const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField, Attachment} = require('discord.js');
const database = require('../../Schemas/guild')
const ms = require('ms')
const moment = require('moment')
const bansDatabase = require('../../Schemas/bans')

module.exports = {
    name: 'ban',
    description: "Ban a user",
    type: ApplicationCommandType.ChatInput,
    staff: true,
    options: [{
        name: 'userid',
        description: 'The ID of the user you want to ban',
        type: ApplicationCommandOptionType.String,
        required: true
    }, {
        name: 'time', 
        description: 'days(ex: 1d) or permanent',
        type: ApplicationCommandOptionType.String,
        required: true
    }, {
        name: 'evidence',
        description: 'Please provide a picture',
        type: ApplicationCommandOptionType.Attachment,
        required: true
    }, {
        name: 'reason',
        description: 'Please provide a reason for banning this user',
        type: ApplicationCommandOptionType.String,
        required: true
    },{
        name: 'username',
        description: 'What is the users name?',
        type: ApplicationCommandOptionType.String,
        required: false
    }],
    cooldown: 10000,
    run: async (client, interaction) => {
        let userID = interaction.options.getString('userid')
        let time = interaction.options.getString('time')
        let evidence = interaction.options.getAttachment('evidence')
        let username = interaction.options.getString('username')
        let reason = interaction.options.getString('reason')
        let name;

        const bansDB = await bansDatabase.findOne({UserID: userID})
        if(bansDB) {
            return interaction.reply({content: 'That user is already banned from all guilds.'})
        }

        if(username) name = `${username}(${userID})`
        else name = userID

        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let currentDate = `${month}-${day}-${year}`

        await database.find({}).then(guilds => {
            guilds.forEach(guild => {
                if(guild.PublicLogsChannelID) {
                let channel = client.channels.cache.get(guild.PublicLogsChannelID)
                if(!channel) return
                let embed = new EmbedBuilder()
                .setTitle(`🔨 User Banned`)
                .addFields(
                    {name: '----------------\n**Staff Member**', value: `${interaction.user.username}[${interaction.user.id}]`},
                    {name: 'Banned User:', value: `${name}\n----------------`},
                    {name: 'Reason:', value: reason},
                    {name: 'Time:', value: time},
                    {name: 'Date:', value: currentDate + '\n----------------'}
                )
                .setColor(client.config.Setup.EmbedColor)
                .setFooter({text: client.config.Setup.EmbedFooter})
                .setImage(evidence.url)
                channel.send({embeds: [embed]})
                }
            })
        })

        let embed = new EmbedBuilder()
        .setTitle(`🔨 User Banned`)
        .addFields(
            {name: '----------------\n**Staff Member**', value: `${interaction.user.username}[${interaction.user.id}]`},
            {name: 'Banned User:', value: `${name}\n----------------`},
            {name: 'Reason:', value: reason},
            {name: 'Time:', value: time},
            {name: 'Date:', value: currentDate}
        )
        .setColor(client.config.Setup.EmbedColor)
        .setFooter({text: client.config.Setup.EmbedFooter})
        .setImage(evidence.url)
        interaction.reply({embeds: [embed]})


        client.guilds.cache.forEach(async guild => {
            if(guild.id == client.config.Bot.GuildID) return
            let member = guild.members.cache.get(userID)
            member.ban()

            if(time !== 'permanent') {
                setTimeout(async () => {
                    await bansDatabase.findOneAndDelete({UserID: userID}).catch((err => null))
                    guild.members.unban(userID)
                }, ms(time))
            }
        })
        await bansDatabase.create({
            UserID: userID, username: name || null,
            StaffMember: interaction.user.username,
            Reason: reason,
            Time: time,
            Date: currentDate

        }).catch((err => null))
    }
};