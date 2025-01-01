# 🌐 SEHAT AUR SAHULAT

Sehat Aur Sahulat is an Online Hospital System designed to enhance accessibility and convenience in healthcare services. This project empowers users to find doctors based on their location and budget, making healthcare more approachable for everyone.
## DEPLOYED LINK: https://sehat-aur-sahulat.vercel.app/
---

## 🌄 Features

- **Location-Based Search:** Find doctors in your city or nearby areas.
- **Budget Filter:** Specify a budget range to view doctors that fit your financial needs.
- **Appointment Booking:** Book appointments directly with your preferred doctor through the platform.
- **Tailored Results:** Receive a customized list of doctors based on your preferences.

---

## 🔧 Technology Stack

- **Frontend:** React.js, Tailwind CSS
- **Database:** Firebase for real-time database and authentication

---

## 🔬 Getting Started

Follow these steps to set up and run the project locally:

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/username/sehat-aur-sahulat.git
   cd sehat-aur-sahulat
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Firebase:

   - Replace this section with a sample Firebase setup example:
     ```javascript
     // Import Firebase SDKs
     import { initializeApp } from "firebase/app";
     import { getFirestore } from "firebase/firestore";
     import { getAuth } from 'firebase/auth';
     import { getStorage } from 'firebase/storage';

     const firebaseConfig = {
       apiKey: "<your-api-key>",
       authDomain: "<your-auth-domain>",
       projectId: "<your-project-id>",
       storageBucket: "<your-storage-bucket>",
       messagingSenderId: "<your-messaging-sender-id>",
       appId: "<your-app-id>",
       measurementId: "<your-measurement-id>"
     };

     // Initialize Firebase
     const app = initializeApp(firebaseConfig);
     const db = getFirestore(app);
     const auth = getAuth(app);
     const storage = getStorage(app);

     export { db, auth, storage };
     ```

4. Start the development server:

   ```bash
   npm start
   ```

---

## 🌐 Project Members

- **Laiba Mushtaq**
- **Sehrish Ahmed**
- **Hafsa Faizer**
- **Amna Naz**

---

## 🕹️ How It Works

1. Users enter their location and budget range.
2. The system fetches available doctors that match the criteria.
3. Users can view doctor profiles and select one to book an appointment.

---

## 🌐 Future Enhancements

- **Advanced Filters:** Search by specialization, rating, or availability.
- **Mobile Application:** Expand to Android and iOS platforms.
- **Telemedicine:** Integrate video consultation features.

---

## 🔄 Contributions

We welcome contributions to improve Sehat Aur Sahulat. Feel free to fork the repository and submit pull requests.

---

## 📍 Acknowledgements

- All contributors and supporters of this project.
- The development community for their valuable resources and support.

