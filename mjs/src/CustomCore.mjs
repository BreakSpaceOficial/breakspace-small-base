import { Client, Collection, Partials } from 'discord.js'
import { join } from 'path'
import { readdirSync, existsSync, statSync } from 'fs'
export default class extends Client {
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
    async eventos(local, { raiz = false } = {}) {
        if (!existsSync(local)) return folderExist("localFolder", local)
        const pastas = readdirSync(local)
        if (raiz) {
            try {
                const arquivos = readdirSync(join(process.cwd(), local)).filter(f => f.includes("."))
                for (const arquivo of arquivos) {
                    const evt = (await import(`file://${join(process.cwd(), `${local}/${arquivo}`)}`))?.default
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
                        const evt = (await import(`file://${join(process.cwd(), `${local}/${pasta}/${arquivo}`)}`))?.default
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
    async slash(local) {
        try {
            if (!existsSync(local)) return folderExist("localFolder", local)
            const pastas = readdirSync(local)
            for (const pasta of pastas) {
                if (statSync(join(process.cwd(), `${local}/${pasta}`)).isFile()) return folderExist("existFolder", local, pasta)
                const arquivos = readdirSync(`${local}/${pasta}`)
                for (const arquivo of arquivos) {
                    const cmd = (await import(`file://${join(process.cwd(), `${local}/${pasta}/${arquivo}`)}`))?.default
                    this.slashCommands.set(cmd.name, cmd)
                    this.slashArray.push(cmd)
                }
            }
        } catch (err) {
            console.error(`Erro: ${err}`)
        }
    }
    async prefix(local) {
        try {
            if (!existsSync(local)) return folderExist("localFolder", local)
            const pastas = readdirSync(local);
            for (const pasta of pastas) {
                if (statSync(join(process.cwd(), `${local}/${pasta}`)).isFile()) return folderExist("existFolder", local, pasta)
                const arquivos = readdirSync(`${local}/${pasta}`)
                for (const arquivo of arquivos) {
                    const cmd = (await import(`file://${join(process.cwd(), `${local}/${pasta}/${arquivo}`)}`))?.default
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
