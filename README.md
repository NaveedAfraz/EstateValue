# EstateValue

A real estate website where users can browse properties and see predicted prices.

## Stack
- Frontend: React + Vite + Tailwind CSS V4
- Backend: Node.js + Express
- Database: MySQL
- ML Service: Python FastAPI with scikit-learn

## Folder Structure
```text
EstateValue/
├── frontend/                 # React + Vite + Tailwind 4 (already initialized)
│   ├── src/
│   ├── ...
├── backend/                  # Node.js + Express Backend
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Route handlers
│   │   ├── routes/           # Express routes
│   │   ├── app.js            # Express app configuration
│   │   └── server.js         # Entry point
│   ├── .env.example
│   └── package.json
└── ml-service/               # FastAPI + scikit-learn ML Service
    ├── ml_model/             # ML Model loading and prediction logic
    ├── .env.example
    ├── requirements.txt
    └── main.py               # FastAPI application
```

## Package Installation List

### Frontend (cd frontend)
```bash
npm install axios react-router-dom
npm install -D tailwindcss @tailwindcss/vite
```
*(Assuming Vite and React are already set up. Use `npm info tailwindcss@next` if Tailwind v4 specifics are needed based on their modern plugin setup)*

### Backend (cd backend)
```bash
npm install express cors dotenv mysql2 axios
npm install --save-dev nodemon
```

### ML Service (cd ml-service)
```bash
pip install fastapi uvicorn scikit-learn pandas numpy pydantic python-dotenv
```

## Run Instructions

### 1. Database Setup
- Create a MySQL database (e.g., `estate_value`).
- Run following query for basic setup:
  ```sql
  CREATE TABLE properties (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      bedrooms INT NOT NULL,
      bathrooms INT NOT NULL,
      square_feet INT NOT NULL,
      actual_price DECIMAL(15,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

### 2. Configure Environment Variables
Copy the `.env.example` files to `.env` in both `backend` and `ml-service` directories, and adjust the values according to your environment.

### 3. Start Backend
```bash
cd backend
npm install
npm run dev
```
*(Runs on `http://localhost:5000`)*

### 4. Start ML Service
```bash
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*(Runs on `http://localhost:8000`)*

### 5. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
*(Runs on Vite's default port, e.g., `http://localhost:5173`)*
