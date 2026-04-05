const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://book-site-4ki1-git-main-nissanexs-projects.vercel.app/api/auth/callback'
);

module.exports = async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect('/login.html?error=no_code');

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    const username = data.name || data.email.split('@')[0];
    const email = data.email;

    res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>
      <script>
        localStorage.setItem('isLogin','true');
        localStorage.setItem('username',${JSON.stringify(username)});
        localStorage.setItem('email',${JSON.stringify(email)});
        localStorage.setItem('loginMethod','google');
        window.location.href='/home.html';
      </script></body></html>`);
  } catch (err) {
    console.error(err);
    res.redirect('/login.html?error=oauth_failed');
  }
};