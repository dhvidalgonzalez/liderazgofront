import apiClient from "src/services/apiClient";

const listUsersService = async () => {
  return apiClient({
    method: "GET",
    url: "/user/",
  });
};

export default listUsersService;
