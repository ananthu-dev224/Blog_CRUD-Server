const ResponseEnum = Object.freeze({
  ERROR: {
    INTERNAL_SERVER_ERROR: {
      message: "An unexpected error occurred",
      status: "error",
      statusCode: 500,
    },
    USER_NOT_FOUND: {
      message: "User does not exist",
      status: "error",
      statusCode: 404,
    },
    USER_EXISTS: {
      message: "User already exists",
      status: "error",
      statusCode: 400,
    },
    BLOG_NOT_FOUND: {
      message: "Blog not found",
      status: "error",
      statusCode: 404,
    },
    INVALID_PASSWORD: {
      message: "Invalid Password",
      status: "error",
      statusCode: 400,
    },
    INVALID_AUTHORIZATION: {
      message: "You are not authorized to make changes to this blog",
      status: "error",
      statusCode: 403,
    },
  },
  SUCCESS: {
    LOGIN_SUCCESS: {
      message: "Login successful",
      status: "success",
      statusCode: 200,
    },
    REGISTER_SUCCESS: {
      message: "User registered successfully",
      status: "success",
      statusCode: 200,
    },
    BLOG_CREATED: {
      message: "Blog created successfully",
      status: "success",
      statusCode: 201,
    },
    BLOG_UPDATED: {
      message: "Blog updated successfully",
      status: "success",
      statusCode: 200,
    },
    BLOG_DELETED: {
      message: "Blog deleted successfully",
      status: "success",
      statusCode: 200,
    },
    BLOGS: {
      status: "success",
      statusCode: 200,
    },
  },
});

module.exports = ResponseEnum;
