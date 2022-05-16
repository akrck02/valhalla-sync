import { sign } from "jsonwebtoken";
import Device from "../../core/device";
import { LoginParams } from "../../core/login";
import { MISSING_PARAMETERS, SOMETHING_WENT_WRONG } from "../../core/responses";
import { AuthDb } from "../authDb";

export default class AuthModel {


    public static async login(params : LoginParams, db : AuthDb) : Promise<boolean> {
        const LOGIN_SQL = "SELECT * FROM auth WHERE username=? AND password=?";
        const result = await db.get().all(
            LOGIN_SQL,
            params.user,
            params.password
        );

        return new Promise((r) => r(new result.length > 0));
    }


    public static async register(params : LoginParams, db : AuthDb, secret : string) {
        const SQL = "INSERT INTO auth(username, password, email) VALUES (?,?,?)";
        const status = await db.get().run(
            SQL,
            params.user,
            params.password,
            params.mail
        );

        if(status.changes != 1){
            return SOMETHING_WENT_WRONG;
        }

        return await AuthModel.registerDevice(params,db,secret);
    }


    /**
     * Register a new device on users database
     * @param req the current request
     * @param res the current response 
     * @returns A promise that resolves whether or not the device was registered
     */
     public static async registerDevice(properties : LoginParams = {}, db : AuthDb ,secret : string) : Promise<any>{

        if(!properties.user || !properties.device || !properties.password || !properties.mail){
            return MISSING_PARAMETERS;
        }

        const token = sign({
            username : properties.user,
            password : properties.password,
            mail     : properties.mail,
            device   : properties.device
        }, secret);

        const SQL = "INSERT INTO auth_device(auth, platform, token) VALUES (?,?,?)";
        const id = await db.get().run(
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
    public static async updateDevice(properties : {
        device ?: string,
        user ?: string,
        mail ?: string,
        password ?: string,
        platform ?: string
    } = {}, db : AuthDb ,secret : string) : Promise<any>{

        if(!properties.user || !properties.device || !properties.password || !properties.mail){
            return MISSING_PARAMETERS;
        }

        const token = sign({
            username : properties.user,
            password : properties.password,
            mail     : properties.mail,
            device   : properties.device
        }, secret);
        
        const SQL = "UPDATE auth_device SET auth=?, platform=?, token=? WHERE device=?"
        await db.get().run(
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


    public static async deviceExists(device : string, db : AuthDb) : Promise<boolean> {
        const DEVICE_SQL = "SELECT * FROM auth_device WHERE device=?";
        const devices = await db.get().all(
            DEVICE_SQL,
            device
        );

        return devices || devices.length > 0; 
    }
    



}