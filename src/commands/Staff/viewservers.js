const { EmbedBuilder, ModalBuilder, ApplicationCommandType, TextInputBuilder, TextInputStyle, ApplicationCommandOptionType, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle  } = require("discord.js");


const IDLE_TIMEOUT = 30; 
const MAX_PER_PAGE = 10; 

module.exports = {
    name: 'viewservers',
    description: "View all the servers",
    type: ApplicationCommandType.ChatInput,
    staff: true,
    cooldown: 2000,
    run: async (client, interaction) => {
        
        let servers = Array.from(client.guilds.cache.values())
        let total = servers.length
        const maxPerPage = MAX_PER_PAGE
        const totalPages = Math.ceil(total / maxPerPage)

        if(totalPages === 0) {
            return interaction.reply({content: 'There are no servers.'})
        }

        let currentPage = 1

        let components = []
        components.push(
            new ButtonBuilder().setCustomId("prevBtn").setEmoji("⬅️").setStyle(ButtonStyle.Secondary).setDisabled(true),
            new ButtonBuilder()
              .setCustomId("nxtBtn")
              .setEmoji("➡️")
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(totalPages === 1)
          );

          let buttonsRow = new ActionRowBuilder().addComponents(components);
            
          const buildEmbed = () => {
            const start = (currentPage - 1) * maxPerPage;
            const end = start + maxPerPage < total ? start + maxPerPage : total

            const embed = new EmbedBuilder()
            .setTitle('List Of Servers')
            .setFooter({text: `Servers: ${total} • Page ${currentPage} of ${totalPages}`})

            const fields = []
            for(let i = start; i < end; i++) {
                const server = servers[i]
                fields.push({
                    name: server.name,
                    value: server.id,
                    inline: true
                })
          }
          embed.addFields(fields)
          let components = [];
          components.push(
            ButtonBuilder.from(buttonsRow.components[0]).setDisabled(currentPage === 1),
            ButtonBuilder.from(buttonsRow.components[1]).setDisabled(currentPage === totalPages)
          );
          buttonsRow = new ActionRowBuilder().addComponents(components);
          return embed;
          }

          const embed = buildEmbed();
          const sentMsg = await interaction.channel.send({ embeds: [embed], components: [buttonsRow] });
      
          const collector = interaction.channel.createMessageComponentCollector({
            filter: (reaction) => reaction.user.id === interaction.user.id && reaction.message.id === sentMsg.id,
            idle: IDLE_TIMEOUT * 1000,
            dispose: true,
            componentType: ComponentType.Button,
          });
      
          collector.on("collect", async (response) => {
            if (!["prevBtn", "nxtBtn"].includes(response.customId)) return;
            await response.deferUpdate();
      
            switch (response.customId) {
              case "prevBtn":
                if (currentPage > 1) {
                  currentPage--;
                  const embed = buildEmbed();
                  await sentMsg.edit({ embeds: [embed], components: [buttonsRow] });
                }
                break;
      
              case "nxtBtn":
                if (currentPage < totalPages) {
                  currentPage++;
                  const embed = buildEmbed();
                  await sentMsg.edit({ embeds: [embed], components: [buttonsRow] });
                }
                break;
            }
      
            collector.on("end", async () => {
              await sentMsg.edit({ components: [] });
            });
          });

          interaction.reply({content: 'Enjoy :)'})
    }
};