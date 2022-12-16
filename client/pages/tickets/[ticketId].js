import Link from 'next/link'
import useRequest from '../../hooks/use-request'
import Router  from 'next/router'
const ShowTicket = ({ticket})=> {

    const {doRequest, errors} = useRequest({
        method: "POST",
        url: "/api/orders",
        body: {
            ticketId: ticket.id
        },
        config: {
            withCredentials:true
        },
        onSuccess: (order) => Router.push("/orders/[orderId]", `/orders/${order.id}`)
    })

    return (
       <div>
        {errors}
            <div className='row'>
                <div className='col-md-4'>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">{ticket.title}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">${ticket.price}</h6>
                        {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                        <button onClick={() => doRequest()} className="btn btn-success btn-sm mr-3">Purchase</button>
                        {
                            ticket.orderId && <Link href="/orders/[orderId]" as={`/orders/${ticket.orderId}`} className="btn btn-info btn-sm mr-3">Detail Order</Link>
                        }
                       
                        <Link className="btn btn-warning btn-sm" href="/">Back</Link>
                    </div>
                    </div>
                </div>
                
            </div>
       </div>
    )
}

ShowTicket.getInitialProps = async (context, client, currentuser) =>{
    const {ticketId} = context.query;
    const {data} = await (await client).get(`/api/tickets/${ticketId}`);
    return {ticket:data}
}

export default ShowTicket;