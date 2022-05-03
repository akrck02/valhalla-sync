import { Request, Response } from "express";
import { AuthModel } from "./auth/authModel";


const  NOT_IMPLEMENTED_YET = () => new Promise((r) => r({
    success: false, 
    message:"Not implemented yet.", 
    code : 404
}));

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
            "register" : (req : Request, res : Response) => this.auth.newAuth(req, res),
            "login" : NOT_IMPLEMENTED_YET,
            "check/updates" : NOT_IMPLEMENTED_YET,
            "download" : NOT_IMPLEMENTED_YET,
            "upload" : NOT_IMPLEMENTED_YET
        }
    }

}

