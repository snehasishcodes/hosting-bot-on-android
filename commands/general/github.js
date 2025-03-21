const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("github")
        .setDescription("GitHub Repository Information")
    ,
    async execute(interaction) {
        const res = await fetch("https://api.github.com/repos/snehasishcodes/vscode-status");
        const data = await res.json();
        const string = JSON.stringify(data);

        await interaction.reply(`\`\`\`json\n${string}\n\`\`\``);
    },
};