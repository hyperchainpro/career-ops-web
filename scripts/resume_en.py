"""
Resume ATS-Friendly dengan Foto Header - English
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
output_path = '/home/z/my-project/download/Resume_Febri_Rizki_EN.pdf'
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
photo = Image('/home/z/my-project/scripts/photo_febri.jpg', width=70, height=95)
photo.hAlign = 'RIGHT'

header_text = []
header_text.append(Paragraph('<b>FEBRI RIZKI</b>', name_style))
header_text.append(Paragraph('UI/UX Designer &amp; AI Engineer', title_style))
header_text.append(Paragraph('febririzki95@gmail.com', contact_style))
header_text.append(Paragraph('+62 852-6543-6395 / +62 896-5473-8245', contact_style))
header_text.append(Paragraph('Langsa, Aceh, Indonesia', contact_style))
header_text.append(Paragraph('github.com/febririzki95 &nbsp;|&nbsp; linkedin.com/in/febririzki95', contact_style))

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

# ── Professional Summary ──
story.extend(section_header('PROFESSIONAL SUMMARY'))
story.append(Paragraph(
    'UI/UX Designer and AI Engineer with an academic background in Science (B.Sc. &amp; '
    'M.Sc. in Biology) that proves to be a strategic advantage in developing AI solutions '
    '— particularly for domains requiring understanding of complex systems, data analysis, '
    'and analytical thinking patterns. Holds M.Sc. from Universitas Sumatera Utara (2024) '
    '&amp; B.Sc. from Universitas Syiah Kuala (2018) with hands-on experience building 10+ '
    'end-to-end digital products spanning user research, UI/UX design, and production-grade '
    'AI model integration. Semifinalist at the PIDI Digdaya Bank Indonesia Hackathon 2026. '
    'Committed to delivering intuitive user experiences backed by reliable, scalable AI systems.',
    body_style
))

# ── Work Experience ──
story.extend(section_header('WORK EXPERIENCE'))
story.append(Paragraph('<b>UI/UX Designer &amp; AI Engineer (Hybrid Role)</b>', job_title_style))
story.append(Paragraph('Hyperchain Project &nbsp;|&nbsp; 2026 - Present &nbsp;|&nbsp; Langsa, Aceh, Indonesia', job_meta_style))
story.append(Paragraph('•  Led end-to-end design and AI integration for digital platforms, combining UX research, prototyping, and machine learning model deployment.', bullet_style))
story.append(Paragraph('•  Built a component-based design system that improved visual consistency by 30% and accelerated frontend development cycles.', bullet_style))
story.append(Paragraph('•  Implemented Google Gemini API integration for AI tutor features and smart assistants, delivering personalized experiences for 1,000+ users.', bullet_style))
story.append(Paragraph('•  Conducted iterative usability testing that reduced user friction by 25% and increased task completion rate by 40%.', bullet_style))
story.append(Paragraph('•  Collaborated cross-functionally (frontend, backend, ML engineers) to launch 6 production-ready AI products within a 12-month period.', bullet_style))
story.append(Paragraph('•  Built an MLOps pipeline (MLflow + GitHub Actions) for automated model retraining, reducing model drift by 50%.', bullet_style))
story.append(Spacer(1, 3))

# ── Project Portfolio ──
story.extend(section_header('PROJECT PORTFOLIO'))
story.append(Paragraph('Featured projects with public repository links for verification:', body_style))

projects_en = [
    ('TRADIX - AI-Powered Stock Trading Platform (Hackathon PIDI Digdaya BI 2026 Project)',
     'https://github.com/hyperchainpro/TRADIX'),
    ('HyperChain Pro - AI-Powered Design Platform with BranchBoard',
     'https://github.com/hyperchainpro/hyperchainpro'),
    ('PathMentor AI - Adaptive AI Tutor for High-School Students (Gemini XPRIZE 2026)',
     'https://github.com/febririzki95/pathmentor-ai'),
    ('DapurMind AI - AI-Powered Cooking Assistant',
     'https://github.com/hyperchainpro/dapurmindai'),
    ('CR AutoPilot - Automated ContentRewards Pipeline (34 Platforms)',
     'https://github.com/hyperchainpro/cr-autopilot'),
    ('Food Recognizer - Flutter ML App (2023 Food Categories)',
     'https://github.com/febririzki95/food_recognizer_ci_check'),
    ('Workflow-CI - Automated ML Model Retraining (MLOps)',
     'https://github.com/febririzki95/Workflow-CI'),
    ('NeuroPilot - AI Platform with Caddy Server & Neon DB',
     'https://github.com/febririzki95/NeuroPilot'),
    ('Eksperimen SML - ML Preprocessing Automation (Breast Cancer Dataset)',
     'https://github.com/febririzki95/Eksperimen_SML_Febri'),
    ('Hyperchain Landing - Integrated Digital Ecosystem',
     'https://github.com/hyperchainpro/hyperchain-landing'),
    ('HYP Convert - Multi-platform Document Converter (Expo/React Native)',
     'https://github.com/hyperchainpro/hyp-convert'),
]
for name, url in projects_en:
    story.append(Paragraph(f'•  <b>{name}</b> &nbsp;|&nbsp; <font color="#2185b8">{url}</font>', bullet_style))
story.append(Spacer(1, 3))

# ── Education ──
story.extend(section_header('EDUCATION'))
story.append(Paragraph('<b>Master of Science (M.Si.) - Biology</b>', job_title_style))
story.append(Paragraph('Universitas Sumatera Utara (USU), Medan &nbsp;|&nbsp; 2022 - 2024', job_meta_style))
story.append(Paragraph('Academic background in biology provides strategic advantage for AI Engineering: deep understanding of complex systems, scientific data analysis, and analytical thinking patterns directly relevant for computational biology, bioinformatics, and AI model development in life sciences &amp; healthcare domains.', body_style))

story.append(Paragraph('<b>Bachelor of Science (S.Si.) - Biology</b>', job_title_style))
story.append(Paragraph('Universitas Syiah Kuala (Unsyiah), Banda Aceh &nbsp;|&nbsp; 2014 - 2018', job_meta_style))
story.append(Paragraph('Strong foundation in scientific method, statistics, and data processing that underpins the career transition to data science and AI engineering.', body_style))
story.append(Spacer(1, 3))

# ── Skills ──
story.extend(section_header('SKILLS'))
story.append(Paragraph('<b>UI/UX Designer Tech Stack:</b>  Figma, Adobe XD, Sketch, Adobe Photoshop, Adobe Illustrator, Design System &amp; Tokens, Wireframing, Prototyping, Usability Testing, User Research, Journey Mapping, Persona Development, Information Architecture, A/B Testing, Neumorphic Design, Material Design, Mobile-First &amp; Responsive Design, Accessibility (WCAG 2.1), Figma Auto Layout, Figma Variants, Micro-interactions', skill_style))
story.append(Paragraph('<b>AI Engineer Tech Stack:</b>  Google Gemini API (gemini-2.0-flash), OpenAI API, Prompt Engineering, RAG (Retrieval-Augmented Generation), LangChain, TensorFlow, TensorFlow Lite, PyTorch, scikit-learn, MLflow, Model Deployment &amp; Retraining, MLOps, Pandas, NumPy, Matplotlib, EDA, Feature Engineering, Computer Vision, Image Classification, Isolate Inference, Hugging Face', skill_style))
story.append(Paragraph('<b>Frontend Development:</b>  React, Next.js 16, React Native (Expo), TypeScript, Tailwind CSS 4, shadcn/ui, Radix UI, Framer Motion, Zustand, Three.js, GSAP, MDX Editor', skill_style))
story.append(Paragraph('<b>Backend &amp; Database:</b>  Prisma ORM, PostgreSQL, Neon, Convex, Supabase, Node.js, REST API, Bcrypt Authentication, SQLite, Caddy Server', skill_style))
story.append(Paragraph('<b>Cloud &amp; DevOps:</b>  Vercel, Cloudflare Pages, GitHub Actions, Docker, CI/CD Pipeline, OpenNext, Wrangler, EAS Build, Vercel Postgres', skill_style))
story.append(Paragraph('<b>Programming Languages:</b>  TypeScript, JavaScript, Python, Dart, PHP, SQL', skill_style))

# ── Certifications ──
story.extend(section_header('CERTIFICATIONS'))
story.append(Paragraph('<b>Dicoding Academy</b> (18 course certificates)', body_style))
story.append(Paragraph('•  <b>Machine Learning &amp; AI</b> — 4 certificates (ML for Beginners, Applied ML, ML Development, AI Integration)', bullet_style))
story.append(Paragraph('•  <b>Frontend &amp; UI/UX</b> — 5 certificates (JS Programming Basics, Frontend Web Fundamentals, React, React Expert, etc.)', bullet_style))
story.append(Paragraph('•  <b>Backend &amp; Cloud</b> — 5 certificates (Backend Fundamentals, AWS Cloud Practitioner, GCP Basics, Azure Fundamentals, Docker)', bullet_style))
story.append(Paragraph('•  <b>Mobile Development</b> — 4 certificates (Android Beginners, Android Fundamentals, Flutter, Multi-platform)', bullet_style))
story.append(Paragraph('<b>Big Data &amp; Data Analytics Training (BDT)</b> — 1 professional certificate', body_style))
story.append(Paragraph('Certificate verification link (Google Drive): <font color="#2185b8">https://drive.google.com/drive/folders/1dFr8J11MOiOYUozlHDO4PvPmmeavzIfX</font>', link_style))

# ── Awards ──
story.extend(section_header('AWARDS'))
story.append(Paragraph('<b>Semifinalist — PIDI Digdaya Bank Indonesia Hackathon 2026</b>', job_title_style))
story.append(Paragraph('Bank Indonesia &nbsp;|&nbsp; 2026 &nbsp;|&nbsp; National', job_meta_style))
story.append(Paragraph('Collaborated with a team to develop an innovative data- and AI-driven digital solution supporting Bank Indonesia\'s digital transformation agenda. Passed the preliminary selection round and ranked among the top 20 teams nationally out of hundreds of participating teams.', body_style))

# ── Languages ──
story.extend(section_header('LANGUAGES'))
story.append(Paragraph('<b>Indonesian</b> — Native', skill_style))
story.append(Paragraph('<b>English</b> — Professional', skill_style))

# ── Build ──
doc.build(story)
print(f'OK: Resume EN saved to {output_path}')

import os
size_kb = os.path.getsize(output_path) / 1024
print(f'Size: {size_kb:.1f} KB')
