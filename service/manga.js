import axios from 'axios';
import { apiConfig } from '../config/config';

export default axios.create({
	baseURL: apiConfig.baseUrl
})
