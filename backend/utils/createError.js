const createError = (message, status) => {
    const err = new Error(message || "Internal Server Error");
    err.status = status || 500;
    return err;
}

export default createError;