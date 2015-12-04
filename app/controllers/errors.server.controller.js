'use strict';

/**
 * Get unique error field name
 */
var getUniqueErrorMessage = function(err) {
	var output;

	try {
		var fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
		output = 'มีผู้ใช้ '+ fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' นี้อยู่แล้วในระบบค่ะ';

	} catch (ex) {
		output = 'มีผู้ใช้นี้อยู่แล้วในระบบค่ะ';
	}

	return output;
};

/**
 * Get the error message from error object
 */
exports.getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = getUniqueErrorMessage(err);
				break;
			default:
				message = 'มีบางอย่างผิดพลาดกรุณาลองใหม่ค่ะ';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};