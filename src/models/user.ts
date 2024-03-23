import mongoose, { Schema, Document, CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserDocument extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  isValidPassword(password: string): Promise<boolean>; // Add isValidPassword method
}

const userSchema: Schema = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String, // Store hashed password
  // Additional user attributes
});

// Hash password before saving
userSchema.pre<UserDocument>(
  "save",
  async function (this: UserDocument, next: (err?: CallbackError) => void) {
    const user = this;

    if (!user.isModified("password")) return next();

    try {
      const hash = await bcrypt.hash(user.password, 10);
      user.password = hash;
    } catch (error) {
      return next(error as CallbackError);
    }
  }
);

// Add isValidPassword method to the schema
userSchema.methods.isValidPassword = async function (password: string) {
  const user = this as UserDocument;
  return bcrypt.compare(password, user.password);
};

// Create the User model
const User = mongoose.models.Users || mongoose.model<UserDocument>('Users', userSchema);

export default User;
