// Avnish Singh Portfolio Intelligence & Speech Formatting Engine

/**
 * Strips all Markdown syntax, links, URLs, hashes, bullets, and technical formatting
 * so that text-to-speech synthesis (TTS) sounds like a natural human speaking,
 * with ZERO "hashtags", "stars", or raw link spellings.
 */
export function cleanTextForSpeech(rawText: string): string {
  if (!rawText) return '';

  let cleaned = rawText;

  // 1. Remove code blocks
  cleaned = cleaned.replace(/```[\s\S]*?```/g, ' ');
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // 2. Convert markdown links [Text](URL) to just "Text"
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 3. Remove raw URLs (https://... or http://...)
  cleaned = cleaned.replace(/https?:\/\/[^\s)]+/g, '');

  // 4. Remove headings (###, ##, #)
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');

  // 5. Remove bold, italics, strikethrough (**, *, __, _, ~~)
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');
  cleaned = cleaned.replace(/__([^_]+)__/g, '$1');
  cleaned = cleaned.replace(/_([^_]+)_/g, '$1');
  cleaned = cleaned.replace(/~~([^~]+)~~/g, '$1');

  // 6. Remove list markers (*, -, +, 1., 2.)
  cleaned = cleaned.replace(/^[\s]*[-*+]\s+/gm, '');
  cleaned = cleaned.replace(/^[\s]*\d+\.\s+/gm, '');

  // 7. Remove blockquotes and horizontal rules
  cleaned = cleaned.replace(/^>\s+/gm, '');
  cleaned = cleaned.replace(/^---+$/gm, '');

  // 8. Replace symbols and brackets with spoken words or spaces
  cleaned = cleaned.replace(/[#*~`><|]/g, ' ');
  cleaned = cleaned.replace(/&amp;/g, 'and');
  cleaned = cleaned.replace(/&/g, 'and');
  cleaned = cleaned.replace(/[\(\)\[\]\{\}]/g, ' ');

  // 9. Clean up extra whitespace and newlines
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

/**
 * Generates natural spoken dialogue specifically crafted for Voice Assistant speech.
 * Written purely as conversational sentences — no markdown, no technical symbols.
 */
export function generateSpokenVoiceResponse(query: string, role?: string): string {
  const q = (query || '').toLowerCase();

  if (q.includes('project') || q.includes('cement') || q.includes('strength') || q.includes('machine learning') || q.includes('model')) {
    return "Avnish has developed prominent machine learning projects, most notably the Cement Compressive Strength Predictor. He built regression models using Scikit-learn, Random Forest, and Support Vector Machines to accurately forecast concrete durability with interactive Streamlit visualizations. He has also created a full-stack Online E-Library System and a Python desktop weather analytics application.";
  }

  if (q.includes('intern') || q.includes('eme') || q.includes('invisiax') || q.includes('experience') || q.includes('work') || q.includes('job')) {
    return "Avnish is currently working as a remote QA Tester at InvisiaX, where he conducts functional testing and quality verification for web applications. Previously, he completed a machine learning internship at EME Technologies in Mohali, training supervised models and engineering data pipelines, as well as industrial training building Python automation tools.";
  }

  if (q.includes('education') || q.includes('ikgptu') || q.includes('degree') || q.includes('diploma') || q.includes('cgpa') || q.includes('btech') || q.includes('college') || q.includes('study')) {
    return "Avnish is pursuing his B.Tech in Computer Science and Engineering at IKGPTU through lateral entry with a 7.09 CGPA. He serves as a PWSkill Campus Ambassador and an NCC Cadet. Prior to this, he graduated with a Grade A Diploma in Computer Science from Government Polytechnic College Ferozepur.";
  }

  if (q.includes('skill') || q.includes('python') || q.includes('tech') || q.includes('stack') || q.includes('language')) {
    return "Avnish specializes in Python for data science and machine learning. His core technical stack includes Scikit-learn, Random Forest, Support Vector Machines, Decision Trees, Pandas, NumPy, SQL, and data visualization using Matplotlib and Seaborn, alongside full-stack web and REST API development.";
  }

  if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('phone') || q.includes('reach') || q.includes('location')) {
    return "You can reach Avnish directly by email at savnish174@gmail.com, or by phone at plus 91 8429084842. He is based in Punjab, India, and is actively open to software developer opportunities and internships.";
  }

  if (role === 'recruiter') {
    return "Avnish Singh is a skilled Machine Learning and Software Developer with hands-on experience in Python, Scikit-learn, and QA testing. He is currently available for full-time internships and junior software developer roles, both remote and on-site.";
  }

  return "Hello! I am Avnish Singh's AI portfolio assistant. I can speak with you about his machine learning pipelines, his B.Tech at IKGPTU, his internship accomplishments at EME Technologies, or his software projects. What would you like to know?";
}

/**
 * Generates structured Markdown text responses for the Chat tab.
 */
export function generateTextChatResponse(query: string, role?: string): string {
  const q = (query || '').toLowerCase();

  if (q.includes('project') || q.includes('cement') || q.includes('strength')) {
    return `### 🚀 Avnish's Featured Projects\n\n1. **Cement Compressive Strength Predictor (Machine Learning / Scikit-learn)**\n   - Predicts 28-day concrete compressive strength using regression techniques (Random Forest, SVM, Decision Trees).\n   - Built end-to-end data pipeline: feature scaling, outlier handling, and correlation analysis.\n   - Interactive UI deployed on Streamlit with real-time prediction and visualization.\n   - **Live App**: [Streamlit Web App](https://cement-strength-predictor-hwbassqqhzunrrnxusfnak.streamlit.app/)\n   - **GitHub**: [github.com/avnishcodes/cement-strength-predictor](https://github.com/avnishcodes/cement-strength-predictor)\n\n2. **Online E-Library Management System (Full-Stack)**\n   - Web-based cataloging platform built with HTML5, CSS3, JavaScript, and PHP with SQL database management.\n\n3. **SkyView Weather Analytics Application (Desktop Python)**\n   - Python GUI desktop application utilizing Tkinter and live OpenWeatherMap REST API integrations.`;
  }

  if (q.includes('intern') || q.includes('eme') || q.includes('invisiax') || q.includes('experience') || q.includes('work')) {
    return `### 💼 Professional Experience & Internships\n\n- **QA Tester at InvisiaX** *(07/2026 – Present, Remote)*\n  - Conducting end-to-end manual QA testing, identifying functional defects, and verifying responsive UI layouts across web applications.\n\n- **ML Industrial Project Intern at EME Technologies, Mohali** *(06/2025 – 07/2025)*\n  - Developed supervised ML models (Linear & Polynomial Regression, Random Forest, SVM) with feature engineering and cross-validation.\n  - Analyzed and visualized datasets using Pandas, NumPy, Matplotlib, and Seaborn.\n\n- **Python Developer Trainee at EME Technologies** *(07/2023 – 08/2023)*\n  - Built desktop automation tools and custom software in Python Tkinter.`;
  }

  if (q.includes('skill') || q.includes('tech') || q.includes('python') || q.includes('ml')) {
    return `### ⚡ Technical Skillset\n\n- **Programming Languages**: Python (Primary, Advanced), C, C++, SQL\n- **Machine Learning & AI**: Scikit-learn, Random Forest, SVM, Decision Trees, Regression Models, Google Gemini GenAI\n- **Data Engineering & Analysis**: Pandas, NumPy, Matplotlib, Seaborn, Jupyter Notebooks\n- **Web & Frameworks**: HTML5, CSS3, JavaScript, PHP, Streamlit, Tkinter, REST APIs\n- **Tools & Environments**: Git, GitHub, VS Code, Linux/Windows`;
  }

  if (q.includes('education') || q.includes('ikgptu') || q.includes('degree') || q.includes('cgpa') || q.includes('btech')) {
    return `### 🎓 Education & Credentials\n\n- **B.Tech in Computer Science & Engineering** *(07/2024 – Present, Lateral Entry, CGPA: 7.09)*\n  - I.K. Gujral Punjab Technical University (IKGPTU), Kapurthala, Punjab\n  - **Leadership**: PWSkill Campus Ambassador & NCC Cadet representing the university.\n\n- **Diploma in Computer Science & Engineering** *(08/2021 – 05/2024, CGPA: 7.05, Grade A)*\n  - Govt. Polytechnic College, Ferozepur, Punjab\n  - Awarded PTIS State-Level Dance Trophy for Child Labour Social Awareness (Oct 2022).`;
  }

  if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('phone')) {
    return `### 📬 Contact Information\n\n- **Email**: [savnish174@gmail.com](mailto:savnish174@gmail.com)\n- **Phone**: [+91 8429084842](tel:+918429084842)\n- **GitHub**: [github.com/avnishcodes](https://github.com/avnishcodes)\n- **LinkedIn**: [linkedin.com/in/avnishcodes](https://www.linkedin.com/in/avnishcodes)\n- **Location**: Punjab, India\n\nAvnish is actively open to software developer opportunities, internships, and collaborations!`;
  }

  return `Avnish Singh is a Computer Science undergraduate at IKGPTU specializing in **Machine Learning (Scikit-learn, Regression, Classification)** and **Python Software Development**.\n\nFeel free to ask about his **ML projects**, **EME Technologies internship**, **technical skills**, or **academic background**!`;
}
