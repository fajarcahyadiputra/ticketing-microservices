import { OrderStatus } from "@fajartickets/common";
import mongoose, { mongo } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
mongoose.set('strictQuery', false);

interface OrderAttribute {
    id: string;
    version: number;
    userId: string;
    price: number;
    status: OrderStatus
}

interface OrderDoc extends mongoose.Document {
    version: number;
    userId: string;
    price: number;
    status: OrderStatus
}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs: OrderAttribute): OrderDoc;
}

const orderShema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
},{
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

orderShema.set("versionKey", "version");
orderShema.plugin(updateIfCurrentPlugin)


orderShema.statics.build = (attrs: OrderAttribute) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        userId: attrs.userId,
        price: attrs.price,
        status: attrs.status
    })
}

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderShema);

export {Order}