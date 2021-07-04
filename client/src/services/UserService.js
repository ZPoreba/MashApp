import axios from "axios";
import authHeader from "./AuthHeader";

const API_URL = process.env.REACT_APP_API_URL;

class UserService {

    setSubscribedRocket(id) {
        return axios.post(`${API_URL}api/state/rocket/subscribe/`, { id: id }, { headers: authHeader() });
    }

    deleteSubscribedRocket(id) {
        return axios.delete(`${API_URL}api/state/rocket/subscribe/${id}`, {headers: authHeader()});
    }

    editUserData(newData) {
        return axios.post(`${API_URL}api/auth/edit_user_data/`, newData, {headers: authHeader()});
    }
}

export default new UserService();
