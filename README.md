# 🛠️ NestJS Backend Project

This project is a backend system built using [NestJS](https://nestjs.com/). It provides a robust and scalable RESTful API to support a frontend interface which is separately provided as a downloadable form.

---

## 🚀 Features

- ✅ Built with NestJS and TypeScript
- ✅ RESTful API architecture
- ✅ Modular structure for scalability
- ✅ Integrated with a database (e.g., PostgreSQL, MySQL, MongoDB)
- ✅ API validation and error handling
- ✅ JWT Authentication (if implemented)
- ✅ CORS support for frontend integration

---

## 📁 Project Structure

├── app/
│   ├── admin-dashboard/
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── settings/
│   │   │   ├── general/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── users/
│   │       └── page.tsx
│   ├── admin-login/
│   │   └── page.tsx
│   ├── api/
│   │   ├── admin/
│   │   │   └── categories/
│   │   │       └── seed/
│   │   │           └── route.ts
│   │   ├── auth/
│   │   │   ├── register/
│   │   │   │   └── route.ts
│   │   │   ├── seller/
│   │   │   │   └── route.ts
│   │   │   ├── seller-login/
│   │   │   │   └── route.ts
│   │   │   ├── seller-logout/
│   │   │   │   └── route.ts
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── categories/
│   │   │   └── route.ts
│   │   ├── favorites/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── listings/
│   │   │   ├── create/
│   │   │   │   └── route.ts
│   │   │   ├── product/
│   │   │   │   └── [slug]/
│   │   │   │       └── route.ts
│   │   │   ├── route.ts
│   │   │   ├── uploads/
│   │   │   │   ├── delete/
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── orders/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── cancel/
│   │   │       │   └── route.ts
│   │   │       ├── complete/
│   │   │       │   └── route.ts
│   │   │       └── route.ts
│   │   ├── reviews/
│   │   │   ├── can-review/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── seller/
│   │   │   ├── messages/
│   │   │   │   ├── conversation/
│   │   │   │   │   └── [userId]/
│   │   │   │   │       └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── notifications/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── orders/
│   │   │   │   └── route.ts
│   │   │   ├── reviews/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── search/
│   │   │   │   └── route.ts
│   │   │   ├── stats/
│   │   │   │   └── route.ts
│   │   │   └── users/
│   │   │       └── route.ts
│   │   └── users/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   ├── auth/
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── [token]/
│   │   │       └── page.tsx
│   │   └── seller/
│   │       └── login/
│   │           └── page.tsx
│   ├── cart/
│   │   ├── cart-client.tsx
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── checkout/
│   │   ├── checkout-client.tsx
│   │   ├── page.tsx
│   │   ├── success/
│   │   │   ├── page.tsx
│   │   │   └── success-client.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── success/
│   │           └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── marketplace/
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── orders/
│   │   ├── loading.tsx
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── page.tsx
│   ├── profile/
│   │   └── [username]/
│   │       └── page.tsx
│   ├── seller-dashboard/
│   │   ├── add-listing/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── listings/
│   │   │   ├── loading.tsx
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── loading.tsx
│   │   ├── messages/
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   └── payments/
│   │       └── page.tsx
│   └── [category]/
│       └── [slug]/
│           └── page.tsx
├── components/
│   ├── admin/
│   │   ├── admin-header.tsx
│   │   ├── categories-list.tsx
│   │   ├── dashboard-stats.tsx
│   │   ├── mobile-sidebar.tsx
│   │   ├── recent-activity.tsx
│   │   ├── sales-chart.tsx
│   │   ├── sidebar.tsx
│   │   ├── user-filters.tsx
│   │   └── users-list.tsx
│   ├── auth/
│   │   ├── auth-button.tsx
│   │   └── session-provider.tsx
│   ├── cart/
│   │   └── cart-icon.tsx
│   ├── dashboard/
│   │   ├── header.tsx
│   │   ├── mobile-sidebar.tsx
│   │   ├── PaymentActions.tsx
│   │   ├── PaymentList.tsx
│   │   ├── PaymentStats.tsx
│   │   ├── scroll-area.tsx
│   │   ├── separator.tsx
│   │   └── sidebar.tsx
│   ├── footer.tsx
│   ├── image-upload.tsx
│   ├── layout-wrapper/
│   │   ├── AdminLayout.jsx
│   │   ├── layout-wrapper.tsx
│   │   ├── SellerLayout.tsx
│   │   └── UserLayout.jsx
│   ├── loading.tsx
│   ├── order/
│   │   ├── order-complete-form.tsx
│   │   ├── order-details.tsx
│   │   ├── order-review-form.tsx
│   │   └── orders-list.tsx
│   ├── page-transition.tsx
│   ├── product/
│   │   ├── can-review-check.tsx
│   │   ├── ProductImages.tsx
│   │   ├── ProductPage.tsx
│   │   ├── review-form.tsx
│   │   ├── review-list.tsx
│   │   └── review-stats.tsx
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   ├── top-nav.tsx
│   ├── ui/
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── aspect-ratio.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── chart.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── command.tsx
│   │   ├── context-menu.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── hover-card.tsx
│   │   ├── input-otp.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── menubar.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── pagination.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── resizable.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── toggle-group.tsx
│   │   ├── toggle.tsx
│   │   ├── tooltip.tsx
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   └── UserLayout.jsx
├── components.json
├── context/
│   └── cart-context.tsx
├── generated/
│   ├── prisma/
│   │   ├── client.d.ts
│   │   ├── client.js
│   │   ├── default.d.ts
│   │   ├── default.js
│   │   ├── edge.d.ts
│   │   ├── edge.js
│   │   ├── index-browser.js
│   │   ├── index.d.ts
│   │   ├── index.js
│   │   ├── package.json
│   │   ├── query_engine-windows.dll.node
│   │   ├── runtime/
│   │   │   ├── edge-esm.js
│   │   │   ├── edge.js
│   │   │   ├── index-browser.d.ts
│   │   │   ├── index-browser.js
│   │   │   ├── library.d.ts
│   │   │   ├── library.js
│   │   │   ├── react-native.js
│   │   │   └── wasm.js
│   │   ├── schema.prisma
│   │   ├── wasm.d.ts
│   │   └── wasm.js
│   └── prisma.ts
├── hooks/
│   ├── use-mobile.tsx
│   ├── use-notifications.ts
│   └── use-toast.ts
├── lib/
│   ├── auth.ts
│   ├── image-upload.ts
│   ├── prisma.ts
│   ├── types.ts
│   ├── utils/
│   │   └── api-response.tsx
│   └── utils.ts
├── middleware.ts
├─] next-env.d.ts (ignored)
├── next.config.mjs
├─] node_modules/ (ignored)
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── prisma/
│   ├── migrations/
│   │   ├── 20250504083350_init/
│   │   │   └── migration.sql
│   │   ├── 20250504203421_add_slug/
│   │   │   └── migration.sql
│   │   ├── 20250504213410_add_slug_unique/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   ├── placeholder.svg
│   └── product_images/
│       ├── 02cfeb15-52f0-4578-b298-bc4e0f9f479f.png
│       ├── 0ca22549-fc36-4a43-88e8-40b4e8f79a85.gif
│       ├── 1c7e4863-42fa-44c7-bd79-09c3cb54c3f4.gif
│       ├── 64ee5ed3-66ba-45a4-949f-03ef503bc813.gif
│       ├── b1067d63-b466-4fa8-a7e0-2d64ea5d0d44.gif
│       ├── c829a725-d992-4642-b4b8-ef68639caf83.jpg
│       └── f1830d72-510f-4f69-8fe3-7bac3faba081.gif
├── scripts/
│   └── insert-categories.ts
├── styles/
│   └── globals.css
├── tailwind.config.js
├── tsconfig.json
└── types/
    └── next-auth.d.ts
