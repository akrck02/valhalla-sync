import { Request, Response } from "express";
import { AuthModel } from "./auth/authModel";
import { NOT_IMPLEMENTED_YET, PONG } from "./core/responses";

export class Router{
    
    public static VERSION = "1";
    public static PREFIX = "sync"; 
    public static API = `/${Router.PREFIX}/v${Router.VERSION}/`;

    public PATHS : {[key:string] : (req : Request, res : Response) => Promise<any>};
    public auth : AuthModel;

    public constructor(secret : string) {
        this.auth = new AuthModel(secret);

        this.PATHS = {
            "ping": () => PONG,
            "register" : (req,res) => this.auth.register(req,res),
            "login" : (req,res) => this.auth.login(req,res),
            "check/updates" : () => NOT_IMPLEMENTED_YET,
            "download" :  () => NOT_IMPLEMENTED_YET,
            "upload" :  () => NOT_IMPLEMENTED_YET,
        }
    }

}

