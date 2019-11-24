import { Component } from '@angular/core';
// import { TesseractWorker } from 'tesseract.js';
import { createWorker } from 'tesseract.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  TITLE = 'TextSense';
  text = '';
  showSpinner = false;
  worker: any;

  constructor() {
    this.worker = createWorker();
  }

  async recognize(event) {
    try {
      this.showSpinner = true;
      let imageFile = event.target.files[0];
      await this.worker.load();
      await this.worker.loadLanguage('eng');
      await this.worker.initialize('eng');
      const { data: { text } } = await this.worker.recognize(imageFile);
      this.text = text;
      this.showSpinner = false;
    } catch (e) {
      alert('Something went wrong while trying to recognize text: ' + e);
    }
  }

  async downloadPDF() {
    try {
      const filename = 'tesseract-ocr-result.pdf';
      const { data } = await this.worker.getPDF('Tesseract OCR Result');
      const blob = new Blob([new Uint8Array(data)], { type: 'application/pdf' });
      if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, filename);
      } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch(e) {
      alert('Something went wrong while trying to download PDF: ' + e);
    }
  }
}
