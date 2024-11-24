
# **Solaura**
![solaura_logo](https://github.com/user-attachments/assets/9ab5b895-9f04-4860-968c-d58313ee5e8d)

Solaura is a blockchain-based application designed to analyze Solana wallets and provide insights into their behavior. It allows users to analyze wallet activity, mint NFTs, report suspicious wallets, and share analysis on social media.

<img width="1196" alt="Screenshot 2024-11-24 at 03 43 36" src="https://github.com/user-attachments/assets/74bc0ed1-7880-48bf-95b9-969fd202e21e">

---

## **Table of Contents**
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Support](#support)

---

## **Features**

1. **Wallet Analysis**:
   - Analyze wallet behavior and reputation using on-chain data.
2. **Mint NFT**:
   - Mint an NFT directly from analysis results.
3. **Report on Chain**:
   - Report suspicious wallets directly on the Solana blockchain.
4. **Social Sharing**:
   - Share wallet analysis to Twitter with pre-filled messages.

---

## **Prerequisites**

Ensure the following are installed on your system:

1. **Node.js** (v16 or later)
   - [Download Node.js](https://nodejs.org/)
2. **Yarn** or **npm** (Node.js package manager)
3. **Git** (Version control system)
   - [Download Git](https://git-scm.com/)
4. **Solana CLI** (Optional, for blockchain interactions)
   - [Solana CLI Installation Guide](https://docs.solana.com/cli/install-solana-cli)

---

## **Getting Started**

### **Frontend**

The frontend is a React-based application built with Next.js.

#### **Steps to Run the Frontend:**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/7moodev/solaura.git
   cd solaura
   ```

2. **Navigate to the Frontend Directory**:
   ```bash
   cd frontend
   ```

3. **Install Dependencies**:
   ```bash
   yarn install
   # OR
   npm install
   ```

4. **Set Up Environment Variables**:
   Create a `.env` file in the `frontend` directory and add the following variables:
   ```env
   NEXT_PUBLIC_SOLANA_NETWORK=testnet
   NEXT_PUBLIC_RPC_URL=https://api.testnet.solana.com
   NEXT_PUBLIC_TOKEN_ADDRESS=6xy719wtR9vjumsLUxEH3SXKQAGfVtuFdZBf4XTeWck3
   ```

5. **Run the Development Server**:
   ```bash
   yarn dev
   # OR
   npm run dev
   ```

6. **View in Browser**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### **Backend**

The backend is responsible for providing data to the frontend and managing interactions with the Solana blockchain.

#### **Steps to Run the Backend**:
> _Details for setting up and running the backend will be provided here._

---

## **Project Structure**

### **Frontend Directory**:
- **`/components`**: Contains reusable UI components.
- **`/pages`**: Contains application pages powered by Next.js.
- **`/styles`**: Contains TailwindCSS configuration and styles.

### **Backend Directory**:
- **`/routes`**: Contains API endpoints.
- **`/services`**: Contains business logic for handling blockchain interactions.
- **`/config`**: Contains configuration files for environment setup.

---

## **Contributing**

We welcome contributions from the community! Follow the steps below:

1. **Fork the Repository**:
   Click the "Fork" button at the top right of this repository.

2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/<your-username>/solaura.git
   cd solaura
   ```

3. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Changes**:
   Implement your feature or fix a bug.

5. **Test Your Changes**:
   Ensure your changes work as expected:
   ```bash
   yarn dev
   ```

6. **Commit and Push**:
   ```bash
   git add .
   git commit -m "Add your commit message"
   git push origin feature/your-feature-name
   ```

7. **Submit a Pull Request**:
   Open a pull request on GitHub to merge your changes.

---

## **Support**

If you encounter any issues or have questions, feel free to:
- Open an issue on [GitHub](https://github.com/7moodev/solaura/issues)
- Join our Discord community

---
