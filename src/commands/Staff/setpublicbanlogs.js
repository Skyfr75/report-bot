const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField} = require('discord.js');
const database = require('../../Schemas/guild')

module.exports = {
    name: 'setpublicbanlogs',
    description: "set the public bans logs channel!",
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: 'channel',
        description: 'The channel you want the public logs to go to',
        type: ApplicationCommandOptionType.Channel,
        required: true
    }],
    cooldown: 2000,
    run: async (client, interaction) => {
        if(!interaction.member.permissions.has([PermissionsBitField.Flags.Administrator])) {
            return interaction.reply({content: 'You cannot use this.', ephemeral: true})
        }
        await database.findOne({GuildID: interaction.guild.id}) || await database.create({GuildID: interaction.guild.id})
        let channel = interaction.options.getChannel('channel')


        let embed = new EmbedBuilder()
        .setTitle(':white_check_mark: Logs Channel Saved')
        .setDescription(`You've successfully set the \`Public Logs Channel\` to ${channel}!`)
        .setColor(client.config.Setup.EmbedColor)
        .setFooter({text: client.config.Setup.EmbedFooter})
        .setTimestamp()
        interaction.reply({embeds: [embed]})

        await database.findOneAndUpdate({GuildID: interaction.guild.id}, {PublicLogsChannelID: channel.id}).catch((err => null))
    }
};