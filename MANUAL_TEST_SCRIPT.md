# BloodPG Manual Test Script
## Pre-Closed Beta Testing Checklist

**Test Date:** _______________  
**Tester Name:** _______________  
**Browser:** _______________  
**Environment:** [ ] Local (localhost:3000) [ ] Staging [ ] Production

---

## Prerequisites

- [ ] Development server is running (`npm run dev`)
- [ ] Supabase project is configured and accessible
- [ ] Google OAuth is configured in Supabase dashboard
- [ ] All environment variables are set (`.env.local`)
- [ ] Browser console is open for error checking
- [ ] Network tab is open to monitor API calls

---

## 1. Authentication & User Management

### 1.1 Initial Load (Unauthenticated)
- [ ] Navigate to `http://localhost:3000`
- [ ] **Expected:** Page loads without redirect
- [ ] **Expected:** "Sign in with Google" button appears in top-right corner
- [ ] **Expected:** Main content area shows empty state or placeholder
- [ ] **Expected:** No console errors

### 1.2 Google OAuth Sign-In Flow
- [ ] Click "Sign in with Google" button
- [ ] **Expected:** Redirects to Google OAuth consent screen
- [ ] **Expected:** Google account selection screen appears
- [ ] Select a Google account
- [ ] **Expected:** Redirects back to app at `/auth/callback`
- [ ] **Expected:** Then redirects to home page (`/`)
- [ ] **Expected:** User name/email appears in top-right corner (replaces sign-in button)
- [ ] **Expected:** User profile icon appears next to name
- [ ] **Expected:** Menu button (three dots) appears next to name
- [ ] **Check Console:** No authentication errors
- [ ] **Check Network:** Verify successful API calls to Supabase

### 1.3 User Profile Display
- [ ] **Verify:** User name is displayed (from Google account)
- [ ] **Verify:** If name is long, it truncates with ellipsis (`...`)
- [ ] **Verify:** Menu button remains visible and properly spaced even with long names
- [ ] **Verify:** User profile icon is visible
- [ ] Click menu button (three dots)
- [ ] **Expected:** Dropdown menu appears with "Sign Out" option
- [ ] Click outside the menu
- [ ] **Expected:** Menu closes

### 1.4 Sign-Out Flow
- [ ] Click menu button
- [ ] Click "Sign Out"
- [ ] **Expected:** User is signed out
- [ ] **Expected:** "Sign in with Google" button reappears
- [ ] **Expected:** User data is cleared from session
- [ ] **Check Console:** No errors during sign-out

### 1.5 Session Persistence
- [ ] Sign in with Google
- [ ] Close browser tab
- [ ] Reopen browser and navigate to `http://localhost:3000`
- [ ] **Expected:** User remains signed in (session persisted)
- [ ] **Expected:** User name/email still displayed

### 1.6 Sign-In Modal (Triggered by Actions)
- [ ] Sign out
- [ ] Navigate to left pane "Enter information" tab
- [ ] Enter blood pressure values (AM: 120/80, PM: 130/85)
- [ ] Click "Save" button
- [ ] **Expected:** Sign-in modal appears (full-screen overlay)
- [ ] **Expected:** Modal has dark overlay (rgba(0,0,0,0.65))
- [ ] **Expected:** Modal shows "Continue with Google" button
- [ ] **Expected:** Input fields remain visible (not disabled)
- [ ] **Expected:** "Save" button does NOT change to "Edit"
- [ ] Click "Continue with Google" in modal
- [ ] Complete Google sign-in
- [ ] **Expected:** After sign-in, data is automatically saved
- [ ] **Expected:** "Save" button changes to "Edit"
- [ ] **Expected:** Input fields become disabled
- [ ] **Expected:** Modal closes automatically

### 1.7 Admin Authentication
- [ ] Navigate to `/admin/login`
- [ ] **Expected:** Admin login page appears
- [ ] Sign in with Google account: `asereopeyemimichael@gmail.com`
- [ ] **Expected:** Redirects to `/admin` dashboard
- [ ] Sign in with a different Google account
- [ ] **Expected:** Redirects to home page (`/`) instead of admin dashboard

---

## 2. Blood Pressure Record CRUD Operations

### 2.1 Create New Record (Enter Information Tab)
- [ ] Sign in with Google
- [ ] Navigate to left pane "Enter information" tab
- [ ] **Verify:** Date navigation shows "Today" (or selected date)
- [ ] **Verify:** Date is aligned to the right
- [ ] Enter AM values:
  - [ ] Systolic: `120`
  - [ ] Diastolic: `80`
  - [ ] Select "Pre Medication" radio button
- [ ] Enter PM values:
  - [ ] Systolic: `130`
  - [ ] Diastolic: `85`
  - [ ] Select "Post Medication" radio button
- [ ] **Verify:** Slash (`/`) appears between systolic and diastolic inputs
- [ ] **Verify:** Input fields have black border when active (typing)
- [ ] **Verify:** Radio buttons are black when selected
- [ ] Click "Save" button
- [ ] **Expected:** Success message appears (or no error)
- [ ] **Expected:** "Save" button changes to "Edit" button
- [ ] **Expected:** "Cancel" button disappears
- [ ] **Expected:** Input fields become disabled (gray background)
- [ ] **Check Console:** Verify successful save to Supabase
- [ ] **Check Network:** Verify POST request to Supabase

### 2.2 Update Existing Record
- [ ] With a saved record visible, click "Edit" button
- [ ] **Expected:** "Edit" button changes back to "Save"
- [ ] **Expected:** "Cancel" button reappears
- [ ] **Expected:** Input fields become enabled
- [ ] Change AM systolic from `120` to `125`
- [ ] Click "Save"
- [ ] **Expected:** Record is updated (not duplicated)
- [ ] **Expected:** Button changes back to "Edit"
- [ ] **Check Console:** Verify update operation (not insert)
- [ ] **Check Network:** Verify PUT/PATCH request to Supabase

### 2.3 Date Navigation
- [ ] In "Enter information" tab, click left arrow (backward) next to date
- [ ] **Expected:** Date changes to previous day
- [ ] **Expected:** Form resets (if no record exists for that date)
- [ ] **Expected:** Form loads existing data (if record exists for that date)
- [ ] Click right arrow (forward) next to date
- [ ] **Expected:** Date changes to next day
- [ ] Click date button itself
- [ ] **Expected:** Calendar picker opens
- [ ] Select a different date
- [ ] **Expected:** Date updates
- [ ] **Expected:** Form loads data for selected date (if exists)

### 2.4 View Records in Table (Right Pane)
- [ ] After saving a record, check right pane table
- [ ] **Expected:** Record appears in table
- [ ] **Verify:** S/N column shows sequential numbers (1, 2, 3...)
- [ ] **Verify:** Date column shows formatted date (e.g., "22nd Nov, 2025")
- [ ] **Verify:** BP (AM) column shows "120/80"
- [ ] **Verify:** BP (PM) column shows "130/85"
- [ ] **Verify:** Drug icon (💊) appears next to AM reading (if "Post Medication" was selected)
- [ ] **Verify:** Drug icon appears next to PM reading (if "Post Medication" was selected)
- [ ] **Verify:** Current Medications column shows medications (if any)
- [ ] **Verify:** Table header has gray background (#ededed)
- [ ] **Verify:** Table cells have white background with borders

### 2.5 Pre-Loading Records
- [ ] Sign in
- [ ] **Check Console:** Should see "✅ Pre-loaded X records on app start"
- [ ] Navigate to Records tab in left pane
- [ ] **Expected:** Records appear instantly (no loading spinner)
- [ ] **Expected:** No delay when switching tabs

### 2.6 Record Persistence
- [ ] Save a record
- [ ] Refresh the page (F5)
- [ ] **Expected:** Record still appears in table
- [ ] **Expected:** Record still appears in Records tab
- [ ] **Check Console:** Verify records loaded from Supabase (not localStorage)

### 2.7 Multiple Records
- [ ] Save records for different dates:
  - [ ] Today: AM 120/80, PM 130/85
  - [ ] Yesterday: AM 118/78, PM 128/83
  - [ ] Day before: AM 122/82, PM 132/87
- [ ] **Expected:** All records appear in table
- [ ] **Expected:** Records are sorted by date (newest first)
- [ ] **Expected:** Each record has unique S/N

---

## 3. Date Range Filtering

### 3.1 Date Range Selection (Right Pane)
- [ ] In right pane, locate "From:" and "To:" date buttons
- [ ] **Verify:** "From:" label appears before first date button
- [ ] **Verify:** "To:" label appears between date buttons
- [ ] **Verify:** Space appears between dash and date ranges
- [ ] Click "From:" date button
- [ ] **Expected:** Calendar picker opens
- [ ] Select a start date
- [ ] **Expected:** Date updates
- [ ] Click "To:" date button
- [ ] **Expected:** Calendar picker opens
- [ ] Select an end date
- [ ] **Expected:** Date updates
- [ ] **Expected:** Table filters to show only records within date range

### 3.2 Date Range Navigation
- [ ] Click left arrow next to "From:" date
- [ ] **Expected:** "From:" date moves backward one day
- [ ] Click right arrow next to "From:" date
- [ ] **Expected:** "From:" date moves forward one day
- [ ] Repeat for "To:" date
- [ ] **Expected:** Table updates in real-time as dates change

### 3.3 Filter Edge Cases
- [ ] Set date range to a period with no records
- [ ] **Expected:** Table shows empty state: "No records found. Start by entering your blood pressure data."
- [ ] Set "From:" date after "To:" date
- [ ] **Expected:** Table shows no records (or handles gracefully)
- [ ] Set date range to include only one record
- [ ] **Expected:** Only that record appears

---

## 4. Medications Management

### 4.1 Add Medication
- [ ] Navigate to "Medications" tab in left pane
- [ ] **Verify:** "Today" date navigation is visible and aligned right
- [ ] Click "Drug name" dropdown
- [ ] **Expected:** Dropdown opens with options:
  - [ ] Lisinopril
  - [ ] Amlodipine
  - [ ] Valsartan
  - [ ] Nifedipine
  - [ ] Labetalol
- [ ] **Verify:** Dropdown has white background with black text
- [ ] **Verify:** Dropdown icon is visible and properly aligned
- [ ] Select "Lisinopril"
- [ ] **Expected:** Drug name is selected
- [ ] Click "Frequency" dropdown
- [ ] **Expected:** Dropdown opens with options:
  - [ ] 6hrly
  - [ ] 8hrly
  - [ ] 12hrly
  - [ ] daily
- [ ] **Verify:** Frequency dropdown icon faces down (not up)
- [ ] **Verify:** Frequency field has no placeholder text (just icon)
- [ ] Select "12hrly"
- [ ] Enter dosage: `100mg`
- [ ] Click "Add medication" button
- [ ] **Expected:** Medication is added to list
- [ ] **Expected:** Medication appears in "Current Medications" column in table

### 4.2 Multiple Medications
- [ ] Add a second medication (different drug)
- [ ] **Expected:** Both medications appear
- [ ] **Expected:** Delete icon appears for second medication (not first)
- [ ] **Verify:** Adequate padding between medications
- [ ] Click delete icon on second medication
- [ ] **Expected:** Second medication is removed
- [ ] **Expected:** First medication remains

### 4.3 Medication Dropdown Functionality
- [ ] Click on dropdown text (not icon)
- [ ] **Expected:** Dropdown opens
- [ ] Click on dropdown icon
- [ ] **Expected:** Dropdown also opens
- [ ] **Verify:** Both text and icon are clickable

### 4.4 Medication Input Styling
- [ ] Click into drug name input
- [ ] **Verify:** No stroke/border disappears when typing
- [ ] **Verify:** Input remains visible and functional
- [ ] Type in dosage field
- [ ] **Verify:** Input field styling is consistent

### 4.5 Medication Divider
- [ ] **Verify:** Divider line appears below "Add medication" button
- [ ] **Verify:** Divider has proper padding matching first tab's divider

---

## 5. Records Tab (Left Pane)

### 5.1 Records Display
- [ ] Navigate to "Records" tab in left pane
- [ ] **Expected:** Records appear in card format
- [ ] **Verify:** Each card shows:
  - [ ] Date
  - [ ] AM blood pressure values
  - [ ] PM blood pressure values
  - [ ] Current medications (if any)
- [ ] **Verify:** Drug icon appears for post-medication readings

### 5.2 Records Filter
- [ ] Locate filter dropdown (styled like "Today" calendar button)
- [ ] **Verify:** Dropdown icon is removed (no icon in button)
- [ ] Click filter dropdown
- [ ] **Expected:** Options appear:
  - [ ] This week
  - [ ] Last week
  - [ ] Last month
  - [ ] This month only
- [ ] Select "This week"
- [ ] **Expected:** Records filter to show only this week's records
- [ ] Select "Last month"
- [ ] **Expected:** Records filter accordingly

### 5.3 Download All Button
- [ ] While signed in, click "Download All" button
- [ ] **Expected:** PDF download starts
- [ ] **Expected:** PDF contains all records
- [ ] Sign out
- [ ] Click "Download All" button
- [ ] **Expected:** Sign-in modal appears (full-screen)
- [ ] **Expected:** Modal has dark overlay
- [ ] Sign in via modal
- [ ] **Expected:** PDF download proceeds after sign-in

### 5.4 Records Card Design
- [ ] **Verify:** Records card matches Figma design
- [ ] **Verify:** Values are properly formatted
- [ ] **Verify:** Current medications are attached to cards
- [ ] **Verify:** Download button in records card is black
- [ ] **Verify:** "Download All" button stays within section with appropriate padding

---

## 6. PDF Export

### 6.1 PDF Generation (Signed In)
- [ ] Sign in with Google
- [ ] Ensure you have at least 2-3 records saved
- [ ] Set date range to include multiple records
- [ ] Click "Download Full report" button in right pane
- [ ] **Expected:** PDF generation starts (no errors)
- [ ] **Expected:** PDF file downloads
- [ ] **Expected:** File name format: `BloodPG_Report_[date]_to_[date].pdf`
- [ ] Open downloaded PDF
- [ ] **Verify:** PDF contains:
  - [ ] Logo component (LogoIcon) at top
  - [ ] User name from Google account
  - [ ] User email from Google account
  - [ ] Date range
  - [ ] Report ID (format: `bpg0001`, `bpg0002`, etc.)
  - [ ] Table with all records in date range
  - [ ] Table columns: S/N, Date, BP (AM), BP (PM), Current Medications
  - [ ] Drug icons for post-medication readings
  - [ ] Disclaimer text at bottom
- [ ] **Verify:** PDF styling:
  - [ ] Black area has border radius
  - [ ] Table spacing is consistent
  - [ ] Text weights are correct (bold/regular)
  - [ ] Line height for disclaimer is legible
  - [ ] Overall layout matches Figma design

### 6.2 PDF Generation (Not Signed In)
- [ ] Sign out
- [ ] Click "Download Full report" button
- [ ] **Expected:** Sign-in modal appears
- [ ] Sign in via modal
- [ ] **Expected:** PDF generation proceeds after sign-in

### 6.3 PDF with No Records
- [ ] Set date range to period with no records
- [ ] Click "Download Full report"
- [ ] **Expected:** Alert: "No records available to download."
- [ ] **Expected:** No PDF is generated

### 6.4 PDF File Size
- [ ] Generate PDF with 5+ records
- [ ] **Check:** File size is reasonable (< 2MB for typical report)
- [ ] **Verify:** PDF quality is good (not pixelated)
- [ ] **Verify:** Text is readable

### 6.5 PDF Content Accuracy
- [ ] Generate PDF
- [ ] Compare PDF content with table data
- [ ] **Verify:** All records match
- [ ] **Verify:** Dates are correct
- [ ] **Verify:** Blood pressure values are correct
- [ ] **Verify:** Medications are listed correctly

---

## 7. UI Components & Navigation

### 7.1 Header
- [ ] **Verify:** Logo appears on left
- [ ] **Verify:** Logo does NOT have separate "beta" badge (logo itself contains "beta")
- [ ] **Verify:** "ABOUT US" text is clickable
- [ ] Click "ABOUT US"
- [ ] **Expected:** About Us modal opens (full-screen)
- [ ] **Expected:** Modal has dark overlay (rgba(0,0,0,0.65))
- [ ] **Expected:** Modal matches Figma design
- [ ] Click close button (X) or outside modal
- [ ] **Expected:** Modal closes

### 7.2 Support Icon
- [ ] **Verify:** Support icon is visible in header
- [ ] Click support icon
- [ ] **Expected:** Support modal opens (full-screen)
- [ ] **Expected:** Modal has dark overlay
- [ ] **Expected:** Modal matches Figma design
- [ ] **Verify:** Modal contains:
  - [ ] Title
  - [ ] Icon
  - [ ] Text content
  - [ ] Bullet points
  - [ ] Email address
  - [ ] Logo
  - [ ] Close button

### 7.3 Go Pro Modal
- [ ] **Verify:** Diamond icon is visible in header
- [ ] Click diamond icon
- [ ] **Expected:** Go Pro modal opens (full-screen)
- [ ] **Expected:** Modal has dark overlay
- [ ] **Expected:** Modal matches Figma design
- [ ] **Verify:** Modal contains:
  - [ ] Title
  - [ ] "COMING SOON" badge
  - [ ] Diamond icon
  - [ ] Text content
  - [ ] Features list
  - [ ] Trial offer
  - [ ] "Coming Soon!" button (disabled)
  - [ ] Logo
- [ ] **Verify:** "Coming Soon!" button has disabled hover effect (opacity change)
- [ ] Click "Coming Soon!" button
- [ ] **Expected:** No action (button is disabled)

### 7.4 Main Tabs (Blood Pressure / Glucose Level)
- [ ] **Verify:** Tabs appear above left pane (not in header)
- [ ] **Verify:** "BLOOD PRESSURE" tab is active by default
- [ ] **Verify:** Active tab has black background with white text
- [ ] **Verify:** Active tab shows logo icon (logoblackblood.svg)
- [ ] **Verify:** "GLUCOSE LEVEL" tab is disabled
- [ ] **Verify:** "GLUCOSE LEVEL" tab has "PRO" badge
- [ ] **Verify:** "GLUCOSE LEVEL" tab has disabled hover effect
- [ ] Click "GLUCOSE LEVEL" tab
- [ ] **Expected:** Tab does not switch (disabled)
- [ ] Click "PRO" badge on Glucose Level tab
- [ ] **Expected:** "Coming Soon" modal opens
- [ ] **Verify:** Modal matches design
- [ ] Close modal

### 7.5 Sidebar Tabs
- [ ] **Verify:** Three tabs visible: "Enter information", "Medications", "Records"
- [ ] **Verify:** Active tab has black text and black underline (33% of background line)
- [ ] **Verify:** Active tab icon is black
- [ ] Click "Medications" tab
- [ ] **Expected:** Tab switches
- [ ] **Expected:** Content updates
- [ ] Click "Records" tab
- [ ] **Expected:** Tab switches
- [ ] **Expected:** Content updates

### 7.6 Theme Toggle
- [ ] **Verify:** Light mode button is active (black background)
- [ ] **Verify:** Dark mode button is disabled
- [ ] **Verify:** Dark mode button has disabled hover effect
- [ ] Click dark mode button
- [ ] **Expected:** No action (disabled)

### 7.7 Responsive Design
- [ ] Resize browser window to mobile size (375px width)
- [ ] **Verify:** Layout adapts (if responsive)
- [ ] **Verify:** No horizontal scrolling
- [ ] **Verify:** Text is readable
- [ ] Resize to tablet size (768px width)
- [ ] **Verify:** Layout adapts appropriately

---

## 8. Data Persistence & Real-Time

### 8.1 Supabase Integration
- [ ] Save a record
- [ ] **Check Network Tab:** Verify POST request to Supabase
- [ ] **Check Console:** Verify success message
- [ ] Open Supabase dashboard → Table Editor → blood_pressure_records
- [ ] **Verify:** Record appears in database
- [ ] **Verify:** `user_id` is set correctly
- [ ] **Verify:** All fields are saved correctly

### 8.2 Data Isolation (RLS)
- [ ] Sign in with User A
- [ ] Save a record
- [ ] Sign out
- [ ] Sign in with User B (different Google account)
- [ ] **Expected:** User B does NOT see User A's records
- [ ] **Expected:** Table is empty (or shows only User B's records)
- [ ] Save a record as User B
- [ ] Sign out
- [ ] Sign in as User A again
- [ ] **Expected:** User A sees only their own records

### 8.3 localStorage Fallback
- [ ] Disable network (offline mode in DevTools)
- [ ] Try to save a record
- [ ] **Expected:** Record saves to localStorage (fallback)
- [ ] **Check Console:** Verify fallback message
- [ ] Re-enable network
- [ ] **Expected:** Data syncs to Supabase when online

### 8.4 Record Updates
- [ ] Save a record for today
- [ ] Edit the same record (same date)
- [ ] **Expected:** Record is updated (not duplicated)
- [ ] **Check Database:** Verify only one record exists for that date
- [ ] **Check Database:** Verify `updated_at` timestamp changed

---

## 9. Error Handling & Validation

### 9.1 Input Validation
- [ ] Try to save with empty systolic field
- [ ] **Expected:** Form validation prevents save (or allows with 0)
- [ ] Enter negative number: `-10`
- [ ] **Expected:** Handled gracefully (or prevented)
- [ ] Enter very large number: `9999`
- [ ] **Expected:** Handled gracefully

### 9.2 Network Errors
- [ ] Open DevTools → Network tab
- [ ] Set throttling to "Offline"
- [ ] Try to save a record
- [ ] **Expected:** Error is handled gracefully
- [ ] **Expected:** User sees appropriate message (or localStorage fallback)
- [ ] **Check Console:** No unhandled errors

### 9.3 Authentication Errors
- [ ] Sign in
- [ ] Manually clear session (via console: `localStorage.clear()`)
- [ ] Try to save a record
- [ ] **Expected:** Sign-in modal appears
- [ ] **Expected:** No errors in console

### 9.4 Supabase Errors
- [ ] Save a record
- [ ] **Check Console:** No Supabase errors
- [ ] If error occurs, **Verify:** Error message is user-friendly
- [ ] **Verify:** App doesn't crash

### 9.5 Empty States
- [ ] Clear all data (via `/clear-data` or admin panel)
- [ ] **Expected:** Table shows: "No records found. Start by entering your blood pressure data."
- [ ] **Expected:** Records tab shows empty state
- [ ] **Expected:** No errors in console

---

## 10. Admin Dashboard

### 10.1 Admin Access
- [ ] Navigate to `/admin/login`
- [ ] Sign in with `asereopeyemimichael@gmail.com`
- [ ] **Expected:** Redirects to `/admin` dashboard
- [ ] **Expected:** Admin dashboard loads
- [ ] Sign out
- [ ] Sign in with different email
- [ ] Navigate to `/admin`
- [ ] **Expected:** Redirects to home page (not admin dashboard)

### 10.2 Admin Dashboard Display
- [ ] Sign in as admin
- [ ] **Verify:** Left pane shows "Admin Dashboard" title
- [ ] **Verify:** Right pane shows:
  - [ ] "Dashboard" title (92.577px font size)
  - [ ] Dashboard icon
  - [ ] Date range selector
  - [ ] Stats cards:
    - [ ] Total Users
    - [ ] Total Records
    - [ ] Average Blood Pressure (Systolic/Diastolic)
  - [ ] Users table

### 10.3 Admin Stats
- [ ] **Verify:** "Total Users" counts all authenticated users
- [ ] **Verify:** "Total Records" shows correct count
- [ ] **Verify:** Average blood pressure is calculated correctly
- [ ] **Verify:** Stats update when data changes

### 10.4 Users Table
- [ ] **Verify:** Table shows only users with saved data
- [ ] **Verify:** Table columns:
  - [ ] User email/name
  - [ ] Record count
  - [ ] Delete action
- [ ] Click delete icon for a user
- [ ] **Expected:** Confirmation dialog appears
- [ ] Confirm deletion
- [ ] **Expected:** User and their records are deleted
- [ ] **Expected:** Table updates
- [ ] **Expected:** Stats update

### 10.5 Clear All Data (Admin)
- [ ] Click "Clear All Data" button in admin sidebar
- [ ] **Expected:** Confirmation dialog appears
- [ ] Confirm
- [ ] **Expected:** All data is cleared
- [ ] **Expected:** Page reloads
- [ ] **Expected:** Stats show zeros

---

## 11. Edge Cases & Special Scenarios

### 11.1 Rapid Actions
- [ ] Click "Save" button multiple times rapidly
- [ ] **Expected:** No duplicate records created
- [ ] **Expected:** No errors

### 11.2 Browser Back/Forward
- [ ] Navigate through tabs
- [ ] Click browser back button
- [ ] **Expected:** App handles navigation correctly
- [ ] **Expected:** No data loss

### 11.3 Tab Switching During Save
- [ ] Start entering data
- [ ] Switch to "Medications" tab
- [ ] Switch back to "Enter information" tab
- [ ] **Expected:** Data is preserved (or resets appropriately)

### 11.4 Date Edge Cases
- [ ] Select date far in the past (e.g., 2020)
- [ ] **Expected:** Handled gracefully
- [ ] Select date far in the future (e.g., 2030)
- [ ] **Expected:** Handled gracefully
- [ ] Select today's date
- [ ] **Expected:** Works correctly

### 11.5 Multiple Browser Tabs
- [ ] Open app in two browser tabs
- [ ] Sign in both tabs
- [ ] Save a record in Tab 1
- [ ] Refresh Tab 2
- [ ] **Expected:** Tab 2 shows the new record

### 11.6 Long Text Handling
- [ ] Enter very long medication name
- [ ] **Expected:** Text is handled (truncated or wrapped)
- [ ] Enter very long user name
- [ ] **Expected:** Name truncates with ellipsis in header

---

## 12. Performance

### 12.1 Initial Load
- [ ] Clear browser cache
- [ ] Load app for first time
- [ ] **Check:** Load time is reasonable (< 3 seconds)
- [ ] **Check:** No long-running operations block UI

### 12.2 Record Loading
- [ ] With 10+ records saved
- [ ] Load app
- [ ] **Expected:** Records load quickly
- [ ] **Expected:** No lag when switching tabs
- [ ] **Check Console:** Verify pre-loading message

### 12.3 PDF Generation Performance
- [ ] Generate PDF with 20+ records
- [ ] **Expected:** PDF generates in reasonable time (< 10 seconds)
- [ ] **Expected:** Browser doesn't freeze
- [ ] **Expected:** Progress indicator (if implemented)

---

## 13. Browser Compatibility

### 13.1 Chrome
- [ ] Test in Chrome (latest)
- [ ] **Verify:** All features work
- [ ] **Verify:** No console errors

### 13.2 Firefox
- [ ] Test in Firefox (latest)
- [ ] **Verify:** All features work
- [ ] **Verify:** No console errors

### 13.3 Safari
- [ ] Test in Safari (latest)
- [ ] **Verify:** All features work
- [ ] **Verify:** No console errors

### 13.4 Edge
- [ ] Test in Edge (latest)
- [ ] **Verify:** All features work
- [ ] **Verify:** No console errors

---

## 14. Mobile Responsiveness (if applicable)

### 14.1 Mobile View
- [ ] Open app on mobile device (or mobile emulation)
- [ ] **Verify:** Layout is usable
- [ ] **Verify:** Buttons are tappable
- [ ] **Verify:** Forms are usable
- [ ] **Verify:** Modals display correctly

---

## 15. Final Checks

### 15.1 Console Errors
- [ ] Complete all above tests
- [ ] **Check Console:** No unhandled errors
- [ ] **Check Console:** No warnings (review and address if critical)

### 15.2 Network Requests
- [ ] **Check Network Tab:** All API calls are successful (200 status)
- [ ] **Check Network Tab:** No failed requests
- [ ] **Check Network Tab:** Requests are optimized (no unnecessary calls)

### 15.3 Data Integrity
- [ ] **Verify:** All saved data persists after refresh
- [ ] **Verify:** Data matches between UI and database
- [ ] **Verify:** No data corruption

### 15.4 User Experience
- [ ] **Verify:** All interactions feel smooth
- [ ] **Verify:** Loading states are clear
- [ ] **Verify:** Error messages are helpful
- [ ] **Verify:** Success feedback is provided

---

## Test Summary

**Total Test Cases:** _______________  
**Passed:** _______________  
**Failed:** _______________  
**Blocked:** _______________  

### Critical Issues Found:
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### Minor Issues Found:
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### Notes:
_________________________________________________
_________________________________________________
_________________________________________________

---

## Sign-Off

**Tester Signature:** _______________  
**Date:** _______________  
**Ready for Closed Beta:** [ ] Yes [ ] No

**If No, list blocking issues:**
_________________________________________________
_________________________________________________

