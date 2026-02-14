# Product Requirements Document (PRD)

## Product Name

**JagritiBuild** (working name)  
Online marketplace for Cement, Bricks, Sariya (Steel), and Sand

---

## 1. Product Overview

JagritiBuild is a **B2C + B2B construction materials e-commerce platform** that enables users to browse, compare, and order building materials such as cement, bricks, sariya (TMT steel), and sand with transparent pricing, local availability, and fast delivery.

The platform focuses on **local suppliers**, **bulk buyers**, and **affordable construction solutions**.

---

## 2. Goals & Objectives

### Primary Goals

- Enable easy online ordering of construction materials
- Provide transparent pricing and unit-based calculations
- Support local delivery logistics
- Reduce dependency on middlemen

### Success Metrics (KPIs)

- Conversion rate (visits → orders)
- Average order value (AOV)
- Repeat customers
- Delivery success rate
- Admin order processing time

---

## 3. Target Users

### 3.1 Customer Types

**Home Owners**
- Small quantity orders
- Focus on price + trust

**Contractors**
- Bulk orders
- Regular repeat purchases

**Builders / Developers**
- Large volume orders
- GST invoices, credit-based flow (future)

### 3.2 Admin Users

- Super Admin
- Inventory Manager
- Order Manager

---

## 4. Tech Stack

### Frontend

- React.js
- Tailwind CSS / CSS Modules
- React Router
- Axios / Fetch API

### Backend

- Node.js
- Express.js
- REST APIs

### Database & Auth

- Supabase
- PostgreSQL
- Auth (Email + Phone OTP)
- Storage (product images, invoices)

### Hosting

- **Frontend**: Vercel / Netlify
- **Backend**: Railway / Render
- **Supabase**: Cloud-hosted

---

## 5. Core Features (MVP)

### 5.1 Public Website (No Login Required)

#### Pages

- Home
- Products
- Product Details
- About Us
- Contact Us

#### Home Page Sections

- Hero banner (trust + affordability)
- Product categories:
  - Cement (bags)
  - Bricks (pieces)
  - Sariya (tons/kg)
  - Sand (trolley / cubic ft)
- Why Choose Us
- Testimonials
- Call-to-action (Order Now)

### 5.2 Product Management

#### Product Categories & Units

| Product | Unit                |
|---------|---------------------|
| Cement  | Bag (50kg)         |
| Bricks  | Per piece          |
| Sariya  | Ton / Kg           |
| Sand    | Trolley / CFT      |

#### Product Fields

- Name
- Category
- Brand
- Price per unit
- Minimum order quantity
- Stock availability
- Quality grade
- Description
- Images

### 5.3 Cart & Checkout

#### Cart Features

- Add / remove items
- Quantity adjustment
- Unit-based price calculation
- Estimated delivery cost

#### Checkout

- Address selection
- Delivery date preference
- Payment mode:
  - COD (initial)
  - Online (future)

### 5.4 User Authentication (Supabase Auth)

- Email + password
- Phone OTP (optional)
- Guest checkout (optional)

### 5.5 Orders

#### Order Flow

1. Order placed
2. Order confirmed by admin
3. Dispatched
4. Delivered
5. Completed

#### Order Fields

- Order ID
- User ID
- Items
- Quantity
- Total amount
- Payment mode
- Delivery status

---

## 6. Admin Panel (Very Important)

### Admin Features

- Login (Supabase role-based)
- Dashboard (orders, revenue, stock)
- Product CRUD (no coding)
- Order management
- Price updates
- Stock updates
- Delivery status updates

### Admin Permissions

- Add/edit/delete products
- Update prices anytime
- Manage inventory
- View customer details

---

## 7. Database Schema (Supabase)

### Tables

#### `users`

- id
- name
- phone
- email
- role (user/admin)
- created_at

#### `products`

- id
- name
- category
- unit
- price
- stock
- description
- image_url
- created_at

#### `orders`

- id
- user_id
- status
- total_amount
- created_at

#### `order_items`

- order_id
- product_id
- quantity
- unit_price

---

## 8. Non-Functional Requirements

### Performance

- Page load < 2 seconds
- Optimized images (WebP)

### Security

- Supabase row-level security (RLS)
- JWT-based auth
- HTTPS only

### Scalability

- Modular backend
- Ready for mobile app later

---

## 9. Responsive Design

### Mobile-First Approach

The platform will be built with a **mobile-first design philosophy**, ensuring optimal experience across all device sizes.

### Breakpoints

| Device Type    | Screen Width     | Priority |
|----------------|------------------|----------|
| Mobile         | < 640px          | High     |
| Tablet         | 641px - 1024px   | High     |
| Desktop        | > 1024px         | Medium   |

### Mobile View Requirements (< 640px)

#### Layout
- Single column layout
- Full-width product cards
- Sticky header with hamburger menu
- Bottom navigation for key actions (Home, Cart, Orders, Profile)
- Collapsible filters and categories

#### Features
- Touch-optimized buttons (min 44x44px)
- Swipe gestures for product images
- One-tap phone call for customer support
- WhatsApp quick order button
- Simplified checkout flow (max 3 steps)

#### Cart & Checkout
- Floating cart icon with item count badge
- Slide-up cart drawer
- Sticky "Proceed to Checkout" button
- Auto-save cart on browser close

#### Product Display
- Large product images (full width)
- Tap to zoom functionality
- Horizontal scroll for product variants
- Quantity selector with +/- buttons
- Instant price calculation display

### Tablet View Requirements (641px - 1024px)

#### Layout
- Two-column grid for product listings
- Split-screen checkout (form + summary)
- Sidebar navigation (collapsible)
- Expanded header with search bar

#### Features
- Grid view with larger product cards
- Side panel for filters
- Enhanced product comparison (up to 3 items)
- Picture-in-picture cart preview

#### Admin Panel
- Split-screen dashboard (metrics + quick actions)
- Inline editing for products
- Drag-and-drop image upload
- Side-by-side order details view

### Desktop View Requirements (> 1024px)

#### Layout
- Three or four-column product grid
- Persistent sidebar navigation
- Mega menu for categories
- Full-width hero banners

#### Features
- Hover effects for product cards
- Quick view modal on hover
- Advanced filters panel
- Keyboard shortcuts for power users

### Cross-Device Features

#### Must-Have Responsive Elements
- Responsive typography (fluid sizing)
- Adaptive images (srcset for multiple resolutions)
- Touch and mouse input support
- Orientation change handling

#### Performance Optimization
- Lazy loading for images
- Progressive image loading (blur-up effect)
- Code splitting for faster initial load
- Service worker for offline cart access

#### UI/UX Consistency
- Consistent color scheme across devices
- Unified iconography (Google Material Icons)
- Same brand voice and messaging
- Synchronized cart across devices (logged-in users)

### Testing Requirements

- Test on real devices:
  - iOS (iPhone SE, iPhone 12+)
  - Android (Samsung, Xiaomi, OnePlus)
  - iPad / Android tablets
- Browser testing:
  - Chrome, Safari, Firefox (mobile + desktop)
- Accessibility:
  - Screen reader compatibility
  - Keyboard navigation
  - Sufficient color contrast (WCAG AA)

---

## 10. Design Inspiration & UI/UX Guidelines

### Design References

This section consolidates design inspiration from:
- **JagritiBricks** (existing implementation)
- **ACC Help** (https://www.acchelp.in/) - India's trusted cement company

### Color Palette

**Primary Colors**
- **Brand Red**: `#E63946` / `rgb(230, 57, 70)` - CTAs, buttons, highlights
- **Dark Background**: `#1A1A1A` / `#2D2D2D` - Hero sections, dark mode
- **White/Cream**: `#FFFFFF` / `#FFF8F0` - Clean backgrounds, cards

**Accent Colors**
- **Success Green**: `#25D366` - WhatsApp integration
- **Warning Orange**: `#FF6B35` - Step badges, notifications
- **Trust Blue**: `#457B9D` - Links, secondary actions

### Hero Section Design

**Dark Hero with Contrast** (Inspired by JagritiBricks)
- Dark gradient background (`#1A1A1A` to `#2D1B1B`)
- Large, bold white typography
- Red accent border on the left of text blocks
- High-quality construction imagery on the right
- Prominent CTA button with icon
- WhatsApp floating button (bottom-right, green `#25D366`)

**Key Elements**
```
✅ Factory-direct • Strong & uniform • Best price in your area
```
- Checkmark icon with trust messaging
- Concise value propositions
- Clear call-to-action: "BUY NOW" / "BUY BRICKS NOW"

### Step-by-Step Guide Section

**Visual Process Flow** (Inspired by ACC Help)

Display 4-6 steps with numbered badges:

1. **Choose Ideal Land** - Soil quality, location, legal aspects
2. **Planning & Design** - Architect collaboration, blueprint
3. **Budgeting & Materials** - Cost estimation, material selection
4. **Construction Techniques** - Best practices, quality assurance

**Design Pattern**
- Step number in orange circular badge (top-left)
- Card-based layout with subtle shadows
- Icon or illustration for each step
- Hover effect: subtle lift + shadow increase
- "View Details" link in each card

### Cost Calculator Widget

**Interactive Tool** (Inspired by ACC Help)
- Prominent placement: Homepage + Product pages
- Input fields: Area (sq ft), Construction type, Material grade
- Real-time calculation display
- "Get Precise Cost Estimate" CTA
- Export/Download estimate as PDF

### Trust & Credibility Elements

**Customer Stories** (ACC Help style)
- "Building Dreams Building Stories" section
- Customer testimonials with photos
- Before/after project images
- Video testimonials (optional)

**Trust Badges**
- "Factory-Direct Pricing"
- "Quality Certified"
- "Local Delivery Available"
- "8+ Decades of Excellence" (if applicable)

### Product Showcase

**Category Cards**
- Large, clear imagery
- Product name + brand
- Price per unit (bold, prominent)
- Stock status indicator
- Quick "Add to Cart" button
- Hover: Zoom effect on image

**Product Grid**
- 3-4 columns on desktop
- 2 columns on tablet
- 1 column on mobile
- Filter sidebar (collapsible)
- Sort options: Price, Popularity, New arrivals

### WhatsApp Integration

**Floating Widget**
- Fixed position: bottom-right
- Green circular button (`#25D366`)
- WhatsApp icon (white)
- Pulse animation on page load
- "Chat on WhatsApp" tooltip on hover

**Additional Placements**
- Footer: "Chat on WhatsApp" button
- Product pages: "Quick order via WhatsApp"
- Checkout: "Need help? WhatsApp us"

### Footer Design

**Multi-Column Layout** (Inspired by JagritiBricks)

**Column 1: Brand**
- Logo + tagline
- Brief company description
- Social media icons

**Column 2: Quick Links**
- Home
- Our Products
- Shopping Cart
- Contact Us

**Column 3: Support**
- Privacy Policy
- Terms of Service
- Shipping Info
- Returns

**Column 4: Contact Us**
- Phone: `+91 9876543210` (clickable tel: link)
- Email: `info@jagritibricks.com` (clickable mailto: link)
- Location: "Local delivery available"
- WhatsApp button

**Footer Style**
- Dark background (`#212529`)
- White/light gray text
- Hover effects on links (color change to brand red)
- Copyright notice at bottom

### Admin Panel Design

**Clean, Centered Login** (JagritiBricks style)
- White card on light background
- Brand logo + "Admin Login" heading
- Simple form (username, password)
- Red "LOGIN TO ADMIN PANEL" button
- Error messages in red banner
- Default credentials hint (dev mode only)

**Dashboard Layout**
- Sidebar navigation
- Top stats cards (orders, revenue, products, customers)
- Charts/graphs for trends
- Recent orders table
- Quick action buttons

### Mobile-Specific Features

**Bottom Navigation Bar**
- 4 primary actions: Home, Bricks (Products), Cart, Profile
- Active state: Color change + icon fill
- Fixed position at bottom
- Icon + label layout

**Dark Mode Toggle**
- Top-right corner
- Moon/sun icon
- Smooth transition animation
- Persist preference in localStorage

### Typography

**Font Families**
- **Headings**: `'Playfair Display', serif` or `'Merriweather', serif`
- **Body**: `'Inter', 'Segoe UI', sans-serif`
- **Numbers/Prices**: `'Roboto Mono', monospace`

**Font Weights**
- Logo/Brand: 700 (Bold)
- Headings: 600-700
- Body: 400
- Small text: 300-400

### Button Styles

**Primary CTA**
- Background: Brand red (`#E63946`)
- Text: White, bold
- Border radius: `8px` (rounded)
- Padding: `12px 32px`
- Hover: Darken + subtle lift
- Icon support (brick icon + text)

**Secondary CTA**
- Outline style (red border)
- Background: Transparent
- Text: Red
- Hover: Fill with red

### Animation & Interactions

**Micro-Interactions**
- Button hover: Scale 1.02 + shadow increase
- Card hover: Lift (translateY -4px)
- Image hover: Zoom 1.05
- Links: Underline slide-in animation

**Page Transitions**
- Fade-in on scroll (AOS library)
- Stagger animations for lists
- Skeleton loaders for async content

### Accessibility

- WCAG AA compliant color contrast
- Alt text for all images
- Keyboard navigation support
- Focus indicators (2px red outline)
- Screen reader-friendly labels

### Key UI Components to Build

1. **Hero Banner** - Dark, bold, with CTA
2. **Product Card** - Image, name, price, stock, add-to-cart
3. **Step Cards** - Numbered guide cards
4. **Cost Calculator** - Interactive form widget
5. **Testimonial Carousel** - Customer stories
6. **WhatsApp Floating Button** - Fixed positioning
7. **Footer** - Multi-column, dark theme
8. **Mobile Bottom Nav** - 4-icon navigation
9. **Admin Login Card** - Centered, clean
10. **Toast Notifications** - Success/error messages

---

## 11. Future Enhancements (Phase 2)

- GST invoices
- Supplier onboarding
- Real-time delivery tracking
- Price comparison
- WhatsApp order integration
- Credit-based orders for contractors
- Mobile app (React Native)

---

## 10. Risks & Mitigation

| Risk               | Mitigation                |
|--------------------|---------------------------|
| Price fluctuations | Admin instant update      |
| Delivery delays    | Manual admin control      |
| Stock mismatch     | Real-time inventory       |
| Trust issues       | Reviews + testimonials    |

---

## 11. Timeline (Suggested)

| Phase          | Duration |
|----------------|----------|
| UI Design      | 1 week   |
| Frontend Dev   | 2 weeks  |
| Backend APIs   | 2 weeks  |
| Admin Panel    | 1 week   |
| Testing        | 1 week   |

---

## 12. Final Notes

This PRD is:

✅ Practical  
✅ Scalable  
✅ India-specific (units, materials)  
✅ Perfect for Node + React + Supabase (proceed mcp is already there)
