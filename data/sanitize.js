module.exports = function(obj, key, testFunc) {
  if (obj.hasOwnProperty(key) && !testFunc(obj[key])) {
    delete obj[key];
    console.warn(`'${key}' key is dirty.`);
  }
}
