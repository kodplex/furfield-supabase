import { serve } from "https://deno.land/std@0.177.1/http/server.ts";
import * as base64 from 'https://denopkg.com/chiefbiiko/base64/mod.ts';
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'

const smsHookSecret = Deno.env.get('SEND_SMS_HOOK_SECRET')
const smsUsername = Deno.env.get('DIALOG_SMS_USERNAME')
const smsDigest = Deno.env.get('DIALOG_SMS_DIGEST')
const smsQ = Deno.env.get('DIALOG_SMS_Q')

const username: string  = smsUsername
const digest: string = smsDigest
const q: string = smsQ

const sendTextMessage = async (
  messageBody: string,
  toNumber: string
) => {

  const url = `https://richcommunication.dialog.lk/api/sms/inline/send?username=${username}&digest=${digest}&q=${q}&destination=${toNumber}&message=${messageBody}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const responseData = await response.json();
    console.log('SMS sent successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { error };
  }
}

serve(async (req) => {

  const payload = await req.text();
  const base64_secret = '9hb8gJgYKAn2doIoujv52/wR7xE7jugJMxXE5Xapuf8=';
  const headers = Object.fromEntries(req.headers);
  const wh = new Webhook(base64_secret);

  let response;

  try {
    // Attempt to verify the payload
    const { user, sms }= wh.verify(payload, headers);
    console.log('Webhook verified:', sms.otp);

    const messageBody = `Your OTP is: ${sms.otp}`;

    const resp = await sendTextMessage(messageBody,user.phone);

    response = {
      message: "Hello from Edge Functions!",
      payload: payload,
      headers: headers,
      base64Secret: base64_secret,
      wh: wh,
    };

  } catch (error) {
    response = {
      message: error.message,
      error: error.name,
    };
  }

  return new Response(
    JSON.stringify(response),
    { headers: { "Content-Type": "application/json" } }
  );

}

);
