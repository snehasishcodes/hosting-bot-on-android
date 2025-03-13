const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("The HELP Command.")
        
    ,
    async execute(interaction) {
        await interaction.reply(`HELP !`);
    },
};