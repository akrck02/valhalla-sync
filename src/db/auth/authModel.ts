
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { VerifyJWT } from "../../secure/jwt";
import { INCORRECT_CREDENTIALS, MISSING_PARAMETERS, SOMETHING_WENT_WRONG } from "../core/responses";
import { AuthDb } from "./authDb";

export class AuthModel {

    db : AuthDb;
    secret : string;
    

    constructor(secret : string = "***") {
        this.db = new AuthDb();
        this.secret = secret;
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
    public async register(req : Request, res : Response) : Promise<any>{

        const username = req.body.user;
        const password = req.body.password;
        const mail = req.body.mail;
        const device = req.body.device;
        const platform = req.body.platform;

        if(!username || !password || !mail || !device){
            return MISSING_PARAMETERS;
        }

        const SQL = "INSERT INTO auth(username, password, email) VALUES (?,?,?)";
        const status = await this.db.get().run(
            SQL,
            username,
            password,
            mail
        );

        if(status.changes != 1){
            return SOMETHING_WENT_WRONG;
        }

        return await this.registerDevice({
            user: username,
            mail : mail,
            password : password,
            platform: platform,
            device : device
        });
    }

    public async login(req : Request, res : Response) : Promise<any> {

        // check parameters
        const user = req.body.user;
        const mail = req.body.mail;
        const password = req.body.password;
        const platform = req.body.platform;
        let device =  req.body.device;
        
        // check if correct credentials
        const LOGIN_SQL = "SELECT * FROM auth WHERE username=? AND password=?";
        const login = await this.db.get().all(
            LOGIN_SQL,
            user,
            password
        );
        
        if(login.length < 0) {
            return new Promise(r => r(INCORRECT_CREDENTIALS))
        }

        // if device send (check device) 
        const DEVICE_SQL = "SELECT * FROM auth_device WHERE device=?";
        const existingDevice = await this.db.get().all(
            DEVICE_SQL,
            device
        );

        if(existingDevice && existingDevice.length > 0) {
            return await this.updateDevice({
                user: user,
                mail : mail,
                password : password,
                device : device
            });
        }
        // else register device
        else {
            return await this.registerDevice({
                user: user,
                mail : mail,
                password : password,
                platform: platform,
                device : device
            });
        }

    }

    /**
     * Register a new device on users database
     * @param req the current request
     * @param res the current response 
     * @returns A promise that resolves whether or not the device was registered
     */
    public async registerDevice(properties : {
        device ?: string,
        user ?: string,
        mail ?: string,
        password ?: string,
        platform ?: string
    } = {}) : Promise<any>{

        if(!properties.user || !properties.device || !properties.password || !properties.mail){
            return MISSING_PARAMETERS;
        }

        const token = sign({
            username : properties.user,
            password : properties.password,
            mail     : properties.mail,
            device   : properties.device
        }, this.secret);

        const SQL = "INSERT INTO auth_device(auth, platform, token) VALUES (?,?,?)";
        const id = await this.db.get().run(
            SQL,
            properties.user,
            properties.platform || "NULL",
            token
        );
        
        return new Promise((resolve) => resolve({
            success : true,
            token : token,
            id: id.lastID
        }));
    }


    /**
    * Update a device token on users database
    * @param req the current request
    * @param res the current response 
    * @returns A promise that resolves whether or not the device was registered
    */
    public async updateDevice(properties : {
        device ?: string,
        user ?: string,
        mail ?: string,
        password ?: string,
        platform ?: string
    } = {}) : Promise<any>{

        if(!properties.user || !properties.device || !properties.password || !properties.mail){
            return MISSING_PARAMETERS;
        }

        const token = sign({
            username : properties.user,
            password : properties.password,
            mail     : properties.mail,
            device   : properties.device
        }, this.secret);
        
        const SQL = "UPDATE auth_device SET auth=?, platform=?, token=? WHERE device=?"
        await this.db.get().run(
            SQL,
            properties.user,
            properties.platform || "NULL",
            token
        );
        
        return new Promise((resolve) => resolve({
            success : true,
            token : token,
            id: properties.device
        }));
    }


}