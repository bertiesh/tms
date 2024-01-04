import Cookies from 'js-cookie'
const TokenKey = 'tms-token'
var inFifteenMinutes = new Date(new Date().getTime() + 120 * 60 * 1000);
export function getToken(value) {
    if (value) {
        return Cookies.get(value)
    }else{
        return Cookies.get(TokenKey)
}
    }
    

export function setToken(token) {
    return Cookies.set(TokenKey, token, { expires: inFifteenMinutes })
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}