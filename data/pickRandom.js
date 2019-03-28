/*
  input must be an array

  unweighted example:
  [ 24, "string", ()=>return 2, new Date(), 9.92 ]

  weighted example:
  [
    { value: 'word',         weight: 2.1 },
    { value: ()=>{return 2}, weight: 10 },
    { value: 3.1415926,      weight: 53.59 }
  ]
*/

module.exports = function(input){
  // input errors
  if (!input) throw new ArgumentError('Function requires one argument of type Array');
  if (!(input instanceof Array)) throw new TypeError('Function requires one argument of type Array');

  // validate / set weight mode
  const weighted = input.every(item => {
    var isObject = typeof item == "object";
    var hasProperties = item.hasOwnProperty('value') && item.hasOwnProperty('weight');
    return isObject && hasProperties;
  });

  // fix any bad data
  input.forEach(item => {
    if (typeof input.weight != "number") input.weight = 1;
    // round each weighting data to two decimal places
    input.weight = dec2(input.weight);
  })

  if (weighted){
    var selection = input.slice().map((item,index,arr)=>{
      if (index < 1) return item;
      else {
        item.weight += arr[index-1].weight;
        return item;
      }
    });
    var rand = randFloat(selection[selection.length-1].weight);
    for(var i=0; i<selection.length; i++){
      if (rand <= selection[i].weight) return selection[i].value;
    }
    throw new Error('Computation error: weighting not calibrated');
  } else { // unweighted
    var selection = input.slice();
    return selection[randIndex(selection.length)];
  }

  //helpers
  function dec2(num){
    return parseFloat(num.toFixed(2));
  }
  function randFloat(max){
    return dec2(Math.random()*max);
  }
  function randIndex(max){
    return Math.floor(Math.random()*max);
  }
}
