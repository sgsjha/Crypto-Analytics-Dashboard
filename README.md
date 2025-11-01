<div align="center">

# Crypto Analytics Dashboard

Track and visualize real-time cryptocurrency data with interactive charts and smart anomaly detection.

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Recharts](https://img.shields.io/badge/Recharts-FF6D00?style=for-the-badge&logo=recharts&logoColor=white)](https://recharts.org)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

- Live Link: https://vec-task-v4.vercel.app/

## ✨ Features

- 📊 **Real-time Market Monitoring**: View live pricing and market data for Bitcoin and Ethereum.
- 🔍 **Z-score Anomaly Detection**: Highlights unusual price changes and volatility for better insights.
- 📈 **Interactive Charts**: Smooth time-series visualizations powered by Recharts.
- 💱 **Key Metrics Dashboard**: Displays market cap, price change %, volume, and more.
- 📱 **Mobile-Friendly Layout**: Clean and responsive UI for all screen sizes.

## 🛠️ Tech Stack

- **Frontend**: React.js, Next.js, TypeScript
- **Styling**: Tailwind CSS
- **Data**: CoinGecko API (public crypto market feed)
- **Charts**: Recharts
- **Deployment**: Vercel

## 🚀 Quick Start

Clone and run the dev server:

```bash
git clone https://github.com/sgsjha/crypto-analytics-dashboard.git
cd crypto-analytics-dashboard
npm install
npm run dev
```

Open http://localhost:3000

> ⚠️ Make sure to create an `.env.local` file and add your CoinGecko API key if required.

## 📦 Scripts

- `dev`: Start the development server
- `build`: Production build
- `start`: Run the production server
- `lint`: Lint the codebase

## 🔍 Anomaly Detection Logic

- The Z-score calculation flags data points where price deviation exceeds a threshold, indicating significant market fluctuation.
- Applied on rolling time windows for dynamic insights.

## 🔌 Data Source

This project uses the public [CoinGecko API](https://www.coingecko.com/en/api) for real-time cryptocurrency data.

## 🤝 Contributing

Feel free to open issues or submit PRs to enhance chart interactivity, add more coins, or improve UX.

## 📬 Contact

- LinkedIn: https://www.linkedin.com/in/sarthak-jhaa/
- GitHub: https://github.com/sgsjha

---

Built with purpose — and a little crypto curiosity. 🚀💰
