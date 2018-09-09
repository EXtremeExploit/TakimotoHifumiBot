require('dotenv').config();
var discord = require('discord.js');
var client = new discord.Client();

var prefix = process.env.prefix;
var ch_arrivals_id = process.env.ch_arrivals_id;
var ch_nsfw_access_id = process.env.ch_nsfw_access_id;
var ch_name_color_id = process.env.ch_name_color_id;
var guild_id = process.env.guild_id;

/**
 * 
 * @param {discord.Message} msg 
 * @param {discord.Role} role 
 * @param {Object} roles
 */
function toggleColorToMember(msg, role, roles) {
    if (!msg.member.roles.find((r) => r.name == role.name)) {
        var EveryRole = roles[0]
        msg.member.removeRoles([
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
        msg.member.addRole(role);
        msg.delete();
    } else {
        msg.member.removeRole(role);
        msg.delete();
    }
}

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

    switch (msg.content) {
        case '.sendNSFWaccess':
            client.guilds.find((g) => g.id == guild_id).channels.find((ch) => ch.id == ch_nsfw_access_id).send('Send `.NSFW` to get NSFW permissions, send again if you don\'t want them anymore');
            break;
        case '.sendNAMECOLOR':
            client.guilds.find((g) => g.id == guild_id).channels.find((ch) => ch.id == ch_name_color_id).send('<:dark_red:485125836849283103> : Dark Red\n' +
                '.`darkred`\n' +
                '\n'+
                '<:red:485125793270464552> : Red\n' +
                '.`red`\n' +
                '\n'+
                '<:orange:485125758465867796> : Orange\n' +
                '.`orange`\n' +
                '\n'+
                '<:brown:485125717282127872> : Brown\n' +
                '.`brown`\n' +
                '\n'+
                '<:gold:485125481805512714> : Gold\n' +
                '.`gold`\n' +
                '\n'+
                '<:yellow:485125443717038087> : Yellow\n' +
                '.`yellow`\n' +
                '\n'+
                '<:navy:485125406605836290> : Navy\n' +
                '.`navy`\n' +
                '\n'+
                '<:green:485125361017946113> : Green\n' +
                '.`green`\n' +
                '\n'+
                '<:dark_blue:485125157518704652> : Dark Blue\n' +
                '.`darkblue`\n' +
                '\n'+
                '<:blue:485124756476002304> : Blue\n' +
                '.`blue`\n' +
                '<:cyan:485124676612521999> : Cyan\n' +
                '.`cyan`\n' +
                '\n'+
                '<:pink:485124544399540248> : Pink\n' +
                '.`pink`\n' +
                '\n'+
                '<:magenta:485124483364028416> : Magenta\n' +
                '.`magenta`\n' +
                '\n'+
                '<:purple:485124431023439872> : Purple\n' +
                '.`purple`');
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
        if (!msg.author.id == client.user.id) {
            if (msg.content == prefix + 'NSFW') {
                if (!msg.member.roles.find((r) => r.name == roles.nsfw.name)) {
                    msg.member.addRole(roles.nsfw);
                    msg.delete();
                } else {
                    msg.member.removeRole(roles.nsfw);
                    msg.delete();
                }
            } else {
                msg.delete();
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
                    msg.delete();

            }
        }
    }
})


client.login(process.env.TOKEN);
