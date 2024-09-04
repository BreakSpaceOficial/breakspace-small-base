const { Client, Collection, Partials } = require("discord.js");
const { join } = require("path")
const { readdirSync, existsSync, statSync } = require("fs")
module.exports = class extends Client {
    constructor({ intents }) {
        super({
            intents: intents,
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User
            ]
        })
        this.slashCommands = new Collection()
        this.slashArray = []
        this.prefixCommands = new Collection()
        this.prefixArray = []
    }

    conectar(token) {
        this.login(token)
    }
    registrar({ type, guildsId } = {}) {
        if (!type) { type = "global" }
        try {
            switch (type) {
                case "global":
                    this.application.commands.set(this.slashArray)
                    console.log(`[Base Simple] Registro Global feito com sucesso`)
                    break;
                case "guild":
                    if (!guildsId.length) {
                        this.destroy()
                        return console.log("Você não colocou nenhum ID de servidor")
                    }
                    for (const guildId of guildsId) {
                        this.guilds.cache.get(guildId).commands.set(this.slashArray)
                        console.log(`[Base Simple] Registro Guilds feito com sucesso`)
                    }
                    break
                default:
                    this.destroy()
                    console.log(`[Registro] Parece que o type: '${type}' não existe ou foi escrito errado\nTypes suportados: global, guild\nEx: client.registrar({ type: "global" })`)
                    break;
            }
        } catch (err) {
            console.error(`Erro: ${err}`)
        }
    }
    eventos(local, { raiz = false } = {}) {
        if (!existsSync(local)) return folderExist("localFolder", local)
        const pastas = readdirSync(local)
        if (raiz) {
            try {
                const arquivos = readdirSync(join(process.cwd(), local)).filter(f => f.includes("."))
                for (const arquivo of arquivos) {
                    const evt = require(join(process.cwd(), `${local}/${arquivo}`))
                    if (evt.once) {
                        this.once(evt.name, (...args) => evt.run(...args))
                    } else {
                        this.on(evt.name, (...args) => evt.run(...args));
                    }
                }
            } catch (err) {
                console.error(`Erro: ${err}`)
            }
        }
        if (!raiz) {
            try {
                for (const pasta of pastas) {
                    if (statSync(join(process.cwd(), `${local}/${pasta}`)).isFile()) return folderExist("existFolder", local, pasta)
                    const arquivos = readdirSync(`${local}/${pasta}`)
                    for (const arquivo of arquivos) {
                        const evt = require(join(process.cwd(), `${local}/${pasta}/${arquivo}`))
                        if (evt.once) {
                            this.once(evt.name, (...args) => evt.run(...args))
                        } else {
                            this.on(evt.name, (...args) => evt.run(...args));
                        }
                    }
                }
            } catch (err) {
                console.error(`Erro: ${err}`)
            }
        }
    }
    slash(local) {
        try {
            if (!existsSync(local)) return folderExist("localFolder", local)
            const pastas = readdirSync(local)
            for (const pasta of pastas) {
                if (statSync(join(process.cwd(), `${local}/${pasta}`)).isFile()) return folderExist("existFolder", local, pasta)
                const arquivos = readdirSync(`${local}/${pasta}`)
                for (const arquivo of arquivos) {
                    const cmd = require(join(process.cwd(), `${local}/${pasta}/${arquivo}`))
                    this.slashCommands.set(cmd.name, cmd)
                    this.slashArray.push(cmd)
                }
            }
        } catch (err) {
            console.error(`Erro: ${err}`)
        }
    }
    prefix(local) {
        try {
            if (!existsSync(local)) return folderExist("localFolder", local)
            const pastas = readdirSync(local);
            for (const pasta of pastas) {
                if (statSync(join(process.cwd(), `${local}/${pasta}`)).isFile()) return folderExist("existFolder", local, pasta)
                const arquivos = readdirSync(`${local}/${pasta}`)
                for (const arquivo of arquivos) {
                    const cmd = require(join(process.cwd(), `${local}/${pasta}/${arquivo}`))
                    this.prefixCommands.set(cmd.name, cmd)
                    this.prefixArray.push(cmd)
                }
            }
        } catch (err) {
            console.error(`Erro: ${err}`)
        }
    }
}
function folderExist(type, local, pasta) {
    switch (type) {
        case "localFolder":
            console.log(`Pasta ${local} não foi encontrada, veja se esta escrita corretamente ou esta na pasta certa`)
            break;
        case "existFolder":
            console.log(`Qualquer tipo de arquivo tem que ser colocado dentro de pastas\nEx: ${local}/pasta/${pasta}`)
            break;
    }
}