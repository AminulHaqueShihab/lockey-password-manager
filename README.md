# 🔐 Password Manager

A secure, cross-platform personal password manager built with Next.js, featuring AES encryption, beautiful UI, and comprehensive credential management.

## ✨ Features

- **🔒 Secure Encryption**: AES-256 encryption for all sensitive data
- **🎨 Beautiful UI**: Modern, responsive design with dark mode support
- **📱 Cross-Platform**: Works on desktop and mobile devices
- **🔍 Smart Search**: Find credentials quickly with search and filtering
- **📌 Pin Management**: Pin important credentials to the top
- **🔐 Password Generator**: Generate strong, secure passwords
- **📊 Password Strength**: Visual password strength meter
- **📋 Auto-Copy**: Copy credentials with auto-clear timeout
- **🏷️ Categories**: Organize credentials by categories
- **🔑 2FA Support**: Store and manage 2FA secret keys
- **📝 Notes**: Add notes to your credentials

## 🛠️ Tech Stack

- **Frontend & Backend**: Next.js 15 (App Router)
- **UI Framework**: shadcn/ui with Tailwind CSS
- **Database**: MongoDB
- **ORM**: Mongoose
- **Encryption**: CryptoJS (AES-256)
- **Icons**: Lucide React
- **Notifications**: Sonner

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd password_manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/password_manager

   # Encryption Key (32 characters recommended)
   ENCRYPTION_KEY=your-super-secret-encryption-key-32-chars

   # Master Password Configuration (Optional)
   # Option 1: Set a fixed master password hash (recommended for production)
   # MASTER_PASSWORD_HASH=your-hashed-master-password-here
   # MASTER_PASSWORD_SALT=your-salt-here

   # Option 2: Let the app handle master password setup (demo mode)
   # Leave these empty to use the interactive setup

   # Next.js Configuration
   NEXTAUTH_SECRET=your-nextauth-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Start MongoDB**

   ```bash
   # If using local MongoDB
   mongod

   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env.local
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
password_manager/
├── src/
│   ├── app/
│   │   ├── api/credentials/     # API routes for CRUD operations
│   │   ├── vault/              # Vault pages
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page (redirects to vault)
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── AddCredentialForm.tsx
│   │   ├── CopyButton.tsx
│   │   ├── CredentialCard.tsx
│   │   ├── CredentialList.tsx
│   │   └── PasswordStrength.tsx
│   ├── lib/
│   │   ├── encryption.ts       # AES encryption utilities
│   │   ├── mongodb.ts          # MongoDB connection
│   │   ├── services.ts         # Service configurations
│   │   └── utils.ts            # Utility functions
│   └── models/
│       └── Credential.ts       # Mongoose schema
├── public/                     # Static assets
├── .env.local                  # Environment variables
└── README.md
```

## 🔧 Configuration

### MongoDB Setup

1. **Local MongoDB**:

   - Install MongoDB locally
   - Start the MongoDB service
   - Use `mongodb://localhost:27017/password_manager`

2. **MongoDB Atlas** (Recommended for production):
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string
   - Update `MONGODB_URI` in `.env.local`

### Encryption Key

Generate a secure 32-character encryption key:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Master Password Setup

You have two options for setting up the master password:

#### Option 1: Environment Variables (Recommended for Production)

1. **Generate master password hash**:

   ```bash
   node scripts/generate-master-password.js
   ```

2. **Add to .env.local**:
   ```env
   MASTER_PASSWORD_HASH=your-generated-hash
   MASTER_PASSWORD_SALT=your-generated-salt
   ```

#### Option 2: Interactive Setup (Demo Mode)

1. **Leave environment variables empty**
2. **Start the application**
3. **Follow the first-time setup wizard**
4. **Set your master password through the UI**

⚠️ **Security Note**: The master password cannot be recovered if lost. Store it securely!

## 🎯 Usage

### First Time Setup

1. **Access the vault**: Navigate to `/vault`
2. **Enter master password**: For demo, any password works
3. **Add your first credential**: Click "Add Credential"

### Managing Credentials

- **Add**: Click "Add Credential" button
- **Edit**: Click edit button on any credential card
- **Delete**: Click delete button (with confirmation)
- **Pin**: Toggle pin to keep important credentials at top
- **Copy**: Click copy buttons for username, email, password
- **Search**: Use the search bar to find credentials
- **Filter**: Use category dropdown to filter credentials

### Security Features

- **Master Password**: Required to unlock the vault
- **AES Encryption**: All sensitive data is encrypted
- **Auto-Lock**: Vault locks when you click "Lock Vault"
- **Password Strength**: Visual feedback on password strength
- **Secure Copy**: Credentials copied with auto-clear timeout

## 🔒 Security Considerations

### Production Deployment

1. **Use HTTPS**: Always use HTTPS in production
2. **Strong Encryption Key**: Generate a cryptographically secure key
3. **Environment Variables**: Never commit `.env.local` to version control
4. **Database Security**: Use MongoDB Atlas with proper authentication
5. **Master Password**: Implement proper master password hashing
6. **Session Management**: Add proper session management
7. **Rate Limiting**: Implement API rate limiting
8. **Audit Logging**: Add audit logs for security events

### Current Limitations (Demo)

- Master password is not validated (accepts any password)
- No user authentication system
- No session persistence
- No rate limiting on API endpoints

## 🎨 Customization

### Adding New Services

1. **Update `src/lib/services.ts`**:
   ```typescript
   export const serviceConfigs: Record<string, ServiceConfig> = {
   	yourservice: {
   		name: 'Your Service',
   		color: '#FF0000',
   		gradient: 'from-[#FF0000] to-[#CC0000]',
   		icon: '🔴',
   		url: 'https://yourservice.com',
   	},
   };
   ```

### Styling

- **Colors**: Update Tailwind config in `tailwind.config.js`
- **Components**: Modify shadcn/ui components in `src/components/ui/`
- **Dark Mode**: Toggle with the moon/sun icon in the header

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**:

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

### Other Platforms

- **Netlify**: Similar to Vercel deployment
- **Railway**: Good for full-stack apps
- **DigitalOcean**: Manual deployment with Docker

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This is a demo password manager. For production use, please implement additional security measures:

- Proper user authentication
- Master password hashing
- Session management
- Rate limiting
- Audit logging
- Regular security audits

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include your environment details and error messages

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Lucide](https://lucide.dev/) for icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Next.js](https://nextjs.org/) for the framework
- [MongoDB](https://www.mongodb.com/) for the database
