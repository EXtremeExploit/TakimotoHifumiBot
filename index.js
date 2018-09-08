require('dotenv').config();
var discord = require('discord.js');
var client = new discord.Client();

var prefix = process.env.prefix;
var ch_arrivals_id = process.env.ch_arrivals_id;
var ch_nsfw_access_id = process.env.ch_nsfw_access_id;
var guild_id = process.env.guild_id;

client.on('ready', () => {
    console.log('Ready!');
});

client.on('guildMemberAdd', (member) => {
    var channel = member.guild.channels.find((ch) => ch.id == ch_arrivals_id);
    channel.send('W-Welcome to the server ' + member + ' p-please enjoy your time here <a:HifumiSurprise:486547902660083723>', {
        file: './welcome.gif'
    });
});

client.on('message', async (msg) => {
    if (!msg.guild) return;
    if (!msg.content.startsWith(prefix)) return;

    var messageArray = msg.content.split(' ');
    var prefix_command = messageArray[0];
    var command = messageArray[0].replace(prefix, '');
    var args = messageArray.slice(1).join(' ');

    switch (command) {
        case 'sendNSFWaccess':
            client.guilds.find('id', guild_id).channels.find('id', ch_nsfw_access_id).send('Send `.NSFW` to get NSFW permissions, send again if you don\'t want them anymore');
    }
})

client.on('message', async (msg) => {
    if (!msg.guild) return;
    if (!msg.content.startsWith(prefix)) return;

    var nsfw_role = msg.guild.roles.find('name', 'NSFW 🔞');

    if (msg.channel.id == ch_nsfw_access_id) {
        if (msg.content == '.NSFW') {
            if (!msg.member.roles.find('name', 'NSFW 🔞')) {
                msg.member.addRole(nsfw_role);
                msg.delete();
            } else {
                msg.member.removeRole(nsfw_role);
                msg.delete();
            }
        }
    }
})


client.login(process.env.TOKEN);
