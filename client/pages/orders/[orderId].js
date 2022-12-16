
import Router  from "next/router";
import { useState, useEffect } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";

const ShowOrderList = ({order, currentUser}) => {

    const [timeLeft, setTimeLeft] = useState("")
    const {doRequest, errors} = useRequest({
        method: "post",
        url: "/api/payment",
        config: {
            withCredentials:true
        },
        body: {
            orderId: order.id
        },
        onSuccess: (payment) => Router.push("/orders")
    })

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000))
        }
        findTimeLeft();
       const timerId = setInterval(()=>{
            findTimeLeft()
        },1000)

        return () => {
            clearInterval(timerId)
        }
    },[order])

    const paymentAction = (token) => {

    }


    return (
        <div>

           <p>{timeLeft > 0 ? <p>Time left to pay: {timeLeft} Seconds until expires</p>: order.status=="complete"?"Complete":"Order Expires"} </p>
           {order.status=="created" && order.status === "awaiting:payment" &&  <StripeCheckout token={({id}) => doRequest({token:id})} 
           stripeKey="pk_test_51MEvTdFXe7sbZaR1Vh9UKPG4ykr0tU0Op57k2UGerK1x3lVy2GXQkQcYQPvDwqVEieV4LN5s6u7y4r0sqYNrCAg400TAGnWWOz"
           amount={order.ticket.price * 100}
           email={currentUser.email}
           />}

           {errors}
        </div>
    )
}

ShowOrderList.getInitialProps = async (context, client, currentUser) => {
    const {orderId} = context.query;
    const {data} = await (await client).get("/api/orders/"+ orderId);

    return {order: data};
}

export default ShowOrderList;