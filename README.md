# DonateConnect

A comprehensive platform connecting donors with NGOs to facilitate efficient item donations. This platform bridges the gap between those who want to donate and organizations that can put those donations to good use.

## 🌟 Features

- **User Authentication**
  - Separate portals for donors and NGOs
  - Secure signup and login process
  - Role-based access control

- **Donor Features**
  - Dashboard to manage donations
  - Browse and connect with verified NGOs
  - Track donation history
  - Provide feedback

- **NGO Features**
  - Customizable organization profile
  - Donation request management
  - Analytics dashboard
  - Communication with donors

- **Core Functionalities**
  - Real-time notifications
  - Feedback system
  - Location-based NGO discovery
  - Secure communication channel

## 🛠️ Tech Stack

### Frontend (`/donation-platform`)
- Next.js
- TypeScript
- Radix UI Components
- TailwindCSS
- React Hook Form

### Backend (`/donation-platform-backend`)
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer for email notifications
- Twilio for SMS alerts

### API Layer (`/donation-platform-api`)
- RESTful API architecture
- TypeScript
- Express middleware
- Input validation
- Rate limiting

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/26-PM/donate.connect.git
   cd donate.connect
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd donation-platform
   npm install

   # Backend
   cd ../donation-platform-backend
   npm install

   # API
   cd ../donation-platform-api
   npm install
   ```

3. **Environment Setup**
   - Create `.env` files in each directory following the `.env.example` templates
   - Configure MongoDB connection
   - Set up email and SMS service credentials

4. **Run the application**
   ```bash
   # Frontend
   cd donation-platform
   npm run dev

   # Backend
   cd ../donation-platform-backend
   npm run dev

   # API
   cd ../donation-platform-api
   npm run dev
   ```

## 📝 Environment Variables

Create `.env` files in the respective directories with the following variables:

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

### Backend
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SMTP_HOST=your_smtp_host
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- Project Manager: [26-PM](https://github.com/26-PM)

## 📞 Support

For support, email support@donateconnect.com or join our Slack channel.
