import { Request, Response } from "express";
import { Router } from "./router";

const express = require('express');

export class API {

    private app: any;
    private hostname: string;
    private port: number;
    private router: Router;

    constructor() {
        this.app = express();
        this.hostname = "127.0.0.1";
        this.port = 5500;
        this.router = new Router("***");
    }

    public start(): void {

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        /* CORS Control */
        this.app.use((req : Request, res : Response, next : any) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Accept-Language, Content-Language, Content-Type, Access-Control-Allow-Request-Method');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
            next();

        });
    

        /* CORS Control */
        this.app.use((req: Request, res: Response, next: Function) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Oauth, Device");
            next();
        });

        /* Define every route with callbacks */
        const paths = this.router.PATHS;
        for (const key in paths) {
            const callback = paths[key];
            this.app.post(Router.API + key + "/", (req: Request, res: Response) => this.handleRequest(key,req,res,callback));
            this.app.get(Router.API + key + "/", (req: Request, res: Response) => {
                this.getParametersToBody(req);
                this.handleRequest(key,req,res,callback);
            })
              
        }

        /* Start API listener */
        this.app.listen(this.port, this.hostname);
        console.log("Sync-API", "The valhalla sync API is running on http://" + this.hostname + ":" + this.port + "/" + Router.API);
    }

    
    handleRequest(
        key : string,
        req : Request,
        res : Response,
        callback :  (req : Request, res : Response) => Promise<any> 
    ) {

        console.log("Sync-API","Request: " + Router.API + key + "/");
        const promise = callback(req,res);

        promise.then((data)  => {
            if(data.code){
                res.statusCode = data.code;
            }
            res.send(data)
        })
        .catch((err: any) => {
            console.log("error",err);
            res.statusCode = 500;
            res.send({
                "success" : false,
                "status": "failed",
                "reason": err.message,
                "code" : 500
            });
        });
    }


    /**
     * Convert get params to body
     * @param req The request to handle
     */
    getParametersToBody(req: Request) {
        let url = req.url;
        url = url.substring(url.lastIndexOf("?") + 1);
        
        const params = url.split("&");
        const body : {[key: string] : string} = {};

        params.forEach(param => {
            const parts = param.split("=");
            body[parts[0]] = parts[1];
        }); 

        req.body = body;
    }


    /*
        static checkDeviceAuth(req : Request, res : Response) {
            const token = req.headers['device'];
            if (token === undefined || !AuthModel.isDeviceAuthenticated(token + "")) {
                res.send({
                    "status": "failed",
                    "reason": "Invalid API credentials"
                });
                return;
            }
        }
    */

}