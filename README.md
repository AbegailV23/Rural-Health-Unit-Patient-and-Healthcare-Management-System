# Municipal Health Center Login (React)

A responsive blue-and-white login page with four account types: Admin, Doctor, Nurse, and Patient.

## Run locally

1. Install Node.js (LTS).
2. Extract this ZIP and open the project folder in VS Code.
3. Open a terminal in the project folder.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed by Vite (usually http://localhost:5173).

## Demo accounts

| Account type | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |
| Doctor | `doctor` | `doctor123` |
| Nurse | `nurse` | `nurse123` |
| Patient | `patient` | `patient123` |

## Important security note

This is a front-end demonstration. The demo credentials are stored in the React source code and are **not secure for real patient information**. Before deployment, connect the form to a backend authentication API, store hashed passwords server-side, enforce role-based authorization on the server, use HTTPS, and protect patient data in accordance with applicable privacy requirements. The dashboard cards are placeholders, not connected medical-record functions.
