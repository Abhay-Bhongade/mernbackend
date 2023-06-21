class HttpError extends Error {
    constructor (message,errorCode) {
        super(); //Add a "message" property
        this.message = message;
        this.code = errorCode; // Add a "code" property     
    }
}

module.exports = HttpError;