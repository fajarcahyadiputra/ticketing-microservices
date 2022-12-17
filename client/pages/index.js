import Link from "next/link"

const LandingPage = ({currentUser, tickets}) => {
  const ticketLists = tickets.map((ticket) => {
    return (
      <div className='col-md-4' key={ticket.id}>
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{ticket.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">${ticket.price}</h6>
                {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                <Link className="btn btn-success btn-sm mr-3" href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>Detail</Link>
            </div>
            </div>
        </div>
    )
  })
    return (
      <div className='row'>
        {ticketLists}
        </div>
    )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
 const {data} = await (await client).get("/api/tickets");
  return {tickets: data};
}

export default LandingPage;