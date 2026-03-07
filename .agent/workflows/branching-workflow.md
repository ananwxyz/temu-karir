# Branching Workflow Rules

Mulai tanggal 7 Maret 2026, asisten diinstruksikan untuk menggunakan _branching workflow_ secara *default* saat mengerjakan fitur baru atau modifikasi yang cukup masif di repositori ini.

## Aturan:

1. **Jangan bekerja langsung di `main`** jika itu adalah pekerjaan fitur baru atau eksperimen.
2. Saat mulai mengerjakan *task*, asisten harus melakukan:
   `git checkout -b <nama-branch-deskriptif>`
     (Misal: `git checkout -b feat/freelance-platform`)
3. Lakukan modifikasi kode, *test* secara lokal (`localhost`), *commit*, dan *push* perubahan ke *branch* tersebut.
4. Ketika *developer* (USER) sudah memverifikasi semuanya melalui *browser*/opsi *review*, asisten harus pindah ke `main` dan melakukan *merge*.
   `git checkout main`
   `git merge <nama-branch-deskriptif>`
   `git push`

*Rule* ini akan memastikan stabilitas cabang *production* (`main`).
