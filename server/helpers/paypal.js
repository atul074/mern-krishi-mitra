const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AaDD2atOGsm2xKfuk36t4BQl4BU55iOfPrSiczAev-xUrbx7QvdFxPDrNtVj7QFTrP4jIBcnBmfDpvl_",
  client_secret: "EHhFNYYx540WYUUN77HVtsdRqakj9vwVjjdfBxsz37_2Co3YuXt-SvdyP_pn1t2-BWyuC-TVKzKjSwWn",
});
module.exports = paypal;