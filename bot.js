var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

const saludos = {
  buenosDias: 'Buenos días',
  buenasTardes: 'Buenas tardes',
  buenasNoches: 'Buenas noches',
}

var dameElSaludo = function (hora) 
{

    if(hora < 12 && hora > 7) {
        return saludos.buenosDias;
    }

    if(hora < 20) {
        return saludos.buenasTardes;
    }

    return saludos.buenasNoches;
}

//var sleep = require('sleep');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console( {
  colorize: true
}));
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: false
});

if (process.platform === "win32") {
    var rl = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    rl.on("SIGINT", function () {
      process.emit("SIGINT");
    });
}
  
process.on("SIGINT", function () {
    //graceful shutdown
    console.log('adios');
    bot.disconnect();
    process.exit();
});

bot.on('ready', function (evt) {
    console.log('conectado');
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

var lastChannel;
bot.on('message', function (user, userID, channelID, message, evt) {
    var hora = new Date().getHours();
    var textoHora = dameElSaludo(hora)
    console.log('mensaje'+ ' ' + message + ' ' + hora);
    lastChannel=channelID;
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`

    if (message === 'hola' || message === 'Hola')
    {
        bot.sendMessage({
            to: channelID,
            message: textoHora,
            typing: true
        });
    }

    if (message === 'adios' || message === 'Adios')
    {
        bot.sendMessage({
            to: channelID,
            message: '¡Nos vemos!'
            
        });
    }

    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;

            case 'pong':
                bot.sendMessage({
                    to: channelID,
                    message: 'Ping!'
                });
                break;

            case 'gracias':
                bot.sendMessage({
                    to: channelID,
                    message: 'Un placer ayudar ;)',
                    typing: true
                });
                break;
            // Just add any case commands if you want to..
         }
     }
});
bot.on('guildMemberAdd', function (member) 
{
    console.log('persona');
    if(lastChannel != undefined) {
    bot.sendMessage({
        to: lastChannel,
        message: '¡Bienvenido al servidor!'
        //ToDo: buscar el nombre
        //message: '¡Bienvenido al servidor,' + bot.users.filter(user => user.id == member.id )[0] + '!'
    });
}
});
bot.connect();
//sleep.sleep(200);
//while(true){yield};
console.log('fin');