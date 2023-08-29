import axios, {AxiosResponse} from 'axios';
import qs from 'qs';

const instance = axios.create({
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
  },
  timeout: 60000,
  withCredentials: true,
  validateStatus: () => true,
  // ...config,
});

instance.interceptors.request.use(config => {
  if (!config.headers.Accept) config.headers.Accept = 'application/json';
  config.headers.Host = extractHostname(config.url!);
  config.maxRedirects = !(config.headers?.followRedirect === false) ? 5000 : 0;
  return config;
});

export class Req {
  static get(
    url: string,
    params: any,
    headers: any,
    body: 'all',
  ): Promise<AxiosResponse<any>>;
  static get(
    url: string,
    params?: any,
    headers?: any,
    body?: 'json' | 'text' | 'arraybuffer' | 'blob' | 'document' | 'stream',
  ): Promise<any>;
  static async get(
    url: string,
    params: any = {},
    headers: any = {},
    body:
      | 'all'
      | 'json'
      | 'text'
      | 'arraybuffer'
      | 'blob'
      | 'document'
      | 'stream' = 'json',
  ): Promise<any> {
    const resp = await instance.get(url, {
      params,
      paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'}),
      responseType: body != 'all' ? body : undefined,
      headers,
    });
    return body == 'all' ? resp : resp.data;
  }

  static post(
    url: string,
    params: any,
    headers: any,
    contentType: 'json' | 'form' | 'multipart/form-data',
    body: 'all',
  ): Promise<AxiosResponse<any>>;
  static post(
    url: string,
    params?: any,
    headers?: any,
    contentType?: 'json' | 'form' | 'multipart/form-data',
    body?: 'json' | 'text' | 'arraybuffer' | 'blob' | 'document' | 'stream',
  ): Promise<any>;
  static async post(
    url: string,
    params: any = {},
    headers: any = {},
    contentType: 'json' | 'form' | 'multipart/form-data' = 'json',
    body:
      | 'all'
      | 'json'
      | 'text'
      | 'arraybuffer'
      | 'blob'
      | 'document'
      | 'stream' = 'json',
  ) {
    const resp = await instance(url, {
      method: headers['method'] || 'POST',
      data:
        contentType === 'form'
          ? qs.stringify(params)
          : contentType === 'json'
          ? JSON.stringify(params)
          : params,
      responseType: body != 'all' ? body : undefined,
      headers: {
        'Content-Type':
          contentType === 'form'
            ? 'application/x-www-form-urlencoded'
            : 'application/json',
        ...headers,
      },
    });
    return body == 'all' ? resp : resp.data;
  }
}

export function extractHostname(url: string) {
  let hostname;

  if (url.indexOf('//') > -1) hostname = url.split('/')[2];
  else hostname = url.split('/')[0];

  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];

  return hostname;
}
