# 🚀 BitCode – Realtime Collaborative Coding Platform

🔗 **Live Demo:** https://bitcode-frontend.onrender.com

**BitCode** is a full-stack online coding platform that enables users to practice Data Structures & Algorithms, collaborate in real time, and solve problems with the help of an AI-powered tutor. It brings together **problem solving**, **real-time collaboration**, and **AI-driven doubt resolution** in one modern platform, built with a robust tech stack to ensure secure authentication, smooth real-time interactions, and an intuitive user experience.

---

## ✨ Features

### 🧑‍💻 Coding Platform

- 📝 In-browser coding with **Monaco Editor**  
- 📚 Curated **DSA problems** with starter code  
- 🧪 Code execution & evaluation via **Judge0 API** (public + hidden tests)  
- ⚡ Multi-language **compile & run** with instant verdicts  
- 🕒 **Submission history** with code, time & space complexity  
- 📊 **User profiles** for progress and performance tracking  
- 🛠️ **Admin panel** for problem management and **video solution uploads**

### 🤖 AI-Powered Doubt Solver

- 💬 **Chat-based AI tutor** with context from problem statements, test cases, and user code  
- ✍️ **Structured Markdown explanations** covering approach, logic, and complexity  
- ⏳ Smooth **typing animation** for a natural and interactive learning experience

### 🤝 Real-Time Collaboration

- 🔄 Real-time code collaboration and **group chat** using **Socket.IO**
- 🧑‍🤝‍🧑 **Unique room-based sessions** with isolated environments using **UUID**
- 💡 Live code broadcasting to all connected users
- 🔗 Shareable room links for seamless collaboration

### 🔐 Authentication & Security
- 🔑 Secure **JWT-based authentication**
- 🔒 Password hashing using **bcrypt**
- 🚫 Token blocking using **Redis**
- 👤 Role-based access (Admin / User)

### 🎨 Modern UI
- 📱 Fully responsive design
- 🌙 Clean UI with **Tailwind CSS + DaisyUI**
- 🧾 Markdown support for AI responses
- ⚡ Smooth UX with auto-scroll & animations

---

## 🛠️ Tech Stack

### Frontend
- **React.js**
- **Monaco Editor**
- **Redux Toolkit**
- **React Hook Form + Zod**
- **Tailwind CSS & DaisyUI**
- **Socket.IO Client**
- **Axios**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **Socket.IO**
- **JWT Authentication**
- **Redis**
- **Judge0 API**
- **Google Gemini API**

---

## 🧠 AI Integration

BitCode uses **Google Gemini API** to power its AI doubt-solving feature.

The AI:
- Receives **full problem context**
- Provides **step-by-step explanations**
- Gives **hints first**, full solution on request
- Responds strictly within the problem scope
