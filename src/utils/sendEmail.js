import sendgridEmail from '@sendgrid/mail';
import CONFIG from '../config';

export async function sendEmailUsingSendgrid({ to, from, subject, html }) {
  if (!CONFIG.SENDGRID_API_KEY) {
    // eslint-disable-next-line no-console
    return console.log('Email key not set! Skipping email');
  }
  sendgridEmail.setApiKey(CONFIG.SENDGRID_API_KEY);
  return sendgridEmail.send({
    to,
    from,
    subject,
    html
  });
}
