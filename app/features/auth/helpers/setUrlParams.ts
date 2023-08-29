// https://stackoverflow.com/questions/7171099/how-to-replace-url-parameter-with-javascript-jquery
export function setUrlParam(url: string, paramName: string, paramValue?: string | null) {
	if (paramValue == null) {
		paramValue = '';
	}

	const pattern = new RegExp(`\\b(${paramName}=).*?(&|#|$)`);

	if (url.search(pattern) >= 0) {
		return url.replace(pattern, `$1${paramValue}$2`);
	}

	url = url.replace(/[?#]$/, '');

	return `${url}${url.indexOf('?') > 0 ? '&' : '?'}${paramName}=${paramValue}`;
}

export function setUrlParams(url: string, params: Record<string, string | undefined | null>) {
	return Object.keys(params).reduce(
		(resultUrl, paramName) => setUrlParam(resultUrl, paramName, params[paramName]),
		url,
	);
}
