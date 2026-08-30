import React, { useState } from 'react';
import { 
  personalInfo, 
  experienceData, 
  educationData, 
  projectsData, 
  positionsOfResponsibility, 
  achievementsData 
} from '../data/portfolioData';
import { 
  X, 
  Printer, 
  Mail, 
  Phone, 
  Github, 
  Linkedin, 
  ExternalLink,
  Download,
  FileText
} from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="resume-view-modal"
      className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-950 border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-slate-200 block">
                Avnish_Singh_Resume.pdf
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Updated Official Resume
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Print / Save PDF Button */}
            <button
              onClick={handlePrint}
              id="resume-print-btn"
              title="Print or Save as PDF"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              id="resume-close-btn"
              aria-label="Close resume modal"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Resume Canvas */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-6 md:p-8 bg-slate-950/60 flex justify-center">
          <div 
            id="printable-resume-sheet"
            className="w-full max-w-[820px] rounded-xl sm:rounded-2xl p-6 sm:p-10 shadow-2xl font-sans text-xs sm:text-sm leading-relaxed bg-slate-950 text-slate-200 border border-slate-800/90 print:bg-white print:text-black print:p-0 print:shadow-none print:max-w-none print:border-none"
          >
            
            {/* 1. Header */}
            <header className="border-b-2 border-slate-800 pb-3 mb-4 print:border-black">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white print:text-black">
                    {personalInfo.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium mt-1">
                    <a 
                      href={`mailto:${personalInfo.email}`} 
                      className="hover:underline flex items-center gap-1 text-slate-300 print:text-black"
                    >
                      <Mail className="w-3 h-3 text-indigo-400 print:hidden" />
                      {personalInfo.email}
                    </a>
                    <span className="text-slate-600 print:text-black">|</span>
                    <a 
                      href={`tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}`} 
                      className="hover:underline flex items-center gap-1 text-slate-300 print:text-black"
                    >
                      <Phone className="w-3 h-3 text-indigo-400 print:hidden" />
                      {personalInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end text-xs font-mono gap-1">
                  <a 
                    href={personalInfo.linkedin} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:underline text-indigo-400 print:text-black font-semibold"
                  >
                    <Linkedin className="w-3 h-3 print:hidden" />
                    <span>linkedin/{personalInfo.linkedinUsername}</span>
                  </a>
                  <a 
                    href={personalInfo.github} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:underline text-slate-300 print:text-black font-semibold"
                  >
                    <Github className="w-3 h-3 print:hidden" />
                    <span>github/{personalInfo.githubUsername}</span>
                  </a>
                </div>
              </div>
            </header>

            {/* 2. TECHNICAL SKILL */}
            <section className="mb-4">
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-indigo-300 border-b border-slate-800 pb-0.5 mb-2 print:text-black print:border-black">
                TECHNICAL SKILL
              </h2>
              <ul className="space-y-1 text-xs sm:text-[13px] text-slate-200 print:text-black">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 select-none leading-tight font-bold">●</span>
                  <div>
                    <strong className="text-white font-bold">Programming Languages:</strong> Python (Advanced), C, C++
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 select-none leading-tight font-bold">●</span>
                  <div>
                    <strong className="text-white font-bold">Machine Learning &amp; AI/GenAI:</strong> Scikit-Learn, Random Forest, SVM, Regression Models, Google Gemini
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 select-none leading-tight font-bold">●</span>
                  <div>
                    <strong className="text-white font-bold">APIs &amp; Integration:</strong> REST API Development &amp; Integration
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 select-none leading-tight font-bold">●</span>
                  <div>
                    <strong className="text-white font-bold">Data Management &amp; Analysis:</strong> SQL, Pandas, NumPy
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 select-none leading-tight font-bold">●</span>
                  <div>
                    <strong className="text-white font-bold">Visualization &amp; Tools:</strong> Matplotlib, Seaborn, Jupyter Notebooks
                  </div>
                </li>
              </ul>
            </section>

            {/* 3. EDUCATION */}
            <section className="mb-4">
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-indigo-300 border-b border-slate-800 pb-0.5 mb-2 print:text-black print:border-black">
                EDUCATION
              </h2>
              <div className="space-y-2.5 text-xs sm:text-[13px] text-slate-200 print:text-black">
                
                {/* Degree 1 */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="flex items-start gap-2 font-bold text-white print:text-black">
                      <span className="text-slate-400 select-none leading-tight font-bold">●</span>
                      <span>I.K. Gujral Punjab Technical University (IKGPTU), Kapurthala, Punjab</span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-300 print:text-black shrink-0 sm:pl-2">
                      07/2024 – Present
                    </span>
                  </div>
                  <div className="pl-5 text-slate-300 print:text-black mt-0.5">
                    <span className="text-slate-400 mr-1.5">○</span>
                    B.Tech in Computer Science &amp; Engineering (Lateral Entry) | <span className="font-semibold">CGPA: 7.09</span>
                  </div>
                </div>

                {/* Degree 2 */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="flex items-start gap-2 font-bold text-white print:text-black">
                      <span className="text-slate-400 select-none leading-tight font-bold">●</span>
                      <span>Govt. Polytechnic College, Ferozepur, Punjab</span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-300 print:text-black shrink-0 sm:pl-2">
                      08/2021 – 05/2024
                    </span>
                  </div>
                  <div className="pl-5 text-slate-300 print:text-black mt-0.5">
                    <span className="text-slate-400 mr-1.5">○</span>
                    Diploma in Computer Science &amp; Engineering | <span className="font-semibold">CGPA: 7.05</span>
                  </div>
                </div>

              </div>
            </section>

            {/* 4. ACADEMIC PROJECTS (Focus on ML/GenAI) */}
            <section className="mb-4">
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-indigo-300 border-b border-slate-800 pb-0.5 mb-2 print:text-black print:border-black">
                ACADEMIC PROJECTS (Focus on ML/GenAI)
              </h2>
              <div className="space-y-3 text-xs sm:text-[13px] text-slate-200 print:text-black">
                
                {/* Project 1 */}
                <div>
                  <div className="flex items-baseline gap-2 font-bold text-white print:text-black">
                    <span className="text-slate-400 select-none font-bold">●</span>
                    <span>
                      Cement Compressive Strength Predictor{' '}
                      <a 
                        href="https://github.com/avnishcodes" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-indigo-400 print:text-black font-normal hover:underline inline-flex items-center gap-0.5"
                      >
                        ( Github Link )
                      </a>
                    </span>
                  </div>
                  <ul className="pl-5 space-y-1 text-slate-300 print:text-black mt-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none">○</span>
                      <span>Utilized the Concrete Compressive Strength dataset containing mix composition features such as cement, slag, fly ash, water, superplasticizer, aggregates, and curing age to predict concrete strength.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none">○</span>
                      <span>Developed a regression model to estimate compressive strength, with data preprocessing, feature scaling, model training, and performance evaluation to ensure accurate predictions.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none">○</span>
                      <span>Implemented the project using Python, Scikit-learn, Pandas, NumPy, Matplotlib, and Seaborn for data analysis, visualization, and model development.</span>
                    </li>
                  </ul>
                </div>

                {/* Project 2 */}
                <div>
                  <div className="flex items-baseline gap-2 font-bold text-white print:text-black">
                    <span className="text-slate-400 select-none font-bold">●</span>
                    <span>
                      Online E-Library System{' '}
                      <a 
                        href="https://github.com/avnishcodes" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-indigo-400 print:text-black font-normal hover:underline inline-flex items-center gap-0.5"
                      >
                        ( Github Link )
                      </a>
                    </span>
                  </div>
                  <ul className="pl-5 space-y-1 text-slate-300 print:text-black mt-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none">○</span>
                      <span>Developed a responsive web application for exploring, donating, and accessing books online.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none">○</span>
                      <span>Tech: HTML, CSS, JavaScript, PHP</span>
                    </li>
                  </ul>
                </div>

                {/* Project 3 */}
                <div>
                  <div className="flex items-baseline gap-2 font-bold text-white print:text-black">
                    <span className="text-slate-400 select-none font-bold">●</span>
                    <span>SkyView – Weather App</span>
                  </div>
                  <ul className="pl-5 space-y-1 text-slate-300 print:text-black mt-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none">○</span>
                      <span>Created a desktop application to display real-time weather data using the OpenWeatherMap API.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none">○</span>
                      <span>Tech: Python, Tkinter, API</span>
                    </li>
                  </ul>
                </div>

              </div>
            </section>

            {/* 5. INTERNSHIP */}
            <section className="mb-4">
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-indigo-300 border-b border-slate-800 pb-0.5 mb-2 print:text-black print:border-black">
                INTERNSHIP
              </h2>
              <div className="space-y-3 text-xs sm:text-[13px] text-slate-200 print:text-black">
                
                {/* Internship 1 */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="flex items-start gap-2 font-bold text-white print:text-black">
                      <span className="text-slate-400 select-none font-bold">●</span>
                      <span>InvisiaX · QA Tester</span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-300 print:text-black shrink-0 sm:pl-2">
                      07/2026 - current
                    </span>
                  </div>
                  <ul className="pl-5 space-y-1 text-slate-300 print:text-black mt-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none">○</span>
                      <span>Performed manual testing of web application features and identified functional defects.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none">○</span>
                      <span>Manual QA testing, bug reporting, and verification of web application features.</span>
                    </li>
                  </ul>
                </div>

                {/* Internship 2 */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="flex items-start gap-2 font-bold text-white print:text-black">
                      <span className="text-slate-400 select-none font-bold">●</span>
                      <span>EME Technologies · Industrial Project (45-day Internship)</span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-300 print:text-black shrink-0 sm:pl-2">
                      06/2025 - 07/2025
                    </span>
                  </div>
                  <ul className="pl-5 space-y-1 text-slate-300 print:text-black mt-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none">○</span>
                      <span>Developed machine learning models using Random Forest, SVM, Decision Trees, and Linear Regression for classification and regression tasks.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none">○</span>
                      <span>Preprocessed datasets, performed feature engineering, evaluated model performance, and compared algorithms to improve prediction accuracy.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none">○</span>
                      <span>Demonstrated strong problem-solving skills by tackling real-world coding challenges and translating raw data into actionable insights.</span>
                    </li>
                  </ul>
                </div>

                {/* Internship 3 */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="flex items-start gap-2 font-bold text-white print:text-black">
                      <span className="text-slate-400 select-none font-bold">●</span>
                      <span>EME Technologies · Full-time (45-day industrial training )</span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-300 print:text-black shrink-0 sm:pl-2">
                      07/2023 - 08/2023
                    </span>
                  </div>
                  <ul className="pl-5 space-y-1 text-slate-300 print:text-black mt-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none">○</span>
                      <span>Built projects including a text editor and developed skills in data analysis, automation, and web scraping.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none">○</span>
                      <span>Problem-solving abilities and gained hands-on experience with real-world coding tasks.</span>
                    </li>
                  </ul>
                </div>

              </div>
            </section>

            {/* 6. POSITION OF RESPONSIBILITY */}
            <section className="mb-4">
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-indigo-300 border-b border-slate-800 pb-0.5 mb-2 print:text-black print:border-black">
                POSITION OF RESPONSIBILITY
              </h2>
              <div className="space-y-3 text-xs sm:text-[13px] text-slate-200 print:text-black">
                
                {/* Position 1 */}
                <div>
                  <div className="flex items-start gap-2 font-bold text-white print:text-black">
                    <span className="text-slate-400 select-none font-bold">●</span>
                    <span>PWSkill Campus Ambassadors | IKGPTU, Kapurthala (2024 – Present)</span>
                  </div>
                  <ul className="pl-5 space-y-1 text-slate-300 print:text-black mt-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none">○</span>
                      <span>Involved in organizing tech awareness sessions and peer-led workshops at the University level.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none">○</span>
                      <span>Coordinated events and promoted student engagement in tech initiatives, driving participation.</span>
                    </li>
                  </ul>
                </div>

                {/* Position 2 */}
                <div>
                  <div className="flex items-start gap-2 font-bold text-white print:text-black">
                    <span className="text-slate-400 select-none font-bold">●</span>
                    <span>NCC Cadet | IKGPTU, Kapurthala (2024 – Present)</span>
                  </div>
                  <ul className="pl-5 space-y-1 text-slate-300 print:text-black mt-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none">○</span>
                      <span>Represented the University in NCC camps, drills, and parades.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none">○</span>
                      <span>Gained strong leadership, discipline, and teamwork experience through structured community training and national-level programs.</span>
                    </li>
                  </ul>
                </div>

              </div>
            </section>

            {/* 7. ACHIEVEMENTS */}
            <section>
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-indigo-300 border-b border-slate-800 pb-0.5 mb-2 print:text-black print:border-black">
                ACHIEVEMENTS
              </h2>
              <ul className="space-y-1.5 text-xs sm:text-[13px] text-slate-200 print:text-black">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 select-none font-bold">●</span>
                  <span>
                    Contributed to open-source projects and attended tech workshops/webinars, including those focused on <strong className="font-bold text-white print:text-black">Machine Learning/AI</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 select-none font-bold">●</span>
                  <span>
                    Participated in a state-level choreography event themed on child labour at <strong className="font-bold text-white print:text-black">PTIS Annual Fest (Oct 2022)</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 select-none font-bold">●</span>
                  <span>
                    <strong className="font-bold text-white print:text-black">Hobbies :</strong> Reading tech blogs (especially AI/ML), and listening to music.
                  </span>
                </li>
              </ul>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};
