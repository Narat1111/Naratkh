# Văn Thông iOS - Profile & Tools Website

A beautiful, modern profile page with gaming tools, download links, and auto-key features.

## 📁 Project Structure

```
purat site/
├── index.html          # Main HTML file
├── style.css           # Stylesheet with modern design
├── script.js           # Interactive JavaScript
├── images/             # Image assets folder
│   ├── avatar.jpg      # Profile avatar
│   ├── game1.png       # Game icon 1
│   ├── game2.png       # Game icon 2
│   ├── key1.png        # Auto-key icon 1
│   ├── key2.png        # Auto-key icon 2
│   ├── mod1.png        # Mod file icon
│   └── esign.png       # Esign icon
└── README.md           # This file
```

## ✨ Features

### Design
- **Modern Blue & White Theme** with gradient accents
- **Glassmorphism** effects on header
- **Smooth Animations** throughout the page
- **Responsive Design** for mobile, tablet, and desktop
- **Premium Typography** using Inter font
- **Custom Scrollbar** with gradient colors

### Sections
1. **Profile Card** - Avatar with animated ring, verified badge, social links
2. **Quick Links** - YouTube, Zalo Channel, DNS Profile, Certificate downloads
3. **Tải Game** - Game download section
4. **Auto Get Key** - Automatic key retrieval with sparkle effect
5. **Tải File Mod** - Mod file downloads
6. **Tải Esign** - Esign app download
7. **Footer** - Blog and FAQ links with wave animation

### Interactive Features
- Mobile-friendly hamburger menu
- Smooth scroll navigation
- Ripple effects on buttons
- Hover animations on cards
- Scroll-triggered animations
- Click notifications
- Keyboard navigation (ESC to close menu)

## 🚀 How to Use

1. **Open the website**: Simply double-click `index.html` or right-click → Open with → Your browser
2. **Navigate**: Use the menu button (top-right) to access different sections
3. **Interact**: Click on download buttons, social links, and footer items

## 🎨 Customization

### Change Colors
Edit the CSS variables in `style.css`:
```css
:root {
    --primary-blue: #4A90E2;
    --secondary-blue: #357ABD;
    --accent-blue: #5BA3F5;
    /* ... more colors */
}
```

### Add More Items
Copy an existing item card in `index.html` and modify:
```html
<div class="item-card">
    <img src="images/your-icon.png" alt="Icon" class="item-icon">
    <div class="item-info">
        <h3>Your Title</h3>
        <p class="item-desc">Your description</p>
    </div>
    <a href="#" class="item-download-btn">
        <i class="fas fa-download"></i>
    </a>
</div>
```

### Update Links
Replace `#` in the HTML with your actual URLs:
```html
<a href="https://your-link.com" class="social-btn telegram">
```

## 🔧 Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with animations
- **JavaScript** - Interactive features
- **Font Awesome 6.4.0** - Icons
- **Google Fonts (Inter)** - Typography

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## 📝 Notes

- All images are stored in the `/images` folder
- The site is fully responsive and works on all screen sizes
- No external dependencies required (except CDN fonts and icons)
- All animations are CSS-based for better performance

## 👨‍💻 Credits

Created with ❤️ for Văn Thông iOS
© Copyright Văn Thông IOS 2025

---

**Enjoy your beautiful profile page! 🎉**
