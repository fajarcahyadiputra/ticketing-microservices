import mongoose from "mongoose";
import {Password} from '../services/password';

interface UserAttrs {
    email: string,
    password: string
}
//An interface that describes the properties
//that an user model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}
//An interface that desribes the properties
//that aan user document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    // createdAt: string;
    // updatedAt: string;
}

let encryptDepcrypt = new Password();

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
},{
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
})

userSchema.pre("save", async function(done){
    if(this.isModified("password")){
        const hashed = await encryptDepcrypt.toHash(this.get("password"));
        this.set("password", hashed);
    }
    done();
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export {User}