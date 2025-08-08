# WealthManager.online - Portfolio Analytics Dashboard
A full-stack application designed to provide investors with a comprehensive and interactive view of their investment portfolio. This project features a robust RESTful API backend and a dynamic, responsive React frontend.

## 🚀 Live Demo
Live Frontend: https://wealth-management-online-dashboard-black.vercel.app/

Backend API: https://wealth-management-api.onrender.com

# 📸 Dashboard Preview
<img width="1903" height="865" alt="image" src="https://github.com/user-attachments/assets/1f8df5ac-3bc3-46d4-9180-fd28354c602a" />
<img width="1900" height="876" alt="image" src="https://github.com/user-attachments/assets/dcd28b94-150a-4d42-ba2a-f6e870c2f0a9" />
<img width="1901" height="871" alt="image" src="https://github.com/user-attachments/assets/56d65cfd-816c-49c6-9f91-9a3f2a8da848" />
<img width="1894" height="869" alt="image" src="https://github.com/user-attachments/assets/d759b2f3-0266-4228-95ed-ada1eaed0fd2" />

## ✨ Key Features
1. This dashboard provides a rich set of features to help users analyze their investments at a glance:

2. Portfolio Overview: At-a-glance cards displaying key metrics like Total Portfolio Value, color-coded Total Gain/Loss, and Overall Return Percentage.

3. Dynamic Asset Allocation: Interactive Donut and Pie charts visualizing the portfolio's distribution by sector and market capitalization.

4. Interactive Holdings Grid: A detailed and responsive table of all stock holdings, featuring color-coded performance indicators. (Future work: Implement sorting and filtering).

5. Performance Comparison: A dynamic line chart that compares the portfolio's historical performance against key benchmarks like the Nifty 50 and Gold.

6. Top Performers Section: Highlights the best and worst-performing stocks in the portfolio and displays a calculated diversification score and risk level.

7. Responsive Design: A mobile-first interface that ensures a seamless experience on both desktop and mobile devices.

# 🛠️ Tech Stack
This project was built using a modern full-stack technology set:

Backend: Node.js, Express.js

Frontend: React, Vite, TypeScript, Tailwind CSS

UI Components: shadcn/ui, Recharts for charting

Development: Bun (Runtime & Package Manager), Git, GitHub

Deployment:

Backend API deployed on Render.

Frontend Dashboard deployed on Vercel.

# ⚙️ Setup and Local Development
To run this project on your local machine, follow these steps:

1. Clone the Repository:
   ```
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. Run the Backend Server:
Open a terminal and navigate to the backend directory.

```
cd backend
bun install
bun run dev

```
The backend API will now be running on http://localhost:5000.

3. Run the Frontend Application:
Open a second terminal and navigate to the frontend directory.

```
cd frontend
bun install
bun run dev
```
The frontend development server will start, typically on http://localhost:5173. Open this URL in your browser.

# 🤖 AI-Assisted Development Process
This project was developed with the assistance of AI tools, which contributed to approximately 50-60% of the initial setup and boilerplate code. The core logic, integration, debugging, and refinement were performed manually.

How AI Tools Were Used:
Vercel v0:

Used to generate the initial static layout and visual structure of the frontend dashboard based on a detailed prompt. This provided the foundational JSX and Tailwind CSS classes for the UI components.

Gemini & ChatGPT:

Conceptual Guidance: Provided high-level guidance on project structure, state management patterns, and deployment strategies.

Boilerplate Generation: Generated the initial file structure for the Node.js Express server and the basic API endpoint functions.

Targeted Debugging: Assisted in identifying and suggesting fixes for specific errors encountered during development, such as Cannot find module dependency issues and TypeError exceptions in JavaScript logic.

Code Snippets: Provided example code for specific tasks, like setting up fetch requests in React or configuring vite.config.js.

My Manual Contributions & Development Work:
While AI provided a significant head start, the following critical aspects were engineered and implemented manually:

Backend Logic: I wrote the core data calculation logic within the Express API for computing metrics like value, gainLoss, gainLossPercent, and portfolio allocation percentages from the raw data.

Full-Stack Integration: I was solely responsible for connecting the static frontend UI to the backend API. This involved writing all the fetch requests, managing component state with useState and useEffect hooks, and handling loading and error states for a smooth user experience.

Data Transformation: I developed the crucial logic to transform the data structures returned by the API into the specific formats required by the frontend charting library (Recharts), particularly converting JSON objects into arrays.

Debugging & Configuration: I personally diagnosed and resolved numerous issues, including:

CORS (Cross-Origin Resource Sharing) errors between the frontend and backend.

Missing dependency errors (react-router-dom, etc.).

TypeScript path alias configuration issues in tsconfig.json to make @/ imports work correctly.

Refactoring and cleaning up AI-generated code to fit the project's specific needs.

Deployment: I manually configured and deployed both the backend and frontend applications on Render and Vercel, including setting up root directories and managing production environment variables to link the two services.

