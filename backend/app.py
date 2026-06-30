from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import json
import os

app = Flask(__name__)
CORS(app)

# Database files
USERS_FILE = 'users_db.json'
PROFILES_FILE = 'profiles_db.json'
JOBS_FILE = 'jobs_db.json'
APPLICATIONS_FILE = 'applications_db.json'

def load_data(filename):
    if not os.path.exists(filename):
        return [] if filename != PROFILES_FILE else {}
    with open(filename, 'r') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return [] if filename != PROFILES_FILE else {}

def save_data(filename, data):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)

# 🟢 INITIAL JOBS SEEDING (Agar file khali hai toh initial data bhar dega)
if not os.path.exists(JOBS_FILE):
    initial_jobs = [
        {"id": 1, "company": "TechInnovate Solutions", "title": "MERN Stack Developer", "department": "Engineering", "type": "Full-time", "mode": "Hybrid", "location": "Bangalore, India", "description": "We are looking for a robust MERN Stack Developer...", "skills": "React, Node.js, Express.js, MongoDB", "experience": "1 - 3 Years", "education": "B.Tech / B.E", "matchScore": 95},
        {"id": 2, "company": "CloudScale Global", "title": "Frontend Developer", "department": "Product UI", "type": "Full-time", "mode": "Remote", "location": "Hyderabad, India", "description": "Join our design system group...", "skills": "React, JavaScript, HTML5, CSS3", "experience": "0 - 2 Years", "education": "B.C.A / M.C.A / B.Tech", "matchScore": 88},
        {"id": 3, "company": "DataPrism Analytics", "title": "Python Developer", "department": "Data & Analytics", "type": "Full-time", "mode": "On-site", "location": "Mumbai, India", "description": "Build robust streaming pipelines...", "skills": "Python, Django, Flask", "experience": "2+ Years", "education": "Bachelor's degree", "matchScore": 40},
        {"id": 4, "company": "NextGen Systems", "title": "React Native Developer", "department": "Mobile Apps", "type": "Internship", "mode": "Hybrid", "location": "Pune, India", "description": "Develop high-performance mobile apps...", "skills": "React Native, React, JavaScript", "experience": "Fresher / Internship", "education": "Pursuing Technical Degree", "matchScore": 80}
    ]
    save_data(JOBS_FILE, initial_jobs)


# 1. AUTH ROUTES
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    USERS_DB = load_data(USERS_FILE)
    if any(user['email'] == data.get('email') for user in USERS_DB):
        return jsonify({"success": False, "message": "Email already registered!"}), 400
    
    new_user = {
        "name": data.get('name'),
        "email": data.get('email'),
        "password": generate_password_hash(data.get('password')),
        "role": data.get('role')
    }
    USERS_DB.append(new_user)
    save_data(USERS_FILE, USERS_DB)
    return jsonify({"success": True, "message": "Registration successful!", "role": data.get('role')}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    USERS_DB = load_data(USERS_FILE)
    user = next((u for u in USERS_DB if u['email'] == data.get('email') and u['role'] == data.get('role')), None)
    
    if user and check_password_hash(user['password'], data.get('password')):
        return jsonify({"success": True, "message": "Login successful!", "user": {"name": user.get('name'), "email": user['email'], "role": user['role']}}), 200
    return jsonify({"success": False, "message": "Invalid credentials!"}), 401


# 2. CANDIDATE DASHBOARD ROUTES

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    """Dashboard par Jobs load karne ke liye"""
    jobs = load_data(JOBS_FILE)
    return jsonify(jobs), 200

@app.route('/api/candidate/profile', methods=['POST'])
def save_profile():
    """Profile Edit karke Save Changes karne ke liye"""
    data = request.get_json()
    profiles = load_data(PROFILES_FILE)
    
    email = data.get('email')
    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400
        
    profiles[email] = data
    save_data(PROFILES_FILE, profiles)
    return jsonify({"success": True, "message": "Profile updated successfully!"}), 200

@app.route('/api/candidate/upload-resume', methods=['POST'])
def upload_resume():
    """Resume File upload handler"""
    data = request.get_json()
    # Real project me base64 resume string ko process ya save kiya jata hai
    print("Resume received in backend successfully.")
    return jsonify({"success": True, "message": "Resume uploaded successfully!"}), 200

@app.route('/api/candidate/apply', methods=['POST'])
def apply_job():
    """Job apply handle karne ke liye"""
    data = request.get_json()
    applications = load_data(APPLICATIONS_FILE)
    
    new_application = {
        "id": len(applications) + 1,
        "company": data.get('company'),
        "role": data.get('title'),
        "date": "30-06-2026", # Current Date logic
        "status": "Under Review"
    }
    applications.append(new_application)
    save_data(APPLICATIONS_FILE, applications)
    return jsonify({"success": True, "message": "Application submitted successfully!"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)