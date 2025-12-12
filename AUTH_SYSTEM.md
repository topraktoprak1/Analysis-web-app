# Authentication System Documentation

## Overview
The application now has a complete role-based authentication system that filters data based on user permissions.

## User Roles

### 1. **Admin**
- **Username:** `admin`
- **Password:** `admin123`
- **Permissions:**
  - Can upload Excel files
  - Can see ALL data in the DATABASE
  - Full access to all features
  - Can view all user information

### 2. **Regular User**
- **Registration:** Users must register with their name matching the PERSONEL column in the DATABASE
- **Permissions:**
  - **Cannot** upload files (only admin can upload)
  - Can **only see their own data** - filtered by their name in the PERSONEL column
  - Can create pivot tables and charts with their own data
  - All analysis features work on their filtered dataset

## How It Works

### Data Filtering
When a regular user logs in with username (e.g., "john_doe") and their full name is "John Doe":
1. The system automatically filters the DATABASE where `PERSONEL = "John Doe"`
2. They only see rows belonging to them
3. All pivot tables and charts are created from their filtered data

### Registration Process
1. Go to `/register.html`
2. Enter:
   - **Full Name** - Must EXACTLY match a name in the DATABASE PERSONEL column
   - **Username** - Unique identifier for login
   - **Password** - Secure password
3. System creates a normal user account
4. User can now login and see only their data

## Security Features

- ✅ Password hashing with Werkzeug security
- ✅ Session-based authentication
- ✅ Login required for all data pages
- ✅ Role-based access control
- ✅ Automatic data filtering by user
- ✅ Upload restricted to admin only

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - New user registration
- `POST /api/logout` - User logout

### Protected Endpoints
All data endpoints now require login and automatically filter by user:
- `GET /api/check-session` - Returns user's filtered data
- `POST /api/upload` - Admin only
- `POST /api/filter` - Filtered by user
- `POST /api/pivot` - Works on user's data
- `POST /api/chart` - Creates charts from user's data
- `POST /api/export` - Exports user's filtered data

## Usage Instructions

### For Admin:
1. Login with `admin` / `admin123`
2. Upload Excel file with DATABASE sheet
3. View all data, create reports
4. Admin sees entire database

### For Regular Users:
1. Register at `/register.html` with name matching DATABASE
2. Login with your username and password
3. Automatically see only YOUR data
4. Create your personal reports and charts

## Example Scenario

**DATABASE has employees:**
- PERSONEL: "Ali Yılmaz", "Ayşe Demir", "Mehmet Kaya"

**User Registration:**
- Name: "Ali Yılmaz" (exact match)
- Username: "ali.yilmaz"
- Password: "secure123"

**After Login:**
- Ali only sees rows where PERSONEL = "Ali Yılmaz"
- His pivot tables show only his data
- His charts visualize only his records

## Code Implementation

### Key Functions:

```python
# Load data with user filtering
def load_excel_data(filepath, user_filter=None):
    # If user_filter is provided, filter by PERSONEL column
    if user_filter and 'PERSONEL' in df.columns:
        df = df[df['PERSONEL'].str.strip().str.upper() == user_filter.strip().upper()]
    return df

# Determine user filter in API endpoints
user_filter = None if session.get('role') == 'admin' else session.get('user')
df = load_excel_data(session['current_file'], user_filter)
```

### Decorators:
```python
@login_required  # Requires login
@admin_required  # Requires admin role
```

## Testing

1. **Test Admin Access:**
   ```
   Login: admin / admin123
   Upload file → See all data
   ```

2. **Test User Access:**
   ```
   Register: name="Your Name" (from DATABASE)
   Login with your credentials
   See only your data
   ```

## Database Structure Required

Excel file must have a sheet named `DATABASE` with at minimum:
- `PERSONEL` column - Employee names (used for filtering)
- Other columns for analysis

## Notes

- User names are case-insensitive and whitespace-trimmed
- In production, replace the in-memory USERS_DB with a real database
- Change the secret_key in production
- Consider adding password reset functionality
- Add email verification for registration in production
