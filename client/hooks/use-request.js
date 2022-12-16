import { useState } from "react";
import axios from 'axios';

export default ({url, method, body, config, onSuccess}) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async (props = {}) => {
        try {
            setErrors(null)
            const response = await axios[method.toLowerCase()](url, {...body, ...props}, config);
            if(onSuccess){
                onSuccess(response.data);
            }
            return response.data;
        } catch (error) {
            setErrors(
                <div className='alert alert-danger'>
                <h4>Opsss..</h4>
                <ul className='my-0'>
                  {error.response.data.errors.map((err, index) => {
                    return (
                        <li key={index}>{err.message}</li>
                    )
                  })}
                </ul>
            </div>
            )
        }
    }

    return {doRequest, errors}
}