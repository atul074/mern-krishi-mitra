const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AVetvBXvH4LB2jod7Mmj_2bwjM0kLrbLR3ptvS6PoOhUepnAjo8696APjWm3cFQJclJ3ckEkCUjJx3Hu",
  client_secret: "EEutEAn8xrjXlhOBmebOFaVH99aNNvOaFkX3C4nKl2BdpuUmcIuBOG_F8SbuNks4vwv8LtLaKS4UX6JE",
});

module.exports = paypal;