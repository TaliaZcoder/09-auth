import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

const baseURL = `${API_URL}/api`;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
console.log("BASE URL:", baseURL);