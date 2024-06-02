import { cooldowns } from './cooldowns-cache'
import type { ValidationProps } from 'commandkit';

export default ({ interaction, commandObj, handler }: ValidationProps) => {
    if (cooldowns.has(`${interaction.user.id}-${commandObj.data.name}`)) {
        interaction.reply({
            content: "You're on cooldown, please wait some time before running this command again.",
            ephemeral: true,
        });
 
        return true; // This is important
    }
}