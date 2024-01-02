const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ApplicationCommandOptionType } = require("discord.js");
const client = require('..');
const {readdirSync} = require('fs')

client.on('interactionCreate', async interaction => {
    if(!interaction.isStringSelectMenu()) return;

    const selected = interaction.values[0]

    const generalCommandsList = [];
    readdirSync(`${process.cwd()}/src/commands/General`).forEach((file) => {
        const filen = require(`${process.cwd()}/src/commands/General/${file}`);
        const name = `\`${filen.name}\` - *${filen.description}*`
        generalCommandsList.push(name);
    });

    const staffCommandsList = [];
    readdirSync(`${process.cwd()}/src/commands/Staff`).forEach((file) => {
        const filen = require(`${process.cwd()}/src/commands/Staff/${file}`);
        const name = `\`${filen.name}\` - *${filen.description}*`
        staffCommandsList.push(name);
    });

    const ownerCommandsList = [];
    readdirSync(`${process.cwd()}/src/commands/Owner`).forEach((file) => {
        const filen = require(`${process.cwd()}/src/commands/Owner/${file}`);
        const name = `\`${filen.name}\` - *${filen.description}*`
        ownerCommandsList.push(name);
    });

    const row = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Nothing selected')
            .addOptions(
                {
                    label: 'General',
                    description: 'View the general Commands',
                    value: 'general',
                    emoji: '🥇'
                },
                {
                    label: 'Staff',
                    description: 'View the staff commands',
                    value: 'staff',
                    emoji: '⤴️'
                },  {
                    label: 'Owner',
                    description: 'View the Owner commands',
                    value: 'owner',
                    emoji: '👑'
                }
            ),
    );

    if(selected == 'general') {
        let embed = new EmbedBuilder()
        .setTitle(`🥇 - General Commands`)
        .setDescription(`> ${generalCommandsList.map((data) => `${data}`).join("\n> ")}`)
        .setColor(client.config.Setup.EmbedColor)
        interaction.update({embeds: [embed], components: [row]})
    }

    if(selected == 'staff') {
        if(interaction.guild.id == client.config.Bot.GuildID) {
        let embed = new EmbedBuilder()
        .setTitle(`⤴️ - Staff Commands`)
        .setDescription(`> ${staffCommandsList.map((data) => `${data}`).join("\n> ")}`)
        .setColor(client.config.Setup.EmbedColor)
        interaction.update({embeds: [embed], components: [row]})
        } else {
        let embed = new EmbedBuilder()
        .setTitle(`⤴️ - Staff Commands`)
        .setDescription(`> \`setpublicbanlogs\` - *Sets the ban logs for the public to see!*`)
        .setColor(client.config.Setup.EmbedColor)
        interaction.update({embeds: [embed], components: [row]})
        }
    }

    if(selected == 'owner') {
        let embed = new EmbedBuilder()
        .setTitle(`👑 - Owner Commands`)
        .setDescription(`> ${ownerCommandsList.map((data) => `${data}`).join("\n> ")}`)
        .setColor(client.config.Setup.EmbedColor)
        interaction.update({embeds: [embed], components: [row]})
    }

});