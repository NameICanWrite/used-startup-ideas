export function handleResponse(response) {
	let result
	if (response.results) {
		result = response.results;
	} else if (response.data) {
		result = response.data;
	} else result = response;
	if (response.message) result.message = response.message
	return result
}

export function handleError(error) {
	console.log(error.response?.data || error.message)
	throw new Error(error.response?.data || error.message)
}