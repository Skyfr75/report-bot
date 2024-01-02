const { EmbedBuilder, ChannelType, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");
const client = require('..');
let database = require('../Schemas/blacklisted')

client.on('interactionCreate', async interaction => {
    if(interaction.customId == 'open') {

        let db = await database.findOne({UserID: interaction.user.id}) 
        if(db) {
            return interaction.reply({content: 'You are blacklisted from the appeal system.', ephemeral: true})
        }
        

        const Buttons = new ActionRowBuilder()
        Buttons.addComponents(
        new ButtonBuilder()
        .setCustomId('close')
        .setLabel('Close This Ticket')
        .setStyle(ButtonStyle.Danger),
        )


        if(client.config.TicketSystem.AppealCategoryID) {
            interaction.guild.channels.create({
                name: `appeal-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: client.config.TicketSystem.AppealCategoryID,
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
                .setTitle(`Appeal - ${interaction.user.username}`)
                .setDescription(`*Please answer the following questions:*\n > When were you banned?\n > Why were you banned?\n > Why should you be unbanned?`)
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
            return interaction.reply({content: 'Only staff members can close appeal tickets.'})
        }

        interaction.reply({content: 'Closing in 5 seconds...'})


        setTimeout(() => {
            interaction.channel.delete()
        }, 5000)
    }
});