const twilio = require("twilio");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

const sendSMS = async ({ to, body }) => {
  await client.messages.create({
    body,
    from: process.env.TWILIO_PHONE,
    to, // Must be in E.164 format (e.g., +919999999999)
  });
};

module.exports = sendSMS;
