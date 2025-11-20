import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';
import { DEFAULT_USER_ROLE, USER_ROLES, UserRole } from '../constants/roles';

export interface UserDocument {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organization?: string;
  comparePassword(candidate: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: USER_ROLES, default: DEFAULT_USER_ROLE },
    organization: { type: String },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const UserModel = model<UserDocument>('User', userSchema);

