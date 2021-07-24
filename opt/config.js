
const NG_NODES = [
  "http://dhealth.tokyo:3000"
 ];
 
 const nodeList = [
   "http://dhealth.vistiel-arch.jp:3000",
   "http://dhealth.tokyo:3000",
   "http://dhealth.harvesting-sweet-potatoes.club:3000",
   "http://dhealth-lt.nuaka.net:3000",
   "http://kawaii-dhp-harvest.tokyo:3000",
   "http://dual-01.dhealth.jp:3000",
   "http://dual-01.dhealth.jp:3000",
   "http://marichi-featuring-essan.ml:3000",
 ].filter(word => !NG_NODES.includes(word));
 
 module.exports = nodeList;