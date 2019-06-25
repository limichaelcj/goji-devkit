// obj = an object of user options to be cleaned
// allowed = an array of object keys that will be permitted in the given obj

module.exports = function(obj, allowed){
  // create new object instance so original is not overwritten
  const newObj = JSON.parse(JSON.stringify(obj));
  // check every key
  for(let key in newObj) {
    if (!allowed.includes(key)) delete newObj[key];
  }
  // return cleaned object
  return newObj;
}
