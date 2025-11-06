const Discord = require("discord.js")
const Client = new Discord.Client({intents:["MessageContent","GuildMessages","Guilds","GuildMembers","AutoModerationConfiguration","AutoModerationExecution","GuildVoiceStates","GuildIntegrations","DirectMessagePolls","DirectMessageTyping"]})
const Config = require("./json/Config.json")
const ComandosJs = require("./js/Comandos")
const Settings = require("./js/Settings")
const Path = require("path")
require("dotenv").config({
    path:Path.join(__dirname,"./env/Config.env")
})
const { createAudioResource } = require("@discordjs/voice")
 

Client.once("clientReady",(bot)=>{
    console.log(`${bot.user.tag} | Version: ${Config.Version}`)
    
    const Infos = {
        "Name":bot.user.tag,
        "Avatar":bot.user.avatar,
        "Server Quantity":bot.guilds.cache.size,
        "User Quantity":bot.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0),
        "Id":bot.user.id,
        "Version":Config.Version
    }
    Settings.Web.Api(Infos)


})



Client.on("messageCreate",async (Mensagem)=>{
    const Comando = Mensagem.content.slice(Config.Prefix.length).trim().split(/ +/g).shift().toLowerCase() 
    var Day = new Date().getDate()
    var Jogos = ["Minecraft","Roblox","Noita","Touhou Lunar Nights","Crush Crush","Orange juice","Beecarbonize","Buckshot Roulette","Clone Drone","Outcore","Lethal Company","Super Auto Pets","World Box","Undertale","Peglin","Project Zomboid","Slider","Muck","Oxygen not included","Bloody Hell","Happy Room","Red Dead Redemption","Dave the diver","Dead by daylight","Dead Cells","PayDay 3","Grand Theft Auto V","DayZ","Resident Evil 4","Rust","Grand Theft Auto: San Andreas","Hollow Knight"]
    var Nomes = ["Ukita Akane!!","Ruru","Ruru","Mikage Sakurai","Hinata Hoshino","Bocchi Hitori","Chitose Ikeda","Moriko Morioka","Nayuta Kani","Chiya","Chiya","Chiya","Rize Tedeza","Chino","Mao Amatsuka","Yurika","Kuko","Rito Tsukimi","Tomoe Tachibana","Yoshino Koharu","Mirai Kuriyama","Aoba Suzukaze","Chitose Karasuma","Chitose Karasuma","Kurumi Ebisuzawa","Vignette April Tsukinose","Sylphynford Tachibana","Maki Nishikino","Koume","Yuuko Yoshida","Satsuki","Satsuki"]
    
    
    
    
    Client.user.setStatus("idle")
    Client.user.setActivity(Jogos[Day - 1])
    Client.user.setUsername(Nomes[Day - 1])
    Client.user.setBanner(`./Imgs/Photons/Benner/${Day}.gif`).then(()=>{}).catch(()=>{})
    Client.user.setAvatar(`./Imgs/Photons/${Day}.gif`).then(()=>{}).catch(()=>{})


    if (Mensagem.author.bot || Mensagem.content[0] != Config.Prefix) return;
       
    
    
    ComandosJs.Comandos_Simples.Start(Comando,Mensagem)
    
    if (Object.values(Config.Owners).includes(Mensagem.author.id)){
        ComandosJs.Comandos_Privados.Start(Comando,Mensagem,Client)
    }

    



})



Client.login(process.env.Token)