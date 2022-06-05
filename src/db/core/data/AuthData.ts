import { Database } from "sqlite";
import { MISSING_PARAMETERS, SOMETHING_WENT_WRONG } from "../config/Responses";
import { ILoginParams } from "../interface/ILoginParams";
import { signJWT } from "../security/Jwt";

export default class AuthData {

    public static async login(params : ILoginParams, db : Database) : Promise<boolean> {
        const LOGIN_SQL = "SELECT * FROM auth WHERE username=? AND password=?";
        const result = await db.all(
            LOGIN_SQL,
            params.user,
            params.password
        );

        return new Promise((r) => r(result.length > 0));
    }


    public static async register(params : ILoginParams, db : Database, secret : string) {
        const SQL = "INSERT INTO auth(username, password, email) VALUES (?,?,?)";
        const status = await db.run(
            SQL,
            params.user,
            params.password,
            params.mail
        );

        if(status.changes != 1){
            return SOMETHING_WENT_WRONG;
        }

        return await AuthData.registerDevice(params,db,secret);
    }


    /**
     * Register a new device on users database
     * @param req the current request
     * @param res the current response 
     * @returns A promise that resolves whether or not the device was registered
     */
     public static async registerDevice(properties : ILoginParams, db : Database ,secret : string) : Promise<any>{

        if(!properties || !properties.user || !properties.address || !properties.password || !properties.mail){
            return MISSING_PARAMETERS;
        }

        const token = signJWT({
            username : properties.user,
            password : properties.password,
            mail     : properties.mail,
            device   : properties.address
        }, secret);

        const SQL = "INSERT INTO auth_device(auth, platform, address, token) VALUES (?,?,?,?)";
        const id = await db.run(
            SQL,
            properties.user,
            properties.platform || "NULL",
            properties.address,
            token
        );
        
        return new Promise((resolve) => resolve({
            success : true,
            code: 200,
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
    public static async updateDeviceByAddress(properties : {
        address ?: string,
        user ?: string,
        mail ?: string,
        password ?: string,
        platform ?: string
    } = {}, db : Database ,secret : string) : Promise<any>{

        if(!properties.user || !properties.address || !properties.password || !properties.mail){
            return MISSING_PARAMETERS;
        }

        const token = signJWT({
            username : properties.user,
            password : properties.password,
            mail     : properties.mail,
            device   : properties.address
        }, secret);
        
        const SQL = "UPDATE auth_device SET auth=?, platform=?, token=? WHERE address=?"
        const id = await db.run(
            SQL,
            properties.user,
            properties.platform || "NULL",
            token,
            properties.address 
        );
        
        return new Promise((resolve) => resolve({
            success : true,
            code: 200,
            token : token,
            address: id.lastID
        }));
    }


    public static async deviceExists(auth : string,address : string, platform : string, db : Database) : Promise<boolean> {
        const DEVICE_SQL = "SELECT * FROM auth_device WHERE auth=? AND platform=? AND address=?";
        const devices = await db.all(
            DEVICE_SQL,
            auth,
            platform,
            address
        );

        return devices && devices.length > 0; 
    }
    
}