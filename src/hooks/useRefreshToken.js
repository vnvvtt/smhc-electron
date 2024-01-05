import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get("/refresh", {
            withCredentials: true,
        });

        setAuth((prev) => {
            return {
                ...prev,
                email: response.data.email,
                id: response.data.id,
                name: response.data.name,
                age: response.data.age,
                title: response.data.title,
                roles: response.data.roles,
                salutation: response.data.salutation,
                roleid: response.data.roleid,
                orgid: response.data.orgid,
                specialization: response.data.specialization,
                branchid: response.data.branchid,
                accessToken: response.data.accessToken,
            };
        });
        return response.data.accessToken;
    };
    return refresh;
};

export default useRefreshToken;
