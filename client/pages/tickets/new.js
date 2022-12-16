import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const NewTicket = () => {

    const [title, setTitle] = useState("")
    const [price, setPrice] = useState("")
    const {doRequest, errors} = useRequest({
        url: "/api/tickets",
        method: "POST",
        body: {
            title, price
        },
        config: {
            withCredentials:true
        },
        onSuccess: (data) =>console.log(data)
    })

    const onBlur = () => {
        const value = parseFloat(price);
        if(isNaN(value)){
            return;
        }
        console.log(price);
        setPrice(value.toFixed(2));
    }

    const onSubmit =  async (e)=> {
        e.preventDefault();
        await doRequest()
    }

    return (
      <div className="card w-50">
       <div className="card-header"> <h1>Create A Ticket</h1></div>
       {errors}
       <div className="card-body">
       <form onSubmit={onSubmit} method="POST">
            <div className="form-group">
                <label>Title</label>
                <input onChange={(e) => setTitle(e.target.value)} className="form-control" name="title" id="title"/>
            </div>
            <div className="form-group">
                <label>Price</label>
                <input value={price} onBlur={onBlur} onChange={(e) => setPrice(e.target.value)} className="form-control" name="price" id="price"/>
            </div>
            <button type="submit" className="btn btn-success mt-3">Save</button>
        </form>
       </div>
      </div>
    )
}

export default NewTicket;