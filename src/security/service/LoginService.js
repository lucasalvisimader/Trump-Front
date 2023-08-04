import axios from "axios";

const url = "http://localhost:8081/user/login";

export const LoginService = {
    listLogin : async (user) => {
        try {
            const response = await axios.post(url, user);
            return response;
        } catch (error) {
            console.error(error);
        }
    }
}