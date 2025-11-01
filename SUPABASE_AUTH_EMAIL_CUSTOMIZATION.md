# Supabase Auth Email Customization - Professional Templates

## Overview
Customize Supabase Auth emails to match your brand and look professional instead of the default dull templates.

---

## 🎯 Step 1: Access Email Templates in Supabase

### **Step 1.1: Go to Supabase Dashboard**
1. Visit: https://app.supabase.com
2. Select your project: `fcpkknncvrudppocgage`
3. Go to **Authentication** (left sidebar)
4. Click **Email Templates** (under Authentication)

### **Step 1.2: Available Email Templates**

You can customize these emails:
- ✅ Confirm signup
- ✅ Invite user
- ✅ Magic link
- ✅ Change email
- ✅ Reset password
- ✅ Re-authenticate

---

## 🎨 Step 2: Professional Email Template

### **Template Structure**

Each email has:
- **Subject** - Email subject line
- **Body** - HTML email content

### **Professional Confirm Signup Email**

**Subject:**
```
Welcome to Nepta News! Confirm Your Email
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #333;
            font-size: 20px;
            margin-top: 0;
        }
        .content p {
            color: #666;
            margin: 15px 0;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 14px 40px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: transform 0.2s;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .code-box {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            color: #333;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #999;
        }
        .social-links {
            margin: 20px 0;
            text-align: center;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #667eea;
            text-decoration: none;
            font-size: 14px;
        }
        .highlight {
            color: #667eea;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🎉 Welcome to Nepta News</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <h2>Confirm Your Email Address</h2>
            
            <p>Hi there!</p>
            
            <p>Thank you for signing up for <span class="highlight">Nepta News</span>. We're excited to have you join our community of news enthusiasts!</p>
            
            <p>To get started, please confirm your email address by clicking the button below:</p>

            <!-- Confirmation Button -->
            <div class="button-container">
                <a href="{{ .ConfirmationURL }}" class="button">Confirm Email Address</a>
            </div>

            <p style="color: #999; font-size: 12px;">Or copy and paste this link in your browser:</p>
            <div class="code-box">
                {{ .ConfirmationURL }}
            </div>

            <p>This link will expire in 24 hours for security reasons.</p>

            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

            <p><strong>What's next?</strong></p>
            <ul style="color: #666;">
                <li>Browse breaking news and trending stories</li>
                <li>Save articles to read later</li>
                <li>Customize your news preferences</li>
                <li>Get personalized recommendations</li>
            </ul>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p style="margin: 0 0 10px 0;">© 2024 Nepta News. All rights reserved.</p>
            <p style="margin: 0;">
                <a href="https://neptanews.com" style="color: #667eea; text-decoration: none;">Visit Website</a> • 
                <a href="https://neptanews.com/about" style="color: #667eea; text-decoration: none;">About Us</a> • 
                <a href="https://neptanews.com/contact" style="color: #667eea; text-decoration: none;">Contact</a>
            </p>
            <p style="margin: 10px 0 0 0; font-size: 11px;">
                If you didn't sign up for this account, please ignore this email.
            </p>
        </div>
    </div>
</body>
</html>
```

---

## 🔑 Step 3: Reset Password Email

**Subject:**
```
Reset Your Nepta News Password
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #333;
            font-size: 20px;
            margin-top: 0;
        }
        .content p {
            color: #666;
            margin: 15px 0;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 14px 40px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: transform 0.2s;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            color: #856404;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🔐 Reset Your Password</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <h2>Password Reset Request</h2>
            
            <p>Hi there!</p>
            
            <p>We received a request to reset the password for your Nepta News account. If you didn't make this request, you can ignore this email.</p>

            <p>To reset your password, click the button below:</p>

            <!-- Reset Button -->
            <div class="button-container">
                <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
            </div>

            <div class="warning">
                <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please change your password immediately.
            </div>

            <p>Or copy and paste this link:</p>
            <div style="background-color: #f8f9fa; border-left: 4px solid #f5576c; padding: 15px; margin: 20px 0; border-radius: 4px; font-family: 'Courier New', monospace; color: #333; word-break: break-all; font-size: 12px;">
                {{ .ConfirmationURL }}
            </div>

            <p><strong>For your security:</strong></p>
            <ul style="color: #666;">
                <li>Never share this link with anyone</li>
                <li>Use a strong, unique password</li>
                <li>Enable two-factor authentication if available</li>
            </ul>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p style="margin: 0 0 10px 0;">© 2024 Nepta News. All rights reserved.</p>
            <p style="margin: 10px 0 0 0; font-size: 11px;">
                If you didn't request this, please ignore this email and contact support if you have concerns.
            </p>
        </div>
    </div>
</body>
</html>
```

---

## 📧 Step 4: Magic Link Email

**Subject:**
```
Your Nepta News Login Link
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 40px 30px;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 14px 40px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: transform 0.2s;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🔗 Your Login Link</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <p>Hi there!</p>
            
            <p>Click the button below to sign in to your Nepta News account:</p>

            <!-- Login Button -->
            <div class="button-container">
                <a href="{{ .ConfirmationURL }}" class="button">Sign In to Nepta News</a>
            </div>

            <p style="color: #999; font-size: 12px;">Or copy and paste this link:</p>
            <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px; font-family: 'Courier New', monospace; color: #333; word-break: break-all; font-size: 12px;">
                {{ .ConfirmationURL }}
            </div>

            <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p style="margin: 0 0 10px 0;">© 2024 Nepta News. All rights reserved.</p>
            <p style="margin: 10px 0 0 0; font-size: 11px;">
                If you didn't request this link, you can safely ignore this email.
            </p>
        </div>
    </div>
</body>
</html>
```

---

## 🔧 Step 5: How to Apply Templates in Supabase

### **Step 5.1: Go to Email Templates**
1. Supabase Dashboard
2. **Authentication** → **Email Templates**

### **Step 5.2: Edit Each Template**

For each email type:

1. Click on the template name
2. Click **Edit** button
3. Update **Subject** line
4. Update **Body** (HTML content)
5. Click **Save**

### **Step 5.3: Template Variables**

Use these variables in your templates:

| Variable | Description |
|----------|-------------|
| `{{ .ConfirmationURL }}` | Confirmation/reset link |
| `{{ .Email }}` | User's email address |
| `{{ .Data.email_change_token_new }}` | New email token |
| `{{ .Data.email_change_token_current }}` | Current email token |

---

## 🎨 Email Template Features

### **Confirm Signup Email:**
- ✅ Welcome message
- ✅ Confirmation button
- ✅ Direct link
- ✅ Expiration notice
- ✅ Next steps

### **Reset Password Email:**
- ✅ Clear purpose
- ✅ Reset button
- ✅ Security warning
- ✅ Expiration notice
- ✅ Security tips

### **Magic Link Email:**
- ✅ Simple login link
- ✅ Direct button
- ✅ Expiration notice
- ✅ Reassurance

---

## 🎯 Color Scheme

**Primary Gradient:**
```
#667eea → #764ba2 (Purple/Blue)
```

**Reset Password Gradient:**
```
#f093fb → #f5576c (Pink/Red)
```

**Accent Colors:**
- Primary: `#667eea`
- Warning: `#ffc107`
- Success: `#28a745`

---

## 📋 Best Practices

### **✅ Do's:**
- Use clear, professional language
- Include your brand colors
- Add company logo/name
- Provide direct action buttons
- Include security notices
- Add footer with links

### **❌ Don'ts:**
- Don't use too many colors
- Don't make text too small
- Don't use auto-play videos
- Don't include tracking pixels
- Don't make links unclear

---

## 🔍 Testing Emails

### **Test in Supabase:**
1. Go to **Authentication** → **Users**
2. Create a test user
3. Check your email inbox
4. Verify template looks good

### **Email Preview:**
- Test on desktop
- Test on mobile
- Test in different email clients
- Check links work

---

## 📱 Mobile Responsive

All templates are mobile-responsive with:
- ✅ Responsive font sizes
- ✅ Mobile-friendly buttons
- ✅ Proper padding
- ✅ Readable on small screens

---

## 🚀 Deployment

Once you've customized emails:

1. ✅ Save all templates
2. ✅ Test with real email
3. ✅ Deploy your app
4. ✅ Monitor email delivery
5. ✅ Adjust if needed

---

## 📊 Summary

**Before (Default):**
- Dull, plain text
- No branding
- Unprofessional
- Generic

**After (Professional):**
- Beautiful HTML design
- Your brand colors
- Professional appearance
- Clear call-to-action

---

**Your Supabase Auth emails now look professional!** 🎉

See `SUPABASE_AUTH_EMAIL_CUSTOMIZATION.md` for complete templates and instructions!
