import { Request, Response } from "express";
import { AuthModel } from "./auth/auth";

export class Router{
    
    public static VERSION = "1";
    public static PREFIX = "sync"; 
    public static API = `/${Router.PREFIX}/v${Router.VERSION}/`;


    public PATHS : {[key:string] : (req : Request, res : Response) => Promise<any>};
    public auth : AuthModel;

    public constructor(secret : string) {
        this.auth = new AuthModel(secret);
        this.PATHS = {
            "ping": (req : Request, res : Response) => new Promise((resolve) => resolve({success: true , message : "pong"})),
            "new/auth/device" : (req : Request, res : Response) => this.auth.newAuthDevice(req, res),
            "new/auth" : (req : Request, res : Response) => this.auth.newAuth(req, res),
        }
    }

}