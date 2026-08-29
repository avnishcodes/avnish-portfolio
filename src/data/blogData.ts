import { BlogPost } from '../types';

export const blogPostsData: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'scikit-learn-hyperparameter-optimization',
    title: 'Demystifying Hyperparameter Optimization in Scikit-Learn: From GridSearch to Bayesian Pipelines',
    subtitle: 'A practical deep dive into tuning classification models, mitigating cross-validation leakage, and maximizing ROC-AUC score.',
    excerpt: 'Explore best practices for tuning machine learning models in Python. Learn how to construct leak-free ColumnTransformer pipelines, balance computational budget, and evaluate precision-recall trade-offs on skewed data.',
    date: 'Aug 14, 2026',
    readTime: '6 min read',
    category: 'machine-learning',
    categoryLabel: 'Machine Learning',
    tags: ['Python', 'Scikit-learn', 'Cross-Validation', 'Pipelines'],
    featured: true,
    author: {
      name: 'Avnish Singh',
      role: 'AI/ML & Software Engineer',
    },
    keyTakeaways: [
      'Always encapsulate preprocessing steps in a Pipeline before running GridSearchCV to prevent cross-validation data leakage.',
      'For imbalanced datasets, optimize for Average Precision (PR-AUC) or ROC-AUC rather than raw classification accuracy.',
      'RandomizedSearchCV often reaches within 98% of optimal hyperparameters in a fraction of the computational runtime.'
    ],
    content: `
### The Challenge with Naive Model Tuning

When training supervised learning models, beginners often make a critical mistake: applying feature scaling or categorical encoding across the entire dataset before splitting it into training and validation folds. This introduces subtle data leakage where information from the validation fold bleeds into the model parameters, resulting in overly optimistic accuracy scores that fail in production.

\`\`\`python
# ❌ INCORRECT: Preprocessing before splitting creates data leakage
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X) # Leaks global mean & variance into test fold!
cv_scores = cross_val_score(RandomForestClassifier(), X_scaled, y, cv=5)
\`\`\`

---

### The Correct Way: Encapsulation with Pipelines

In Python's \`scikit-learn\` ecosystem, the \`Pipeline\` and \`ColumnTransformer\` constructs ensure that transformations are fitted strictly on training folds during each cross-validation iteration:

\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import RandomizedSearchCV

# Define categorical & numerical pipelines
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
    ('encoder', OneHotEncoder(handle_unknown='ignore'))
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ]
)

# Full end-to-end model pipeline
clf = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(random_state=42))
])
\`\`\`

---

### Hyperparameter Search Space Strategy

When working with ensemble tree models like Random Forest or Gradient Boosting, hyperparameter spaces can quickly explode if you evaluate every combination with exhaustive grid search.

Instead, randomized sampling allows you to cover broad distribution spaces with fixed computational time budgets:

\`\`\`python
param_distributions = {
    'classifier__n_estimators': [100, 200, 300, 500],
    'classifier__max_depth': [None, 10, 20, 30],
    'classifier__min_samples_split': [2, 5, 10],
    'classifier__min_samples_leaf': [1, 2, 4],
    'classifier__max_features': ['sqrt', 'log2']
}

search = RandomizedSearchCV(
    clf,
    param_distributions=param_distributions,
    n_iter=25,
    scoring='roc_auc',
    cv=5,
    random_state=42,
    n_jobs=-1
)

search.fit(X_train, y_train)
print(f"Optimal ROC-AUC: {search.best_score_:.4f}")
\`\`\`

---

### Summary & Practical Tips

1. **Protect your test set**: Keep your holdout test set completely untouched until the final model pipeline is chosen.
2. **Choose the right evaluation metric**: In fraud detection or medical diagnosis where classes are unbalanced, optimize for F1-score or PR-AUC rather than raw accuracy.
3. **Monitor latency**: More trees and deeper depths increase inference time. Always benchmark the trade-off between a 0.5% metric boost and production response times.
`
  },
  {
    id: 'post-2',
    slug: 'python-desktop-tools-subprocesses',
    title: 'Architecting Non-Blocking Desktop Tools in Python with Asynchronous Subprocesses',
    subtitle: 'How to build responsive GUI editors without UI freezing during background script execution.',
    excerpt: 'A technical walkthrough on managing child processes, streaming stdout/stderr without blocking event loops, and structuring clean multi-tab text editors in pure Python.',
    date: 'Jul 28, 2026',
    readTime: '5 min read',
    category: 'software-engineering',
    categoryLabel: 'Software Engineering',
    tags: ['Python', 'Threading', 'Subprocess', 'GUI Architecture'],
    featured: true,
    author: {
      name: 'Avnish Singh',
      role: 'AI/ML & Software Engineer',
    },
    keyTakeaways: [
      'Never invoke blocking operations (like subprocess.run or network requests) directly in the GUI main thread.',
      'Use worker threads or non-blocking polling loops with queue.Queue to stream console output in real-time.',
      'Always cleanly terminate child processes when the parent application window is closed.'
    ],
    content: `
### The Concurrency Problem in GUI Applications

When developing desktop applications in Python (such as the SmartCode IDE project), one common pitfall is freezing the user interface whenever a user clicks "Run Script".

Because Python GUI frameworks (like Tkinter, PyQt, or CustomTkinter) run on a single-threaded event loop, any synchronous call like \`subprocess.run()\` blocks the window from processing paint events, mouse clicks, and keyboard inputs until the spawned script finishes.

---

### Designing an Asynchronous Execution Worker

To keep the interface silky smooth and responsive, we isolate script execution inside a dedicated background worker thread that communicates back to the GUI via thread-safe queues.

\`\`\`python
import subprocess
import threading
import queue
import sys

class ScriptRunner:
    def __init__(self, output_callback):
        self.output_callback = output_callback
        self.process = None
        self.is_running = False

    def execute_script(self, script_path):
        if self.is_running:
            return False

        self.is_running = True
        thread = threading.Thread(
            target=self._run_subprocess,
            args=(script_path,),
            daemon=True
        )
        thread.start()
        return True

    def _run_subprocess(self, script_path):
        try:
            self.process = subprocess.Popen(
                [sys.executable, script_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=1
            )

            # Stream stdout line-by-line
            for line in self.process.stdout:
                self.output_callback(line, "stdout")

            # Capture errors if any
            stderr_output = self.process.stderr.read()
            if stderr_output:
                self.output_callback(stderr_output, "stderr")

            self.process.wait()
            self.output_callback(f"\\nProcess finished with exit code {self.process.returncode}\\n", "system")
        except Exception as e:
            self.output_callback(f"Execution failed: {str(e)}\\n", "error")
        finally:
            self.is_running = False
\`\`\`

---

### Clean Lifecycle & Graceful Shutdown

Handling child processes also requires defensive signal handling. When a user closes the editor window while a long-running simulation or infinite loop is executing, we must cleanly terminate the child process tree:

\`\`\`python
def cleanup_on_exit(self):
    if self.process and self.process.poll() is None:
        self.process.terminate()
        try:
            self.process.wait(timeout=1.5)
        except subprocess.TimeoutExpired:
            self.process.kill()
\`\`\`

This decoupled architecture keeps the text editor responsive at 60 FPS while enabling real-time terminal output streaming!
`
  },
  {
    id: 'post-3',
    slug: 'sql-for-machine-learning-feature-stores',
    title: 'Mastering SQL for Machine Learning: Window Aggregations & Feature Store Modeling',
    subtitle: 'Why SQL remains the most critical weapon in an AI/ML developer toolkit for scalable data preparation.',
    excerpt: 'Discover how to leverage SQL window functions, running averages, and lag indicators to engineer high-signal predictive features directly inside relational database engines.',
    date: 'Jun 19, 2026',
    readTime: '7 min read',
    category: 'data-engineering',
    categoryLabel: 'Data & SQL',
    tags: ['SQL', 'Data Engineering', 'Machine Learning', 'Analytics'],
    featured: false,
    author: {
      name: 'Avnish Singh',
      role: 'AI/ML & Software Engineer',
    },
    keyTakeaways: [
      'Computing features directly in SQL scales better and uses less memory than pulling millions of raw rows into Python memory.',
      'Window functions (OVER PARTITION BY) enable seamless creation of rolling averages and temporal lag indicators without self-joins.',
      'Carefully enforce point-in-time correctness to avoid temporal lookahead bias when constructing historical training data.'
    ],
    content: `
### Why SQL is Fundamental to Machine Learning

While Python and PyTorch get the headline spotlight in AI discussions, over 80% of real-world data science time is spent exploring, transforming, and extracting meaningful signal from raw relational databases.

Executing feature transformations directly within modern database engines (such as PostgreSQL or MySQL) is substantially faster and avoids memory overhead compared to transferring raw unaggregated tables into local Pandas dataframes.

---

### Temporal Feature Engineering with Window Functions

Consider a customer churn or transaction fraud dataset. A predictive model needs to know:
- What was the customer's average transaction amount over the last 30 days?
- How does the current transaction compare to their previous transaction amount?

Here is how to calculate rolling statistics and lag differentials cleanly in SQL:

\`\`\`sql
SELECT 
    transaction_id,
    user_id,
    transaction_time,
    amount,
    -- 1. Lag feature: Previous transaction amount for this user
    LAG(amount, 1) OVER (
        PARTITION BY user_id 
        ORDER BY transaction_time
    ) AS prev_transaction_amount,
    
    -- 2. Rolling feature: 7-day trailing average amount
    AVG(amount) OVER (
        PARTITION BY user_id 
        ORDER BY transaction_time
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS rolling_7d_avg_amount,
    
    -- 3. Anomaly score: Current transaction relative to historical user mean
    amount / NULLIF(
        AVG(amount) OVER (PARTITION BY user_id), 0
    ) AS amount_to_mean_ratio
FROM transactions;
\`\`\`

---

### Avoiding Temporal Lookahead Bias

A cardinal rule of time-series machine learning: **Never let feature calculations see into the future relative to the observation timestamp.**

Always ensure your window ranges use \`PRECEDING\` clauses rather than looking ahead across the entire partition!
`
  },
  {
    id: 'post-4',
    slug: 'diploma-to-btech-engineering-habits',
    title: 'From Diploma to B.Tech: Essential Engineering Habits, Discipline & Open-Source Collaboration',
    subtitle: 'Reflections on continuous learning, NCC leadership principles, and building real-world software products.',
    excerpt: 'Key lessons learned transitioning from hands-on diploma foundations to advanced university engineering studies, staying consistent with coding, and cultivating rigorous technical discipline.',
    date: 'May 02, 2026',
    readTime: '4 min read',
    category: 'career-growth',
    categoryLabel: 'Growth & Discipline',
    tags: ['Career', 'Engineering', 'Leadership', 'Discipline'],
    featured: false,
    author: {
      name: 'Avnish Singh',
      role: 'AI/ML & Software Engineer',
    },
    keyTakeaways: [
      'Hands-on problem solving beats passive tutorial consumption every single time.',
      'Leadership training in NCC taught me that consistency, accountability, and clarity under pressure are just as vital as writing fast code.',
      'Document your projects as if someone else will maintain them tomorrow.'
    ],
    content: `
### The Power of Practical Foundations

Starting my formal technical education with a 3-year Diploma in Computer Science and Engineering gave me a unique vantage point. Rather than only studying abstract theory, we spent hundreds of hours in the laboratory assembling systems, debugging memory layouts, writing raw C code, and configuring Linux networks.

When I stepped into B.Tech at IKGPTU, this practical foundation allowed me to connect high-level algorithms directly to hardware execution and operational constraints.

---

### Three Core Pillars for Continuous Technical Growth

#### 1. Build Complete Tools, Not Just Code Snippets
Instead of stopping after finishing a toy script, package it with error handling, a readable README, configuration files, and automated unit tests. A completed project that others can clone and run carries tenfold the credibility of a dozen unfinished notebooks.

#### 2. Apply Physical & Mental Discipline
Participating as an NCC Cadet taught me operational discipline, teamwork, and resilience. Long training drills instill a mindset that when a complex bug arises or a machine learning training run crashes at 2:00 AM, you systematically diagnose the root cause rather than getting discouraged.

#### 3. Share Your Learnings Publicly
Whether through GitHub repositories, technical articles, or peer mentoring sessions on campus, explaining a concept to others is the truest test of whether you truly understand it.
`
  }
];
