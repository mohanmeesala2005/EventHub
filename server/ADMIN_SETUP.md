# How to Create an Admin Account

## Quick Start (Recommended Method)

I've created a simple script for you! Follow these steps:

### Step 1: Make sure you have a user account
First, create a regular user account by signing up through your application at `http://localhost:3000/signup`

### Step 2: Run the admin promotion script
In your terminal (in the `/home/mohan/EventHub/server` directory), run:

```bash
node makeAdmin.js <email-of-user>
```

**Example:**
```bash
node makeAdmin.js mohan@example.com
```

### Step 3: Log out and log back in
The user MUST log out and log back in for the admin role to take effect (because the role is stored in the JWT token).

---

## Complete Example Walkthrough

Let's say you want to make a user with email `admin@eventhub.com` an admin:

### 1️⃣ Create the user (if not exists)
- Go to `http://localhost:3000/signup`
- Fill in the form:
  - Name: Admin User
  - Username: admin
  - Email: admin@eventhub.com
  - Password: your-password

### 2️⃣ Promote to admin
In your terminal:
```bash
cd /home/mohan/EventHub/server
node makeAdmin.js admin@eventhub.com
```

You should see:
```
✅ Connected to MongoDB
✅ User successfully promoted to admin!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User Details:
  Name:     Admin User
  Username: admin
  Email:    admin@eventhub.com
  Role:     admin
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  IMPORTANT: The user must LOG OUT and LOG IN again
   for the admin role to take effect!
```

### 3️⃣ Log in as admin
- Log out from the application
- Log back in with the admin credentials
- You should now see:
  - "Admin" badge in the navbar
  - "Admin Dashboard" link in navigation
  - Delete buttons on all events

---

## Alternative Methods

### Method 2: Using MongoDB Compass (GUI)

1. Open MongoDB Compass
2. Connect to your database
3. Find the `users` collection
4. Locate the user you want to make admin
5. Click "Edit Document"
6. Change `"role": "user"` to `"role": "admin"`
7. Click "Update"

### Method 3: Using MongoDB Shell

```bash
# Connect to MongoDB
mongosh

# Switch to your database
use your_database_name

# Update user role
db.users.updateOne(
  { email: "admin@eventhub.com" },
  { $set: { role: "admin" } }
)
```

---

## Troubleshooting

### ❌ "User not found"
- Make sure the user exists in the database
- Check that you're using the correct email address
- Verify the email matches exactly (case-sensitive)

### ❌ "Cannot find module"
- Make sure you're in the `/home/mohan/EventHub/server` directory
- Run `npm install` if needed

### ❌ "Admin features not showing"
- Make sure you logged out and logged back in
- Check browser console for errors
- Clear browser cache and try again

---

## Verifying Admin Access

After logging in as admin, you should see:

✅ **In Navbar:**
- "Admin Dashboard" link
- "Admin" badge under your username

✅ **In Events Page:**
- Red delete button on every event card

✅ **Admin Dashboard:**
- Access to `/admin/dashboard`
- Statistics cards (Total Events, Registrations, Upcoming)
- Event management table
- Ability to delete any event

---

## Security Note

🔒 The admin role is stored in the JWT token, which is why users must log out and log back in after being promoted. This ensures the new role is included in their authentication token.
