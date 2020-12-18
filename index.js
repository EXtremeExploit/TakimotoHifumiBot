require('dotenv').config();
console.log('Starting...');
// Discord
var discord = require('discord.js');
var client = new discord.Client();

// Reddit
var _reddit = require('snoowrap');
var snoostorm = require('snoostorm');
var r = new _reddit({
    username: process.env.reddit_username,
    password: process.env.reddit_password,
    clientSecret: process.env.reddit_clientSecret,
    clientId: process.env.reddit_clientID,
    userAgent: 'r/TakimotoHifumi Discord Bot',
});
const reddit = new snoostorm(r);

var prefix = process.env.prefix;
var channels = {
    logs: {
        id: process.env.ch_logs_id
    },
    arrivals: {
        id: process.env.ch_arrivals_id
    },
    access: {
        name: {
            id: process.env.ch_name_id
        },
        id: process.env.ch_access
    }

}
var guild_id = process.env.guild_id;
var webhook = {
    id: process.env.webhook_ID,
    token: process.env.webhook_Token
}
var owner_id = process.env.owner_id;

var fs = require('fs');

var testers = [
    483675893458403331
];
var cooldown = new Set();
var cds = 5;

/**
 * 
 * @param {discord.Message} msg 
 * @param {discord.Role} role 
 * @param {Object} roles
 */
async function toggleColorToMember(msg, role, roles) {
    if (!msg.member.roles.find((r) => r.name == role.name)) {
        /**
         * 
         * @param {discord.Message} msg 
         * @param {discord.Role} role 
         */

        await msg.member.removeRoles([
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
        await setTimeout(async function () {
            await msg.member.addRole(role);
            await msg.delete(1000);
        }, 1000);
    } else {
        await msg.member.removeRole(role);
        msg.delete(1000);
    }
}

async function sendToLogs(guild, msg) {
    guild.channels.find((ch) => ch.id == channels.logs.id).send(msg);
}

reddit.SubmissionStream({
    subreddit: 'TakimotoHifumi',
    pollTime: 5000,
    results: 25
}).on('submission', async (s) => {
    var embed = new discord.RichEmbed();
    if (s.preview) {
        embed.setColor([155, 89, 182])
            .setURL('https://www.reddit.com' + s.permalink)
            .setTitle(s.title)
            .setImage(s.preview.images[0].source.url)
            .addField('Author', '[' + s.author.name + '](https://www.reddit.com/u/' + s.author.name + ')', true);
    } else {
        if (s.selftext !== '') {
            if (s.selftext.length > 2048) s.selftext = s.selftext.substring(0, 2048 - 3) + '...';
            embed.setColor([155, 89, 182])
                .setURL('https://www.reddit.com' + s.permalink)
                .setTitle(s.title)
                .setDescription(s.selftext)
                .addField('Author', '[' + s.author.name + '](https://www.reddit.com/u/' + s.author.name + ')', true);
        } else {
            embed.setColor([155, 89, 182])
                .setURL('https://www.reddit.com' + s.permalink)
                .setTitle(s.title)
                .addField('Author', '[' + s.author.name + '](https://www.reddit.com/u/' + s.author.name + ')', true);
        }
    }

    client.fetchWebhook(webhook.id, webhook.token).then((w) => {
        w.send(embed);
    });
});

client.on('guildMemberAdd', (member) => {
    var channel = member.guild.channels.find((ch) => ch.id == channels.arrivals.id);
    var roles = {
        tester: member.guild.roles.find((r) => r.name == 'Tester ⚙️'),
        bot: member.guild.roles.find((r) => r.name == 'Robot 🤖')
    }
    channel.send('W-Welcome to the server ' + member + ' p-please enjoy your time here <a:HifumiSurprise:486547902660083723>', {
        file: './welcome.gif'
    });

    sendToLogs(member.guild, new discord.RichEmbed()
        .setTitle('User Joined')
        .setColor(0x00FF00)
        .addField('User', member.user.tag + '/' + member.id + '\n' +
            '**Joined Discord:** ' + member.user.createdAt.toUTCString())
        .setTimestamp(new Date().toUTCString));

    if (member.user.bot) {
        member.addRole(roles.bot);
    } else {
        if (testers.includes(member.id)) {
            member.addRole(roles.tester)
        }
    }
});

client.on('guildMemberRemove', (member) => {
    sendToLogs(member.guild, new discord.RichEmbed()
        .setTitle('User Removed')
        .setColor(0xFF0000)
        .addField('User', member.user.tag + '/' + member.id + '\n' +
            '**Joined Discord:** ' + member.user.createdAt.toUTCString())
        .setTimestamp(new Date().toUTCString));
});

client.on('messageDelete', async (msg) => {
    if (!msg.guild.id == guild_id) return;
    switch (msg.channel.id) {
        case channels.logs:
        case channels.access.id:
        case channels.access.name.id: return;
    }

    sendToLogs(msg.guild, new discord.RichEmbed()
        .setColor([255, 255, 0])
        .setTitle('Message Deleted from:')
        .setDescription('<#' + msg.channel.id + '>')
        .addField('Content', msg.content)
        .setTimestamp(msg.createdTimestamp)
        .setFooter(msg.author.tag, msg.author.displayAvatarURL))
});

client.on('message', async (msg) => {
    if (!msg.guild) return;
    if (!msg.content.startsWith(prefix)) return;

    var messageArray = msg.content.split(' ');
    var prefix_command = messageArray[0];
    var command = messageArray[0].replace(prefix, '');
    var args = messageArray.slice(1).join(' ');

    switch (command) {
        case 'sendNAMECOLOR':
            if (msg.author.id == owner_id) {
                client.guilds.find((g) => g.id == guild_id).channels.find((ch) => ch.id == channels.access.name.id).send({
                    file: './name-color.png'
                });
            }
            break;
        case 'sendAccess':
            if (msg.author.id == owner_id) {
                client.guilds.find((g) => g.id == guild_id).channels.find((ch) => ch.id == channels.access.id).send(new discord.RichEmbed()
                    .setColor(0x0000FF)
                    .setTitle('Roles')
                    .addField('NSFW', 'Send `.NSFW` to get NSFW permissions, send again if you don\'t want them anymore')
                    .addField('Vent', 'Send `.vent` to get permissions for vent, send again if you don\'t want them anymore'));
            }
            break;
        case 'eval':
            if (msg.author.id == owner_id) {
                try {
                    const code = args;
                    var evaled = eval(code);
                    if (typeof evaled !== 'string')
                        evaled = require('util').inspect(evaled);
                    msg.channel.send(new discord.RichEmbed()
                        .setColor([255, 0, 0])
                        .setTitle('Eval Command')
                        .addField('Input', `\`\`\`\n${code}\n\`\`\``)
                        .addField('Output:', `\`\`\`xl\n${evaled}\`\`\``));
                } catch (err) {
                    msg.channel.send(new discord.RichEmbed()
                        .setTitle('ERROR')
                        .setColor([255, 0, 0])
                        .setDescription('```xl\n' + err + '```'));
                }
            }
            break;
        case 'kick':
            if (msg.member.hasPermission(['KICK_MEMBERS']) || msg.member.hasPermission(['ADMINISTRATOR'])) {
                if (msg.mentions.members.first()) {
                    if (msg.member.user.id == msg.mentions.members.first().id) {
                        msg.channel.send(new discord.RichEmbed()
                            .setColor([255, 0, 0])
                            .setDescription('Why do you want to kick yourself...?')
                            .setTitle('Are you serious?'));
                    } else {
                        if (msg.mentions.members.first().id == client.user.id) {
                            msg.channel.send(new discord.RichEmbed()
                                .setColor([255, 0, 0])
                                .setDescription('WHY ME!!!???')
                                .setTitle(';-;'));
                        } else {
                            if (msg.mentions.members.first().kickable) {
                                msg.mentions.members.first().kick(".kick command by: " + msg.author.tag).then((member) => {
                                    msg.channel.send(new discord.RichEmbed()
                                        .setColor([255, 0, 0])
                                        .setTitle('Kicked')
                                        .setDescription('Succesfully kicked: ' + member.user.tag + ' by ' + msg.author.tag));
                                });
                            } else {
                                msg.channel.send(new discord.RichEmbed()
                                    .setColor([255, 0, 0])
                                    .setTitle('Kick Error')
                                    .setDescription('I don\'t have permissions to do that'));
                            }
                        }
                    }
                } else {
                    msg.channel.send(new discord.RichEmbed()
                        .setColor([255, 0, 0])
                        .setDescription('Please specify an user!'));

                }
            } else {
                msg.channel.send(new discord.RichEmbed()
                    .setAuthor(msg.member.user.username, msg.member.user.displayAvatarURL)
                    .setTitle('ERROR')
                    .setDescription('You dont have permissions to run that command.')
                    .setColor([255, 0, 0]));
            }
            break;
        case 'ban':
            if (msg.member.hasPermission(['BAN_MEMBERS']) || msg.member.hasPermission(['ADMINISTRATOR'])) {
                if (msg.mentions.members.first()) {
                    if (msg.member.user.id == msg.mentions.members.first().id) {
                        msg.channel.send(new discord.RichEmbed()
                            .setColor([255, 0, 0])
                            .setDescription('Why do you want to ban yourself...?')
                            .setTitle('Are you serious?'));
                    } else {
                        if (msg.mentions.members.first().id == client.user.id) {
                            msg.channel.send(new discord.RichEmbed()
                                .setColor([255, 0, 0])
                                .setDescription('WHY ME!!!???')
                                .setTitle(';-;'));
                        } else {
                            if (msg.mentions.members.first().bannable) {
                                msg.mentions.members.first().ban({ reason: ".ban command by: " + msg.author.tag }).then((member) => {
                                    msg.channel.send(new discord.RichEmbed()
                                        .setColor([255, 0, 0])
                                        .setTitle('Banned')
                                        .setDescription('Succesfully banned: ' + member.user.tag + ' by ' + msg.author.tag));
                                    sendToLogs(msg.guild, new discord.RichEmbed()
                                        .setTitle('User Banned')
                                        .setColor([255, 0, 0])
                                        .addField('By', msg.author.tag))
                                });
                            } else {
                                msg.channel.send(new discord.RichEmbed()
                                    .setColor([255, 0, 0])
                                    .setTitle('Ban Error')
                                    .setDescription('I don\'t have permissions to do that'));
                            }
                        }
                    }
                } else {
                    msg.channel.send(new discord.RichEmbed()
                        .setColor([255, 0, 0])
                        .setDescription('Please specify an user!'));

                }
            } else {
                msg.channel.send(new discord.RichEmbed()
                    .setAuthor(msg.member.user.username, msg.member.user.displayAvatarURL)
                    .setTitle('ERROR')
                    .setDescription('You dont have permissions to run that command.')
                    .setColor([255, 0, 0]));
            }
            break;
        case 'toggleMute':
            if (msg.member.hasPermission(['ADMINISTRATOR'])) {
                var config = require('./config.json');
                if (config.mute == true) {
                    config.mute = false;
                    fs.writeFile('config.json', '{\n    "mute": false\n}', (e) => {
                        msg.channel.send('Toggled Mute to false');
                    });
                } else {
                    if (config.mute == false) {
                        config.mute = true;
                        fs.writeFile('config.json', '{\n    "mute": true\n}', (e) => {
                            msg.channel.send('Toggled Mute to true');
                        });
                    }
                }
            }
            break;
    }
});

client.on('message', async (msg) => {
    if (!msg.guild) return;

    var messageArray = msg.content.split(' ');
    var prefix_command = messageArray[0];
    var command = messageArray[0].replace(prefix, '');
    var args = messageArray.slice(1).join(' ');

    var roles = {
        vent: msg.guild.roles.find((r) => r.name == 'Venters'),
        muted: msg.guild.roles.find((r) => r.name == 'Muted'),
        nsfw: msg.guild.roles.find((r) => r.name == 'NSFW 🔞'),
        colors: {
            purple: msg.guild.roles.find((r) => r.name == 'Purple'),
            magenta: msg.guild.roles.find((r) => r.name == 'Magenta'),
            pink: msg.guild.roles.find((r) => r.name == 'Pink'),
            cyan: msg.guild.roles.find((r) => r.name == 'Cyan'),
            blue: msg.guild.roles.find((r) => r.name == 'Blue'),
            dark_blue: msg.guild.roles.find((r) => r.name == 'Dark Blue'),
            green: msg.guild.roles.find((r) => r.name == 'Green'),
            navy: msg.guild.roles.find((r) => r.name == 'Navy'),
            yellow: msg.guild.roles.find((r) => r.name == 'Yellow'),
            gold: msg.guild.roles.find((r) => r.name == 'Gold'),
            brown: msg.guild.roles.find((r) => r.name == 'Brown'),
            orange: msg.guild.roles.find((r) => r.name == 'Orange'),
            red: msg.guild.roles.find((r) => r.name == 'Red'),
            dark_red: msg.guild.roles.find((r) => r.name == 'Dark Red'),
        }
    }

    if (require('./config.json').mute == true) {
        if (cooldown.has(msg.author.id)) {
            msg.delete(100);
            msg.reply('Don\'t spam, wait atleast 5 secs').then((message) => {
                message.delete(cds * 1000);
            });
        }
        if (msg.author.id == client.user.id) {
        } else {
            cooldown.add(msg.author.id);
        }
        setTimeout(() => {
            cooldown.delete(msg.author.id)
        }, cds * 1000)
    }

    if (msg.channel.id == channels.access.name.id) {
        if ((msg.author.id == client.user.id) == false) {
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
                    msg.delete(1000);
            }
        }
    }

    if (msg.channel.id == channels.access.id) {
        if (msg.author.id == client.user.id) {
            return;
        } else {
            if (msg.content.toLowerCase() == prefix + 'vent') {
                if (!msg.member.roles.find((r) => r.name == roles.vent.name)) {
                    msg.member.addRole(roles.vent);
                    msg.delete(1000);
                } else {
                    msg.member.removeRole(roles.vent);
                    msg.delete(1000);
                }
            } else {
                if (msg.content.toLowerCase() == prefix + 'nsfw') {
                    if (!msg.member.roles.find((r) => r.name == roles.nsfw.name)) {
                        msg.member.addRole(roles.nsfw);
                        msg.delete(1000);
                    } else {
                        msg.member.removeRole(roles.nsfw);
                        msg.delete(1000);
                    }
                } else {
                    msg.delete(1000);
                }
            }
        }
    }
});

client.on('ready', () => {
    console.log('Ready!')
    client.user.setPresence({
        afk: false,
        status: 'online',
        game: {
            type: 'PLAYING',
            name: 'mods: prefix .'
        }
    })
})

client.on('error', (err) => {
    console.error(err);
})

client.login(process.env.TOKEN);
