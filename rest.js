var request = require('request')
	, config = require('./conf.json');

exports.getOperationRequest = function (uri, operation) {
	var uri_base = uri;
	if (uri_base.lastIndexOf('/') !== uri_base.length - 1) {
		uri_base += "/";
	}
	
	var headers_dict;
	var	auth = 'Basic ' + new Buffer(config.NEO_ID+':'+config.NEO_PW).toString('base64');
	
	headers_dict = {
		'Accept' : 'application/json; charset=UTF-8',
		'Authorization': auth,
		'Content-type' : 'application/json'
	};
	
	return {
		uri: uri_base + operation,
		headers: headers_dict
	};
};

/** 
 * getOperationRequestForQuery
 * @creator Jaehee Ha
 * lovesm135@kaist.ac.kr
 * created
 * 2016.11.16
 * 
 */
exports.getOperationRequestForQuery = function (uri, operation) {
	var uri_base = uri;

	var headers_dict;
	var	auth = 'Basic ' + new Buffer(config.NEO_ID+':'+config.NEO_PW).toString('base64');
	
	headers_dict = {
		'Accept' : 'application/json; charset=UTF-8',
		'Authorization': auth,
		'Content-type' : 'application/json'
	};
	
	return {
		uri: uri_base + operation,
		headers: headers_dict
	};
};

exports.postOperation = function (uri, operation, args, callback) {
	if (operation === null) {
		return callback("invalid input to executeOperation");
	}

	var operationReq = exports.getOperationRequest(uri, operation);
	operationReq.body = args;
	//console.log(operationReq);
	
	request.post(operationReq, function (error, res, body){
		if (error) {
			return callback(error);
		}
		if (res.statusCode === 200) {
			try {
				//console.log(body);
				var operationResponse = JSON.parse(body);
				if(operationResponse.error) {
					return callback(operationResponse.error);
				}
				return callback(null, operationResponse);
			} catch (e) {
				return callback("invalid JSON returned for " + operation);
			}
		} else if (res.statusCode >= 401 && res.statusCode <= 403) {
			console.log(body);
			return callback(null, null);
		} else {
			console.log(body);
			return callback("authentication failed, status code from rest api was " + res.statusCode, body);
		}
	});	
};

/** 
 * getOperationResNoJSON
 * @creator Jaehee Ha
 * lovesm135@kaist.ac.kr
 * created
 * 2016.11.04
 * 
 */
exports.getOperationResNoJSON = function (uri, operation, args, callback) {
	if (operation === null) {
		return callback("invalid input to executeOperation");
	}

	var operationReq = exports.getOperationRequestForQuery(uri, operation);
	
	if(args){
		operationReq.body = args;
	}
	
	request.get(operationReq, function (error, res, body){
		if (error) {
			return callback(error);
		}
		if (res.statusCode === 200) {
			var operationResponse = Object();
			//console.log(body);
			operationResponse.body = body.replace(/\n/g, "<n>").replace(/\r/g, "<r>").replace(/\t/g, "<t>").replace(/\"/g,"<q>");
			return callback(null, operationResponse);
			
		} else if (res.statusCode >= 401 && res.statusCode <= 403) {
			return callback(null, null);
		} else {
			return callback("authentication failed, status code from rest api was " + res.statusCode);
		}
	});
	
	
};

exports.getOperation = function (uri, operation, args, callback) {
	if (operation === null) {
		return callback("invalid input to executeOperation");
	}

	var operationReq = exports.getOperationRequest(uri, operation);
	if(args){
		operationReq.body = args;
	}
	//console.log(operationReq);
	
	request.get(operationReq, function (error, res, body){
		if (error) {
			return callback(error);
		}
		if (res.statusCode === 200) {
			try {
				//console.log(body);
				console.log(JSON.stringify(body));
				var operationResponse = JSON.parse(body);
				if(operationResponse.error){
					return callback(operationResponse.error);
				}
				return callback(null, operationResponse);
			} catch (e) {
				return callback("invalid JSON returned for " + operation);
			}
		} else if (res.statusCode >= 401 && res.statusCode <= 403) {
			return callback(null, null);
		} else {
			return callback("authentication failed, status code from rest api was " + res.statusCode);
		}
	});
	
	
};

/** 
 * @creator Jaehee Ha
 * lovesm135@kaist.ac.kr
 * created
 * 2016.11.04
 * 
 */
exports.delOperation = function (uri, operation, args, callback) {
	if (operation === null) {
		return callback("invalid input to executeOperation");
	}

	var operationReq = exports.getOperationRequest(uri, operation);
	if(args){
		operationReq.body = args;
	}
	//console.log(operationReq);
	
	request.del(operationReq, function (error, res, body){
		if (error) {
			return callback(error);
		}
		if (res.statusCode === 200) {
			try {
				//console.log(body);
				var operationResponse = JSON.parse(body);
				if(operationResponse.error){
					return callback(operationResponse.error);
				}
				return callback(null, operationResponse);
			} catch (e) {
				return callback("invalid JSON returned for " + operation);
			}
		} else if (res.statusCode >= 401 && res.statusCode <= 403) {
			return callback(null, null);
		} else {
			return callback("authentication failed, status code from rest api was " + res.statusCode);
		}
	});
	
	
};

