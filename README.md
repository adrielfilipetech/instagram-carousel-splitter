# 🖼️ Instagram Carousel Image Slicer

Auto slicer for Instagram carousel images. Split large images into 1080px wide vertical strips perfect for Instagram carousel posts.

## ✨ Features

- 📤 Drag & drop or select images
- ✂️ Automatic split into 1080px wide parts
- 🎯 Maintains original image height
- 📦 Downloads as ZIP with sequential naming
- 🖥️ Clean and modern web interface
- 🗂️ Batch mode — process multiple images at once
- 📴 Works fully offline — no server required

## 🛠️ Technologies

- **Frontend:** [AiraKit Alpha](https://adrielfilipetech.github.io/AiraKit/) a design kit made with HTML5, CSS3, JavaScript (Vanilla)
- **Image Processing:** Canvas API (native browser)
- **ZIP Generation:** [JSZip v3.10.1](https://stuk.github.io/jszip/) by Stuart Knightley

## 📁 Project Structure

```
instagram-carousel-splitter/
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── libs/
│       │   └── jszip.min.js
│       └── main.js
└── README.md
```

## 💻 Usage

No installation needed. Just open `index.html` in your browser.

1. Open `index.html`
2. Upload your image (drag & drop or click to select)
3. Click "Process and Download"
4. Your sliced images will be downloaded as a ZIP file

## 🎨 How It Works

1. Upload an image of any width
2. The app calculates how many 1080px wide parts are needed
3. Splits the image horizontally using the Canvas API
4. Names each part sequentially (`filename_01`, `filename_02`, etc.)
5. Packages everything in a ZIP file for download — all processed locally in the browser

## 📝 Supported Formats

- PNG
- JPG/JPEG
- GIF
- BMP
- WEBP

## 📦 Third-party Libraries

| Library | Version | Author | License | Link |
|---------|---------|--------|---------|------|
| JSZip | 3.10.1 | Stuart Knightley | MIT | [stuk.github.io/jszip](https://stuk.github.io/jszip/) |

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## ⭐ Show your support

Give a ⭐️ if this project helped you!