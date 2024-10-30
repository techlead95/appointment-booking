import { API_KEY, WORKSPACE } from "@/constants";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `https://${WORKSPACE}.neetocal.com/api/external/v1`,
  headers: {
    "X-Api-Key": API_KEY,
  },
});

export default apiClient;
