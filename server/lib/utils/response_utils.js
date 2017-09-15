'use strict';

class responseUtilities {

  static sendError(res, err) {
    res.status(500).send(JSON.stringify(err));
  }

  static sendJSONArray(res, array) {
    res.status(200).json(array);
  }

  static sendBadRequest(res, msg = "malformed request") {
    res.status(400).send(JSON.stringify(msg));
  }

  static sendJSONObject(res, obj) {
    res.status(200).json(obj);
  }

  static sendNotFound(res) {
    res.status(404).send();
  }

  static sendUnauthorized(res) {
    res.status(401).send();
  }

  static sendForbidden(res) {
    res.status(403).send();
  }

  static sendSuccess(res, msg = "success") {
    res.status(200).send(JSON.stringify(msg));
  }
}

module.exports = responseUtilities;
