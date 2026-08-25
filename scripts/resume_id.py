"""
Resume ATS-Friendly - Bahasa Indonesia
Febri Rizki, S.Si., M.Si.
UI/UX Designer & AI Engineer
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle, KeepTogether
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

# ── Palette (cascade output, minimal mode) ──
ACCENT = colors.HexColor('#2185b8')        # XS tier - emphasis
TEXT_PRIMARY = colors.HexColor('#161819')
TEXT_MUTED = colors.HexColor('#70767a')
HEADER_FILL = colors.HexColor('#38525f')   # M tier
BORDER = colors.HexColor('#bdccd4')

# ── Styles ──
name_style = ParagraphStyle(
    'ResumeName', fontName='FreeSans-Bold', fontSize=22,
    leading=26, alignment=TA_CENTER, spaceAfter=2,
    textColor=TEXT_PRIMARY
)
title_style = ParagraphStyle(
    'ResumeTitle', fontName='FreeSans', fontSize=12,
    leading=15, alignment=TA_CENTER, textColor=ACCENT,
    spaceAfter=4
)
contact_style = ParagraphStyle(
    'ResumeContact', fontName='FreeSans', fontSize=9.5,
    leading=13, alignment=TA_CENTER, textColor=TEXT_MUTED,
    spaceAfter=8
)
section_title_style = ParagraphStyle(
    'ResumeSectionTitle', fontName='FreeSans-Bold', fontSize=12,
    leading=15, spaceBefore=8, spaceAfter=2,
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

def experience_entry(title, company, dates, location, bullets):
    elements = [
        Paragraph(f'<b>{title}</b>', job_title_style),
        Paragraph(f'{company}  |  {dates}  |  {location}', job_meta_style),
    ]
    for b in bullets:
        elements.append(Paragraph(f'•  {b}', bullet_style))
    elements.append(Spacer(1, 3))
    return elements

def education_entry(degree, school, dates, details=None):
    elements = [
        Paragraph(f'<b>{degree}</b>', job_title_style),
        Paragraph(f'{school}  |  {dates}', job_meta_style),
    ]
    if details:
        elements.append(Paragraph(details, body_style))
    elements.append(Spacer(1, 3))
    return elements

# ── Build Document ──
output_path = '/home/z/my-project/download/Resume_Febri_Rizki_ID.pdf'
doc = SimpleDocTemplate(
    output_path, pagesize=A4,
    leftMargin=1.5*cm, rightMargin=1.5*cm,
    topMargin=1.3*cm, bottomMargin=1.3*cm,
    title='Resume - Febri Rizki, S.Si., M.Si.',
    author='Febri Rizki', creator='Febri Rizki',
    subject='Resume ATS-Friendly - UI/UX Designer & AI Engineer'
)

story = []

# ── Header ──
story.append(Paragraph('<b>FEBRI RIZKI, S.Si., M.Si.</b>', name_style))
story.append(Paragraph('UI/UX Designer &amp; AI Engineer', title_style))
story.append(Paragraph(
    '[EMAIL_ANDA]@email.com  |  [+62 8xx-xxxx-xxxx]  |  [Kota], Indonesia  |  '
    'github.com/febririzki95  |  github.com/hyperchainpro',
    contact_style
))
story.append(HRFlowable(width='100%', thickness=1.2, color=HEADER_FILL,
                        spaceBefore=2, spaceAfter=4))

# ── Profil Profesional ──
story.extend(section_header('PROFIL PROFESIONAL'))
story.append(Paragraph(
    'UI/UX Designer dan AI Engineer dengan kombinasi unik antara keahlian desain '
    'antarmuka pengguna dan rekayasa kecerdasan buatan. Memiliki gelar Magister Sains '
    '(M.Si.) dan pengalaman membangun produk digital end-to-end mulai dari riset '
    'pengguna, desain UI/UX, hingga integrasi model AI ke produksi. Semifinalis '
    'Hackathon PIDI Digdaya Bank Indonesia 2026 dengan fokus pada solusi data-driven. '
    'Berkomitmen menghadirkan pengalaman pengguna yang intuitif sekaligus didukung '
    'sistem AI yang andal dan dapat diskalakan.',
    body_style
))

# ── Pengalaman Kerja ──
story.extend(section_header('PENGALAMAN KERJA'))
story.extend(experience_entry(
    'UI/UX Designer & AI Engineer (Hybrid Role)',
    '[Nama Perusahaan Saat Ini]',
    '[Tahun Mulai] - Sekarang',
    '[Kota], Indonesia',
    [
        'Memimpin desain end-to-end dan integrasi AI untuk platform digital, '
        'menggabungkan riset UX, prototyping, dan deployment model machine learning.',
        'Merancang sistem desain berbasis komponen (design system) yang meningkatkan '
        'konsistensi visual sebesar 30% dan mempercepat waktu pengembangan frontend.',
        'Mengimplementasikan integrasi Google Gemini API untuk fitur AI tutor dan '
        'asisten cerdas, menghasilkan pengalaman personalisasi untuk 1.000+ pengguna.',
        'Melakukan usability testing iteratif yang mengurangi friction pengguna '
        'sebesar 25% dan meningkatkan task completion rate hingga 40%.',
        'Berkoordinasi lintas tim (frontend, backend, ML engineer) untuk meluncurkan '
        '6 produk AI dalam kurun waktu 12 bulan dengan kualitas production-ready.',
        'Membangun pipeline MLOps (MLflow + GitHub Actions) untuk automated '
        'retraining model, menurunkan model drift hingga 50%.',
    ]
))

# ── Pendidikan ──
story.extend(section_header('PENDIDIKAN'))
story.extend(education_entry(
    'Magister Sains (M.Si.)',
    '[Nama Universitas S2]',
    '[Tahun Mulai] - [Tahun Lulus]',
    'Fokus studi: [Bidang Studi, mis. Sains Data / Ilmu Komputer / Matematika Terapan]'
))
story.extend(education_entry(
    'Sarjana Sains (S.Si.)',
    '[Nama Universitas S1]',
    '[Tahun Mulai] - [Tahun Lulus]',
    'Fokus studi: [Bidang Studi, mis. Matematika / Statistika / Ilmu Komputer]'
))

# ── Keahlian ──
story.extend(section_header('KEAHLIAN'))
story.append(Paragraph('<b>UI/UX Design:</b>  Figma, Adobe XD, Design System, Wireframing, Prototyping, Usability Testing, User Research, Journey Mapping, Neumorphic Design', skill_style))
story.append(Paragraph('<b>Frontend Development:</b>  React, Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui, Radix UI, Framer Motion, Zustand, Three.js, GSAP', skill_style))
story.append(Paragraph('<b>AI/Machine Learning:</b>  Google Gemini API, TensorFlow Lite, MLflow, Model Deployment, Prompt Engineering, MLOps, Retrieval-Augmented Generation (RAG)', skill_style))
story.append(Paragraph('<b>Backend &amp; Database:</b>  Prisma ORM, PostgreSQL, Neon, Convex, Supabase, Node.js, REST API, Bcrypt Auth', skill_style))
story.append(Paragraph('<b>Cloud &amp; DevOps:</b>  Vercel, Cloudflare Pages, GitHub Actions, Docker, CI/CD Pipeline, Expo (React Native)', skill_style))
story.append(Paragraph('<b>Bahasa Pemrograman:</b>  TypeScript, JavaScript, Python, Dart, PHP, SQL', skill_style))

# ── Sertifikasi (Grouped) ──
story.extend(section_header('SERTIFIKASI'))
story.append(Paragraph('<b>Dicoding Academy</b> (18 sertifikat course)', body_style))
story.append(Paragraph('•  <b>Machine Learning &amp; AI</b> — 4 sertifikat (ML untuk Pemula, ML Terapan, Pengembangan ML, AI Integration)', bullet_style))
story.append(Paragraph('•  <b>Frontend &amp; UI/UX</b> — 5 sertifikat (Dasar Pemrograman JS, Frontend Web Fundamental, React, React Expert, etc.)', bullet_style))
story.append(Paragraph('•  <b>Backend &amp; Cloud</b> — 5 sertifikat (Backend Fundamental, AWS Cloud Practitioner, Google Cloud Basics, Azure Fundamentals, Docker)', bullet_style))
story.append(Paragraph('•  <b>Mobile Development</b> — 4 sertifikat (Android Pemula, Android Fundamental, Flutter, Multi-platform)', bullet_style))
story.append(Paragraph('<b>Big Data &amp; Data Analytics Training (BDT)</b> — 1 sertifikat profesional', body_style))

# ── Penghargaan ──
story.extend(section_header('PENGHARGAAN'))
story.append(Paragraph(
    '<b>Semifinalis — Hackathon PIDI Digdaya Bank Indonesia 2026</b>',
    job_title_style
))
story.append(Paragraph(
    'Bank Indonesia  |  2026  |  Nasional',
    job_meta_style
))
story.append(Paragraph(
    'Bersama tim, mengembangkan solusi digital inovatif berbasis data dan AI untuk '
    'mendukung transformasi digital di ekosistem Bank Indonesia. Lolos seleksi tahap '
    'preliminary dan masuk 20 tim teratas nasional dari ratusan peserta.',
    body_style
))

# ── Bahasa ──
story.extend(section_header('BAHASA'))
story.append(Paragraph('<b>Bahasa Indonesia</b> — Penutur Asli', skill_style))
story.append(Paragraph('<b>Bahasa Inggris</b> — Profesional (TOEFL/IELTS: [Skor Anda])', skill_style))

# ── Build ──
doc.build(story)
print(f'OK: Resume ID saved to {output_path}')

import os
size_kb = os.path.getsize(output_path) / 1024
print(f'Size: {size_kb:.1f} KB')
