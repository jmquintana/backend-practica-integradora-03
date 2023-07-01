/**
 * @desc    This file contain Success and Error response for sending to client / user
 * @author  Huda Prasetyo
 * @since   2020
 */

/**
 * @desc    Send any success response
 *
 * @param   {string} message
 * @param   {object | array} payload
 * @param   {number} statusCode
 */

export function success(message = "", payload, statusCode) {
	return {
		status: "Success",
		message,
		error: false,
		code: statusCode,
		payload,
	};
}

/**
 * @desc    Send any error response
 *
 * @param   {string} message
 * @param   {number} statusCode
 */

export function error(message, statusCode) {
	/**
	 * List of common HTTP request code
	 * @note  You can add more http request code in here
	 */
	const codes = [200, 201, 400, 401, 404, 403, 422, 500];

	// Get matched code
	const findCode = codes.find((code) => code == statusCode);

	if (!findCode) statusCode = 500;
	else statusCode = findCode;

	return {
		status: "Error",
		message,
		code: statusCode,
		error: true,
	};
}

/**
 * @desc    Send any validation response
 *
 * @param   {object | array} errors
 */

export function validation(errors) {
	return {
		status: "Error",
		message: "Validation errors",
		error: true,
		code: 422,
		errors,
	};
}
