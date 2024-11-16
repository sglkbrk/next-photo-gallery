# Next Photo Gallery

**Next Photo Gallery** is a photo gallery web application built with Next.js and React. It allows users to view images with an interactive gallery experience. The project uses modern front-end technologies such as TailwindCSS and PhotoSwipe for responsive image viewing. The application is integrated with a backend service built with .NET.

## Live Site

You can access the live version of the photo gallery at [https://gallery.buraksaglik.com/](https://gallery.buraksaglik.com/).

## GitHub Repositories

- **Frontend (Next.js)**: [https://github.com/sglkbrk/next-photo-gallery](https://github.com/sglkbrk/next-photo-gallery)
- **Backend (.NET Service)**: [https://github.com/sglkbrk/MyGalleryService](https://github.com/sglkbrk/MyGalleryService)

## Technologies Used

### Frontend:

- **Next.js (v15.0.1)**: React framework for building the user interface.
- **TailwindCSS**: Utility-first CSS framework for styling.
  - `@tailwindcss/aspect-ratio`: Plugin for controlling the aspect ratio of elements.
- **React (v19.0.0-rc-69d4b800-20241021)**: JavaScript library for building user interfaces.
- **PhotoSwipe**: A gallery library for displaying images in full screen, with pinch-to-zoom and swipe navigation.

### Backend:

- **.NET**: The backend is powered by a .NET web API that serves image data and metadata.

## Features

- **Interactive Photo Gallery**: View images in a grid layout and click to open in full-screen mode.
- **Aspect Ratio Control**: Tailwind's aspect ratio plugin ensures images are displayed correctly.
- **Mobile-First Design**: The gallery is optimized for mobile and desktop devices.
- **Zoom and Swipe Navigation**: PhotoSwipe allows for easy zooming and swiping through images in full-screen view.

## 📸 Screenshot

![Project Screenshot](./screenshot.png)

## 🛠 Installation and Setup

To get started with this project, follow these steps:

1. Clone the repository:

   ```bash
   git clone  https://github.com/sglkbrk/next-photo-gallery
   ```

2. Navigate to the project directory:

   ```bash
   cd next-photo-gallery
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and visit:
   ```bash
   http://localhost:3000
   ```

## 🏗 Build for Production

To build the project for production, run:
`bash
    npm run build
    `

Then start the production server with:
`bash
    npm start
    `
