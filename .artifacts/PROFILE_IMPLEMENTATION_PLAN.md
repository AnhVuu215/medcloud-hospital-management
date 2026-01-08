# User Profile Feature - Implementation Plan

## Overview
Implement complete user profile functionality allowing users to view and edit their personal information.

## Backend Implementation

### 1. Profile API Endpoints

#### [NEW] `backend/src/routes/profile.routes.ts`
```typescript
GET    /api/profile          - Get current user profile
PUT    /api/profile          - Update current user profile
PUT    /api/profile/password - Change password
POST   /api/profile/avatar   - Upload avatar image
```

#### [NEW] `backend/src/controllers/profile.controller.ts`
- `getProfile()` - Get authenticated user's profile
- `updateProfile()` - Update user information
- `changePassword()` - Change user password
- `uploadAvatar()` - Handle avatar upload

#### [MODIFY] `backend/src/server.ts`
Add profile routes to server

### 2. Database Schema
User table already exists, may need to add:
- `avatar` - Avatar image URL
- `phone` - Phone number
- `address` - Address
- `dateOfBirth` - Date of birth

---

## Frontend Implementation

### 1. Profile View Component

#### [NEW] `views/ProfileView.tsx`
Main profile page with:
- Profile information display
- Edit mode with form
- Avatar upload
- Password change section
- Save/Cancel actions

### 2. Supporting Components

#### [NEW] `components/AvatarUpload.tsx`
- Image preview
- Upload button
- Drag & drop support
- Image cropping (optional)

#### [NEW] `components/ProfileForm.tsx`
Form fields:
- Full name
- Email (read-only)
- Phone number
- Address
- Date of birth
- Role (read-only)

### 3. API Service

#### [MODIFY] `services/apiService.ts`
Add profile API methods:
```typescript
profileAPI: {
  getProfile()
  updateProfile(data)
  changePassword(oldPassword, newPassword)
  uploadAvatar(file)
}
```

### 4. Integration

#### [MODIFY] `App.tsx`
Add profile route to navigation

#### [MODIFY] `components/Header.tsx`
Update dropdown to link to profile page

---

## Features

### View Profile
- ✅ Display user information
- ✅ Show avatar
- ✅ Display role badge
- ✅ Show account creation date

### Edit Profile
- ✅ Inline editing
- ✅ Form validation
- ✅ Real-time validation feedback
- ✅ Save/Cancel buttons

### Change Password
- ✅ Current password verification
- ✅ New password strength indicator
- ✅ Confirm password matching
- ✅ Secure password update

### Avatar Upload
- ✅ Image preview
- ✅ File size validation (max 2MB)
- ✅ Image format validation (jpg, png)
- ✅ Upload progress indicator

---

## Validation Rules

### Profile Fields
- **Name**: Required, 2-100 characters
- **Email**: Valid email format (read-only)
- **Phone**: Optional, valid phone format
- **Address**: Optional, max 200 characters
- **Date of Birth**: Optional, must be in the past

### Password Change
- **Current Password**: Required
- **New Password**: 
  - Minimum 8 characters
  - At least 1 uppercase
  - At least 1 lowercase
  - At least 1 number
  - At least 1 special character
- **Confirm Password**: Must match new password

---

## Security Considerations

1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: Users can only edit their own profile
3. **Input Sanitization**: Use sanitize utilities
4. **Password Hashing**: bcrypt with salt rounds = 10
5. **File Upload**: Validate file type and size
6. **Rate Limiting**: Prevent brute force password changes

---

## Verification Plan

### Backend Testing
```bash
# Get profile
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/profile

# Update profile
curl -X PUT -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Name","phone":"0123456789"}' \
  http://localhost:5000/api/profile

# Change password
curl -X PUT -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"oldPassword":"old","newPassword":"new"}' \
  http://localhost:5000/api/profile/password
```

### Frontend Testing
1. Navigate to profile page
2. View profile information
3. Click edit button
4. Update fields
5. Save changes
6. Verify toast notification
7. Check data persisted
8. Test password change
9. Upload avatar
10. Test validation errors

---

## Implementation Order

1. ✅ Backend: Profile controller & routes
2. ✅ Backend: Database queries
3. ✅ Frontend: ProfileView component
4. ✅ Frontend: AvatarUpload component
5. ✅ Frontend: API integration
6. ✅ Frontend: Form validation
7. ✅ Integration: Navigation & routing
8. ✅ Testing: E2E flow

---

## Estimated Timeline
- Backend: 30 minutes
- Frontend: 45 minutes
- Integration & Testing: 15 minutes
- **Total**: ~90 minutes
