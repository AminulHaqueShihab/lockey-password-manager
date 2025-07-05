import mongoose, { Document, Schema } from 'mongoose';

// Interface for the credential document
export interface ICredential extends Document {
	serviceName: string;
	serviceUrl: string;
	username: string;
	email: string;
	password: string; // This will be encrypted
	category: string;
	isPinned: boolean;
	twoFactorSecret?: string; // Optional 2FA secret (encrypted)
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}

// Schema definition
const CredentialSchema = new Schema<ICredential>(
	{
		serviceName: {
			type: String,
			required: [true, 'Service name is required'],
			trim: true,
			maxlength: [100, 'Service name cannot exceed 100 characters'],
		},
		serviceUrl: {
			type: String,
			required: [true, 'Service URL is required'],
			trim: true,
			maxlength: [500, 'Service URL cannot exceed 500 characters'],
		},
		username: {
			type: String,
			required: [true, 'Username is required'],
			trim: true,
			maxlength: [100, 'Username cannot exceed 100 characters'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			trim: true,
			lowercase: true,
			maxlength: [255, 'Email cannot exceed 255 characters'],
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			maxlength: [1000, 'Password field too large'], // Encrypted passwords can be longer
		},
		category: {
			type: String,
			required: [true, 'Category is required'],
			trim: true,
			maxlength: [50, 'Category cannot exceed 50 characters'],
			default: 'General',
		},
		isPinned: {
			type: Boolean,
			default: false,
		},
		twoFactorSecret: {
			type: String,
			maxlength: [1000, '2FA secret field too large'], // Encrypted secrets can be longer
			required: false,
		},
		notes: {
			type: String,
			maxlength: [1000, 'Notes cannot exceed 1000 characters'],
			required: false,
		},
	},
	{
		timestamps: true, // Automatically add createdAt and updatedAt fields
		collection: 'credentials',
	}
);

// Index for better query performance
CredentialSchema.index({ serviceName: 1, category: 1 });
CredentialSchema.index({ isPinned: 1, createdAt: -1 });

// Virtual for getting the decrypted password (not stored in DB)
CredentialSchema.virtual('decryptedPassword').get(function () {
	// This will be handled in the application layer
	return this.password;
});

// Ensure virtual fields are serialized
CredentialSchema.set('toJSON', { virtuals: true });
CredentialSchema.set('toObject', { virtuals: true });

// Export the model
export default mongoose.models.Credential ||
	mongoose.model<ICredential>('Credential', CredentialSchema);
