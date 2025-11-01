# Google AdSense Integration - Complete Setup Guide

## Overview
This guide will help you integrate Google AdSense into your Next.js news platform to monetize your content.

---

## 📋 Prerequisites

Before starting, you need:
- ✅ Google Account
- ✅ Website/Domain (can be localhost for testing)
- ✅ Next.js project (you already have this)
- ✅ Some published content on your site

---

## 🔑 Step 1: Create Google AdSense Account

### **Step 1.1: Go to Google AdSense**
1. Visit: https://www.google.com/adsense/start/
2. Click **Sign in with Google**
3. Use your Google account (or create one)

### **Step 1.2: Sign Up for AdSense**
1. Click **Sign up now**
2. Enter your website URL
3. Select your country/region
4. Accept terms and conditions
5. Click **Create account**

### **Step 1.3: Add Your Website**
1. Go to **Sites** (left menu)
2. Click **Add site**
3. Enter your domain: `yourdomain.com`
4. Click **Add site**

### **Step 1.4: Verify Your Site**
Google will give you a verification code to add to your website.

**Two methods:**

**Method A: Meta Tag (Recommended)**
```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

**Method B: HTML File**
- Download the HTML file
- Upload to your website root

---

## 🔗 Step 2: Add Verification Meta Tag to Your Site

### **In Next.js:**

**File:** `app/layout.tsx`

Find the metadata section and add:

```typescript
export const metadata: Metadata = {
  title: 'Your Site Title',
  description: 'Your description',
  verification: {
    google: 'YOUR_VERIFICATION_CODE_HERE'
  }
}
```

**Example:**
```typescript
export const metadata: Metadata = {
  title: 'Nepta News - Breaking News & World News',
  description: 'Stay updated with breaking news...',
  verification: {
    google: 'abc123def456ghi789jkl'  // Replace with your code
  }
}
```

### **Or Add Directly to HTML:**

**File:** `app/layout.tsx`

In the `<head>` section:

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="YOUR_CODE_HERE" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
```

---

## 📝 Step 3: Wait for Site Verification

1. Go to Google AdSense dashboard
2. Click **Sites** → Your site
3. Click **Verify**
4. Wait 24-48 hours for verification
5. You'll get email confirmation

**Note:** Verification can take a few days. Meanwhile, you can prepare your ad placements.

---

## 🎯 Step 4: Get Your AdSense Code

### **Step 4.1: Go to AdSense Dashboard**
1. Visit: https://adsense.google.com
2. Sign in with your Google account
3. Go to **Ads** (left menu)
4. Click **By ad unit**

### **Step 4.2: Create Ad Units**

**Create Display Ads:**
1. Click **Create new ad unit**
2. Select **Display ads**
3. Name it (e.g., "Homepage Banner")
4. Choose size (recommended: 728x90, 300x250, 300x600)
5. Click **Create**
6. Copy the ad code

**Example Ad Code:**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

---

## 💻 Step 5: Create AdSense Component

Create a reusable component for ads:

**File:** `components/AdSense.tsx`

```typescript
'use client'

import { useEffect } from 'react'

interface AdSenseProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  responsive?: boolean
}

export default function AdSense({ slot, format = 'auto', responsive = true }: AdSenseProps) {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div className="my-8 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
        }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  )
}
```

---

## 🎨 Step 6: Add Ads to Your Pages

### **Option 1: Homepage Banner (Top)**

**File:** `app/page.tsx`

```typescript
import AdSense from '@/components/AdSense'

export default function Home() {
  return (
    <div>
      <Header />
      <CategoryNav />
      <BreakingNews />
      
      {/* Ad Banner - Top */}
      <AdSense slot="1234567890" format="horizontal" />
      
      <main>
        <ModernHero />
        <TrendingGrid />
        
        {/* Ad Banner - Middle */}
        <AdSense slot="0987654321" format="auto" />
        
        <EditorsPicksSection />
      </main>
      
      <Footer />
    </div>
  )
}
```

### **Option 2: Sidebar Ads (Article Page)**

**File:** `app/[category]/[slug]/page.tsx`

```typescript
import AdSense from '@/components/AdSense'

export default function ArticlePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2">
        <ArticleContent />
      </div>
      
      {/* Sidebar with Ads */}
      <aside className="lg:col-span-1">
        <AdSense slot="1111111111" format="vertical" />
        <AdSense slot="2222222222" format="vertical" />
      </aside>
    </div>
  )
}
```

### **Option 3: Between Articles (Latest News)**

**File:** `components/LatestNews.tsx`

```typescript
import AdSense from '@/components/AdSense'

export default function LatestNews() {
  return (
    <section>
      {/* Articles */}
      {articles.map((article, index) => (
        <div key={article.id}>
          <ArticleCard article={article} />
          
          {/* Ad every 3 articles */}
          {(index + 1) % 3 === 0 && (
            <AdSense slot="3333333333" format="auto" />
          )}
        </div>
      ))}
    </section>
  )
}
```

---

## 🔧 Step 7: Add AdSense Script to Layout

**File:** `app/layout.tsx`

Add the AdSense script in the `<head>`:

```typescript
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
```

**Replace:** `ca-pub-xxxxxxxxxxxxxxxx` with your **Publisher ID**

---

## 📍 Recommended Ad Placements

### **Homepage:**
```
┌─────────────────────────────────┐
│ Header                          │
├─────────────────────────────────┤
│ [AD BANNER - 728x90]            │  ← Top banner
├─────────────────────────────────┤
│ Breaking News                   │
├─────────────────────────────────┤
│ Hero Section                    │
├─────────────────────────────────┤
│ [AD BANNER - 300x250]           │  ← Middle ad
├─────────────────────────────────┤
│ Trending Grid                   │
├─────────────────────────────────┤
│ Editor's Picks                  │
├─────────────────────────────────┤
│ [AD BANNER - 728x90]            │  ← Bottom banner
├─────────────────────────────────┤
│ Footer                          │
└─────────────────────────────────┘
```

### **Article Page:**
```
┌──────────────────────────────────────────┐
│ Article Content          │ [AD 300x600]  │
│                          │               │
│ Paragraph 1              │ [AD 300x250]  │
│                          │               │
│ Paragraph 2              │               │
│                          │               │
│ [AD 728x90]              │               │
│                          │               │
│ Paragraph 3              │               │
└──────────────────────────────────────────┘
```

---

## 🎯 Ad Sizes (Recommended)

| Size | Type | Best For |
|------|------|----------|
| 728x90 | Leaderboard | Top/Bottom banners |
| 300x250 | Medium Rectangle | Sidebars, Between content |
| 300x600 | Half Page | Sidebars |
| 160x600 | Wide Skyscraper | Sidebars |
| 320x50 | Mobile Banner | Mobile devices |
| 300x50 | Mobile Banner | Mobile devices |

---

## 🚀 Step 8: Deploy and Monitor

### **Step 8.1: Deploy Your Site**
1. Deploy to production (Vercel, Netlify, etc.)
2. Use your real domain (not localhost)
3. Wait for AdSense approval

### **Step 8.2: Monitor Performance**
1. Go to AdSense dashboard
2. Check **Performance reports**
3. Monitor:
   - Impressions
   - Clicks
   - CTR (Click-Through Rate)
   - RPM (Revenue Per Mille)

### **Step 8.3: Optimize Ads**
- Test different ad placements
- Monitor which ads perform best
- Adjust based on user behavior

---

## ⚠️ AdSense Policies

### **✅ Do's:**
- Place ads naturally in content
- Use recommended ad sizes
- Ensure good user experience
- Have quality content
- Follow Google policies

### **❌ Don'ts:**
- Don't click your own ads
- Don't encourage clicks
- Don't place too many ads
- Don't use misleading content
- Don't violate policies

---

## 🔍 Troubleshooting

### **Ads Not Showing**

**Problem:** Ads not displaying on your site

**Solutions:**
1. Check AdSense script is added
2. Verify Publisher ID is correct
3. Check ad slots are correct
4. Wait 24-48 hours for approval
5. Check browser console for errors

**Check Console:**
```javascript
// Open browser console (F12)
// Look for errors related to adsbygoogle
```

### **Low Revenue**

**Problem:** Getting few clicks/impressions

**Solutions:**
1. Increase page traffic
2. Optimize ad placements
3. Improve content quality
4. Test different ad sizes
5. Wait for more data

### **Account Suspended**

**Problem:** AdSense account suspended

**Reasons:**
- Invalid traffic
- Clicking own ads
- Policy violations
- Low-quality content

**Solution:**
- Review AdSense policies
- Appeal if you believe it's wrong
- Fix issues and reapply

---

## 📊 Complete Implementation Example

### **Create AdSense Component:**

**File:** `components/AdSense.tsx`

```typescript
'use client'

import { useEffect } from 'react'

interface AdSenseProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  responsive?: boolean
  className?: string
}

export default function AdSense({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
}: AdSenseProps) {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div className={`my-8 flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
        }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  )
}
```

### **Update Layout:**

**File:** `app/layout.tsx`

```typescript
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
```

### **Use in Homepage:**

**File:** `app/page.tsx`

```typescript
import AdSense from '@/components/AdSense'

export default function Home() {
  return (
    <div>
      <Header />
      <CategoryNav />
      <BreakingNews />
      
      <AdSense slot="1234567890" format="horizontal" />
      
      <main>
        <ModernHero />
        <TrendingGrid />
        <AdSense slot="0987654321" format="auto" />
        <EditorsPicksSection />
      </main>
      
      <Footer />
    </div>
  )
}
```

---

## 📝 Checklist

- [ ] Created Google AdSense account
- [ ] Added website to AdSense
- [ ] Added verification meta tag
- [ ] Waited for site verification (24-48 hours)
- [ ] Created ad units in AdSense
- [ ] Got Publisher ID and ad slots
- [ ] Created AdSense component
- [ ] Added AdSense script to layout
- [ ] Added ads to homepage
- [ ] Added ads to article pages
- [ ] Deployed to production
- [ ] Monitored performance
- [ ] Optimized placements

---

## 🎯 Summary

**Time Required:** 30 minutes setup + 24-48 hours verification  
**Difficulty:** Easy  
**Revenue Potential:** Depends on traffic and content quality  

**Steps:**
1. Create AdSense account
2. Verify your website
3. Create ad units
4. Add component to Next.js
5. Place ads on pages
6. Deploy and monitor

---

## 📚 Useful Links

- **AdSense Home:** https://www.google.com/adsense/start/
- **AdSense Dashboard:** https://adsense.google.com
- **AdSense Policies:** https://support.google.com/adsense/answer/48182
- **AdSense Help:** https://support.google.com/adsense

---

**Your news platform is now ready to monetize with Google AdSense!** 💰

Good luck with your monetization! 🚀
