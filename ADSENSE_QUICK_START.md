# Google AdSense - Quick Start Guide

## ⚡ 5-Minute Setup

### **Step 1: Get Your Publisher ID**

1. Go to: https://www.google.com/adsense/start/
2. Sign in with Google
3. Add your website
4. Wait for verification (24-48 hours)
5. Once approved, go to **Settings** → **Account**
6. Copy your **Publisher ID** (looks like: `ca-pub-1234567890123456`)

---

### **Step 2: Update AdSense Component**

**File:** `components/AdSense.tsx`

Replace `ca-pub-xxxxxxxxxxxxxxxx` with your Publisher ID:

```typescript
data-ad-client="ca-pub-1234567890123456"  // Your actual ID
```

---

### **Step 3: Add Script to Layout**

**File:** `app/layout.tsx`

Add this to the `<head>` section:

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
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
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

Replace `ca-pub-1234567890123456` with your Publisher ID.

---

### **Step 4: Create Ad Units**

In AdSense Dashboard:

1. Go to **Ads** → **By ad unit**
2. Click **Create new ad unit**
3. Select **Display ads**
4. Name it (e.g., "Homepage Banner")
5. Choose size (e.g., 728x90)
6. Click **Create**
7. Copy the **ad slot number** (looks like: `1234567890`)

**Create Multiple Ad Units:**
- Homepage Banner: `1234567890`
- Article Sidebar: `0987654321`
- Between Articles: `1111111111`

---

### **Step 5: Add Ads to Your Pages**

**Homepage - File:** `app/page.tsx`

```typescript
import AdSense from '@/components/AdSense'

export default function Home() {
  return (
    <div>
      <Header />
      <CategoryNav />
      <BreakingNews />
      
      {/* Ad Banner */}
      <AdSense slot="1234567890" format="horizontal" />
      
      <main>
        <ModernHero />
        <TrendingGrid />
        
        {/* Middle Ad */}
        <AdSense slot="0987654321" format="auto" />
        
        <EditorsPicksSection />
      </main>
      
      <Footer />
    </div>
  )
}
```

**Article Page - File:** `app/[category]/[slug]/page.tsx`

```typescript
import AdSense from '@/components/AdSense'

export default function ArticlePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2">
        <ArticleContent />
      </div>
      
      {/* Sidebar Ads */}
      <aside className="lg:col-span-1">
        <AdSense slot="1111111111" format="vertical" />
      </aside>
    </div>
  )
}
```

---

### **Step 6: Deploy**

1. Commit and push your changes
2. Deploy to production (Vercel, Netlify, etc.)
3. Use your real domain (not localhost)
4. Wait 24-48 hours for ads to appear

---

## 🎯 Ad Sizes

| Size | Type | Best For |
|------|------|----------|
| 728x90 | Leaderboard | Top/Bottom |
| 300x250 | Rectangle | Sidebars |
| 300x600 | Half Page | Sidebars |
| 320x50 | Mobile | Mobile |
| auto | Responsive | Any |

---

## 📊 Usage Examples

### **Horizontal Banner**
```typescript
<AdSense slot="1234567890" format="horizontal" />
```

### **Vertical Sidebar**
```typescript
<AdSense slot="0987654321" format="vertical" />
```

### **Responsive (Auto)**
```typescript
<AdSense slot="1111111111" format="auto" responsive={true} />
```

### **Custom Styling**
```typescript
<AdSense 
  slot="1234567890" 
  format="auto"
  className="my-custom-class"
/>
```

---

## ✅ Checklist

- [ ] Created AdSense account
- [ ] Added website to AdSense
- [ ] Got Publisher ID
- [ ] Updated AdSense component with Publisher ID
- [ ] Added AdSense script to layout
- [ ] Created ad units
- [ ] Added ads to homepage
- [ ] Added ads to article pages
- [ ] Deployed to production
- [ ] Waiting for ads to appear (24-48 hours)

---

## 🔗 Important Links

- **AdSense:** https://www.google.com/adsense/start/
- **Dashboard:** https://adsense.google.com
- **Policies:** https://support.google.com/adsense/answer/48182

---

## 💡 Tips

1. **Don't click your own ads** - This violates policies
2. **Place ads naturally** - Don't force users to see them
3. **Test placements** - See which works best
4. **Monitor performance** - Check dashboard regularly
5. **Quality content** - Better content = better revenue

---

**Your news platform is now ready for monetization!** 💰
