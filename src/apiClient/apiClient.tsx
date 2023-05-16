import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://matrix.varun.circles-dev.net/_matrix/client/v3",
    withCredentials: true,
});

export default apiClient;