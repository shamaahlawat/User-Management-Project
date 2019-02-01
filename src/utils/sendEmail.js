import sendgridEmail from '@sendgrid/mail';
import CONFIG from '../config';

export async function sendEmailUsingSendgrid({ to, from, subject, html }) {
  sendgridEmail.setApiKey(CONFIG.SENDGRID_API_KEY);
  return sendgridEmail.send({
    to,
    from,
    subject,
    html
  });
}
