# TODO: Improve Event Context with API Integration

- [x] Define EventContextType interface in eventContext.tsx
- [x] Implement createEvent function to call http://localhost:8080/api/event/create
- [x] Update Booking.tsx to use useEvent hook for API call
- [x] Add loading state and error handling with toasts
- [x] Test API call and form submission
- [x] Update createEvent to return EventResponse with slug
- [x] Modify Booking.tsx to use slug from API response for QR code generation
- [x] Pass QR code data to Details page via navigation state
- [x] Update Details.tsx to display dynamic QR code from state
