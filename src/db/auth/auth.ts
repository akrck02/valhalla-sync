
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { VerifyJWT } from "../../secure/jwt";
import { AuthDb } from "./authDb";

export class AuthModel {

    db : AuthDb;
    secret : string;
    

    constructor(secret : string) {
        this.db = new AuthDb();
        this.secret = "juan";
    }

    /**
     * Get if an auth token is valid
     * @param token The auth token to validate
     * @returns If the auth token is valid
     */
    public isAuthenticated(token : string) : boolean {

        try {
            const data = VerifyJWT(token, this.secret);
            const username = data.username;
            const password = data.password;
            const mail = data.mail;

            //check user in token database
        } catch (error) {
            return false;
        }

        return true;
    }

    /**
     * Get if a device is authenticated
     * @param token The device token 
     * @returns If a device is authenticated on sync service
     */
    public isDeviceAuthenticated(token : string) : boolean {

        try {
            //check device in token database

        } catch (error) { return false; }
        return true;
    }


    /**
     * Register new auth on general database
     * @param req the current request
     * @param res the current response 
     * @returns Promise that resolves whether or not the auth was registered
     */
    public async newAuth(req : Request, res : Response) : Promise<any>{

        const username = req.body.username;
        const password = req.body.password;
        const mail = req.body.mail;

        if(!username || !password || !mail){
            return new Promise((resolve) => {
                resolve({success: false, message: "Missing parameters"});
            });
        }

        const token = sign({
            username : username,
            password : password,
            mail : mail
        }, this.secret);


        const SQL = "INSERT INTO user(token, username, password, mail) VALUES (?,?,?,?)";
        await this.db.get().run(
            SQL,
            token,
            username,
            password,
            mail
        );

        return new Promise((resolve) => resolve(token));
    }

    /**
     * Register a new device on users database
     * @param req the current request
     * @param res the current response 
     * @returns A promise that resolves whether or not the device was registered
     */
    public newAuthDevice(req : Request, res : Response) : Promise<any>{
        
        
        return new Promise((resolve) => {
            resolve({success: true, message: "Device created"});
        });
    }


}