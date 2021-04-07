require('dotenv').config();
console.log('Starting...');
const discord = require('discord.js');
let client = new discord.Client({
    http: {
        api: 'https://discord.com/api',
        cdn: 'https://cdn.discordapp.com'
    }
});

//#region Global variables
let prefix = process.env.prefix;
var channels = {
    logs: {
        id: process.env.ch_logs_id
    },
    arrivals: {
        id: process.env.ch_arrivals_id
    },
    channels: {
        id: process.env.ch_access
    },
    colors: {
        id: process.env.ch_name_id
    }
}
var guild_id = process.env.guild_id;
var owner_id = process.env.owner_id;

var roles;

let guild;
//#endregion

/**
 * 
 * @param {discord.Message} msg 
 * @param {discord.Role} role 
 * @param {Object} roles
 */
async function toggleColorToMember(msg, role, roles) {
    if (!msg.member.roles.cache.find((r) => r.name == role.name)) {// If user doesn't have the role
        await msg.member.roles.removes([
            roles.colors.purple,
            roles.colors.magenta,
            roles.colors.pink,
            roles.colors.cyan,
            roles.colors.blue,
            roles.colors.dark_blue,
            roles.colors.green,
            roles.colors.navy,
            roles.colors.yellow,
            roles.colors.gold,
            roles.colors.brown,
            roles.colors.orange,
            roles.colors.red,
            roles.colors.dark_red,
        ]);
        //Remove any color roles
        //Then add the color the user wants one second later to avoid rate limiting
        //And weird visual bug
        await setTimeout(async function () {
            await msg.member.roles.add(role);
            await msg.delete({ timeout: 1000 });
        }, 1000);
    } else {//If user has specified color then remove it
        await msg.member.roles.remove(role);
        msg.delete({ timeout: 1000 });
    }
}

//#region Log stuff
async function sendToLogs(guild, msg) {
    guild.channels.cache.find((ch) => ch.id == channels.logs.id).send(msg);
}


client.on('guildMemberAdd', (member) => {
    var channel = member.guild.channels.cache.find((ch) => ch.id == channels.arrivals.id);
    var roles = {
        tester: member.guild.roles.cache.find((r) => r.name == 'Tester ⚙️'),
        bot: member.guild.roles.cache.find((r) => r.name == 'Robot 🤖')
    }
    channel.send('W-Welcome to the server ' + member + ' p-please enjoy your time here <a:HifumiSurprise:486547902660083723>', {
        file: './welcome.gif'
    });

    sendToLogs(member.guild, new discord.MessageEmbed()
        .setTitle('User Joined')
        .setColor(0x00FF00)
        .addField('User', member.user.tag + '/' + member.id + '\n' +
            '**Joined Discord:** ' + member.user.createdAt.toUTCString())
        .setTimestamp(new Date().toUTCString));

    if (member.user.bot)
        member.roles.add(roles.bot);
});


client.on('guildMemberRemove', (member) => {
    sendToLogs(member.guild, new discord.MessageEmbed()
        .setTitle('User Removed')
        .setColor(0xFF0000)
        .addField('User', member.user.tag + '/' + member.id + '\n' +
            '**Joined Discord:** ' + member.user.createdAt.toUTCString())
        .setTimestamp(new Date().toUTCString));
});

client.on('messageDelete', async (msg) => {
    if (msg.guild.id !== guild_id) return;
    switch (msg.channel.id) {
        case channels.logs.id:
        case channels.channels.id:
        case channels.colors.id: return;
    }

    let embed = new discord.MessageEmbed()
        .setColor([255, 255, 0])
        .setTitle('Message Deleted from:')
        .setDescription('<#' + msg.channel.id + '>')
    if (msg.content)
        embed.addField('Content', msg.content);
    embed.setTimestamp(msg.createdTimestamp);
    embed.setFooter(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true, size: 1024, format: `png` }));


    guild.channels.cache.find((ch) => ch.id == channels.logs.id).send(embed);
});

//#endregion


//Commands
client.on('message', async (msg) => {
    if (!msg.guild) return;
    if (!msg.content.startsWith(prefix)) return;

    var messageArray = msg.content.split(' ');
    var command = messageArray[0].replace(prefix, '');
    var args = messageArray.slice(1).join(' ');

    switch (command) {
        case 'sendNAMECOLOR':
            if (msg.author.id == owner_id) {
                client.guilds.find((g) => g.id == guild_id).channels.cache.find((ch) => ch.id == channels.colors.id).send({
                    file: './name-color.png'
                });
            }
            break;
        case 'sendAccess':
            if (msg.author.id == owner_id) {
                client.guilds.find((g) => g.id == guild_id).channels.cache.find((ch) => ch.id == channels.channels.id).send(new discord.MessageEmbed()
                    .setColor(0x0000FF)
                    .setTitle('Roles')
                    .addField('NSFW', 'Send `.NSFW` to get NSFW permissions, send again if you don\'t want them anymore')
                    .addField('Vent', 'Send `.vent` to get permissions for vent, send again if you don\'t want them anymore'));
            }
            break;
        case 'kick':
            if (msg.member.hasPermission(['KICK_MEMBERS']) || msg.member.hasPermission(['ADMINISTRATOR'])) {
                if (msg.mentions.members.first()) {
                    if (msg.member.user.id == msg.mentions.members.first().id) {
                        msg.channel.send(new discord.MessageEmbed()
                            .setColor([255, 0, 0])
                            .setDescription('Why do you want to kick yourself...?')
                            .setTitle('Are you serious?'));
                    } else {
                        if (msg.mentions.members.first().id == client.user.id) {
                            msg.channel.send(new discord.MessageEmbed()
                                .setColor([255, 0, 0])
                                .setDescription('WHY ME!!!???')
                                .setTitle(';-;'));
                        } else {
                            if (msg.mentions.members.first().kickable) {
                                msg.mentions.members.first().kick(".kick command by: " + msg.author.tag).then((member) => {
                                    msg.channel.send(new discord.MessageEmbed()
                                        .setColor([255, 0, 0])
                                        .setTitle('Kicked')
                                        .setDescription('Succesfully kicked: ' + member.user.tag + ' by ' + msg.author.tag));
                                });
                            } else {
                                msg.channel.send(new discord.MessageEmbed()
                                    .setColor([255, 0, 0])
                                    .setTitle('Kick Error')
                                    .setDescription('I don\'t have permissions to do that'));
                            }
                        }
                    }
                } else {
                    msg.channel.send(new discord.MessageEmbed()
                        .setColor([255, 0, 0])
                        .setDescription('Please specify an user!'));
                }
            } else {
                msg.channel.send(new discord.MessageEmbed()
                    .setAuthor(msg.member.user.username, msg.member.user.displayAvatarURL({ dynamic: true, size: 1024, format: `png` }))
                    .setTitle('ERROR')
                    .setDescription('You dont have permissions to run that command.')
                    .setColor([255, 0, 0]));
            }
            break;
        case 'ban':
            if (msg.member.hasPermission(['BAN_MEMBERS']) || msg.member.hasPermission(['ADMINISTRATOR'])) {
                if (msg.mentions.members.first()) {
                    if (msg.member.user.id == msg.mentions.members.first().id) {
                        msg.channel.send(new discord.MessageEmbed()
                            .setColor([255, 0, 0])
                            .setDescription('Why do you want to ban yourself...?')
                            .setTitle('Are you serious?'));
                    } else {
                        if (msg.mentions.members.first().id == client.user.id) {
                            msg.channel.send(new discord.MessageEmbed()
                                .setColor([255, 0, 0])
                                .setDescription('WHY ME!!!???')
                                .setTitle(';-;'));
                        } else {
                            if (msg.mentions.members.first().bannable) {
                                msg.mentions.members.first().ban({ reason: ".ban command by: " + msg.author.tag }).then((member) => {
                                    msg.channel.send(new discord.MessageEmbed()
                                        .setColor([255, 0, 0])
                                        .setTitle('Banned')
                                        .setDescription('Succesfully banned: ' + member.user.tag + ' by ' + msg.author.tag));
                                    sendToLogs(msg.guild, new discord.MessageEmbed()
                                        .setTitle('User Banned')
                                        .setColor([255, 0, 0])
                                        .addField('By', msg.author.tag))
                                });
                            } else {
                                msg.channel.send(new discord.MessageEmbed()
                                    .setColor([255, 0, 0])
                                    .setTitle('Ban Error')
                                    .setDescription('I don\'t have permissions to do that'));
                            }
                        }
                    }
                } else {
                    msg.channel.send(new discord.MessageEmbed()
                        .setColor([255, 0, 0])
                        .setDescription('Please specify an user!'));
                }
            } else {
                msg.channel.send(new discord.MessageEmbed()
                    .setAuthor(msg.member.user.username, msg.member.user.displayAvatarURL({ dynamic: true, size: 1024, format: `png` }))
                    .setTitle('ERROR')
                    .setDescription('You dont have permissions to run that command.')
                    .setColor([255, 0, 0]));
            }
            break;
        case 'ping':
            msg.channel.send(new discord.MessageEmbed()
                .setTitle(`Pinging...`)
                .setColor([0, 0, 255])).then((pingMsg) => {
                    pingMsg.edit(new discord.MessageEmbed()
                        .setColor([255, 0, 0])
                        .setTitle(`Pong!`)
                        .setTimestamp(new Date())
                        .addField(`Bot`, `**${pingMsg.createdTimestamp - msg.createdTimestamp}ms.**`, true)
                        .addField(`WebSocket`, `**${client.ws.ping}ms.**`, true));
                });
            break;
    }
});


// Colors and Channel Access
client.on('message', async (msg) => {
    if (!msg.guild) return;

    if(msg.author.id == client.user.id) return;

    //#region Colors
    if (msg.channel.id == channels.colors.id) {
        switch (msg.content.toLowerCase()) {
            case '.purple':
                toggleColorToMember(msg, roles.colors.purple, roles);
                break;
            case '.magenta':
                toggleColorToMember(msg, roles.colors.magenta, roles);
                break;
            case '.pink':
                toggleColorToMember(msg, roles.colors.pink, roles);
                break;
            case '.cyan':
                toggleColorToMember(msg, roles.colors.cyan, roles);
                break;
            case '.blue':
                toggleColorToMember(msg, roles.colors.blue, roles);
                break;
            case '.darkblue':
                toggleColorToMember(msg, roles.colors.dark_blue, roles);
                break;
            case '.green':
                toggleColorToMember(msg, roles.colors.green, roles);
                break;
            case '.navy':
                toggleColorToMember(msg, roles.colors.navy, roles);
                break;
            case '.yellow':
                toggleColorToMember(msg, roles.colors.yellow, roles);
                break;
            case '.gold':
                toggleColorToMember(msg, roles.colors.gold, roles);
                break;
            case '.brown':
                toggleColorToMember(msg, roles.colors.brown, roles);
                break;
            case '.orange':
                toggleColorToMember(msg, roles.colors.orange, roles);
                break;
            case '.red':
                toggleColorToMember(msg, roles.colors.red, roles);
                break;
            case '.darkred':
                toggleColorToMember(msg, roles.colors.dark_red, roles);
                break;
            default:
                msg.delete({ timeout: 1000 });
        }
    }
    //#endregion


    //#region Channels
    if (msg.channel.id == channels.channels.id) {
        if (msg.content.toLowerCase() == prefix + 'vent') {
            if (!msg.member.roles.cache.find((r) => r.name == roles.vent.name)) {
                msg.member.roles.add(roles.vent);
            } else {
                msg.member.roles.remove(roles.vent);
            }
        } else if (msg.content.toLowerCase() == prefix + 'nsfw') {
            if (!msg.member.roles.cache.find((r) => r.name == roles.nsfw.name)) {
                msg.member.roles.add(roles.nsfw);
            } else {
                msg.member.roles.remove(roles.nsfw);
            }
        }
        msg.delete({ timeout: 1000 });
    }
    //#endregion
});

//General events
client.on('ready', () => {
    console.log('Ready!')
    client.user.setPresence({
        afk: false,
        status: 'online',
        game: {
            type: 'PLAYING',
            name: 'mods: prefix .'
        }
    });

    guild = client.guilds.cache.find((g) => g.id == guild_id);

    roles = {
        vent: guild.roles.cache.find((r) => r.name == 'Venters'),
        nsfw: guild.roles.cache.find((r) => r.name == 'NSFW 🔞'),
        colors: {
            purple: guild.roles.cache.find((r) => r.name == 'Purple'),
            magenta: guild.roles.cache.find((r) => r.name == 'Magenta'),
            pink: guild.roles.cache.find((r) => r.name == 'Pink'),
            cyan: guild.roles.cache.find((r) => r.name == 'Cyan'),
            blue: guild.roles.cache.find((r) => r.name == 'Blue'),
            dark_blue: guild.roles.cache.find((r) => r.name == 'Dark Blue'),
            green: guild.roles.cache.find((r) => r.name == 'Green'),
            navy: guild.roles.cache.find((r) => r.name == 'Navy'),
            yellow: guild.roles.cache.find((r) => r.name == 'Yellow'),
            gold: guild.roles.cache.find((r) => r.name == 'Gold'),
            brown: guild.roles.cache.find((r) => r.name == 'Brown'),
            orange: guild.roles.cache.find((r) => r.name == 'Orange'),
            red: guild.roles.cache.find((r) => r.name == 'Red'),
            dark_red: guild.roles.cache.find((r) => r.name == 'Dark Red'),
        }
    }
})

client.on('error', (err) => {
    console.error(err);
})

client.login(process.env.TOKEN);
