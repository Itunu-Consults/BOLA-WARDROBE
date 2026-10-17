import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BOLA_OFFICIAL_WHATSAPP_LINK,
  sanitizeWhatsappNumber,
  createProductOrderWhatsappUrl,
  createConsultationWhatsappUrl,
  createGeneralInquiryWhatsappUrl,
} from './whatsapp.ts';

test('BOLA_OFFICIAL_WHATSAPP_LINK points to requested https://wa.link/ghucjd', () => {
  assert.equal(BOLA_OFFICIAL_WHATSAPP_LINK, 'https://wa.link/ghucjd');
});

test('sanitizeWhatsappNumber preserves wa.link URL or formats phone', () => {
  assert.equal(sanitizeWhatsappNumber('https://wa.link/ghucjd'), 'https://wa.link/ghucjd');
  assert.equal(sanitizeWhatsappNumber('+234 801 234 5678'), '2348012345678');
  assert.equal(sanitizeWhatsappNumber('08012345678'), '2348012345678');
});

test('createProductOrderWhatsappUrl directs to https://wa.link/ghucjd', () => {
  const url = createProductOrderWhatsappUrl({
    whatsappNumber: '2348000000000',
    product: {
      name: 'Adire Swirl Two-Piece Set',
      slug: 'adire-swirl-two-piece-set',
    },
    selectedOptions: {
      Size: 'M',
      Color: 'Emerald Green',
    },
    quantity: 1,
  });

  assert.equal(url, 'https://wa.link/ghucjd');
});

test('createConsultationWhatsappUrl directs to https://wa.link/ghucjd', () => {
  const url = createConsultationWhatsappUrl('2348000000000', {
    fullName: 'Amara Johnson',
    consultationType: 'Event Styling',
    preferredDate: '2026-11-05',
    preferredTime: '2:00 PM',
  });

  assert.equal(url, 'https://wa.link/ghucjd');
});

test('createGeneralInquiryWhatsappUrl directs to https://wa.link/ghucjd', () => {
  const url = createGeneralInquiryWhatsappUrl('2348000000000', 'Bespoke Order', 'Question');
  assert.equal(url, 'https://wa.link/ghucjd');
});
