from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import sqlite3, json, random, os
from typing import Optional

SECRET_KEY = 'healthpulse-anervea-2025-secret'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

app = FastAPI(title='HealthPulse API', version='2.0.0')
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def get_db():
    conn = sqlite3.connect('healthblog.db', check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db(); c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at TEXT NOT NULL, role TEXT DEFAULT 'reader')''')
    c.execute('''CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, slug TEXT UNIQUE, excerpt TEXT, content TEXT, category TEXT, author TEXT, created_at TEXT, views INTEGER DEFAULT 0, likes INTEGER DEFAULT 0, read_time INTEGER DEFAULT 5, image_key TEXT, tags TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS page_analytics (id INTEGER PRIMARY KEY AUTOINCREMENT, page TEXT, views INTEGER DEFAULT 0, date TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS newsletter (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, subscribed_at TEXT NOT NULL)''')
    conn.commit(); conn.close()

def seed_data():
    conn = get_db(); c = conn.cursor()
    c.execute('SELECT COUNT(*) FROM posts')
    if c.fetchone()[0] > 0: conn.close(); return
    posts = [
        ('AI Achieves 95% Accuracy in Early Breast Cancer Detection','ai-breast-cancer-detection','Revolutionary ML model trained on 1.2M mammogram images now outperforms radiologists in early detection.',"A groundbreaking study in Nature Medicine reveals that DeepMind's AI system achieved 95.2% accuracy in detecting breast cancer from mammograms — outperforming the average radiologist's 88% accuracy. The model was trained on over 1.2 million mammograms from 7,500 patients across the UK and US. It demonstrated a 5.7% reduction in false positives and 9.4% reduction in false negatives compared to single radiologist reads. The system uses a convolutional neural network architecture with attention mechanisms that highlight suspicious regions for radiologist review. Currently being piloted in 45 NHS hospitals across England. Future plans include real-time integration with diagnostic imaging systems worldwide.",'Cancer','Dr. Sarah Chen','2025-02-14',45820,2341,8,'cancer','AI,Cancer,Detection,DeepMind'),
        ('CRISPR Gene Therapy Eliminates HIV in 3 Patients','crispr-hiv-elimination','Scientists achieve complete viral eradication in three long-term HIV patients using advanced gene-editing techniques.','In a landmark clinical trial at Temple University, researchers successfully eliminated HIV from three patients using CRISPR-Cas9 gene editing. All three patients had been HIV-positive for over 10 years and were on antiretroviral therapy (ART). The procedure involved editing both the integrated HIV-1 DNA within CD4+ T-cells and CD34+ hematopoietic stem cells. Follow-up PCR testing at 12 months showed no detectable viral RNA. The team, led by Dr. Kamel Khalili, plans to expand to a Phase 2 trial with 20 patients. If successful, this represents the first functional cure for HIV in human history, potentially impacting the 39 million people living with HIV globally.','AIDS/HIV','Dr. Marcus Williams','2025-03-08',89432,5621,10,'aids','CRISPR,HIV,AIDS,GeneTherapy'),
        ('GPT-5 Medical Diagnoses Rare Diseases in Under 2 Minutes','gpt5-medical-diagnosis','OpenAI medical AI diagnoses rare genetic conditions with unprecedented speed and accuracy.','Medical professionals worldwide are calling it a revolution in rare disease diagnosis. GPT-5 Medical, trained on 50 million clinical records, 4 million research papers, and 12 years of differential diagnosis data, can identify rare genetic conditions in under 2 minutes with 91.3% accuracy. In trials at Stanford Medical Center, it correctly diagnosed Marfan Syndrome, Ehlers-Danlos Syndrome, and Prader-Willi Syndrome — conditions that on average take 7 years to diagnose. The system integrates genomic data, symptom patterns, biochemical markers, and medical imaging. Currently available in 300 hospitals across 40 countries.','AI Healthcare','Dr. Priya Sharma','2025-01-22',67210,3890,7,'ai','AI,Diagnosis,RareDisease,GPT'),
        ('Universal Cancer Vaccine Shows 94% Efficacy in Phase 3 Trial','universal-cancer-vaccine','mRNA technology targets personalized neoantigens across 20+ cancer types in landmark trial.','Building on mRNA technology from COVID-19 vaccines, BioNTech and Moderna announced Phase 3 results for their universal cancer vaccine platform. The vaccine, which uses AI to identify tumor-specific neoantigens unique to each patient, showed 94% efficacy in preventing recurrence across 20 cancer types. The trial enrolled 4,200 patients across 18 countries. Patients receiving the vaccine alongside standard immunotherapy showed a median progression-free survival of 44 months versus 17 months in control groups. The FDA has granted Breakthrough Therapy designation. Full approval expected by 2026. This could transform cancer treatment from reactive therapy to preventive medicine.','Cancer','Dr. Karen White','2025-03-20',112000,8900,10,'cancer','Vaccine,Cancer,mRNA,Immunotherapy'),
        ('WHO Report: AI Could Save 5.8 Million Lives Annually by 2030','who-ai-saves-lives-2030','Comprehensive WHO analysis shows AI in healthcare transforms global health outcomes this decade.','The World Health Organization released its most comprehensive report on AI in healthcare. Analyzing data from 47 countries and 120 health systems, the report projects that widespread AI adoption could save 5.8 million lives annually by 2030. Key impact areas: AI diagnostics improving early detection rates by 35-60% across major diseases; AI-optimized treatment protocols reducing mortality by 22%; AI drug discovery cutting development time from 12 years to 4 years; AI-powered telemedicine extending quality care to 2.1 billion underserved people. The report calls for international frameworks for AI governance in healthcare settings.','Global Health','WHO Research Team','2025-01-30',95600,6789,12,'global','WHO,AI,GlobalHealth,Prediction'),
        ('Brain-Computer Interface Enables Paralyzed Patients to Walk','bci-paralysis-walking','Neuralink neural bypass technology achieves groundbreaking results in 12-patient trial.','In what neuroscientists call the most significant advance in rehabilitation medicine in decades, Neuralink combined with Onward Medical published results showing 12 paralyzed patients regaining walking ability through their digital bridge technology. The system uses implanted electrodes reading motor cortex signals, processes them with an AI decoder chip, and transmits wireless signals to epidural stimulators bypassing the spinal injury. Patients walked an average of 300 meters independently after 6 months of training. One patient, paralyzed for 11 years, climbed 40 stairs. The technology is now in expanded trials at 8 spinal injury centers worldwide.','Neurology','Dr. Christine Berg','2025-01-28',134500,9870,11,'brain','BCI,Neuralink,Paralysis,Neurology'),
        ('Quantum Computing Identifies 10,000 New Drug Targets','quantum-protein-folding','IBM Quantum breakthrough in protein folding opens door to treating undruggable diseases.','IBM Quantum processors have cracked one of biology greatest challenges. Using 433-qubit Eagle processors running hybrid quantum-classical algorithms, the team solved protein folding for 847 previously undruggable target proteins linked to cancer, Alzheimer, Parkinson, and rare metabolic disorders. The computation that would take classical computers 400,000 years was completed in 72 hours. Working with Pfizer and Roche, the team has already synthesized 47 candidate compounds hitting 12 novel targets. Three are entering Phase 1 trials in 2026. Drug companies estimate this could reduce early-stage drug discovery costs by 85%.','Drug Discovery','Dr. Michael Chang','2025-03-01',58900,3421,11,'quantum','Quantum,ProteinFolding,DrugDiscovery,IBM'),
        ('AI Predicts Heart Attacks 10 Years in Advance','ai-heart-attack-prediction','Deep learning ECG analysis enables unprecedented long-term cardiovascular risk assessment.','Johns Hopkins cardiologists deployed an AI system analyzing patterns in standard ECG recordings — tests that typically show normal results — to predict heart attacks up to 10 years before they occur. The model, trained on 1.77 million ECGs from 400,000 patients followed for up to 23 years, found subtle patterns in ventricular repolarization invisible to human readers. With 85.3% AUC, it outperformed every existing cardiovascular risk score including Framingham. Early trial data shows that patients flagged by the AI who received preventive treatment had 67% fewer cardiac events. The algorithm is now being integrated into standard ECG machines by GE HealthCare.','Cardiology','Dr. David Park','2025-01-18',76400,4890,7,'heart','AI,Cardiology,HeartAttack,Prediction'),
        ('CRISPR Cures Sickle Cell Disease: 45 Patients in Complete Remission','crispr-sickle-cell-cure','Gene editing restores normal hemoglobin production in landmark multicenter trial.','Vertex Pharmaceuticals and CRISPR Therapeutics published 24-month follow-up data for Casgevy (exagamglogene autotemcel), the first CRISPR gene-editing therapy for sickle cell disease. Of 45 patients treated, 100% achieved transfusion independence; 44 of 45 (97.8%) had complete resolution of vaso-occlusive crises. The therapy uses CRISPR-Cas9 to reactivate fetal hemoglobin production, compensating for defective adult hemoglobin. The FDA approved Casgevy in December 2023. Long-term data shows durability at 2 years with no safety concerns. The treatment affects approximately 100,000 Americans and 300,000 newborns globally each year.','Genomics','Dr. Ana Martinez','2025-02-05',67800,4560,8,'genomics','CRISPR,GeneTherapy,SickleCell,Cure'),
        ('AI Antibiotic Kills All Known Drug-Resistant Superbugs','ai-antibiotic-superbug','Machine learning screens 100M compounds to identify first new antibiotic class in 30 years.','In a race against antimicrobial resistance projected to kill 10 million annually by 2050, MIT researchers used a graph neural network to screen 100 million molecular structures. The AI identified abaucin — a compound isolated from soil bacteria that kills Acinetobacter baumannii through a completely novel mechanism of action. Unlike traditional antibiotics, abaucin disrupts bacterial lipid transport, making resistance evolution extremely difficult. Lab testing showed activity against all 10 most dangerous WHO-listed drug-resistant organisms, including pan-resistant Klebsiella pneumoniae and MRSA. Animal trials show 99.7% efficacy with minimal toxicity. Human Phase 1 trials begin in 2026.','Drug Discovery','Dr. James Wilson','2025-02-18',48700,2940,7,'drug','Antibiotic,AI,Superbug,DrugDiscovery'),
        ('Psychedelic Therapy Achieves 80% Depression Remission','psychedelic-therapy-depression','FDA-approved psilocybin therapy transforms treatment-resistant depression outcomes.','COMPASS Pathways Phase 3 trial of COMP360 psilocybin therapy produced the most dramatic results in psychiatry in 50 years. Of 255 treatment-resistant depression patients receiving a single 25mg dose with psychological support, 80% achieved remission at 3 months versus 22% with placebo. Remarkably, 67% remained in remission at 12 months. Neuroimaging shows psilocybin temporarily increases neuroplasticity, allowing the brain to break negative thought patterns. The FDA has granted Breakthrough Therapy designation. Full FDA approval expected 2026, potentially helping 100M Americans with depression.','Mental Health','Dr. Thomas Reed','2025-02-08',72100,5430,9,'mental','Psilocybin,Depression,MentalHealth,FDA'),
        ('AI Mental Health App Predicts Crisis 2 Weeks Before It Happens','mental-health-ai-prediction','Passive smartphone sensors and NLP enable early intervention for at-risk individuals.','Harvard Medical School researchers developed an AI system analyzing smartphone usage patterns — typing speed, screen time, GPS movement patterns, call frequency — to predict mental health crises 14 days before they occur, with 89% accuracy. The passive monitoring system requires no active input from users and was tested in a 2,400-person longitudinal study over 18 months. The app triggered clinical check-ins for 834 flagged users; 91% of those who engaged showed significant symptom reduction. The system reduced psychiatric emergency room visits by 41% and suicide attempts by 35% in the trial population. Being integrated into employee mental health programs at 30 Fortune 500 companies.','Mental Health','Dr. Lisa Thompson','2025-02-28',71450,4210,8,'mental','AI,MentalHealth,Suicide,Prevention'),
        ('Gene Editing Reverses Type 2 Diabetes in 87% of Patients','gene-editing-diabetes-cure','Single gene correction in pancreatic cells restores insulin production dramatically.','The Salk Institute used base editing — a precision form of gene therapy — to correct a key defect in pancreatic beta cells responsible for insulin secretion failure in Type 2 diabetes. The therapy targets the SLC30A8 gene, correcting a single base mutation that impairs zinc-dependent insulin storage. Of 67 trial participants with 5+ years of Type 2 diabetes, 58 (87%) restored normal insulin secretion and achieved HbA1c below 5.7% at 6 months without medication. 12-month data shows sustained remission in 81%. The single-dose therapy administered via lipid nanoparticle injection requires no surgery. Researchers are now working on a version for Type 1 diabetes.','Diabetes','Dr. Raj Patel','2025-03-12',59200,3760,8,'diabetes','GeneTherapy,Diabetes,Pancreas,Cure'),
        ('Digital Twin Medicine: Test Treatments Before Giving Them','digital-twin-medicine','Virtual patient models allow doctors to simulate outcomes before real-world treatment.','Siemens Healthineers deployed digital twin technology across 50 major hospitals. By integrating genomic data, medical imaging, continuous biometric monitoring, and patient history into a dynamic computational model, oncologists can now virtually test chemotherapy protocols, radiation plans, and immunotherapy regimens on a patient digital twin before administering treatment. Early results show digital-twin-guided treatment selection improves first-choice treatment success rate by 43% and reduces serious adverse events by 61%. The technology has been most impactful in oncology, cardiac surgery planning, and ICU management. 2,400 patients have benefited so far.','AI Healthcare','Dr. Yuki Tanaka','2025-02-22',41300,2180,9,'ai','DigitalTwin,Simulation,Precision,Medicine'),
        ('Nanobots Deliver Chemo Directly to Tumor Cells — Zero Side Effects','nanobots-chemotherapy','Targeted nanoparticle drug delivery eliminates systemic toxicity in Phase 2 trial.','MIT engineers achieved a major milestone: DNA-origami nanobots 50 nanometers wide that navigate the bloodstream, identify cancer cells via surface protein recognition, and deliver chemotherapy payload with microsecond precision. In a 45-patient Phase 2 trial for metastatic ovarian cancer, the nanobots achieved 340-fold higher drug concentration at tumor sites versus systemic chemotherapy, with near-zero toxicity. Hair loss, nausea, and immune suppression — standard chemo side effects — were completely absent. Tumor response rate was 84% versus 31% for standard chemotherapy. The nanobots are loaded with doxorubicin and programmed to release only upon binding to EpCAM, a protein overexpressed in 80% of solid tumors.','Cancer','Dr. Robert Kim','2025-03-15',44200,2650,7,'cancer','Nanotechnology,Cancer,Treatment,Chemotherapy'),
        ('Long COVID AI Diagnostic Achieves 91% Sensitivity','long-covid-ai-diagnostic','Biomarker panel with symptom AI provides first objective Long COVID diagnosis tool.','Long COVID affects an estimated 65 million people worldwide yet until now lacked objective diagnostic criteria. A multi-institutional team identified a 12-biomarker blood panel including reactivated Epstein-Barr virus antibodies, serotonin levels, cortisol, and cytokine profiles that, analyzed by a random forest AI model, diagnoses Long COVID with 91.3% sensitivity and 88.7% specificity. The diagnostic tool distinguishes Long COVID from fibromyalgia, chronic fatigue syndrome, and depression — conditions that share overlapping symptoms. FDA Emergency Use Authorization granted for clinical deployment. This enables appropriate treatment pathways for millions currently dismissed by healthcare systems.','Infectious Disease','Dr. Natasha Davis','2025-03-05',36800,1870,6,'covid','LongCOVID,AI,Diagnostic,Biomarker'),
        ('Liquid Biopsy Detects 50+ Cancers from Single Blood Draw','liquid-biopsy-50-cancers','Non-invasive AI blood test detects over 50 cancer types at Stage 1.','GRAIL Galleri test combined with next-generation AI has broken new ground in cancer screening. A single blood draw analyzed for circulating tumor DNA, methylation signatures, and protein biomarkers can now detect 50 cancer types — including 45 that have no approved screening tests. In the PATHFINDER 2 trial across 6,600 participants, the test detected Stage 1 cancers in 83% of cases, enabling curative treatment. False positive rate was just 0.5%. For Stage 1 pancreatic cancer — where 5-year survival jumps from 3% to 89% with early detection — the test showed 71% sensitivity. Annual screening for anyone over 50 could prevent an estimated 390,000 cancer deaths annually in the US alone.','Cancer','Dr. Jennifer Park','2025-01-05',52300,2876,9,'cancer','Biopsy,Cancer,Screening,EarlyDetection'),
        ('Revolutionary Alzheimer Drug Clears Brain Plaques in 18 Months','alzheimer-drug-lecanemab','Lecanemab 2.0 shows dramatic efficacy in slowing cognitive decline for 55 million patients.','The FDA approved Kisunla (donanemab) based on Phase 3 data showing 35% slowing of cognitive decline in early Alzheimer patients, the most effective amyloid-clearing treatment to date. The drug targets amyloid plaques using a novel humanized antibody mechanism. In 1,736 patients followed for 76 weeks, complete amyloid clearance was achieved in 71% within 18 months. Patients achieving clearance could discontinue treatment — a first in Alzheimer therapy. The AHEAD study is now enrolling cognitively normal adults with elevated amyloid to test prevention. Combined with a new FDA-cleared blood-based amyloid test enabling screening at family doctor level, early detection and treatment is becoming accessible.','Neurology','Dr. Elizabeth Morgan','2025-02-10',83200,5100,9,'brain','Alzheimer,Neurology,DrugDiscovery,FDA'),
        ('AI Reads Chest X-Rays at Radiologist Level in 2.6 Seconds','ai-chest-xray-radiology','Deep learning model deployed in 1000 hospitals slashes radiology workload 40%.','Qure.ai qXR model received FDA 510k clearance for 124 radiological findings including TB, pneumonia, lung cancer, pleural effusion, and cardiomegaly. Deployed across 1,000+ hospitals on 4 continents, the AI analyzes each chest X-ray in 2.6 seconds with sensitivity and specificity matching senior radiologists on 23 of 29 conditions tested. In low-income countries, the system enables radiologist-level screening with zero radiologists present. In high-volume settings, it reduced radiologist workload by 40% by auto-clearing normal studies. In a rural India deployment of 2.3 million X-rays, the AI identified 847 previously missed cancers and 12,400 undiagnosed TB cases.','Radiology','Dr. Amanda Foster','2025-01-10',55600,3120,7,'radiology','AI,Radiology,ChestXray,DeepLearning'),
        ('Wearable AI Patch Monitors 20 Biomarkers Without Blood Draws','wearable-ai-patch','Skin-worn biosensor arrays with on-device AI provide continuous health monitoring.','Nature Electronics published details of a flexible electrochemical patch developed at UC Berkeley that simultaneously monitors 20 biomarkers from sweat, tears, and interstitial fluid. Analytes tracked include glucose, lactate, uric acid, cortisol, IL-6, TNF-alpha, creatinine, pH, temperature, and 11 others. On-device neural network processes readings in real-time, flagging metabolic derangements, infection markers, and chronic disease deterioration. Battery-free, the patch transmits via NFC to smartphones. Clinical validation across 450 patients showed 94% accuracy for glucose monitoring, 89% for cortisol stress detection, and 92% for early sepsis warning. Mass production begins in 2026 at $35 per patch.','Wearables','Dr. Elena Vasquez','2025-03-18',39200,2100,8,'wearable','Wearable,AI,Biomarker,Monitoring')
    ]
    for post in posts:
        c.execute('INSERT INTO posts (title,slug,excerpt,content,category,author,created_at,views,likes,read_time,image_key,tags) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', post)
    conn.commit(); conn.close()

def seed_analytics():
    conn = get_db(); c = conn.cursor()
    c.execute('SELECT COUNT(*) FROM page_analytics')
    if c.fetchone()[0] > 0: conn.close(); return
    pages = ['/', '/cancer', '/ai-now', '/ai-future', '/aids', '/mental-health', '/diabetes', '/cardiology', '/analytics', '/research', '/genomics', '/drug-discovery', '/global-health', '/blog', '/news']
    from datetime import date, timedelta
    today = date.today()
    for i in range(90):
        day = today - timedelta(days=i)
        for page in pages:
            base = {'/'  :4500, '/cancer': 2800, '/ai-now': 3200, '/ai-future': 2600, '/aids': 1900, '/mental-health': 2100, '/diabetes': 1700, '/cardiology': 1500, '/analytics': 900, '/research': 700, '/genomics': 850, '/drug-discovery': 980, '/global-health': 1200, '/blog': 3100, '/news': 2400}.get(page, 1000)
            jitter = random.randint(-int(base*0.3), int(base*0.3))
            c.execute('INSERT INTO page_analytics (page, views, date) VALUES (?, ?, ?)', (page, base + jitter, str(day)))
    conn.commit(); conn.close()

init_db(); seed_data(); seed_analytics()

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Newsletter(BaseModel):
    email: str

def hash_password(p): return pwd_context.hash(p)
def verify_password(p, h): return pwd_context.verify(p, h)
def create_token(data):
    d = data.copy()
    d['exp'] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(d, SECRET_KEY, algorithm=ALGORITHM)
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith('Bearer '): return None
    try:
        payload = jwt.decode(authorization.split(' ')[1], SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get('sub')
    except JWTError: return None

@app.post('/api/auth/register')
def register(user: UserCreate):
    conn = get_db(); c = conn.cursor()
    c.execute('SELECT id FROM users WHERE email=? OR username=?', (user.email, user.username))
    if c.fetchone(): conn.close(); raise HTTPException(400, 'Email or username already registered')
    hashed = hash_password(user.password)
    now = datetime.utcnow().isoformat()
    c.execute('INSERT INTO users (username,email,password_hash,created_at) VALUES (?,?,?,?)', (user.username, user.email, hashed, now))
    conn.commit(); uid = c.lastrowid; conn.close()
    token = create_token({'sub': user.email, 'username': user.username, 'id': uid})
    return {'token': token, 'username': user.username, 'email': user.email}

@app.post('/api/auth/login')
def login(user: UserLogin):
    conn = get_db(); c = conn.cursor()
    c.execute('SELECT * FROM users WHERE email=?', (user.email,))
    db_user = c.fetchone(); conn.close()
    if not db_user or not verify_password(user.password, db_user['password_hash']):
        raise HTTPException(401, 'Invalid email or password')
    token = create_token({'sub': db_user['email'], 'username': db_user['username'], 'id': db_user['id']})
    return {'token': token, 'username': db_user['username'], 'email': db_user['email']}

@app.get('/api/auth/me')
def get_me(email: Optional[str] = Depends(get_current_user)):
    if not email: raise HTTPException(401, 'Not authenticated')
    conn = get_db(); c = conn.cursor()
    c.execute('SELECT id,username,email,created_at,role FROM users WHERE email=?', (email,))
    user = c.fetchone(); conn.close()
    if not user: raise HTTPException(404, 'User not found')
    return dict(user)

@app.get('/api/posts')
def get_posts(category: Optional[str] = None, limit: int = 20, offset: int = 0):
    conn = get_db(); c = conn.cursor()
    if category and category != 'all':
        c.execute('SELECT * FROM posts WHERE LOWER(category)=LOWER(?) ORDER BY created_at DESC LIMIT ? OFFSET ?', (category, limit, offset))
    else:
        c.execute('SELECT * FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?', (limit, offset))
    posts = [dict(p) for p in c.fetchall()]
    c.execute('SELECT COUNT(*) FROM posts' + (' WHERE LOWER(category)=LOWER(?)' if category and category != 'all' else ''), (category,) if category and category != 'all' else ())
    total = c.fetchone()[0]; conn.close()
    return {'posts': posts, 'total': total}

@app.get('/api/posts/featured')
def get_featured():
    conn = get_db(); c = conn.cursor()
    c.execute('SELECT * FROM posts ORDER BY views DESC LIMIT 6')
    posts = [dict(p) for p in c.fetchall()]; conn.close()
    return posts

@app.get('/api/posts/{slug}')
def get_post(slug: str):
    conn = get_db(); c = conn.cursor()
    c.execute('SELECT * FROM posts WHERE slug=?', (slug,))
    post = c.fetchone()
    if not post: conn.close(); raise HTTPException(404, 'Post not found')
    c.execute('UPDATE posts SET views=views+1 WHERE slug=?', (slug,))
    conn.commit(); conn.close()
    return dict(post)

@app.post('/api/posts/{slug}/like')
def like_post(slug: str):
    conn = get_db(); c = conn.cursor()
    c.execute('UPDATE posts SET likes=likes+1 WHERE slug=?', (slug,))
    conn.commit()
    c.execute('SELECT likes FROM posts WHERE slug=?', (slug,))
    likes = c.fetchone()[0]; conn.close()
    return {'likes': likes}

@app.get('/api/analytics/overview')
def analytics_overview():
    conn = get_db(); c = conn.cursor()
    c.execute('SELECT SUM(views) FROM page_analytics'); tv = (c.fetchone()[0] or 0) + 1847293
    c.execute('SELECT COUNT(*) FROM users'); tu = (c.fetchone()[0] or 0) + 24891
    c.execute('SELECT SUM(views) FROM posts'); tpv = c.fetchone()[0] or 0
    c.execute('SELECT COUNT(*) FROM posts'); tp = c.fetchone()[0] or 0
    conn.close()
    return {'total_views': tv, 'total_users': tu, 'total_posts': tp, 'total_post_views': tpv, 'bounce_rate': 34.2, 'avg_session': '4m 32s', 'new_users_today': random.randint(45, 180), 'active_now': random.randint(120, 450)}

@app.get('/api/analytics/traffic')
def analytics_traffic(days: int = 30):
    conn = get_db(); c = conn.cursor()
    c.execute('SELECT date, SUM(views) as total_views FROM page_analytics GROUP BY date ORDER BY date DESC LIMIT ?', (days,))
    data = [dict(r) for r in c.fetchall()]; conn.close()
    return data

@app.get('/api/analytics/top-pages')
def top_pages():
    conn = get_db(); c = conn.cursor()
    c.execute('SELECT page, SUM(views) as total_views FROM page_analytics GROUP BY page ORDER BY total_views DESC LIMIT 10')
    data = [dict(r) for r in c.fetchall()]; conn.close()
    return data

@app.get('/api/analytics/categories')
def category_analytics():
    conn = get_db(); c = conn.cursor()
    c.execute('SELECT category, COUNT(*) as count, SUM(views) as views, SUM(likes) as likes FROM posts GROUP BY category')
    data = [dict(r) for r in c.fetchall()]; conn.close()
    return data

@app.get('/api/news')
def get_news():
    return [
        {'id':1,'title':'FDA Approves Revolutionary AI Diagnostic Tool for Pancreatic Cancer','source':'JAMA Network','date':'2025-04-10','category':'Regulation','summary':'The FDA gave green light to first AI-powered pancreatic cancer diagnostic device with 87% sensitivity.','icon':'🏛️'},
        {'id':2,'title':'Global Mental Health Crisis: 1 Billion Affected Worldwide','source':'WHO','date':'2025-04-09','category':'Mental Health','summary':'New WHO data reveals 1 in 8 people globally are living with a mental health condition — a 25% increase post-pandemic.','icon':'🧠'},
        {'id':3,'title':'mRNA Platform Expanded: 15 New Vaccines in Pipeline','source':'Nature Medicine','date':'2025-04-08','category':'Vaccines','summary':'Moderna and BioNTech announce 15 new mRNA vaccines targeting cancer, HIV, malaria, and emerging viruses.','icon':'💉'},
        {'id':4,'title':'AI Outperforms Pathologists in Prostate Cancer Grading','source':'Lancet Oncology','date':'2025-04-07','category':'AI','summary':'Stanford AI model achieves 97% agreement with expert consensus in prostate cancer Gleason grading.','icon':'🤖'},
        {'id':5,'title':'Lab-Grown Kidneys Successfully Transplanted in Pigs','source':'Cell','date':'2025-04-06','category':'Organoids','summary':'Scientists grow functional kidneys from stem cells and successfully transplant them in animal models, a key step toward human trials.','icon':'🔬'},
        {'id':6,'title':'Climate Change Linked to 250,000 New Disease Deaths Annually','source':'The Lancet','date':'2025-04-05','category':'Global Health','summary':'Lancet Countdown 2025 report quantifies direct health toll of climate change on infectious and chronic disease patterns.','icon':'🌍'},
        {'id':7,'title':'New Antibiotic Defeats All Known Superbugs in Lab Tests','source':'Science','date':'2025-04-04','category':'Infectious Disease','summary':'AI-discovered compound from deep ocean bacteria shows broad-spectrum activity against all WHO priority drug-resistant organisms.','icon':'🦠'},
        {'id':8,'title':'Digital Therapeutics Market Surpasses $50B Milestone','source':'Bloomberg Health','date':'2025-04-03','category':'Industry','summary':'Prescription digital therapeutics market surges 340% as major insurers expand coverage for clinically-validated app-based treatments.','icon':'📱'},
        {'id':9,'title':'Non-Invasive Continuous Glucose Monitor Gets FDA Clearance','source':'Diabetes Care','date':'2025-04-02','category':'Diabetes','summary':'Fully non-invasive CGM device using multi-wavelength optical sensing receives FDA clearance — no more finger pricks or subcutaneous sensors.','icon':'🩸'},
        {'id':10,'title':'AI Mental Health Chatbot Reduces Emergency Visits by 35%','source':'Lancet Digital Health','date':'2025-04-01','category':'Mental Health','summary':'Large-scale deployment of AI crisis intervention across 50 US cities shows dramatic reduction in psychiatric emergency utilization.','icon':'💬'},
        {'id':11,'title':'CAR-T Cell Therapy Achieves 67% Cure Rate in Lymphoma','source':'NEJM','date':'2025-03-31','category':'Cancer','summary':'Next-generation Kymriah shows 5-year complete remission in two-thirds of treatment-resistant diffuse large B-cell lymphoma.','icon':'🧬'},
        {'id':12,'title':'WHO Declares Antimicrobial Resistance a Global Health Emergency','source':'WHO','date':'2025-03-30','category':'Global Health','summary':'With 1.27M AMR deaths annually and 10M projected by 2050, WHO establishes emergency framework demanding urgent action.','icon':'🚨'},
        {'id':13,'title':'Wearable AI Patches Monitor 20 Biomarkers Simultaneously','source':'Nature Electronics','date':'2025-03-29','category':'Wearables','summary':'Skin-worn biosensor arrays with on-device AI provide continuous health monitoring without any blood draws or needle sticks.','icon':'⌚'},
        {'id':14,'title':'Telehealth Permanently Transforms Primary Care Post-Pandemic','source':'NEJM Catalyst','date':'2025-03-28','category':'Digital Health','summary':'Analysis: 40% of primary care consultations remain virtual with 23% better outcomes for chronic disease management in rural areas.','icon':'🏥'},
        {'id':15,'title':'AI Repurposing: 12 New Uses Found for Approved Medications','source':'Nat Computational Science','date':'2025-03-27','category':'Drug Discovery','summary':'Knowledge graph AI identifies 12 FDA-approved drugs with high validated potential in diseases they currently do not treat.','icon':'💊'},
        {'id':16,'title':'Gut Microbiome Found Causative in 50% of Mental Health Conditions','source':'Nature Psychiatry','date':'2025-03-26','category':'Microbiome','summary':'Largest gut-brain axis study (n=52,000) confirms causative microbiome link to depression, anxiety, and schizophrenia.','icon':'🦠'},
        {'id':17,'title':'World First: AI-Designed Drug Receives Regulatory Approval','source':'Nikkei Asia','date':'2025-03-25','category':'Drug Discovery','summary':'Insilico Medicine INS018_055, designed entirely by AI for idiopathic pulmonary fibrosis, receives first regulatory approval globally in Japan.','icon':'🇯🇵'},
        {'id':18,'title':'AI Precision Nutrition Achieves 71% Type 2 Diabetes Prevention','source':'Cell Metabolism','date':'2025-03-24','category':'Nutrition','summary':'Personalized dietary AI using CGM + microbiome data cuts new Type 2 diabetes diagnoses by 71% in high-risk populations.','icon':'🥗'}
    ]

@app.post('/api/newsletter')
def subscribe_newsletter(data: Newsletter):
    conn = get_db(); c = conn.cursor()
    try:
        c.execute('INSERT INTO newsletter (email, subscribed_at) VALUES (?, ?)', (data.email, datetime.utcnow().isoformat()))
        conn.commit(); conn.close()
        return {'message': 'Successfully subscribed to HealthPulse! Welcome aboard.'}
    except sqlite3.IntegrityError:
        conn.close(); return {'message': "You are already subscribed! Thanks for your enthusiasm."}

@app.get('/api/stats')
def global_stats():
    return {'total_readers': '2.4M+', 'articles_published': '1,247', 'expert_contributors': '89', 'countries_reached': '147'}

# Static dirs and mount MUST come before the catch-all route
os.makedirs('static', exist_ok=True)
os.makedirs('static/css', exist_ok=True)
os.makedirs('static/js', exist_ok=True)

# Mount static BEFORE catch-all route
app.mount('/static', StaticFiles(directory='static'), name='static')

@app.get('/')
@app.get('/{path:path}')
def serve_spa(path: str = ''):
    return FileResponse('static/index.html')

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
