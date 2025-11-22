/**
 * PDF Generator Service
 * Server-side PDF generation using Puppeteer
 * Supports: Quotations, Invoices, Agreements, Measurement Reports
 */

import puppeteer from 'puppeteer';

export interface PDFOptions {
  format?: 'A4' | 'Letter';
  landscape?: boolean;
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  displayHeaderFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
}

export interface QuotationData {
  quotationNumber: string;
  date: string;
  clientName: string;
  clientAddress?: string;
  clientPhone?: string;
  clientEmail?: string;
  items: Array<{
    name: string;
    description?: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  validUntil?: string;
  notes?: string;
  termsConditions?: string;
}

export interface InvoiceData extends QuotationData {
  invoiceNumber: string;
  dueDate?: string;
  paidAmount?: number;
  dueAmount?: number;
}

export interface MeasurementReportData {
  title: string;
  date: string;
  location: string;
  photos: Array<{
    url: string;
    caption?: string;
    annotations?: any[];
  }>;
  notes?: string;
}

export class PDFGenerator {
  private async initBrowser() {
    return puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    });
  }

  async generateQuotationPDF(
    data: QuotationData,
    options: PDFOptions = {}
  ): Promise<Buffer> {
    const html = this.generateQuotationHTML(data);
    return this.generatePDFFromHTML(html, options);
  }

  async generateInvoicePDF(
    data: InvoiceData,
    options: PDFOptions = {}
  ): Promise<Buffer> {
    const html = this.generateInvoiceHTML(data);
    return this.generatePDFFromHTML(html, options);
  }

  async generateMeasurementReportPDF(
    data: MeasurementReportData,
    options: PDFOptions = {}
  ): Promise<Buffer> {
    const html = this.generateMeasurementReportHTML(data);
    return this.generatePDFFromHTML(html, options);
  }

  private async generatePDFFromHTML(
    html: string,
    options: PDFOptions = {}
  ): Promise<Buffer> {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    const pdf = await page.pdf({
      format: options.format || 'A4',
      landscape: options.landscape || false,
      margin: options.margin || {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm',
      },
      displayHeaderFooter: options.displayHeaderFooter || false,
      headerTemplate: options.headerTemplate,
      footerTemplate: options.footerTemplate,
      printBackground: true,
    });

    await browser.close();

    return Buffer.from(pdf);
  }

  private generateQuotationHTML(data: QuotationData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              font-size: 12px;
              line-height: 1.6;
              color: #333;
              padding: 40px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: start;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 3px solid #1e40af;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #1e40af;
            }
            .doc-type {
              font-size: 28px;
              font-weight: bold;
              color: #1e40af;
              text-align: right;
            }
            .doc-number {
              font-size: 14px;
              color: #666;
              margin-top: 5px;
            }
            .info-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .info-block h3 {
              font-size: 14px;
              color: #1e40af;
              margin-bottom: 10px;
              text-transform: uppercase;
            }
            .info-block p {
              margin: 5px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 30px 0;
            }
            thead {
              background-color: #1e40af;
              color: white;
            }
            th, td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
            }
            th {
              font-weight: 600;
              text-transform: uppercase;
              font-size: 11px;
            }
            td {
              font-size: 12px;
            }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .totals {
              margin-top: 30px;
              display: flex;
              justify-content: flex-end;
            }
            .totals-table {
              width: 300px;
            }
            .totals-table td {
              padding: 8px 12px;
            }
            .total-row {
              font-weight: bold;
              font-size: 14px;
              background-color: #f3f4f6;
            }
            .notes {
              margin-top: 40px;
              padding: 20px;
              background-color: #f9fafb;
              border-left: 4px solid #1e40af;
            }
            .notes h3 {
              font-size: 14px;
              color: #1e40af;
              margin-bottom: 10px;
            }
            .footer {
              margin-top: 60px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              color: #666;
              font-size: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">IVR INTERIORS</div>
              <p style="margin-top: 5px; color: #666;">Premium Interior Solutions</p>
            </div>
            <div class="doc-type">
              QUOTATION
              <div class="doc-number">${data.quotationNumber}</div>
              <div class="doc-number">${data.date}</div>
            </div>
          </div>

          <div class="info-section">
            <div class="info-block">
              <h3>Quotation To:</h3>
              <p><strong>${data.clientName}</strong></p>
              ${data.clientAddress ? `<p>${data.clientAddress}</p>` : ''}
              ${data.clientPhone ? `<p>Phone: ${data.clientPhone}</p>` : ''}
              ${data.clientEmail ? `<p>Email: ${data.clientEmail}</p>` : ''}
            </div>
            <div class="info-block" style="text-align: right;">
              <h3>Company Details:</h3>
              <p><strong>IVR INTERIORS</strong></p>
              <p>Hyderabad, Telangana</p>
              <p>Phone: +91-9876543210</p>
              <p>Email: info@ivrinteriors.com</p>
            </div>
          </div>

          ${data.validUntil ? `
            <div style="background-color: #fef3c7; padding: 10px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
              <strong>Valid Until:</strong> ${data.validUntil}
            </div>
          ` : ''}

          <table>
            <thead>
              <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 40%;">Item Description</th>
                <th style="width: 10%;" class="text-center">Qty</th>
                <th style="width: 10%;" class="text-center">Unit</th>
                <th style="width: 15%;" class="text-right">Unit Price</th>
                <th style="width: 20%;" class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${data.items
                .map(
                  (item, index) => `
                <tr>
                  <td class="text-center">${index + 1}</td>
                  <td>
                    <strong>${item.name}</strong>
                    ${item.description ? `<br><small style="color: #666;">${item.description}</small>` : ''}
                  </td>
                  <td class="text-center">${item.quantity}</td>
                  <td class="text-center">${item.unit}</td>
                  <td class="text-right">₹${item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td class="text-right">₹${item.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="totals">
            <table class="totals-table">
              <tr>
                <td>Subtotal:</td>
                <td class="text-right">₹${data.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              ${data.discount > 0 ? `
                <tr>
                  <td>Discount:</td>
                  <td class="text-right">-₹${data.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              ` : ''}
              <tr>
                <td>Tax (${data.taxRate}%):</td>
                <td class="text-right">₹${data.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr class="total-row">
                <td>TOTAL:</td>
                <td class="text-right">₹${data.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            </table>
          </div>

          ${data.notes || data.termsConditions ? `
            <div class="notes">
              ${data.notes ? `
                <h3>Notes:</h3>
                <p>${data.notes}</p>
              ` : ''}
              ${data.termsConditions ? `
                <h3 style="margin-top: 20px;">Terms & Conditions:</h3>
                <p>${data.termsConditions}</p>
              ` : ''}
            </div>
          ` : ''}

          <div class="footer">
            <p>Thank you for your business!</p>
            <p style="margin-top: 5px;">IVR INTERIORS | Premium Interior Solutions | www.ivrinteriors.com</p>
          </div>
        </body>
      </html>
    `;
  }

  private generateInvoiceHTML(data: InvoiceData): string {
    // Similar to quotation but with invoice-specific fields
    return this.generateQuotationHTML(data).replace(/QUOTATION/g, 'INVOICE');
  }

  private generateMeasurementReportHTML(data: MeasurementReportData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              font-size: 12px;
              line-height: 1.6;
              color: #333;
              padding: 40px;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 3px solid #1e40af;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #1e40af;
            }
            .title {
              font-size: 20px;
              margin: 20px 0 10px;
            }
            .photo {
              margin: 30px 0;
              page-break-inside: avoid;
            }
            .photo img {
              max-width: 100%;
              border: 1px solid #e5e7eb;
            }
            .caption {
              margin-top: 10px;
              font-style: italic;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">IVR INTERIORS</div>
            <h1 class="title">${data.title}</h1>
            <p>${data.date} | ${data.location}</p>
          </div>

          ${data.photos.map((photo, index) => `
            <div class="photo">
              <img src="${photo.url}" alt="Photo ${index + 1}" />
              ${photo.caption ? `<p class="caption">${photo.caption}</p>` : ''}
            </div>
          `).join('')}

          ${data.notes ? `
            <div style="margin-top: 40px; padding: 20px; background-color: #f9fafb; border-left: 4px solid #1e40af;">
              <h3>Notes:</h3>
              <p>${data.notes}</p>
            </div>
          ` : ''}
        </body>
      </html>
    `;
  }
}

// Singleton instance
export const pdfGenerator = new PDFGenerator();
