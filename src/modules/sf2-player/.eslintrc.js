module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": "tidal",
  "rules": {
    "valid-jsdoc": ["error", {
      "requireReturnDescription": false,
      "requireParamDescription": false
    }]
  }
};
