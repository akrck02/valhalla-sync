import { API } from "./db/api";


class ValhallaSync {

    constructor() {
        console.log = (...msg) => console.info("[" + msg[0] + "] " + msg.slice(1));
    }

    title() {
        console.info("###############################################################################");
        console.info("                 VALHALLA SYNC by @Akrck02 - Choco version                     ");
        console.info("###############################################################################");
        console.info(" ");
    }

    start() {
        this.title();
        const api = new API();
        api.start();

    }

}

//Create a new sync service
const sync = new ValhallaSync();
sync.start();