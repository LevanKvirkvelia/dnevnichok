import axios, { AxiosRequestConfig } from 'axios';
import { RequestCommon, extractHostname } from './RequestCommon';

export class Request extends RequestCommon {
	async initCookies() {}

	async createInstance(config?: AxiosRequestConfig) {
		this.instance = axios.create({
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
			},
			timeout: 60000,
			withCredentials: true,
			validateStatus: () => true,
			...config,
		});
		this.instance.interceptors.request.use(config => {
			if (!config.headers.Accept) config.headers.Accept = 'application/json';
			config.headers.Host = extractHostname(config.url);
			config.maxRedirects = !(config.headers?.followRedirect === false) ? 5000 : 0;
			return config;
		});
	}
}
