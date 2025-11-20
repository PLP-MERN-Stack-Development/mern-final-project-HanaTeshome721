import createHttpError from 'http-errors';
import { asyncHandler } from '../utils/async-handler';
import { UserModel } from '../models/user.model';
import { tokenService } from '../services/token.service';
import { DEFAULT_USER_ROLE } from '../constants/roles';

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = DEFAULT_USER_ROLE, organization } = req.body;

  const existing = await UserModel.findOne({ email });
  if (existing) {
    throw createHttpError(409, 'Email already registered');
  }

  const user = await UserModel.create({
    name,
    email,
    password,
    role,
    organization,
  });

  const payload = { id: user.id, email: user.email, name: user.name, role: user.role };
  const accessToken = tokenService.signAccessToken(payload);
  const refreshToken = tokenService.signRefreshToken(payload);

  res
    .cookie('access_token', accessToken, { httpOnly: true, sameSite: 'lax' })
    .cookie('refresh_token', refreshToken, { httpOnly: true, sameSite: 'lax' })
    .status(201)
    .json({ user: payload, accessToken, refreshToken });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const payload = { id: user.id, email: user.email, name: user.name, role: user.role };
  const accessToken = tokenService.signAccessToken(payload);
  const refreshToken = tokenService.signRefreshToken(payload);

  res
    .cookie('access_token', accessToken, { httpOnly: true, sameSite: 'lax' })
    .cookie('refresh_token', refreshToken, { httpOnly: true, sameSite: 'lax' })
    .json({ user: payload, accessToken, refreshToken });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw createHttpError(401, 'Authentication required');
  }

  const user = await UserModel.findById(req.user.id).select('-password');
  res.json({ user });
});

