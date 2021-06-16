import axios from "axios";
import authHeader from "./AuthHeader";
const API_URL = process.env.REACT_APP_API_URL;

class AuthService {
    login(username, password) {
        return axios
            .post(`${API_URL}api/auth/login/`, { username: username, password: password })
            .then((response) => {
                if (response.data.token) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    oauth_login(code, provider) {
        return axios
            .post(`${API_URL}api/auth/oauth/login/${provider}/`, code)
            .then((response) => {
                if (response.data.token) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(username, email, password) {
        return axios.post(`${API_URL}api/auth/register/`, { username: username, password: password, email: email });
    }

    generate_code(email) {
        return axios.post(`${API_URL}api/auth/reset_code/`, email);
    }

    confirm_code(code) {
        return axios.put(`${API_URL}api/auth/reset_code/`, code);
    }

    reset_password(password) {
        return axios.post(`${API_URL}api/auth/reset_password/`, password);
    }

    change_password(password) {
        return axios.post(`${API_URL}api/auth/change_password/`, password, { headers: authHeader() });
    }
}

export default new AuthService();
