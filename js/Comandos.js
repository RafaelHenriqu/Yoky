const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');


const Config = require("./Settings")
const fs = require("fs");
const path = require('path');

const LoadLanguage = () =>{
    return Language = require(`../json/Language/${Config.ConfigJs.Language}.json`)
}

const Comandos_Simples = {
    Start:async function(Comando,Mensagem){
        const Language = LoadLanguage()
        switch(Comando){
            case 'clear':
                Quantidade = parseInt(Mensagem.content.split(" ")[1])
                if (isNaN(Quantidade) || Quantidade < 1){Mensagem.channel.send(Language.Clear_ERROR)
                    break
                }
                if (Quantidade >= 100){
                    QuantidadeMaxima = await Mensagem.channel.messages.fetch({limit:100})
                    QuantidadeMaxima = parseInt(QuantidadeMaxima.size)
                    Mensagem.channel.bulkDelete(QuantidadeMaxima + 1).catch(error =>{
                        Mensagem.channel.send(Language.Clear_Time_has_expired)
                    })
                }else{
                    Mensagem.channel.bulkDelete(Quantidade + 1).catch(error =>{
                        Mensagem.channel.send(Language.Clear_Time_has_expired)
                    })
                }
                break
            default:
                break
        }
    },
}

const Comandos_Privados = {
    
    Start:async function(Comandos,Mensagem,Client){
        const Language = LoadLanguage()
        switch(Comandos){
            case 'setlanguage':
                var LanguageSelect = Mensagem.content.split(" ")[1]
                var LanguageFolder = [] 
                require("fs").readdir(require("path").join(__dirname, "../json/Language"),(error,arquivo)=>{
                    if (error){
                        return;
                    }else{
                        arquivo.forEach(Arquivo=>{
                            var Arquivo = Arquivo.replace(".json","").trim()
                            LanguageFolder.push(Arquivo)
                        })
                        if (LanguageFolder.includes(LanguageSelect)){
                            Config.ConfigJs.Language = LanguageSelect
                        }else{
                            Mensagem.channel.send(Language.Not_Language)
                        }
                    }  
                })                
                break
            case 'noticec':
                var Channel_ID = Mensagem.content.split(" ")[1]
                Config.ConfigJs.Warning_Chat = Channel_ID
                break
            case 'notice':
                 var Aviso = Mensagem.content.replace(/\/notice/i,'').trim()
                try{
                    Client.channels.cache.get(Config.ConfigJs.Warning_Chat).send(Aviso);
                    break
                }catch{
                    Mensagem.channel.send(Language.Channel_Not_Configured)
                    break    
                }
                break
            case 'configs':
                Mensagem.channel.send(Language.Configuration_Commands)
                break
            case 'join':
                const Music = fs.readdirSync(path.join(__dirname,"../Sounds/Music/"))
                const Channel = Mensagem.member.voice
                const Path = path.join(__dirname,"../Sounds/Music/")
                const Connection = await joinVoiceChannel({
                    guildId:Channel.guild.id,
                    adapterCreator:Channel.channel.guild.voiceAdapterCreator,
                    channelId:Channel.channel.id,
                })
                const Player = createAudioPlayer()
                Connection.subscribe(Player)
                var Random = Music[Math.floor(Math.random() * Music.length)]
                console.log(`${Path}${Random}`)
                if (Random == undefined){
                    return
                }
                const Resource = await createAudioResource(`${Path}${Random}`) // Adicionar Compatibilidade com outros Formatos Futuramente
                Player.play(Resource)
                
                
                Player.on(AudioPlayerStatus.Idle,()=>{
                    Comandos_Privados.Start('join',Mensagem)
                })
                break
            default:
                break
        }     

    }
}


module.exports = {
    Comandos_Simples,
    Comandos_Privados,
}