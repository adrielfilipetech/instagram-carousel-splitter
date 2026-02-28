 // Estado
        let selectedFileSingle = null;
        let selectedFilesBatch = [];

        // Elementos DOM
        const dropZone = document.getElementById('dropZone');
        const dropZoneBatch = document.getElementById('dropZoneBatch');
        const fileInput = document.getElementById('fileInput');
        const fileInputBatch = document.getElementById('fileInputBatch');
        const preview = document.getElementById('preview');
        const previewImage = document.getElementById('previewImage');
        const fileName = document.getElementById('fileName');
        const dimensions = document.getElementById('dimensions');
        const parts = document.getElementById('parts');
        const processBtn = document.getElementById('processBtn');
        const processBatchBtn = document.getElementById('processBatchBtn');
        const fileList = document.getElementById('fileList');
        const fileCount = document.getElementById('fileCount');
        const loading = document.getElementById('loading');
        const loadingPlural = document.getElementById('loadingPlural');
        const errorDiv = document.getElementById('error');
        const successDiv = document.getElementById('success');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        // ==================== TABS ====================
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab).classList.add('active');
                hideMessages();
            });
        });

        // ==================== SINGLE IMAGE MODE ====================

        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            if (e.dataTransfer.files.length > 0) handleFileSingle(e.dataTransfer.files[0]);
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) handleFileSingle(e.target.files[0]);
        });

        function handleFileSingle(file) {
            if (!file.type.startsWith('image/')) {
                showError('Please select a valid image file');
                return;
            }
            selectedFileSingle = file;

            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                const img = new Image();
                img.onload = () => {
                    const numParts = Math.ceil(img.width / 1080);
                    fileName.textContent = file.name;
                    dimensions.textContent = `${img.width} x ${img.height}px`;
                    parts.textContent = numParts;
                    preview.style.display = 'block';
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
            hideMessages();
        }

        processBtn.addEventListener('click', async () => {
            if (!selectedFileSingle) return;
            await splitAndDownload([selectedFileSingle], false);
        });

        // ==================== BATCH MODE ====================

        dropZoneBatch.addEventListener('dragover', (e) => { e.preventDefault(); dropZoneBatch.classList.add('drag-over'); });
        dropZoneBatch.addEventListener('dragleave', () => dropZoneBatch.classList.remove('drag-over'));
        dropZoneBatch.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZoneBatch.classList.remove('drag-over');
            if (e.dataTransfer.files.length > 0) handleFilesBatch(Array.from(e.dataTransfer.files));
        });

        fileInputBatch.addEventListener('change', (e) => {
            if (e.target.files.length > 0) handleFilesBatch(Array.from(e.target.files));
        });

        function handleFilesBatch(files) {
            const imageFiles = files.filter(f => f.type.startsWith('image/'));
            if (imageFiles.length === 0) { showError('Please select valid image files'); return; }
            selectedFilesBatch = imageFiles;
            renderFileList();
            hideMessages();
        }

        function renderFileList() {
            fileList.innerHTML = '';
            fileCount.textContent = selectedFilesBatch.length;
            if (selectedFilesBatch.length === 0) { processBatchBtn.style.display = 'none'; return; }
            processBatchBtn.style.display = 'block';
            selectedFilesBatch.forEach((file, index) => {
                const item = document.createElement('div');
                item.className = 'file-item';
                item.innerHTML = `
                    <span class="file-item-name">${file.name}</span>
                    <button class="file-item-remove" onclick="removeFile(${index})">Remove</button>
                `;
                fileList.appendChild(item);
            });
        }

        window.removeFile = function(index) {
            selectedFilesBatch.splice(index, 1);
            renderFileList();
        };

        processBatchBtn.addEventListener('click', async () => {
            if (selectedFilesBatch.length === 0) return;
            await splitAndDownload(selectedFilesBatch, true);
        });

        // ==================== CORE: SPLIT + ZIP ====================

        async function splitAndDownload(files, isBatch) {
            showLoading(isBatch);
            hideMessages();

            try {
                const zip = new JSZip();

                for (const file of files) {
                    const img = await loadImage(file);
                    const baseName = file.name.replace(/\.[^.]+$/, '');
                    const ext = file.name.split('.').pop().toLowerCase();
                    const mimeType = file.type || 'image/jpeg';
                    const totalParts = Math.ceil(img.width / 1080);

                    for (let i = 0; i < totalParts; i++) {
                        const x = i * 1080;
                        const w = Math.min(1080, img.width - x);
                        canvas.width = w;
                        canvas.height = img.height;
                        ctx.clearRect(0, 0, w, img.height);
                        ctx.drawImage(img, x, 0, w, img.height, 0, 0, w, img.height);

                        const num = String(i + 1).padStart(2, '0');
                        const dataUrl = canvas.toDataURL(mimeType, 0.92);
                        const base64 = dataUrl.split(',')[1];

                        // Em batch, agrupa cada imagem em sua pasta
                        const path = isBatch
                            ? `${baseName}/${baseName}_${num}.${ext}`
                            : `${baseName}_${num}.${ext}`;

                        zip.file(path, base64, { base64: true });
                    }

                    // yield ao navegador entre imagens
                    await new Promise(r => setTimeout(r, 0));
                }

                const blob = await zip.generateAsync({ type: 'blob' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = isBatch ? 'carousel-batch.zip' : `${files[0].name.replace(/\.[^.]+$/, '')}-carousel.zip`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);

                showSuccess('Download started successfully!');

            } catch (err) {
                showError(err.message || 'Error processing image(s)');
            } finally {
                hideLoading();
            }
        }

        function loadImage(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = e.target.result;
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        // ==================== UI HELPERS ====================

        function showLoading(isBatch) {
            loading.style.display = 'block';
            loadingPlural.textContent = isBatch ? 's' : '';
            processBtn.disabled = true;
            processBatchBtn.disabled = true;
        }

        function hideLoading() {
            loading.style.display = 'none';
            processBtn.disabled = false;
            processBatchBtn.disabled = false;
        }

        function showError(message) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            successDiv.style.display = 'none';
        }

        function showSuccess(message) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
            errorDiv.style.display = 'none';
        }

        function hideMessages() {
            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';
        }