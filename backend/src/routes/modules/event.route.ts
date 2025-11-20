import { Router } from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth';
import { validateResource } from '../../middleware/validate-resource';
import { createEventSchema, getEventSchema } from '../../validation/event.schema';
import { createEvent, getEventById, listEvents, publishEvent } from '../../controllers/event.controller';

export const eventRouter = Router();

eventRouter.get('/', listEvents);
eventRouter.get('/:eventId', validateResource(getEventSchema), getEventById);
eventRouter.post('/', authenticate, authorizeRoles('organizer', 'admin'), validateResource(createEventSchema), createEvent);
eventRouter.post('/:eventId/publish', authenticate, authorizeRoles('organizer', 'admin'), validateResource(getEventSchema), publishEvent);

