const { create } = require("sourcebin");
module.exports = {
  data: {
    name: "guilds-cache",
    description: "Get the name of cached guilds",
    dm_permission: false,
  },
  /**
   *
   * @param {import('commandkit').SlashCommandProps} param0
   */
  run: async ({ interaction, client }) => {
    await interaction.deferReply({ ephemeral: true });
    const cachedBin = await create({
      files: [
        {
          content: client.guilds.cache.map((guild) => guild?.name),
          language: "javascript",
        },
      ],
    });
 

    await interaction.editReply(`${cachedBin?.url}`);
  },

  options: {
    devOnly: true,
  },
};
