// require necessary discord.js classes
const {
    SlashCommandBuilder,
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    Events
} = require("discord.js");

function makeCamel(name) {
    return name.charAt(0).toUpperCase()+name.substring(1).toLowerCase();
}

class Async {
    constructor() {
        throw new TypeError("Async is not constructable");
    }

    static wait(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    static waitUntil(condition, ms=0) {
        return new Promise(async (resolve) => {
            while (! await condition()) await (ms==0)?0:this.wait(ms);
            resolve();
        });
    }

    static loopUntil(code, condition, ms=0) {
        return new Promise(async (resolve) => {
            while (! await condition()) {
                await code();
                await (ms==0)?0:this.wait(ms);
            }
            resolve();
        });
    }
}

class MessageField {
    #channel = null;
    #typing = false;
    #sendArgs = null;
    #promise = null;
    #time = 0;

    constructor(channel) {
        this.#channel = channel;
    }

    startTyping() {
        this.#typing = true;
        this.#time = Date.now();
        this.#promise = Async.loopUntil(
            () => this.#channel.sendTyping(),
            () => !this.#typing,
            1000
        ).then(async () => {
            await this.#channel.send(...this.#sendArgs);
            this.#time = Date.now()-this.#time;
            this.#sendArgs = null;
            this.#promise = null;
        });
    }

    send(...args) {
        this.#sendArgs = args;
        this.#typing = false;
        return this.#promise;
    }

    get time() {return this.#time;}
}

class Command {
    static Type = {
        SLASH               : 0,
        MESSAGE_CONTEXT_MENU: 1
    };

    #create = null;
    constructor(type, name, desc, args, krgs, func) {
        this.#create = { type, name, desc, args, krgs };
        this.func = func;

        switch (type) {
            default: 
                throw new Error(`Couldn't create command "${name}" of invalid type ${type}`);

            case Command.Type.SLASH:
                this.data = new SlashCommandBuilder()
                    .setName(name)
                    .setDescription(desc);
                
                for (const arg of args) {
                    arg.type = makeCamel(arg.type);
                    this.data[`add${arg.type}Option`]((option) => option
                        .setName(arg.name)
                        .setDescription(arg.description)
                        .setRequired(true)
                    );
                }
                
                for (const arg of krgs) {
                    arg.type = makeCamel(arg.type);
                    this.data[`add${arg.type}Option`]((option) => option
                        .setName(arg.name)
                        .setDescription(arg.description)
                        .setRequired(false)
                    );
                }
                break;
            
            case Command.Type.MESSAGE_CONTEXT_MENU:
                this.data = new ContextMenuCommandBuilder()
                    .setName(name)
                    .setType(ApplicationCommandType.Message);
                
                this.#create.desc = [];
                this.#create.args = [];
                this.#create.krgs = [];
        }
    }

    get type() {return this.#create.type;}
    get name() {return this.#create.name;}

    async execute(env, interaction) {
        if (
            (this.type == Command.Type.SLASH               ) && !interaction.isChatInputCommand         () ||
            (this.type == Command.Type.MESSAGE_CONTEXT_MENU) && !interaction.isMessageContextMenuCommand()
        ) {
            throw new Error(`Command "${this.name}" called in the wrong context`);
        }

        const args = {};
        for (const arg of this.#create.args) 
            args[arg.name] = interaction.options[`get${arg.type}`](arg.name);

        const krgs = {};
        for (const arg of this.#create.krgs)
            krgs[arg.name] = interaction.options[`get${arg.type}`](arg.name);

        return await this.func.apply(env, [interaction, args, krgs]);
    }
}

class Action {
    #trigger = Events.ClientReady;
    #once = false;

    constructor(trigger, func) {
        this.#trigger = trigger;
        this.func = func;
    }

    get trigger() {return this.#trigger;}
    get isOnce() {return this.#once;}

    once() {
        this.#once = true;
        return this;
    }
    always() {
        this.#once = false;
        return this;
    }
    
    async execute(env, args) {
        return await this.func.apply(env, args);
    }
}

module.exports = { Command, Action, Async, MessageField };