const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const generateResponse = require("./lib/generate");
require("dotenv").config();

const CLIENT_ID = "1349807784450986075";
const TOKEN = process.env.BOT_TOKEN;
const GUILD_ID = "1207976390377603102"

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

// command handling
const commands = [];
client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON())
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// registering slash commands
const rest = new REST().setToken(TOKEN);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();

// events
// event: slash command sent
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        }
    }
});

// event: message create for AI response
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot === true) return;

    const content = message.content;

    if (content.toLowerCase().startsWith("ai:")) {
        const prompt = content.substring(3, content.length).trim();
        message.channel.sendTyping();
        const response = await generateResponse(prompt);

        if (response.length > 1800) {
            const totalChunks = Math.ceil(response.length / 1800);
            for (let i = 0; i < totalChunks; i++) {
                const chunk = response.substring(i * 1800, Math.min((i + 1) * 1800, response.length));

                message.channel.send({
                    content: chunk
                })
            }
        } else {
            message.reply({
                content: response
            });
        }
    }
    else {
        const isSpecialChannel = ["1352236809559605261"].includes(message.channel.id);
        const probabilities = isSpecialChannel ? [1] : [0, 0, 0, 0, 1, 0, 0];
        const chosenEvent = probabilities[Math.floor(Math.random() * probabilities.length)];
        if (chosenEvent === 1) {
            const prompt = content;
            message.channel.sendTyping();
            const response = await generateResponse(prompt);

            if (response.length > 1800) {
                const totalChunks = Math.ceil(response.length / 1800);
                for (let i = 0; i < totalChunks; i++) {
                    const chunk = response.substring(i * 1800, Math.min((i + 1) * 1800, response.length));

                    message.channel.send({
                        content: chunk
                    })
                }
            } else {
                message.reply({
                    content: response
                });
            }
        }
    }
});

client.on(Events.ClientReady, readyClient => {
    console.log(`${readyClient.user.tag} is Online.`);
});

client.login(TOKEN).then(() => {
    console.log("Login successful.");
})