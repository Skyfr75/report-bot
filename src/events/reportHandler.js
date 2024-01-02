const { EmbedBuilder, ChannelType, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");
const client = require('..');
let database = require('../Schemas/blacklisted')

client.on('interactionCreate', async interaction => {
    if(interaction.customId == 'report') {
        

        let db = await database.findOne({UserID: interaction.user.id}) 
        if(db) {
            return interaction.reply({content: 'You are blacklisted from the report system.', ephemeral: true})
        }


        const Buttons = new ActionRowBuilder()
        Buttons.addComponents(
        new ButtonBuilder()
        .setCustomId('close')
        .setLabel('Close This Ticket')
        .setStyle(ButtonStyle.Danger),
        )


        if(client.config.TicketSystem.ReportCategoryID) {
            interaction.guild.channels.create({
                name: `report-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: client.config.TicketSystem.ReportCategoryID,
                permissionOverwrites: [
                    {
                      id: interaction.guild.id,
                      deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                      id: client.config.Setup.supportRoleID,
                      allow: [PermissionsBitField.Flags.ViewChannel],
                    }, {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                    }
                  ],
            }).then((x) => {

                interaction.reply({
                    content: `Your ticket has been created! ${x} | ${x.name}`,
                    ephemeral: true,
                  });


                let embed = new EmbedBuilder()
                .setTitle(`Report - ${interaction.user.username}`)
                .setDescription(`*Please answer the following questions:*\n > What user are you reporting (userid)?\n > Proof, Screenshots etc??\n > Why are you reporting them?`)
                .setColor(client.config.Setup.EmbedColor)
                x.send({embeds: [embed], components: [Buttons]})

                x.permissionOverwrites.set([
                    {
                      id: interaction.guild.id,
                      deny: [PermissionsBitField.Flags.ViewChannel],
                    
                    }, {
                      id: interaction.user.id,
                      allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    }, {
                      id: client.config.Setup.supportRoleID,
                      allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    }
                  ])
            })
        } else {
            return interaction.reply({content: 'The ticket system is not setup.', ephemeral: true})
        }
    }

    if(interaction.customId == 'close') {
        if(!interaction.member.roles.cache.get(client.config.Setup.supportRoleID)) {
            return interaction.reply({content: 'Only staff members can close report tickets.'})
        }

        interaction.reply({content: 'Closing in 5 seconds...'})


        setTimeout(() => {
            interaction.channel.delete()
        }, 5000)
    }
});