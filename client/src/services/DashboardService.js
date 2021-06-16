import axios from "axios";
import authHeader from "./AuthHeader";

const API_URL = process.env.REACT_APP_API_URL;

class DashboardService {

    getDashboardData() {
        return axios.get(`${API_URL}api/state/dashboard/`, { headers: authHeader() });
    }
}

export default new DashboardService();