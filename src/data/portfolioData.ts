import { 
  PersonalInfo, 
  Project, 
  SkillCategory, 
  ExperienceItem, 
  EducationItem, 
  CertificationItem, 
  HobbyItem,
  PositionOfResponsibility,
  AchievementItem
} from '../types';

export const personalInfo: PersonalInfo = {
  name: 'Avnish Singh',
  role: 'Machine Learning & Software Developer',
  headline: 'B.Tech CSE · IKGPTU · Python & Machine Learning Specialist',
  email: 'savnish174@gmail.com',
  phone: '(+91) 8429084842',
  location: 'Punjab, India',
  github: 'https://github.com/avnishcodes',
  githubUsername: 'avnishcodes',
  linkedin: 'https://www.linkedin.com/in/avnishcodes',
  linkedinUsername: 'avnishcodes',
  degree: 'B.Tech in Computer Science & Engineering | CGPA: 7.3',
  university: 'I.K. Gujral Punjab Technical University (IKGPTU), Kapurthala, Punjab',
  batch: '07/2024 – Present',
  status: 'Open to Opportunities',
  shortBio: 'B.Tech Computer Science student at IKGPTU with strong foundation in Machine Learning, Python, and Software Development. Hands-on experience in predictive modeling, regression, desktop applications, and QA testing.',
  fullBio: [
    "I am a Computer Science & Engineering undergraduate at I.K. Gujral Punjab Technical University (IKGPTU), Kapurthala, Punjab (07/2024 – Present, CGPA: 7.3).",
    "I previously earned my Diploma in Computer Science & Engineering from Govt. Polytechnic College, Ferozepur (08/2021 – 05/2024, CGPA: 7.05).",
    "My technical expertise centers on Python, Machine Learning (Scikit-Learn, Random Forest, SVM, Regression Models, Google Gemini), REST API Development & Integration, Data Management (SQL, Pandas, NumPy), and Visualizations (Matplotlib, Seaborn, Jupyter Notebooks).",
    "I have completed industrial internships at EME Technologies developing ML models and software tools, served as QA Tester at InvisiaX, and actively lead as PWSkill Campus Ambassador and NCC Cadet at IKGPTU."
  ]
};

export const technicalSkills = {
  programmingLanguages: ['Python (Advanced)', 'C', 'C++'],
  machineLearningAI: ['Scikit-Learn', 'Random Forest', 'SVM', 'Regression Models', 'Google Gemini'],
  apisIntegration: ['REST API Development & Integration'],
  dataManagementAnalysis: ['SQL', 'Pandas', 'NumPy'],
  visualizationTools: ['Matplotlib', 'Seaborn', 'Jupyter Notebooks']
};

export const skillCategories: SkillCategory[] = [
  {
    id: 'programming-languages',
    name: 'Programming Languages',
    description: 'Core languages for software architecture, algorithmic logic, and machine learning.',
    iconName: 'Code',
    accent: 'blue',
    skills: [
      { name: 'Python (Advanced)', level: 95, experience: 'Advanced', highlight: 'Primary language for ML, scripting & desktop development' },
      { name: 'C', level: 82, experience: 'Foundational', highlight: 'Procedural programming & memory fundamentals' },
      { name: 'C++', level: 80, experience: 'Foundational', highlight: 'Object-oriented programming & data structures' }
    ]
  },
  {
    id: 'ml-genai',
    name: 'Machine Learning & AI/GenAI',
    description: 'Predictive algorithms, supervised learning, regression models, and AI integration.',
    iconName: 'BrainCircuit',
    accent: 'teal',
    skills: [
      { name: 'Scikit-Learn', level: 90, experience: 'Proficient', highlight: 'Classification, regression, preprocessing pipelines & model evaluation' },
      { name: 'Random Forest', level: 88, experience: 'Proficient', highlight: 'Ensemble learning for high-accuracy predictions' },
      { name: 'SVM', level: 85, experience: 'Proficient', highlight: 'Support Vector Machines for classification & regression' },
      { name: 'Regression Models', level: 92, experience: 'Proficient', highlight: 'Linear, polynomial, and multi-variable regression analysis' },
      { name: 'Google Gemini', level: 86, experience: 'Proficient', highlight: 'Prompt engineering, multimodal GenAI & API integrations' }
    ]
  },
  {
    id: 'apis-integration',
    name: 'APIs & Integration',
    description: 'Developing and consuming modern application programming interfaces.',
    iconName: 'Cpu',
    accent: 'amber',
    skills: [
      { name: 'REST API Development & Integration', level: 88, experience: 'Proficient', highlight: 'Client-server architecture, JSON serialization, and API endpoints' }
    ]
  },
  {
    id: 'data-management',
    name: 'Data Management & Analysis',
    description: 'Relational databases, data wrangling, and high-performance numeric arrays.',
    iconName: 'Database',
    accent: 'purple',
    skills: [
      { name: 'SQL', level: 88, experience: 'Proficient', highlight: 'Relational querying, schema design, joins & aggregations' },
      { name: 'Pandas', level: 92, experience: 'Proficient', highlight: 'DataFrame manipulation, cleaning, and ETL workflows' },
      { name: 'NumPy', level: 90, experience: 'Proficient', highlight: 'Vectorized mathematical operations & multi-dimensional arrays' }
    ]
  },
  {
    id: 'visualization-tools',
    name: 'Visualization & Tools',
    description: 'Statistical plotting, interactive visual exploratory analysis, and notebook environments.',
    iconName: 'Sparkles',
    accent: 'rose',
    skills: [
      { name: 'Matplotlib', level: 88, experience: 'Proficient', highlight: 'Publication-quality figures, 2D plots & charts' },
      { name: 'Seaborn', level: 86, experience: 'Proficient', highlight: 'Statistical data visualization and correlation heatmaps' },
      { name: 'Jupyter Notebooks', level: 92, experience: 'Proficient', highlight: 'Interactive code experimentation, EDA, and model documentation' }
    ]
  }
];

export const educationData: EducationItem[] = [
  {
    id: 'edu-btech',
    degree: 'B.Tech in Computer Science & Engineering',
    institution: 'I.K. Gujral Punjab Technical University (IKGPTU)',
    location: 'Kapurthala, Punjab',
    period: '07/2024 – Present',
    grade: 'CGPA: 7.09',
    status: 'Present',
    accent: 'blue',
    about: 'Pursuing B.Tech in Computer Science & Engineering with coursework and project focus on Machine Learning, Data Structures, Algorithms, and Software Engineering.',
    highlights: [
      {
        title: 'B.Tech CSE Degree',
        detail: 'Pursuing B.Tech in Computer Science & Engineering through lateral entry, currently maintaining a CGPA of 7.09.'
      },
      {
        title: 'Campus Leadership',
        detail: 'Serving as PWSkill Campus Ambassador and active NCC Cadet representing the university.'
      }
    ],
    badges: ['B.Tech CSE', 'IKGPTU Kapurthala', 'CGPA: 7.09', '07/2024 – Present']
  },
  {
    id: 'edu-diploma',
    degree: 'Diploma in Computer Science & Engineering',
    institution: 'Govt. Polytechnic College',
    location: 'Ferozepur, Punjab',
    period: '08/2021 – 05/2024',
    grade: 'CGPA: 7.05',
    status: 'Completed',
    accent: 'teal',
    about: 'Graduated with Diploma in Computer Science & Engineering with comprehensive foundational training in software development, operating systems, and computer networks.',
    highlights: [
      {
        title: 'Diploma CSE Graduate',
        detail: 'Completed 3-year technical diploma program with CGPA: 7.05.'
      },
      {
        title: 'PTIS Annual Fest Award',
        detail: 'Participated in state-level choreography event on child labour awareness (Oct 2022).'
      }
    ],
    badges: ['Diploma CSE', 'Govt. Polytechnic College', 'CGPA: 7.05', '08/2021 – 05/2024']
  }
];

export const projectsData: Project[] = [
  {
    id: 'cement-strength-predictor',
    title: 'Cement Compressive Strength Predictor',
    tagline: 'Regression Model for Estimating Concrete Compressive Strength',
    category: 'ml',
    categoryLabel: 'Academic Project (ML/GenAI)',
    description: 'Utilized the Concrete Compressive Strength dataset containing mix composition features such as cement, slag, fly ash, water, superplasticizer, aggregates, and curing age to predict concrete strength.',
    detailedOverview: 'Developed a regression model to estimate compressive strength, with data preprocessing, feature scaling, model training, and performance evaluation to ensure accurate predictions. Implemented the project using Python, Scikit-learn, Pandas, NumPy, Matplotlib, and Seaborn for data analysis, visualization, and model development.',
    highlights: [
      'Utilized Concrete Compressive Strength dataset containing mix composition features (cement, slag, fly ash, water, superplasticizer, aggregates, curing age)',
      'Developed regression model with end-to-end data preprocessing, feature scaling, model training, and performance evaluation',
      'Implemented using Python, Scikit-learn, Pandas, NumPy, Matplotlib, and Seaborn for visualization and model development'
    ],
    technologies: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Regression Models', 'Streamlit'],
    metrics: [
      { label: 'Domain', value: 'Machine Learning' },
      { label: 'Task', value: 'Regression' },
      { label: 'Live App', value: 'Streamlit Cloud' }
    ],
    githubUrl: 'https://github.com/avnishcodes/cement-strength-predictor',
    liveDemoUrl: 'https://cement-strength-predictor-hwbassqqhzunrrnxusfnak.streamlit.app/',
    featured: true,
    accentColor: '#3b82f6'
  },
  {
    id: 'online-elibrary-system',
    title: 'Online E-Library System',
    tagline: 'Responsive Web Application for Exploring, Donating & Accessing Books',
    category: 'web',
    categoryLabel: 'Academic Project / Web',
    description: 'Developed a responsive web application for exploring, donating, and accessing books online.',
    detailedOverview: 'Created an interactive platform built with HTML, CSS, JavaScript, and PHP enabling users to search cataloged literature, donate books to community archives, and read digital materials seamlessly across devices.',
    highlights: [
      'Developed responsive web application for exploring, donating, and accessing books online',
      'Implemented backend management and database handling using PHP',
      'Engineered clean user interface and interactions using HTML, CSS, and JavaScript'
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'PHP'],
    metrics: [
      { label: 'Platform', value: 'Web App' },
      { label: 'Frontend', value: 'HTML/CSS/JS' },
      { label: 'Backend', value: 'PHP' }
    ],
    githubUrl: 'https://github.com/avnishcodes',
    liveDemoUrl: 'https://github.com/avnishcodes',
    featured: true,
    accentColor: '#2dd4bf'
  },
  {
    id: 'skyview-weather-app',
    title: 'SkyView – Weather App',
    tagline: 'Desktop Weather Application Using OpenWeatherMap API',
    category: 'python',
    categoryLabel: 'Academic Project / Desktop & API',
    description: 'Created a desktop application to display real-time weather data using the OpenWeatherMap API.',
    detailedOverview: 'Engineered a desktop GUI application using Python and Tkinter that interfaces directly with OpenWeatherMap REST APIs to fetch, parse, and display real-time meteorological conditions for cities worldwide.',
    highlights: [
      'Created a desktop application to display real-time weather data using OpenWeatherMap API',
      'Integrated live REST API calls with dynamic JSON parsing in Python',
      'Crafted intuitive graphical user interface using Tkinter'
    ],
    technologies: ['Python', 'Tkinter', 'OpenWeatherMap API', 'REST API', 'JSON'],
    metrics: [
      { label: 'Type', value: 'Desktop App' },
      { label: 'GUI', value: 'Tkinter' },
      { label: 'API', value: 'OpenWeatherMap' }
    ],
    githubUrl: 'https://github.com/avnishcodes',
    liveDemoUrl: 'https://github.com/avnishcodes',
    featured: true,
    accentColor: '#a78bfa'
  }
];

export const experienceData: ExperienceItem[] = [
  {
    id: 'invisiax-qa',
    role: 'QA Tester',
    company: 'InvisiaX',
    location: 'Remote / India',
    type: 'Internship',
    period: '07/2026 – current',
    dateRange: 'Current',
    accent: 'teal',
    description: 'Performed manual testing of web application features and identified functional defects. Responsible for manual QA testing, bug reporting, and verification.',
    bullets: [
      'Performed manual testing of web application features and identified functional defects.',
      'Manual QA testing, bug reporting, and verification of web application features.'
    ],
    technologies: ['Manual QA Testing', 'Bug Reporting', 'Web Application Testing', 'Feature Verification'],
    keyOutcome: 'Identified and verified functional web application features to ensure defect-free user experiences.'
  },
  {
    id: 'eme-ml-intern',
    role: 'Industrial Project (45-day Internship)',
    company: 'EME Technologies',
    location: 'Chandigarh / Mohali, India',
    type: 'Internship',
    period: '06/2025 – 07/2025',
    dateRange: '45-Day Internship',
    accent: 'blue',
    description: 'Developed machine learning models using Random Forest, SVM, Decision Trees, and Linear Regression for classification and regression tasks.',
    bullets: [
      'Developed machine learning models using Random Forest, SVM, Decision Trees, and Linear Regression for classification and regression tasks.',
      'Preprocessed datasets, performed feature engineering, evaluated model performance, and compared algorithms to improve prediction accuracy.',
      'Demonstrated strong problem-solving skills by tackling real-world coding challenges and translating raw data into actionable insights.'
    ],
    technologies: ['Machine Learning', 'Random Forest', 'SVM', 'Decision Trees', 'Linear Regression', 'Scikit-learn', 'Feature Engineering'],
    keyOutcome: 'Built and evaluated multi-model ML architectures with feature engineering and performance comparison.'
  },
  {
    id: 'eme-training',
    role: 'Full-time (45-day industrial training)',
    company: 'EME Technologies',
    location: 'Chandigarh / Mohali, India',
    type: 'Industrial Training',
    period: '07/2023 – 08/2023',
    dateRange: '45-Day Training',
    accent: 'amber',
    description: 'Built projects including a text editor and developed skills in data analysis, automation, and web scraping.',
    bullets: [
      'Built projects including a text editor and developed skills in data analysis, automation, and web scraping.',
      'Problem-solving abilities and gained hands-on experience with real-world coding tasks.'
    ],
    technologies: ['Python', 'Text Editor', 'Data Analysis', 'Automation', 'Web Scraping', 'Tkinter'],
    keyOutcome: 'Constructed custom text editor software and automated data extraction scripts in Python.'
  }
];

export const positionsOfResponsibility: PositionOfResponsibility[] = [
  {
    id: 'pwskill-ambassador',
    role: 'PWSkill Campus Ambassadors',
    organization: 'IKGPTU, Kapurthala',
    period: '2024 – Present',
    bullets: [
      'Involved in organizing tech awareness sessions and peer-led workshops at the University level.',
      'Coordinated events and promoted student engagement in tech initiatives, driving participation.'
    ]
  },
  {
    id: 'ncc-cadet',
    role: 'NCC Cadet',
    organization: 'IKGPTU, Kapurthala',
    period: '2024 – Present',
    bullets: [
      'Represented the University in NCC camps, drills, and parades.',
      'Gained strong leadership, discipline, and teamwork experience through structured community training and national-level programs.'
    ]
  }
];

export const achievementsData: AchievementItem[] = [
  {
    id: 'achieve-opensource',
    description: 'Contributed to open-source projects and attended tech workshops/webinars, including those focused on Machine Learning/AI.',
    highlight: 'Open-Source & AI Workshops'
  },
  {
    id: 'achieve-ptis',
    description: 'Participated in a state-level choreography event themed on child labour at PTIS Annual Fest (Oct 2022).',
    highlight: 'State-Level PTIS Event'
  },
  {
    id: 'achieve-hobbies',
    description: 'Hobbies : Reading tech blogs (especially AI/ML), and listening to music.',
    highlight: 'Tech Blogs & Music'
  }
];

export const certificationsData: CertificationItem[] = [
  {
    id: 'course-azure-data-eng',
    title: 'Azure Data Engineering End-to-End 2026',
    issuer: 'Udemy · Cloud and Data Universe',
    platform: 'Udemy',
    date: '2026',
    status: 'In Progress',
    category: 'course',
    accent: 'blue',
    icon: 'Cloud',
    skills: ['Microsoft Azure', 'PySpark', 'Python', 'Azure Data Factory', 'Databricks', 'Cloud ETL', 'SQL'],
    description: 'Comprehensive end-to-end cloud data engineering training covering distributed processing with PySpark, building scalable ETL pipelines in Azure Data Factory, Databricks analytics, and cloud lakehouse architecture.'
  },
  {
    id: 'course-sql-mysql-bi',
    title: 'SQL – MySQL for Data Analytics and Business Intelligence',
    issuer: 'Udemy · 365 Careers',
    platform: 'Udemy',
    date: '2026',
    status: 'In Progress',
    category: 'course',
    accent: 'amber',
    icon: 'Database',
    skills: ['MySQL', 'SQL Queries', 'Data Analytics', 'Business Intelligence', 'Database Design', 'Relational DB'],
    description: 'Specialized business intelligence and data analytics coursework with MySQL. Covers complex relational joins, aggregations, window functions, database normalization, and analytics reporting.'
  },
  {
    id: 'course-how-to-learn',
    title: 'How to Learn: Effective Approaches for Self-Guided Learning',
    issuer: 'Udemy',
    platform: 'Udemy',
    date: '2026',
    status: 'Active',
    category: 'specialization',
    accent: 'purple',
    icon: 'BookOpen',
    skills: ['Self-Guided Learning', 'Cognitive Strategies', 'Accelerated Learning', 'Technical Mastery'],
    description: 'Frameworks and proven cognitive approaches for structured self-directed learning, metacognition, mental modeling, and rapid acquisition of complex technical domains.'
  },
  {
    id: 'cert-ml',
    title: 'Machine Learning & Predictive Modeling',
    issuer: 'EME Technologies',
    platform: 'EME Technologies',
    date: 'July 2025',
    category: 'certification',
    accent: 'teal',
    icon: 'Brain',
    skills: ['Scikit-Learn', 'Random Forest', 'SVM', 'Regression Models', 'Feature Engineering'],
    description: 'Industrial project training in supervised machine learning classification, regression modeling, and performance evaluation on real-world datasets.'
  },
  {
    id: 'cert-python',
    title: 'Python Software Development & Automation',
    issuer: 'EME Technologies',
    platform: 'EME Technologies',
    date: 'August 2023',
    category: 'certification',
    accent: 'indigo',
    icon: 'Code2',
    skills: ['Python', 'Text Editor', 'Data Analysis', 'Web Scraping', 'Tkinter GUI'],
    description: '45-day industrial training certification covering Python software engineering, GUI development, automation scripts, and data pipelines.'
  }
];

export const hobbiesData: HobbyItem[] = [
  {
    id: 'tech-blogs',
    name: 'Reading Tech Blogs',
    emoji: '📖',
    tag: 'AI & Machine Learning',
    color: 'blue',
    description: 'Reading technical blogs, AI/ML research breakthroughs, and software engineering architecture insights.',
    detail: 'Passionate about staying updated with state-of-the-art developments in generative AI, neural networks, and Python ecosystem enhancements.'
  },
  {
    id: 'music',
    name: 'Listening to Music',
    emoji: '🎵',
    tag: 'Focus & Relaxation',
    color: 'purple',
    description: 'Listening to music to unwind and maintain high focus during coding sessions.',
    detail: 'Soundtracks and curated playlists serve as an essential creative backdrop for deep problem solving.'
  }
];
