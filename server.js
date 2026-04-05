const express = require('express');
const path = require('path');

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sajikan file statis (css, img, js, video)
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

// ── Route API (tambahkan endpoint-mu di sini) ───────────────
// Contoh:
// app.get('/api/stories', (req, res) => {
//   res.json({ stories: [] });
// });

// ── Jalankan lokal (Vercel tidak pakai app.listen) ─────────
// PENTING: Jangan hapus blok if ini. Vercel butuh module.exports,
// bukan app.listen langsung.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
  });
}

// Export untuk Vercel Serverless
module.exports = app;