/**
 * Consistent success envelope: { success, message, data, meta }.
 * `meta` is used for pagination info (page, limit, total) — omitted when not relevant.
 */
class ApiResponse {
  constructor(statusCode, data, message = 'Success', meta = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }

  send(res) {
    return res.status(this.statusCode).json(this);
  }
}

module.exports = ApiResponse;
