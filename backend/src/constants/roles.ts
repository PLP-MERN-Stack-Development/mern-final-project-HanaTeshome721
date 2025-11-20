export const USER_ROLES = ['attendee', 'organizer', 'staff', 'admin'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const DEFAULT_USER_ROLE: UserRole = 'attendee';

