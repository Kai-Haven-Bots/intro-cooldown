import { Client, IntentsBitField, Message } from "discord.js";

import { config } from "dotenv";
config();

const F = IntentsBitField.Flags;

const client = new Client({
    intents: [F.Guilds, F.GuildMessages, F.GuildMembers]
})

client.on("ready", () => {
    console.log("Ready!");
})

client.login(process.env._TOKEN);

let timers = new Map<string, number>();

const INTRO_CHANNEL_ID = process.env._INTRO_CHANNEL_ID || "908893077886861342"; // replace with your channel ID
const PET_CHANNEL_ID = process.env._PET_CHANNEL_ID || "896271426301096008"; // replace with your channel ID
const PET_ROLE_ID = process.env._PET_ROLE_ID || "1179673468556541962"; // replace with your role ID

client.on('messageCreate', async (msg: Message) => {
    try{

        if(!msg.member) return;
        if(msg.member?.permissions.has('ModerateMembers')) return;
        if(msg.author.id === "1187033085808754802") return;

        if (msg.channel.id === INTRO_CHANNEL_ID) {
            if (timers.has(msg.author.id)) {
                // prevent message from being sent
                await msg.delete();
                await msg.author.send('You can only send a message every 12 hours in the introduction channel.');
            } else {
                // update the timer for the user
                timers.set(msg.author.id, Date.now());
                msg.react('<a:kai_hi:993061354367897621>').catch(err => {});
            }
        } else if (msg.channelId === PET_CHANNEL_ID){
            try{
                await msg.member?.roles.add(PET_ROLE_ID);
            }catch(err: any){
                console.log(err);
            }
        }
    }catch(err: any){
        console.log(err);
    }
})

// scan the timers every minute
setInterval(() => {
    const now = Date.now();
    timers.forEach((value, key) => {
        if (now - value > 12 * 60 * 60 * 1000) {
            timers.delete(key);
        }
    });
}, 60 * 1000);