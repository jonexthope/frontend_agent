export class FeatureUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = "FeatureUnavailableError";
  }
}

export class ApiError extends Error {
  constructor(message, status, options = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = options.code;
    this.details = options.details;
  }
}

export class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = "NetworkError";
  }
}
