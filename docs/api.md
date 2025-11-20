# EventFlow API Notes

## Base URL
/api/v1

## Auth
- HTTP-only cookies carrying ccessToken + efreshToken
- CSRF protection with same-site lax cookies
- Role claims: ttendee, organizer, staff, dmin

## Key Endpoints
| Method | Path | Description |
| --- | --- | --- |
| GET | /health | Service readiness probe |
| GET | /events | Public catalog listing |
| POST | /auth/register | Create attendee/organizer accounts |
| POST | /orders | Start a ticket order |
| POST | /orders/:id/confirm | Confirm payment + issue tickets |
| POST | /tickets/:id/check-in | Staff scan + mark attendance |

Detailed OpenAPI definitions will follow once schemas are implemented.
