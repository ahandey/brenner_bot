// require necessary discord.js classes
const { SlashCommandBuilder, Events } = require("discord.js");

function makeCamel(name) {
    return name.charAt(0).toUpperCase()+name.substring(1).toLowerCase();
}

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
            this.data[`add${arg.type}Option`]((option) => {
                option.setName(arg.name);
                option.setDescription(arg.description);
                option.setRequired(true);
            });
        }
        
        for (const arg of krgs) {
            arg.type = makeCamel(arg.type);
            this.data[`add${arg.type}Option`]((option) => {
                option.setName(arg.name);
                option.setDescription(arg.description);
                option.setRequired(false);
            });
        }
    }

    get name() {return this.#create.name;}

    async execute(interaction) {
        const args = {};
        for (const arg of this.#create.args)
            args[arg.name] = interaction[`get${arg.type}`](arg.name);

        const krgs = {};
        for (const arg of this.#create.krgs)
            krgs[arg.name] = interaction[`get${arg.type}`](arg.name);

        this.func(args, krgs);
    }
}

class Action {
    #trigger = Events.ClientReady;
    #once = true;
    #exec = null;

    constructor(trigger, exec) {
        this.#trigger = trigger;
        this.#exec = exec;
    }

    get trigger() {return this.#trigger;}
    get isOnce() {return this.#once;}
    async execute(...args) {
        return await this.#exec(...args);
    }

    once() {
        this.#once = true;
        return this;
    }
    always() {
        this.#once = false;
        return this;
    }
}

module.exports = { Command, Action };