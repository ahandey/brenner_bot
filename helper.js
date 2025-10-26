// require necessary discord.js classes
const { Channel, SlashCommandBuilder, Events } = require("discord.js");

function makeCamel(name) {
    return name.charAt(0).toUpperCase()+name.substring(1).toLowerCase();
}

class Utility {
    Async = class Async {
        wait(ms) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }

        waitUntil(f, ms=0) {
            return new Promise(async (resolve) => {
                while (!f()) await (ms==0)?0:this.wait(ms);
                resolve();
            });
        }
    }
}

Channel.prototype.testField = "Hello Channel testField";

class Command {
    #create = null;

    constructor(name, desc, args, krgs, func) {
        this.#create = { name, desc, args, krgs };
        this.func = func;

        this.data = new SlashCommandBuilder();
        this.data.setName(name);
        this.data.setDescription(desc);
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
    }

    get name() {return this.#create.name;}

    async execute(env, interaction) {
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

module.exports = { Command, Action, Utility };