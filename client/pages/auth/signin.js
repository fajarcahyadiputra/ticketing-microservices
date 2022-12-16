import {useState} from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {doRequest, errors} = useRequest({
        url: "/api/users/signin",
        method: "POST",
        body: {
            email, password
        },
        config: {
            withCredentials:true
        },
        onSuccess: () => Router.push("/")
    })

    const onSUbmit = async (e) => {
        e.preventDefault();
        await doRequest();
    }

    return (
        <form onSubmit={onSUbmit} method="post">
            <h1>Sign in Page</h1>
            {errors}
            <div className="form-group">
                <label>Email Address</label>
                <input onChange={(e) => setEmail(e.target.value)} type="text" className="form-control" name="email"/>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" name="password"/>
            </div>
            <button className='btn btn-primary' type='submit'>Sign in</button>
        </form>
    )
}