
import { Request, Response } from "express";
import { VerifyJWT } from "../../secure/jwt";
import { INCORRECT_CREDENTIALS, MISSING_PARAMETERS } from "../core/api/Responses";
import AuthData from "../core/data/AuthData";
import { AuthDb } from "../core/classes/AuthDb";
import IToken from "../core/interface/IToken";

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
     * Get if an auth token is valid
     * @param token The auth token to validate
     * @returns If the auth token is valid
     */
    public static getTokenInfo(token : string, secret : string) : IToken {
        const data = VerifyJWT(token, secret);
        return data as IToken;
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
        const address = req.body.address;
        const platform = req.body.platform;

        if(!username || !password || !mail || !address) {
            await db.get().close();
            return MISSING_PARAMETERS;
        }

        try {
            const register = await AuthData.register({
                user: username,
                password: password,
                mail : mail,
                address : address,
                platform : platform
            },db.get(),secret)

            await db.get().close();
            return register;
        } catch(error) {
            await db.get().close();
            throw error;
        }
    }

    public static async login(req : Request, res : Response, db : AuthDb, secret : string) : Promise<any> {

        try {
            // check parameters
            const user = req.body.user;
            const mail = req.body.mail;
            const password = req.body.password;
            const platform = req.body.platform;
            let address =  req.body.address;
            
            // check if correct credentials
            const login = await AuthData.login({
                user : user,
                password : password,
                mail : mail,
                platform : platform,
                address : address
            },db.get());

            if(!login) {
                await db.get().close();
                return new Promise(r => r(INCORRECT_CREDENTIALS))
            }

            // if device send (check device) 
            if(await AuthData.deviceExists(user,address,platform,db.get())) {
                
                const update = await AuthData.updateDeviceByAddress({
                    user: user,
                    mail : mail,
                    password : password,
                    platform : platform,
                    address : address
                },db.get(),secret);

                await db.get().close();
                return update;
            }
            // else register device
            else {
                const register = await AuthData.registerDevice({
                    user: user,
                    mail : mail,
                    password : password,
                    platform: platform,
                    address : address
                },db.get(),secret);

                await db.get().close();
                return register;
            }
        } catch(error) {
            await db.get().close();
            throw error;
        }
    }


}