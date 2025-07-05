import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	masterPassword: string;
	isEmailVerified: boolean;
	lastLogin: Date;
	createdAt: Date;
	updatedAt: Date;
	comparePassword(candidatePassword: string): Promise<boolean>;
	compareMasterPassword(candidateMasterPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minlength: [8, 'Password must be at least 8 characters long'],
		},
		firstName: {
			type: String,
			required: [true, 'First name is required'],
			trim: true,
			maxlength: [50, 'First name cannot exceed 50 characters'],
		},
		lastName: {
			type: String,
			required: [true, 'Last name is required'],
			trim: true,
			maxlength: [50, 'Last name cannot exceed 50 characters'],
		},
		masterPassword: {
			type: String,
			required: [true, 'Master password is required'],
			minlength: [8, 'Master password must be at least 8 characters long'],
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

// Hash password before saving
userSchema.pre('save', async function (next) {
	if (!this.isModified('password') && !this.isModified('masterPassword')) {
		return next();
	}

	try {
		// Hash regular password
		if (this.isModified('password')) {
			const salt = await bcrypt.genSalt(12);
			this.password = await bcrypt.hash(this.password, salt);
		}

		// Hash master password
		if (this.isModified('masterPassword')) {
			const salt = await bcrypt.genSalt(12);
			this.masterPassword = await bcrypt.hash(this.masterPassword, salt);
		}

		next();
	} catch (error) {
		next(error as Error);
	}
});

// Method to compare regular password
userSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
};

// Method to compare master password
userSchema.methods.compareMasterPassword = async function (
	candidateMasterPassword: string
): Promise<boolean> {
	return bcrypt.compare(candidateMasterPassword, this.masterPassword);
};

// Prevent duplicate model compilation
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
