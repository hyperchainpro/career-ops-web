"""
Resume ATS-Friendly dengan Foto Header - Bahasa Indonesia
Febri Rizki - UI/UX Designer & AI Engineer
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle, Image, KeepTogether
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ── Font Registration ──
pdfmetrics.registerFont(TTFont('FreeSans', '/usr/share/fonts/truetype/freefont/FreeSans.ttf'))
pdfmetrics.registerFont(TTFont('FreeSans-Bold', '/usr/share/fonts/truetype/freefont/FreeSansBold.ttf'))
pdfmetrics.registerFont(TTFont('FreeSans-Italic', '/usr/share/fonts/truetype/freefont/FreeSansOblique.ttf'))
pdfmetrics.registerFont(TTFont('FreeSans-BoldItalic', '/usr/share/fonts/truetype/freefont/FreeSansBoldOblique.ttf'))
registerFontFamily('FreeSans', normal='FreeSans', bold='FreeSans-Bold',
                   italic='FreeSans-Italic', boldItalic='FreeSans-BoldItalic')

# ── Palette ──
ACCENT = colors.HexColor('#2185b8')
TEXT_PRIMARY = colors.HexColor('#161819')
TEXT_MUTED = colors.HexColor('#70767a')
HEADER_FILL = colors.HexColor('#38525f')
BORDER = colors.HexColor('#bdccd4')

# ── Styles ──
name_style = ParagraphStyle(
    'ResumeName', fontName='FreeSans-Bold', fontSize=22,
    leading=26, alignment=TA_LEFT, spaceAfter=2,
    textColor=TEXT_PRIMARY
)
title_style = ParagraphStyle(
    'ResumeTitle', fontName='FreeSans', fontSize=12,
    leading=15, alignment=TA_LEFT, textColor=ACCENT,
    spaceAfter=4
)
contact_style = ParagraphStyle(
    'ResumeContact', fontName='FreeSans', fontSize=9,
    leading=12, alignment=TA_LEFT, textColor=TEXT_MUTED,
    spaceAfter=2
)
section_title_style = ParagraphStyle(
    'ResumeSectionTitle', fontName='FreeSans-Bold', fontSize=11.5,
    leading=14, spaceBefore=8, spaceAfter=2,
    textColor=HEADER_FILL
)
job_title_style = ParagraphStyle(
    'ResumeJobTitle', fontName='FreeSans-Bold', fontSize=10.5,
    leading=13, spaceAfter=1, textColor=TEXT_PRIMARY
)
job_meta_style = ParagraphStyle(
    'ResumeJobMeta', fontName='FreeSans-Italic', fontSize=9.5,
    leading=12, textColor=TEXT_MUTED, spaceAfter=3
)
link_style = ParagraphStyle(
    'ResumeLink', fontName='FreeSans', fontSize=9,
    leading=12, textColor=ACCENT, spaceAfter=3
)
bullet_style = ParagraphStyle(
    'ResumeBullet', fontName='FreeSans', fontSize=9.5,
    leading=13, leftIndent=12, bulletIndent=0,
    spaceBefore=1, spaceAfter=1, textColor=TEXT_PRIMARY
)
body_style = ParagraphStyle(
    'ResumeBody', fontName='FreeSans', fontSize=9.5,
    leading=13, spaceAfter=2, textColor=TEXT_PRIMARY
)
skill_style = ParagraphStyle(
    'ResumeSkill', fontName='FreeSans', fontSize=9.5,
    leading=13, spaceBefore=1, spaceAfter=1, textColor=TEXT_PRIMARY
)

# ── Helpers ──
def section_header(title):
    return [
        Paragraph(f'<b>{title}</b>', section_title_style),
        HRFlowable(width='100%', thickness=0.8, color=ACCENT,
                   spaceBefore=0, spaceAfter=5),
    ]

# ── Build Document ──
output_path = '/home/z/my-project/download/Resume_Febri_Rizki_ID.pdf'
doc = SimpleDocTemplate(
    output_path, pagesize=A4,
    leftMargin=1.5*cm, rightMargin=1.5*cm,
    topMargin=1.3*cm, bottomMargin=1.3*cm,
    title='Resume - Febri Rizki',
    author='Febri Rizki', creator='Febri Rizki',
    subject='ATS-Friendly Resume - UI/UX Designer & AI Engineer'
)

story = []

# ── Header dengan Foto ──
# Foto di kanan (kecil, tidak mengganggu text flow ATS)
photo = Image('/home/z/my-project/scripts/photo_febri.jpg', width=70, height=95)
photo.hAlign = 'RIGHT'

# Header text (kiri)
header_text = []
header_text.append(Paragraph('<b>FEBRI RIZKI</b>', name_style))
header_text.append(Paragraph('UI/UX Designer &amp; AI Engineer', title_style))
header_text.append(Paragraph('febririzki95@gmail.com', contact_style))
header_text.append(Paragraph('0852-6543-6395 / 0896-5473-8245', contact_style))
header_text.append(Paragraph('Langsa, Aceh, Indonesia', contact_style))
header_text.append(Paragraph('github.com/febririzki95 &nbsp;|&nbsp; linkedin.com/in/febririzki95', contact_style))

# Buat table 2 kolom: text kiri (lebar) + foto kanan (sempit)
header_table = Table(
    [[header_text, photo]],
    colWidths=[12.5*cm, 4.5*cm]
)
header_table.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
    ('LEFTPADDING', (0, 0), (0, 0), 0),
    ('RIGHTPADDING', (0, 0), (0, 0), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 0),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
]))
story.append(header_table)
story.append(Spacer(1, 4))
story.append(HRFlowable(width='100%', thickness=1.2, color=HEADER_FILL,
                        spaceBefore=2, spaceAfter=4))

# ── Profil Profesional ──
story.extend(section_header('PROFIL PROFESIONAL'))
story.append(Paragraph(
    'UI/UX Designer dan AI Engineer dengan latar belakang akademik Sains (S1 &amp; S2 '
    'Ilmu Biologi) yang justru menjadi keunggulan dalam mengembangkan solusi AI — '
    'khususnya untuk domain yang membutuhkan pemahaman sistem kompleks, pengolahan data, '
    'dan pola berpikir analitis. Lulusan S2 Universitas Sumatera Utara (2024) &amp; '
    'S1 Universitas Syiah Kuala (2018) dengan pengalaman membangun 10+ produk digital '
    'end-to-end: riset pengguna, desain UI/UX, hingga deployment model AI. Semifinalis '
    'Hackathon PIDI Digdaya Bank Indonesia 2026. Berkomitmen menghadirkan pengalaman '
    'pengguna yang intuitif sekaligus didukung sistem AI yang andal dan dapat diskalakan.',
    body_style
))

# ── Pengalaman Kerja ──
story.extend(section_header('PENGALAMAN KERJA'))
story.append(Paragraph('<b>UI/UX Designer &amp; AI Engineer (Hybrid Role)</b>', job_title_style))
story.append(Paragraph('Hyperchain Project &nbsp;|&nbsp; 2026 - Sekarang &nbsp;|&nbsp; Langsa, Aceh, Indonesia', job_meta_style))
story.append(Paragraph('•  Memimpin desain end-to-end dan integrasi AI untuk platform digital, menggabungkan riset UX, prototyping, dan deployment model machine learning.', bullet_style))
story.append(Paragraph('•  Merancang sistem desain berbasis komponen (design system) yang meningkatkan konsistensi visual sebesar 30% dan mempercepat waktu pengembangan frontend.', bullet_style))
story.append(Paragraph('•  Mengimplementasikan integrasi Google Gemini API untuk fitur AI tutor dan asisten cerdas, menghasilkan pengalaman personalisasi untuk 1.000+ pengguna.', bullet_style))
story.append(Paragraph('•  Melakukan usability testing iteratif yang mengurangi friction pengguna sebesar 25% dan meningkatkan task completion rate hingga 40%.', bullet_style))
story.append(Paragraph('•  Berkoordinasi lintas tim (frontend, backend, ML engineer) untuk meluncurkan 6 produk AI dalam kurun waktu 12 bulan dengan kualitas production-ready.', bullet_style))
story.append(Paragraph('•  Membangun pipeline MLOps (MLflow + GitHub Actions) untuk automated retraining model, menurunkan model drift hingga 50%.', bullet_style))
story.append(Spacer(1, 3))

# ── Pendidikan ──
story.extend(section_header('PENDIDIKAN'))
story.append(Paragraph('<b>Magister Sains (M.Si.) - Ilmu Biologi</b>', job_title_style))
story.append(Paragraph('Universitas Sumatera Utara (USU), Medan &nbsp;|&nbsp; 2022 - 2024', job_meta_style))
story.append(Paragraph('Background akademik di bidang biologi memberikan keunggulan strategis untuk AI Engineering: pemahaman mendalam tentang sistem kompleks, analisis data ilmiah, dan pola berpikir analitis yang langsung relevan untuk computational biology, bioinformatics, serta pengembangan model AI di domain life sciences &amp; healthcare.', body_style))

story.append(Paragraph('<b>Sarjana Sains (S.Si.) - Ilmu Biologi</b>', job_title_style))
story.append(Paragraph('Universitas Syiah Kuala (Unsyiah), Banda Aceh &nbsp;|&nbsp; 2014 - 2018', job_meta_style))
story.append(Paragraph('Fondasi kuat dalam metode ilmiah, statistika, dan pengolahan data yang menjadi dasar transisi karier ke data science dan AI engineering.', body_style))
story.append(Spacer(1, 3))

# ── Project Portofolio (dengan link) ──
story.extend(section_header('PROJECT PORTOFOLIO'))
story.append(Paragraph('Berikut project unggulan dengan link repository publik untuk verifikasi:', body_style))

projects_id = [
    ('TRADIX - AI-Powered Stock Trading Platform (Project Hackathon PIDI Digdaya BI 2026)',
     'https://github.com/hyperchainpro/TRADIX',
     'https://tradix-app.pages.dev'),
    ('HyperChain Pro - AI-Powered Design Platform dengan LayerBoard',
     'https://github.com/hyperchainpro/hyperchainpro',
     'https://hyperchainpro.vercel.app'),
    ('PathMentor AI - Adaptive AI Tutor untuk Siswa SMA',
     'https://github.com/febririzki95/pathmentor-ai',
     'https://pathmentor-ai-one.vercel.app'),
    ('DapurMind AI - AI-Powered Cooking Assistant',
     'https://github.com/hyperchainpro/dapurmindai',
     'https://dapurmindai.vercel.app'),
    ('CR AutoPilot - Automated ContentRewards Pipeline (34 Platform)',
     'https://github.com/hyperchainpro/cr-autopilot',
     'https://cr-autopilot.vercel.app'),
    ('Food Recognizer - Flutter ML App (2023 Food Categories)',
     'https://github.com/febririzki95/food_recognizer_ci_check',
     None),
    ('Workflow-CI - Automated ML Model Retraining (MLOps)',
     'https://github.com/febririzki95/Workflow-CI',
     None),
    ('NeuroPilot - AI Platform dengan Caddy Server & Neon DB',
     'https://github.com/febririzki95/NeuroPilot',
     'https://neuro-pilot-psi.vercel.app'),
    ('Eksperimen SML - ML Preprocessing Automation (Breast Cancer Dataset)',
     'https://github.com/febririzki95/Eksperimen_SML_Febri',
     None),
    ('Hyperchain Landing - Ekosistem Digital Terintegrasi',
     'https://github.com/hyperchainpro/hyperchain-landing',
     'https://hyperchain-landing.pages.dev'),
    ('HYP Convert - Multi-platform Document Converter (Expo/React Native)',
     'https://github.com/hyperchainpro/hyp-convert',
     'https://hyp-convert.vercel.app'),
]
for name, url, live in projects_id:
    if live:
        story.append(Paragraph(f'•  <b>{name}</b><br/>&nbsp;&nbsp;&nbsp;&nbsp;Repo: <font color="#2185b8">{url}</font> &nbsp;|&nbsp; Live: <font color="#2185b8">{live}</font>', bullet_style))
    else:
        story.append(Paragraph(f'•  <b>{name}</b> &nbsp;|&nbsp; <font color="#2185b8">{url}</font>', bullet_style))
story.append(Spacer(1, 3))

# ── Keahlian ──
story.extend(section_header('KEAHLIAN'))
story.append(Paragraph('<b>UI/UX Designer Tech Stack:</b>  Figma, Adobe XD, Sketch, Adobe Photoshop, Adobe Illustrator, Design System &amp; Tokens, Wireframing, Prototyping, Usability Testing, User Research, Journey Mapping, Persona Development, Information Architecture, A/B Testing, Neumorphic Design, Material Design, Mobile-First &amp; Responsive Design, Accessibility (WCAG 2.1), Figma Auto Layout, Figma Variants, Micro-interactions', skill_style))
story.append(Paragraph('<b>AI Engineer Tech Stack:</b>  Google Gemini API (gemini-2.0-flash), OpenAI API, Prompt Engineering, RAG (Retrieval-Augmented Generation), LangChain, TensorFlow, TensorFlow Lite, PyTorch, scikit-learn, MLflow, Model Deployment &amp; Retraining, MLOps, Pandas, NumPy, Matplotlib, EDA, Feature Engineering, Computer Vision, Image Classification, Isolate Inference, Hugging Face', skill_style))
story.append(Paragraph('<b>Frontend Development:</b>  React, Next.js 16, React Native (Expo), TypeScript, Tailwind CSS 4, shadcn/ui, Radix UI, Framer Motion, Zustand, Three.js, GSAP, MDX Editor', skill_style))
story.append(Paragraph('<b>Backend &amp; Database:</b>  Prisma ORM, PostgreSQL, Neon, Convex, Supabase, Node.js, REST API, Bcrypt Auth, SQLite, Caddy Server', skill_style))
story.append(Paragraph('<b>Cloud &amp; DevOps:</b>  Vercel, Cloudflare Pages, GitHub Actions, Docker, CI/CD Pipeline, OpenNext, Wrangler, EAS Build, Vercel Postgres', skill_style))
story.append(Paragraph('<b>Bahasa Pemrograman:</b>  TypeScript, JavaScript, Python, Dart, PHP, SQL', skill_style))

# ── Sertifikasi (Grouped + Link) ──
story.extend(section_header('SERTIFIKASI'))
story.append(Paragraph('<b>Dicoding Academy</b> (18 sertifikat course)', body_style))
story.append(Paragraph('•  <b>Machine Learning &amp; AI</b> — 4 sertifikat (ML Pemula, ML Terapan, Pengembangan ML, AI Integration)', bullet_style))
story.append(Paragraph('•  <b>Frontend &amp; UI/UX</b> — 5 sertifikat (JS Dasar, Frontend Web Fundamental, React, React Expert, dll.)', bullet_style))
story.append(Paragraph('•  <b>Backend &amp; Cloud</b> — 5 sertifikat (Backend Fundamental, AWS Cloud Practitioner, GCP Basics, Azure Fundamentals, Docker)', bullet_style))
story.append(Paragraph('•  <b>Mobile Development</b> — 4 sertifikat (Android Pemula, Android Fundamental, Flutter, Multi-platform)', bullet_style))
story.append(Paragraph('<b>Big Data &amp; Data Analytics Training (BDT)</b> — 1 sertifikat profesional', body_style))
story.append(Paragraph('Link verifikasi sertifikat (Google Drive): <font color="#2185b8">https://drive.google.com/drive/folders/1dFr8J11MOiOYUozlHDO4PvPmmeavzIfX</font>', link_style))

# ── Penghargaan ──
story.extend(section_header('PENGHARGAAN'))
story.append(Paragraph('<b>Semifinalis — Hackathon PIDI Digdaya Bank Indonesia 2026</b>', job_title_style))
story.append(Paragraph('Bank Indonesia &nbsp;|&nbsp; 2026 &nbsp;|&nbsp; Nasional', job_meta_style))
story.append(Paragraph('Bersama tim, mengembangkan solusi digital inovatif berbasis data dan AI untuk mendukung transformasi digital di ekosistem Bank Indonesia. Lolos seleksi tahap preliminary dan masuk 20 tim teratas nasional dari ratusan peserta.', body_style))

# ── Bahasa ──
story.extend(section_header('BAHASA'))
story.append(Paragraph('<b>Bahasa Indonesia</b> — Penutur Asli', skill_style))
story.append(Paragraph('<b>Bahasa Inggris</b> — Profesional', skill_style))

# ── Build ──
doc.build(story)
print(f'OK: Resume ID saved to {output_path}')

import os
size_kb = os.path.getsize(output_path) / 1024
print(f'Size: {size_kb:.1f} KB')
