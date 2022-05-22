import { Request, Response } from "express";
import { AuthHandler } from "./auth/auth";
import { BackupHandler } from "./backup/backup";
import IApiFunctionSet from "./core/api/IApiFunction";
import { PONG } from "./core/api/Responses";
import { AuthDb } from "./core/classes/AuthDb";

export class Router {
    
    public static VERSION = "1";
    public static PREFIX = "sync"; 
    public static API = `/${Router.PREFIX}/v${Router.VERSION}/`;

    public static async start(secret :string, db : string = "auth") : Promise<IApiFunctionSet> {
        const auth = new AuthDb(db);
        await auth.open();
        await auth.createTables();

        const paths :IApiFunctionSet = {
            "ping": () => PONG,
            "register" : (req : Request,res : Response) => AuthHandler.register(req,res,auth,secret),
            "login" : (req : Request,res : Response) => AuthHandler.login(req,res,auth,secret),
            "sync" : (req : Request,res : Response) => BackupHandler.sync(req,res,secret),
        }

        return paths;
    }

}

