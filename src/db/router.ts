import { Request, Response } from "express";
import { AuthDb } from "./auth/authDb";
import { AuthHandler } from "./auth/handler/auth";
import { BackupHandler } from "./backup/handler/backup";
import { NOT_IMPLEMENTED_YET, PONG } from "./core/responses";

export class Router{
    
    public static VERSION = "1";
    public static PREFIX = "sync"; 
    public static API = `/${Router.PREFIX}/v${Router.VERSION}/`;

    public PATHS : {[key:string] : (req : Request, res : Response) => Promise<any>};
    public auth : AuthDb;

    public constructor(secret : string) {
        this.auth = new AuthDb();

        this.PATHS = {
            "ping": () => PONG,
            "register" : (req,res) => AuthHandler.register(req,res,this.auth,secret),
            "login" : (req,res) => AuthHandler.login(req,res,this.auth,secret),
            "check/updates" : () => NOT_IMPLEMENTED_YET,
            "download" :  () => NOT_IMPLEMENTED_YET,
            "upload" :  () => NOT_IMPLEMENTED_YET,
            "export" : (req,res) => BackupHandler.export(req,res)
        }
    }

}

