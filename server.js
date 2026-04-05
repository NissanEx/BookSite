const express    = require('express');
const path       = require('path');
const { google } = require('googleapis');

const app = express();

// ── Konfigurasi Google OAuth ────────────────────────────────
// GANTI nilai di bawah setelah dapat Client Secret
const GOOGLE_CLIENT_ID     = '444307736563-sbh4r7ke4j8tm9m2t2jhvbd6vjs9maf0.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET; // diisi via Vercel env
const REDIRECT_URI         = 'https://book-site-4ki1-git-main-nissanexs-projects.vercel.app/auth/google/callback';

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sajikan file statis
app.use('/css',   express.static(path.join(__dirname, 'css')));
app.use('/img',   express.static(path.join(__dirname, 'img')));
app.use('/js',    express.static(path.join(__dirname, 'js')));
app.use('/video', express.static(path.join(__dirname, 'video')));

// ── Route HTML ──────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, 'CreateBook.html'));
});

// ── Route Google OAuth ──────────────────────────────────────

// 1. Arahkan user ke halaman login Google
app.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ]
  });
  res.redirect(url);
});

// 2. Google redirect ke sini setelah user login
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect('/login?error=no_code');
  }

  try {
    // Tukar code dengan token
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Ambil info user dari Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    const username = data.name || data.email.split('@')[0];
    const email    = data.email;

    // Kirim data ke frontend via script (localStorage)
    // Cara ini aman karena halaman hanya bisa diakses setelah callback Google
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Login...</title></head>
      <body>
        <script>
          localStorage.setItem('isLogin', 'true');
          localStorage.setItem('username', ${JSON.stringify(username)});
          localStorage.setItem('email', ${JSON.stringify(email)});
          localStorage.setItem('loginMethod', 'google');
          const redirect = localStorage.getItem('redirectAfterLogin') || 'home.html';
          localStorage.removeItem('redirectAfterLogin');
          window.location.href = '/' + redirect;
        </script>
        <p style="font-family:sans-serif;text-align:center;margin-top:40px;">
          Mengalihkan... ⏳
        </p>
      </body>
      </html>
    `);

  } catch (err) {
    console.error('Google OAuth error:', err.message);
    res.redirect('/login?error=oauth_failed');
  }
});

// ── Jalankan lokal ──────────────────────────────────────────
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
  });
}

// Export untuk Vercel
module.exports = app;