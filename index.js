require('dotenv').config();
var discord = require('discord.js');
var client = new discord.Client();

client.on('ready',() => {
    console.log('Ready!');
    console.log('aaoao')
});

client.on('guildMemberAdd', (member) => {
    var channel = member.guild.channels.find((ch) => ch.id == '485083554351546381');
    channel.send('W-Welcome to the server '+member+' p-please enjoy your time here <a:HifumiSurprise:486547902660083723>', {
        file: './welcome.gif'
    });
});

client.login(process.env.TOKEN);
