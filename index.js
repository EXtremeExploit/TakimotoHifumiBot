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
var ch_arrivals_id = process.env.ch_arrivals_id;
var ch_nsfw_access_id = process.env.ch_nsfw_access_id;
var ch_name_color_id = process.env.ch_name_color_id;
var guild_id = process.env.guild_id;
var webhook = {
    id: process.env.webhook_ID,
    token: process.env.webhook_Token
}
var owner_id = process.env.owner_id;

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

client.on('ready', () => {
    console.log('Ready!');
});

reddit.SubmissionStream({
    subreddit: 'TakimotoHifumi'
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
    var channel = member.guild.channels.find((ch) => ch.id == ch_arrivals_id);
    var roles = {
        bot: member.guild.roles.find((r) => r.name == 'Robot 🤖'),
        member: member.guild.roles.find((r) => r.name == 'Members 👤')
    }
    channel.send('W-Welcome to the server ' + member + ' p-please enjoy your time here <a:HifumiSurprise:486547902660083723>', {
        file: './welcome.gif'
    });

    if (member.user.bot) {
        member.addRole(roles.bot);
    } else {
        member.addRole(roles.member);
    }
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
            if (msg.author.id == owner_id) {
                client.guilds.find((g) => g.id == guild_id).channels.find((ch) => ch.id == ch_nsfw_access_id).send('Send `.NSFW` to get NSFW permissions, send again if you don\'t want them anymore');
            }
            break;
        case 'sendNAMECOLOR':
            if (msg.author.id == owner_id) {
                client.guilds.find((g) => g.id == guild_id).channels.find((ch) => ch.id == ch_name_color_id).send('<:dark_red:485125836849283103> : Dark Red\n' +
                    '.`darkred`\n' +
                    '\n' +
                    '<:red:485125793270464552> : Red\n' +
                    '.`red`\n' +
                    '\n' +
                    '<:orange:485125758465867796> : Orange\n' +
                    '.`orange`\n' +
                    '\n' +
                    '<:brown:485125717282127872> : Brown\n' +
                    '.`brown`\n' +
                    '\n' +
                    '<:gold:485125481805512714> : Gold\n' +
                    '.`gold`\n' +
                    '\n' +
                    '<:yellow:485125443717038087> : Yellow\n' +
                    '.`yellow`\n' +
                    '\n' +
                    '<:navy:485125406605836290> : Navy\n' +
                    '.`navy`\n' +
                    '\n' +
                    '<:green:485125361017946113> : Green\n' +
                    '.`green`\n' +
                    '\n' +
                    '<:dark_blue:485125157518704652> : Dark Blue\n' +
                    '.`darkblue`\n' +
                    '\n' +
                    '<:blue:485124756476002304> : Blue\n' +
                    '.`blue`\n' +
                    '<:cyan:485124676612521999> : Cyan\n' +
                    '.`cyan`\n' +
                    '\n' +
                    '<:pink:485124544399540248> : Pink\n' +
                    '.`pink`\n' +
                    '\n' +
                    '<:magenta:485124483364028416> : Magenta\n' +
                    '.`magenta`\n' +
                    '\n' +
                    '<:purple:485124431023439872> : Purple\n' +
                    '.`purple`');
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
    }
})

client.on('message', async (msg) => {
    if (!msg.guild) return;

    var messageArray = msg.content.split(' ');
    var prefix_command = messageArray[0];
    var command = messageArray[0].replace(prefix, '');
    var args = messageArray.slice(1).join(' ');

    var roles = {
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

    if (msg.channel.id == ch_nsfw_access_id) {
        if (msg.author.id == client.user.id) {
            return;
        } else {
            if (msg.content == '.NSFW') {
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

    if (msg.channel.id == ch_name_color_id) {
        if ((msg.author.id == client.user.id) == false) {
            switch (msg.content) {
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
});


client.login(process.env.TOKEN);
