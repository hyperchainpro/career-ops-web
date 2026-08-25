"""
Resume ATS-Friendly - English
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
ACCENT = colors.HexColor('#2185b8')
TEXT_PRIMARY = colors.HexColor('#161819')
TEXT_MUTED = colors.HexColor('#70767a')
HEADER_FILL = colors.HexColor('#38525f')
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
output_path = '/home/z/my-project/download/Resume_Febri_Rizki_EN.pdf'
doc = SimpleDocTemplate(
    output_path, pagesize=A4,
    leftMargin=1.5*cm, rightMargin=1.5*cm,
    topMargin=1.3*cm, bottomMargin=1.3*cm,
    title='Resume - Febri Rizki, S.Si., M.Si.',
    author='Febri Rizki', creator='Febri Rizki',
    subject='ATS-Friendly Resume - UI/UX Designer & AI Engineer'
)

story = []

# ── Header ──
story.append(Paragraph('<b>FEBRI RIZKI, S.Si., M.Si.</b>', name_style))
story.append(Paragraph('UI/UX Designer &amp; AI Engineer', title_style))
story.append(Paragraph(
    '[YOUR_EMAIL]@email.com  |  [+62 8xx-xxxx-xxxx]  |  [City], Indonesia  |  '
    'github.com/febririzki95  |  github.com/hyperchainpro',
    contact_style
))
story.append(HRFlowable(width='100%', thickness=1.2, color=HEADER_FILL,
                        spaceBefore=2, spaceAfter=4))

# ── Professional Summary ──
story.extend(section_header('PROFESSIONAL SUMMARY'))
story.append(Paragraph(
    'UI/UX Designer and AI Engineer with a unique blend of user interface design '
    'expertise and artificial intelligence engineering capabilities. Holds a Master '
    'of Science (M.Si.) degree with hands-on experience building end-to-end digital '
    'products spanning user research, UI/UX design, and production-grade AI model '
    'integration. Semifinalist at the PIDI Digdaya Bank Indonesia Hackathon 2026 with '
    'a strong focus on data-driven solutions. Committed to delivering intuitive user '
    'experiences backed by reliable, scalable AI systems.',
    body_style
))

# ── Work Experience ──
story.extend(section_header('WORK EXPERIENCE'))
story.extend(experience_entry(
    'UI/UX Designer & AI Engineer (Hybrid Role)',
    '[Current Company Name]',
    '[Start Year] - Present',
    '[City], Indonesia',
    [
        'Led end-to-end design and AI integration for digital platforms, combining '
        'UX research, prototyping, and machine learning model deployment.',
        'Built a component-based design system that improved visual consistency by '
        '30% and accelerated frontend development cycles.',
        'Implemented Google Gemini API integration for AI tutor features and smart '
        'assistants, delivering personalized experiences for 1,000+ users.',
        'Conducted iterative usability testing that reduced user friction by 25% and '
        'increased task completion rate by 40%.',
        'Collaborated cross-functionally (frontend, backend, ML engineers) to launch '
        '6 production-ready AI products within a 12-month period.',
        'Built an MLOps pipeline (MLflow + GitHub Actions) for automated model '
        'retraining, reducing model drift by 50%.',
    ]
))

# ── Education ──
story.extend(section_header('EDUCATION'))
story.extend(education_entry(
    'Master of Science (M.Si.)',
    '[Graduate University Name]',
    '[Start Year] - [Graduation Year]',
    'Focus: [Field of Study, e.g., Data Science / Computer Science / Applied Mathematics]'
))
story.extend(education_entry(
    'Bachelor of Science (S.Si.)',
    '[Undergraduate University Name]',
    '[Start Year] - [Graduation Year]',
    'Focus: [Field of Study, e.g., Mathematics / Statistics / Computer Science]'
))

# ── Skills ──
story.extend(section_header('SKILLS'))
story.append(Paragraph('<b>UI/UX Design:</b>  Figma, Adobe XD, Design System, Wireframing, Prototyping, Usability Testing, User Research, Journey Mapping, Neumorphic Design', skill_style))
story.append(Paragraph('<b>Frontend Development:</b>  React, Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui, Radix UI, Framer Motion, Zustand, Three.js, GSAP', skill_style))
story.append(Paragraph('<b>AI/Machine Learning:</b>  Google Gemini API, TensorFlow Lite, MLflow, Model Deployment, Prompt Engineering, MLOps, Retrieval-Augmented Generation (RAG)', skill_style))
story.append(Paragraph('<b>Backend &amp; Database:</b>  Prisma ORM, PostgreSQL, Neon, Convex, Supabase, Node.js, REST API, Bcrypt Authentication', skill_style))
story.append(Paragraph('<b>Cloud &amp; DevOps:</b>  Vercel, Cloudflare Pages, GitHub Actions, Docker, CI/CD Pipeline, Expo (React Native)', skill_style))
story.append(Paragraph('<b>Programming Languages:</b>  TypeScript, JavaScript, Python, Dart, PHP, SQL', skill_style))

# ── Certifications (Grouped) ──
story.extend(section_header('CERTIFICATIONS'))
story.append(Paragraph('<b>Dicoding Academy</b> (18 course certificates)', body_style))
story.append(Paragraph('•  <b>Machine Learning &amp; AI</b> — 4 certificates (ML for Beginners, Applied ML, ML Development, AI Integration)', bullet_style))
story.append(Paragraph('•  <b>Frontend &amp; UI/UX</b> — 5 certificates (JS Programming Basics, Frontend Web Fundamentals, React, React Expert, etc.)', bullet_style))
story.append(Paragraph('•  <b>Backend &amp; Cloud</b> — 5 certificates (Backend Fundamentals, AWS Cloud Practitioner, Google Cloud Basics, Azure Fundamentals, Docker)', bullet_style))
story.append(Paragraph('•  <b>Mobile Development</b> — 4 certificates (Android Beginners, Android Fundamentals, Flutter, Multi-platform)', bullet_style))
story.append(Paragraph('<b>Big Data &amp; Data Analytics Training (BDT)</b> — 1 professional certificate', body_style))

# ── Awards ──
story.extend(section_header('AWARDS'))
story.append(Paragraph(
    '<b>Semifinalist — PIDI Digdaya Bank Indonesia Hackathon 2026</b>',
    job_title_style
))
story.append(Paragraph(
    'Bank Indonesia  |  2026  |  National',
    job_meta_style
))
story.append(Paragraph(
    'Collaborated with a team to develop an innovative data- and AI-driven digital '
    'solution supporting Bank Indonesia\'s digital transformation agenda. Passed the '
    'preliminary selection round and ranked among the top 20 teams nationally out of '
    'hundreds of participating teams.',
    body_style
))

# ── Languages ──
story.extend(section_header('LANGUAGES'))
story.append(Paragraph('<b>Indonesian</b> — Native', skill_style))
story.append(Paragraph('<b>English</b> — Professional (TOEFL/IELTS: [Your Score])', skill_style))

# ── Build ──
doc.build(story)
print(f'OK: Resume EN saved to {output_path}')

import os
size_kb = os.path.getsize(output_path) / 1024
print(f'Size: {size_kb:.1f} KB')
