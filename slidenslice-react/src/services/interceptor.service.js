import axios from "axios"
import { toast } from "react-toastify";


const api = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    headers:{
        "Content-Type":"application/json"
    }
})

api.interceptors.request.use((config)=>{
    if(config.skipAuth){
        delete config.skipAuth;
        return config;
    }
    const token = sessionStorage.getItem("token");
       if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    return config
})

api.interceptors.response.use((res)=>{
    console.log(res)
    if(res.data.message){
        toast.success(res?.data?.message || "Successfully")

    }
        return res

},(error)=>{
    console.log(error)
    toast.error(error?.response?.data?.message || "Something went wrong")
            return Promise.reject(error);

})

export default api;