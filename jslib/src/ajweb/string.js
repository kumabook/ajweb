dojo.provide("ajweb.string");

ajweb.string = {};

ajweb.string.direct = function(param){
  return param.value;
};

ajweb.string.concat = function(param){
  return param.first + param.second;
};

