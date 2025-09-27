const createTitleFromStatus = (statusCode) => {
  const statusTitles = {
    200: "Success",
    201: "Created Successfully",
    204: "Request Successful",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Access Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
    503: "Service Unavailable",
  };

  if (statusTitles[statusCode]) {
    return statusTitles[statusCode];
  }

  if (statusCode >= 200 && statusCode < 300) {
    return "Success";
  }
  if (statusCode >= 400 && statusCode < 500) {
    return "Client Error";
  }
  if (statusCode >= 500 && statusCode < 600) {
    return "Server Error";
  }

  return "An Unexpected Issue Occurred";
};

export default createTitleFromStatus;