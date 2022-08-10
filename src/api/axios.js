import axios from 'axios'

const apiURL = "http://localhost:3500"

export default axios.create({
    baseURL: apiURL,
    withCredentials: true
})