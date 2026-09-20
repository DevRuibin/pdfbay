import { createIcons, icons } from 'lucide';
import { showAlert, showLoader, hideLoader } from '../ui.js';
import { downloadFile, formatBytes } from '../utils/helpers.js';
import { initI18n, t } from '../i18n/index.js';
import { convertImagesToPdfFile } from '../utils/images-to-pdf-lib.js';
import { isValidImageFile } from '../utils/image-input-utils.js';
import { performOcr } from '../utils/ocr.js';
import {
  getAvailableTesseractLanguageEntries,
  UnsupportedOcrLanguageError,
} from '../utils/tesseract-language-availability.js';

let images: File[] = [];
let extractedText = '';
let searchablePdfBytes: Uint8Array | null = null;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}

async function initializePage() {
  await initI18n();
  createIcons({ icons });

  const fileInput = document.getElementById('file-input') as HTMLInputElement;
  const dropZone = document.getElementById('drop-zone');
  const addMoreBtn = document.getElementById('add-more-btn');
  const clearFilesBtn = document.getElementById('clear-files-btn');
  const processBtn = document.getElementById(
    'process-btn'
  ) as HTMLButtonElement;
  const copyBtn = document.getElementById('copy-text-btn');
  const downloadTxtBtn = document.getElementById('download-txt-btn');
  const downloadPdfBtn = document.getElementById('download-pdf-btn');

  populateLanguageSelect();

  fileInput?.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    if (target.files?.length) handleFiles(target.files);
  });

  dropZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('bg-gray-600');
  });
  dropZone?.addEventListener('dragleave', () => {
    dropZone.classList.remove('bg-gray-600');
  });
  dropZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('bg-gray-600');
    const dropped = (e as DragEvent).dataTransfer?.files;
    if (dropped?.length) handleFiles(dropped);
  });
  fileInput?.addEventListener('click', () => {
    fileInput.value = '';
  });

  addMoreBtn?.addEventListener('click', () => fileInput?.click());
  clearFilesBtn?.addEventListener('click', () => {
    images = [];
    resetResults();
    updateUI();
  });
  processBtn?.addEventListener('click', runOcr);
  copyBtn?.addEventListener('click', copyText);
  downloadTxtBtn?.addEventListener('click', downloadTxt);
  downloadPdfBtn?.addEventListener('click', downloadSearchablePdf);

  const backBtn = document.getElementById('back-to-tools');
  backBtn?.addEventListener('click', () => {
    window.location.href = 'tools.html';
  });

  document.querySelectorAll('details').forEach((details) => {
    details.addEventListener('toggle', () => createIcons({ icons }));
  });

  updateUI();
}

function populateLanguageSelect() {
  const select = document.getElementById('ocr-language') as HTMLSelectElement;
  if (!select) return;

  select.innerHTML = '';

  const availableEntries = getAvailableTesseractLanguageEntries();
  if (availableEntries.length === 0) {
    const option = document.createElement('option');
    option.textContent = t('tools:imageToText.noLanguages');
    option.value = '';
    select.appendChild(option);
    select.disabled = true;
    return;
  }

  // English first — it is the default for most users and the tesseract default.
  const sorted = [...availableEntries].sort((a, b) => {
    if (a[0] === 'eng') return -1;
    if (b[0] === 'eng') return 1;
    return a[1].localeCompare(b[1]);
  });

  for (const [code, name] of sorted) {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = name;
    option.setAttribute('data-i18n-ignore', '');
    if (code === 'eng') option.selected = true;
    select.appendChild(option);
  }
}

function handleFiles(fileList: FileList | File[]) {
  const incoming = Array.from(fileList);
  const valid: File[] = [];
  const rejected: string[] = [];

  for (const file of incoming) {
    if (isValidImageFile(file)) valid.push(file);
    else rejected.push(file.name);
  }

  if (rejected.length) {
    showAlert(
      t('tools:imageToText.unsupportedTitle'),
      t('tools:imageToText.unsupportedMessage', { files: rejected.join(', ') })
    );
  }

  images = images.concat(valid);
  resetResults();
  updateUI();
}

function resetResults() {
  extractedText = '';
  searchablePdfBytes = null;
  const results = document.getElementById('ocr-results');
  if (results) results.classList.add('hidden');
  const output = document.getElementById(
    'text-output'
  ) as HTMLTextAreaElement | null;
  if (output) output.value = '';
}

function updateUI() {
  const fileDisplayArea = document.getElementById('file-display-area');
  const toolOptions = document.getElementById('tool-options');
  const fileControls = document.getElementById('file-controls');
  const dropZoneHint = document.getElementById('drop-zone-hint');

  if (fileDisplayArea) {
    fileDisplayArea.innerHTML = '';
    if (images.length) {
      images.forEach((file) => {
        const row = document.createElement('div');
        row.className =
          'flex items-center justify-between text-sm bg-gray-900 border border-gray-700 rounded-lg px-3 py-2';

        const name = document.createElement('span');
        name.className = 'truncate text-gray-200 mr-3';
        name.textContent = file.name;

        const size = document.createElement('span');
        size.className = 'text-gray-500 whitespace-nowrap';
        size.textContent = formatBytes(file.size);

        row.append(name, size);
        fileDisplayArea.appendChild(row);
      });
    }
  }

  if (toolOptions) toolOptions.classList.toggle('hidden', images.length === 0);
  if (fileControls)
    fileControls.classList.toggle('hidden', images.length === 0);
  if (dropZoneHint) {
    dropZoneHint.classList.toggle('hidden', images.length > 0);
  }
}

async function runOcr() {
  const select = document.getElementById('ocr-language') as HTMLSelectElement;
  const language = select?.value;

  if (!language) {
    showAlert(
      t('tools:imageToText.noLanguagesTitle'),
      t('tools:imageToText.noLanguagesMessage')
    );
    return;
  }
  if (!images.length) {
    showAlert(
      t('tools:imageToText.noFileTitle'),
      t('tools:imageToText.noFileMessage')
    );
    return;
  }

  const toolOptions = document.getElementById('tool-options');
  const results = document.getElementById('ocr-results');
  const loaderText = document.getElementById('loader-text');
  if (toolOptions) toolOptions.classList.add('hidden');
  showLoader();

  const setStatus = (status: string, progress: number) => {
    if (!loaderText) return;
    const pct = Math.round((progress || 0) * 100);
    loaderText.textContent = `${status} ${pct}%`;
  };

  try {
    setStatus(t('tools:imageToText.preparing'), 0.05);
    const pdfFile = await convertImagesToPdfFile(images);

    setStatus(t('tools:imageToText.recognizing'), 0.15);
    const result = await performOcr(
      new Uint8Array(await pdfFile.arrayBuffer()),
      {
        language,
        resolution: 2,
        binarize: true,
        whitelist: '',
        onProgress: setStatus,
      }
    );

    extractedText = result.fullText.trim();
    searchablePdfBytes = result.pdfBytes;

    const output = document.getElementById(
      'text-output'
    ) as HTMLTextAreaElement | null;
    if (output) output.value = extractedText;
    if (results) results.classList.remove('hidden');

    hideLoader();
    createIcons({ icons });
  } catch (e) {
    hideLoader();
    if (e instanceof UnsupportedOcrLanguageError) {
      showAlert(t('tools:imageToText.languageUnavailableTitle'), e.message);
    } else {
      showAlert(
        t('tools:imageToText.ocrErrorTitle'),
        t('tools:imageToText.ocrErrorMessage')
      );
      console.error(e);
    }
    if (toolOptions) toolOptions.classList.remove('hidden');
  }
}

async function copyText() {
  if (!extractedText) return;
  try {
    await navigator.clipboard.writeText(extractedText);
    const btn = document.getElementById('copy-text-btn');
    const label = btn?.querySelector('span');
    if (label) {
      const original = label.textContent;
      label.textContent = t('tools:imageToText.copied');
      setTimeout(() => {
        label.textContent = original;
      }, 1500);
    }
  } catch {
    showAlert(
      t('tools:imageToText.copyErrorTitle'),
      t('tools:imageToText.copyErrorMessage')
    );
  }
}

function downloadTxt() {
  if (!extractedText) return;
  const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
  downloadFile(blob, 'image-to-text.txt');
}

function downloadSearchablePdf() {
  if (!searchablePdfBytes) return;
  const blob = new Blob([new Uint8Array(searchablePdfBytes)], {
    type: 'application/pdf',
  });
  downloadFile(blob, 'image-to-text-searchable.pdf');
}
