/**
 * DCustomRPC
 * 
 * Created by JakeMakesStuff and contributors (https://github.com/JakeMakesStuff/DCustomRPC/contributors).
 */

// Imports go here.
const log = require("fancy-log");
const { config } = require("./config");
const { version } = require("./package.json");
const { emoticons } = require("./config");
// Defines the RPC client.
const { Client } = require("discord-rpc");

// Invokes an instance of the RPC client.
const rpc = new Client({ transport: "ipc" });

// Throws an exception if the change interval is 0.
if (config.change_interval === 0) {
    console.log("The change interval cannot be 0. (╯°□°）╯︵ ┻━┻");
}

// Adds emoticons to log messages.
function emoticonify(string) {
    if (Math.random() <= config.emoticon_chance) {
        var randEmote = emoticons[Math.floor(Math.random() * emoticons.length)];
        return string + " " + randEmote;
    } else { return string; }
}

console.log(`Starting DCustomRPC, Version: ${version}. ~(˘▾˘~)`)

// Defines the game changing loop.
async function gameloop() {
    var x = true;
    while(x) {
        var r = Math.floor(Math.random() * config.game_list.length);
        if ((config.game_list[r] != global.current_game) || (config.game_list.length === 1)) {
            global.current_game = config.game_list[r];
            rpc.setActivity(config.game_list[r]);
            log(emoticonify("Changed activity."));
            x = false;
        }
    }
}

// RPC ready event executes loop function.
rpc.once('ready', () => {
    log(`Logged into Discord with the application ID ${config.application_id}. (^o^)／`);
    global.current_game = {};
    gameloop();
    setInterval(gameloop, config.change_interval * 1000);
});

// Logs into Discord if it is not a test.
if (process.argv[2] != "test") {
    rpc.login(config.application_id).catch( err => {
        console.log(`Error logging into RPC client! (╯°□°）╯︵ ┻━┻\n${err}`)
    });
} else {
    console.log("At least before logging into Discord, all seems well! >^_^<");
}
