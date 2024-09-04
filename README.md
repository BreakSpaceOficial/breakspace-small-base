<div align="center">

# Base Simple

**Uma base simples para facilitar a criação de BOTs**

![Suporte](https://discord.com/api/guilds/1233197090104934400/widget.png?style=banner2)

[Bot de Exemplo](https://github.com/BreakSpaceOficial/BreakSpace-small-base-Example) - [Suporte/Bugs](https://discord.gg/Yq2UqWZu) - *Docs (Em Breve)*

</div>

## Como instalar?

```
npm i @breakspace/small-base dotenv discord.js@14.15.3 --save
```

## Como usar ?
```js
// commonjs
require("dotenv").config()
const { Client } = require("@breakspace/small-base")
// module
import 'dotenv/config'
import { Client } from '@breakspace/small-base'

// como iniciar o bot
const client = new Client({
    intents: [], // coloque as intents por String ou com GatewayIntentBits
    // os partials já são passsados automaticamente
})
client.conectar(process.env.Token)

```
## Como utilizar o handler?
```js

// isso ira ler os eventos dentro da pasta raiz (src/eventos)
client.eventos("src/eventos")
// isso ira ler os eventos dentro de uma pasta (src/events/pasta)
client.eventos("src/eventos", { raiz: true })
// isso ira habilitar a pasta de comandos em slash
client.slash("src/slash")
// isso ira habilitar a pasta de comandos em prefix
client.prefix("src/prefix")

// você pode passar src/comandos/slash e src/comandos/prefix para deixar mais organizado
```


## Como registrar os comandos?
coloque dentro do evento **ready** para funcionar o registro de comandos
```js
// para registrar globalmente
client.registrar({ type: "global" })

// para registrar por servidor(es)
client.registrar({ type: "guild", guildsId: ["1234567890123456789"] })

```

## Como buscar os comandos em slash e prefix?
```js
 interaction.client.slashCommands.get(commandName)
 message.client.prefixCommands.get(commandName)
```

## Futuras Adições
- [ ] Sistema de Logs (Comandos e evento)
- [ ] Coloração nas logs
- [ ] Suporte para comandos globais e por servidor (pastas diferentes)

## Canais Parceiros
*Nenhum canal ate o momento*

## Lojas Parceiras
*Nenhuma loja ate o momento*

## Leia Abaixo (Parcerias)

 *Caso tenha interesse acesse no **[servidor de suporte](https://discord.gg/Yq2UqWZu)** e veja o **[canal de parcerias](https://discord.com/channels/1233197090104934400/1279665430109093954)***