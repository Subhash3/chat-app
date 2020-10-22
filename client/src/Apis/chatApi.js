import axios from 'axios'

const URL = "http://localhost:3000/chat-app"
export const chatAPI = axios.create({
    baseURL: URL
})