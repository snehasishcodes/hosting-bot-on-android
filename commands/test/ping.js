const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("The PING Command."),
    async execute(interaction) {
        await interaction.reply(`PONG !`);
    },
};