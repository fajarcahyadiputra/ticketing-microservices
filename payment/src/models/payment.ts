import mongoose from "mongoose";

interface PaymentAttribute {
    orderId: string;
    stripeId: string;
}

interface PaymentDoc extends mongoose.Document {
    orderId: string;
    stripeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc>{
    build(attrs: PaymentAttribute):PaymentDoc
}

const paymentShema = new mongoose.Schema({
    stripeId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    }
},{
    toJSON: {
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

paymentShema.statics.build = (attrs: PaymentAttribute)=>{
    return new Payment(attrs);
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>("Payment", paymentShema);

export {Payment}