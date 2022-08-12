import axios from 'axios'

const apiURL = "http://localhost:3500"

export default axios.create({
    baseURL: apiURL
})

export const axiosPrivate = axios.create({
    baseURL: apiURL,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
})