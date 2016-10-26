interface ResponseData {
    message: string;
    data: any;
}

var ServerConst = {
    "URL": "http://localhost:8080",
    "PERMISSION_AUTHORIZED": "PERMISSION_AUTHORIZED",

    "PERMISSION_OUTOFTIME": "PERMISSION_OUTOFTIME",
    "PERMISSION_INVALIDTOKEN": "PERMISSION_INVALIDTOKEN",
    "PERMISSION_EMPTYACCOUNT": "PERMISSION_EMPTYACCOUNT",
    "PERMISSION_DENIED": "PERMISSION_DENIED",

    "INVALID_NAME": "INVALID_NAME",
    "INVALID_PASSWORD": "INVALID_PASSWORD",
    "LOGIN_TOOCLOSE": "LOGIN_TOOCLOSE",
    "ALREADY_EXIST": "ALREADY_EXIST",
    "LOGIN_DENIED": "LOGIN_DENIED",
    "INVALID_PARAM": "INVALID_PARAM",
    "SERVER_ERROR": "SERVER_ERROR",
    "SUCCESS": "SUCCESS"
}

var ServerMessage = {
    "PERMISSION_OUTOFTIME": "Token is expired",
    "PERMISSION_INVALIDTOKEN": "Token is invalid",
    "PERMISSION_EMPTYACCOUNT": "Cannot find account",
    "PERMISSION_DENIED": "Permission denied",

    "INVALID_NAME": "Cannot find resource",
    "INVALID_PASSWORD": "Password is not correct",
    "LOGIN_TOOCLOSE": "Cannot login twice in one minute",
    "ALREADY_EXIST": "Resource already exist",
    "LOGIN_DENIED": "Your account is disabled",
    "INVALID_PARAM": "Paramater is invalid",
    "SERVER_ERROR": "Server error",
    "SUCCESS": "Success",

    "EMPTY_USERNAME": "Username cannot be empty",
    "EMPTY_PASSWORD": "Password cannot be empty"
}

export { ResponseData, ServerConst, ServerMessage };