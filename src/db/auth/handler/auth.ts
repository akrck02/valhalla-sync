
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { VerifyJWT } from "../../../secure/jwt";
import { INCORRECT_CREDENTIALS, MISSING_PARAMETERS, SOMETHING_WENT_WRONG } from "../../core/api/Responses";
import AuthData from "../../core/data/AuthData";
import { AuthDb } from "../authDb";

export class AuthHandler {

    /**
     * Get if an auth token is valid
     * @param token The auth token to validate
     * @returns If the auth token is valid
     */
    public static isAuthenticated(token : string, secret : string) : boolean {

        try {
            const data = VerifyJWT(token, secret);
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
    public static isDeviceAuthenticated(token : string, secret : string) : boolean {

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
    public static async register(req : Request, res : Response, db : AuthDb, secret : string) : Promise<any>{

        const username = req.body.user;
        const password = req.body.password;
        const mail = req.body.mail;
        const device = req.body.device;
        const platform = req.body.platform;

        if(!username || !password || !mail || !device){
            return MISSING_PARAMETERS;
        }

       return await AuthData.register({
           user: username,
           password: password,
           mail : mail,
           device : device,
           platform : platform
       },db.get(),secret)
    }

    public static async login(req : Request, res : Response, db : AuthDb, secret : string) : Promise<any> {

        // check parameters
        const user = req.body.user;
        const mail = req.body.mail;
        const password = req.body.password;
        const platform = req.body.platform;
        let device =  req.body.device;
        
        // check if correct credentials
        const login = await AuthData.login({
            user : user,
            password : password,
            mail : mail,
            platform : platform,
            device : device
        },db.get());

        if(login) {
            return new Promise(r => r(INCORRECT_CREDENTIALS))
        }

        // if device send (check device) 


        if(await AuthData.deviceExists(device,db.get())) {
            return await AuthData.updateDevice({
                user: user,
                mail : mail,
                password : password,
                device : device
            },db.get(),secret);
        }
        // else register device
        else {
            return await AuthData.registerDevice({
                user: user,
                mail : mail,
                password : password,
                platform: platform,
                device : device
            },db.get(),secret);
        }

    }


}