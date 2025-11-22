/**
 * Integration Adapters
 * Handles external service integrations: Stripe, Razorpay, Mapbox, Twilio, SMTP
 */

import Stripe from 'stripe';
import nodemailer from 'nodemailer';

// ============================================================================
// Payment Integrations
// ============================================================================

export class StripeAdapter {
  private stripe: Stripe;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2024-11-20.acacia',
    });
  }

  async createPaymentIntent(amount: number, currency: string = 'inr') {
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit
      currency,
    });
  }

  async createCustomer(email: string, name: string) {
    return this.stripe.customers.create({
      email,
      name,
    });
  }

  async createCheckoutSession(data: {
    amount: number;
    currency: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }) {
    return this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: data.currency,
            product_data: {
              name: 'Payment',
            },
            unit_amount: Math.round(data.amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      metadata: data.metadata,
    });
  }
}

export class RazorpayAdapter {
  private keyId: string;
  private keySecret: string;

  constructor(keyId: string, keySecret: string) {
    this.keyId = keyId;
    this.keySecret = keySecret;
  }

  async createOrder(amount: number, currency: string = 'INR') {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency,
        receipt: `receipt_${Date.now()}`,
      }),
    });

    return response.json();
  }

  async verifyPayment(data: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): Promise<boolean> {
    const crypto = require('crypto');
    const text = `${data.orderId}|${data.paymentId}`;
    const generated = crypto
      .createHmac('sha256', this.keySecret)
      .update(text)
      .digest('hex');

    return generated === data.signature;
  }
}

// ============================================================================
// Maps & Routing
// ============================================================================

export class MapboxAdapter {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async getDirections(waypoints: Array<{ lat: number; lng: number }>) {
    const coordinates = waypoints.map((wp) => `${wp.lng},${wp.lat}`).join(';');

    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?` +
        new URLSearchParams({
          access_token: this.accessToken,
          geometries: 'geojson',
          overview: 'full',
          steps: 'true',
        })
    );

    return response.json();
  }

  async optimizeRoute(waypoints: Array<{ lat: number; lng: number }>) {
    const coordinates = waypoints.map((wp) => `${wp.lng},${wp.lat}`).join(';');

    const response = await fetch(
      `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates}?` +
        new URLSearchParams({
          access_token: this.accessToken,
          source: 'first',
          destination: 'last',
          roundtrip: 'false',
          geometries: 'geojson',
        })
    );

    return response.json();
  }

  async geocode(address: string) {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?` +
        new URLSearchParams({
          access_token: this.accessToken,
          limit: '1',
        })
    );

    const data = await response.json();
    return data.features[0]?.center; // Returns [lng, lat]
  }
}

// ============================================================================
// Communication
// ============================================================================

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(data: {
    to: string;
    subject: string;
    html: string;
    attachments?: Array<{ filename: string; content: Buffer }>;
  }) {
    return this.transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to: data.to,
      subject: data.subject,
      html: data.html,
      attachments: data.attachments,
    });
  }

  async sendQuotation(to: string, quotationNumber: string, pdfBuffer: Buffer) {
    const html = `
      <h2>New Quotation from IVR INTERIORS</h2>
      <p>Dear Customer,</p>
      <p>Please find attached quotation <strong>${quotationNumber}</strong>.</p>
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <br>
      <p>Best regards,<br>IVR INTERIORS Team</p>
    `;

    return this.sendEmail({
      to,
      subject: `Quotation ${quotationNumber} from IVR INTERIORS`,
      html,
      attachments: [
        {
          filename: `Quotation-${quotationNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
  }

  async sendInvoice(to: string, invoiceNumber: string, pdfBuffer: Buffer) {
    const html = `
      <h2>Invoice from IVR INTERIORS</h2>
      <p>Dear Customer,</p>
      <p>Please find attached invoice <strong>${invoiceNumber}</strong>.</p>
      <p>Payment details are included in the invoice.</p>
      <br>
      <p>Best regards,<br>IVR INTERIORS Team</p>
    `;

    return this.sendEmail({
      to,
      subject: `Invoice ${invoiceNumber} from IVR INTERIORS`,
      html,
      attachments: [
        {
          filename: `Invoice-${invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
  }
}

export class WhatsAppService {
  private accountSid?: string;
  private authToken?: string;
  private whatsappNumber?: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
  }

  async sendMessage(to: string, message: string) {
    if (!this.accountSid || !this.authToken || !this.whatsappNumber) {
      console.warn('WhatsApp not configured, skipping message send');
      return null;
    }

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          From: this.whatsappNumber,
          To: `whatsapp:${to}`,
          Body: message,
        }),
      }
    );

    return response.json();
  }

  generateWhatsAppLink(phone: string, message: string): string {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }
}

// ============================================================================
// Route Optimization Fallback (TSP Heuristic)
// ============================================================================

export class RouteOptimizerFallback {
  /**
   * Simple nearest neighbor TSP heuristic for route optimization
   * Used as fallback when Mapbox API is not available
   */
  optimizeRoute(waypoints: Array<{ lat: number; lng: number; id?: string }>) {
    if (waypoints.length <= 2) return waypoints;

    const start = waypoints[0];
    const remaining = waypoints.slice(1, -1);
    const end = waypoints[waypoints.length - 1];

    const optimized = [start];
    let current = start;

    while (remaining.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = this.calculateDistance(current, remaining[0]);

      for (let i = 1; i < remaining.length; i++) {
        const distance = this.calculateDistance(current, remaining[i]);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      current = remaining[nearestIndex];
      optimized.push(current);
      remaining.splice(nearestIndex, 1);
    }

    optimized.push(end);

    return optimized;
  }

  private calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number {
    // Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLon = this.toRad(point2.lng - point1.lng);
    const lat1 = this.toRad(point1.lat);
    const lat2 = this.toRad(point2.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}

// ============================================================================
// Service Instances
// ============================================================================

export const stripeService = process.env.STRIPE_SECRET_KEY
  ? new StripeAdapter(process.env.STRIPE_SECRET_KEY)
  : null;

export const razorpayService =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new RazorpayAdapter(
        process.env.RAZORPAY_KEY_ID,
        process.env.RAZORPAY_KEY_SECRET
      )
    : null;

export const mapboxService = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
  ? new MapboxAdapter(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN)
  : null;

export const emailService = new EmailService();
export const whatsappService = new WhatsAppService();
export const routeOptimizerFallback = new RouteOptimizerFallback();
