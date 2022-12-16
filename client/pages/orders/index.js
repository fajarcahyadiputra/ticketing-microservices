import Link from "next/link"

const MyOrder = ({currentUser, orders})=> {

    const ticketLists = orders.map((order) => {
        return (
          <div className='col-md-4 mb-3' key={order.id}>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{order.ticket.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">${order.ticket.price}</h6>
                    <h6 className="card-subtitle mb-2 text-muted">Order Status: {order.status}</h6>
                    {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                    <Link className="btn btn-success btn-sm mr-3" href="/tickets/[ticketId]" as={`/tickets/${order.ticket.id}`}>Detail</Link>
                </div>
                </div>
            </div>
        )
      })

    return <div className='row'>
    {ticketLists}
    </div>
}

MyOrder.getInitialProps = async (context, client, currentUser)=> {
    const {data} = await (await client).get("/api/orders")
    return {orders: data};
}

export default MyOrder