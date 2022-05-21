export default class Logger {

    static log(...data : any) {
        console.info("   ",data.join(","));
    }

    static success(...data : any) {
        console.info(" ✅", data.join(","));
    }

    static warning(...data : any) {
        console.warn(" 🔶", data.join(","));
    }

    static error(...data : any) {
        console.error(" ❌", data.join(","));
    }

    static jump() {
        console.info("");
    }

    static rawlog(...data : any) {
        console.info(data.join(" "));
    }

    static hardTitle(title : string) {
        Logger.jump();
        Logger.line("#");
        console.info("  " + title.toUpperCase() + " ");
        Logger.line("#");
    }

    static softTitle(title : string) {
        Logger.jump();
        Logger.line();
        console.info("  " + title);
        Logger.line();
    }

    static line(char : string = "-"){
        let line = char;
        console.info(line.repeat(42));
    }
}