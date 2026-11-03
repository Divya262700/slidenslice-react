import api from "./interceptor.service"

export const loginService = (data) =>{
    return api.post('/auth/login',data)
}
export const authCheckService = () =>{
    return api.get('/auth/me')
}