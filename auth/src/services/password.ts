import {randomBytes, scrypt} from 'crypto';
import {promisify} from 'util'

let scryptAsync = promisify(scrypt);

export class Password {
    constructor(){
        Object.setPrototypeOf(this, Password.prototype)
    }
     async toHash(password: string){
        let salt = randomBytes(8).toString("hex");
        let buf  = (await scryptAsync(password, salt, 64)) as Buffer;
        return `${buf.toString('hex')}.${salt}`
    }
     async compare(storedPassword: string, suppliedPassword: string){
        let [hashedPassword, salt] = storedPassword.split(".");
        let buff = (await scryptAsync(suppliedPassword, salt ,64)) as Buffer;

        return buff.toString('hex') === hashedPassword;
    }
}
