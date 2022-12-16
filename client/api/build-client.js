import axios from 'axios';

export default async ({req}) => {
    if(typeof  window === "undefined"){
        //in server
        return axios.create({
            baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
            timeout: "6000",
            headers: req.headers
        })
      }else{
       //in browser
        return axios.create({
            baseURL: "/"
        })
      }
}