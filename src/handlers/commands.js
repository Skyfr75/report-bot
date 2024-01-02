const fs = require('fs');
const { PermissionsBitField } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const client = require('../index')
const colors = require('colors');

const rest = new REST({ version: '9' }).setToken(client.config.Bot.BotToken);

module.exports = (client) => {
    const commands = [];
    fs.readdirSync('./src/commands').forEach(async dir => {
        const cmdFiles = fs.readdirSync(`./src/commands/${dir}`).filter(file => file.endsWith('.js'));

        for (const file of cmdFiles) {
            const cmd = require(`../commands/${dir}/${file}`);
            commands.push({
                name: cmd.name,
                description: cmd.description,
                type: cmd.type,
                options: cmd.options ? cmd.options : null,
                default_permission: cmd.default_permission ? cmd.default_permission : null,
                default_member_permissions: cmd.default_member_permissions ? PermissionsBitField.resolve(cmd.default_member_permissions).toString() : null
            });

            if (cmd.name) {
                client.commands.set(cmd.name, cmd);
            } else {
                console.log(`[Error]`.red + ` Failed to load ${file.split('.js')[0]}`);
            }

        }
    });

    (async () => {
        try {
            await rest.put(
                Routes.applicationCommands(client.config.Bot.ClientID),
                { body: commands }
            );
            console.log(`[Success]`.green + ` Slash commands registered`);
        } catch (e) {
            console.log(`[Error]`.red + ` Failed to register Slash commands`, e);
        }
    })();
};