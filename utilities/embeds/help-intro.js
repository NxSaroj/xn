const { EmbedBuilder, Client } = require('discord.js');

const helpIntro = new EmbedBuilder()
.setTitle('Xantrack help menu')
.setColor('White')
.setDescription(`**Need Xantrack Know-How? We've Got You Covered! \n- This option emphasizes that the guide has all the information the user needs.**`)
.addFields(
    { name: 'OWNER', value: (await Client) }
)
