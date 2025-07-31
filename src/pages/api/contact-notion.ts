import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

// Direkt Resend API key - GERÇEK API KEY!
const RESEND_API_KEY = 're_hpwWG1nt_KxXVKCsSCeGVVaNNaPBRE9vg';
const RECIPIENT_EMAIL = 'beyond2c@europe.com';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers ekle
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS request için
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    console.log('🔥 API çağrısı alındı:', req.method);
    
    const { name, email, subject, message, phone, organization } = req.body;
    
    console.log('📝 Form verileri:', { name, email, subject });

    // Resend API key kontrolü
    if (!RESEND_API_KEY || RESEND_API_KEY.startsWith('re_123')) {
      throw new Error('Geçersiz Resend API key');
    }

    // Direkt Resend client
    const resend = new Resend(RESEND_API_KEY);

    console.log('📧 Contact form submission:', { name, email, subject });

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ad, email ve mesaj alanları zorunludur.' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Geçerli bir email adresi giriniz.' 
      });
    }

    // Email gönder
    const result = await resend.emails.send({
      from: 'Beyond2C <onboarding@resend.dev>', // Resend'in test adresi
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject: `Beyond2C Contact Form: ${subject || 'Yeni Mesaj'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c5282; border-bottom: 2px solid #ed64a6; padding-bottom: 10px;">
            🌍 Beyond2C - Yeni İletişim Mesajı
          </h2>
          
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d3748; margin-top: 0;">İletişim Bilgileri</h3>
            <p><strong>👤 İsim:</strong> ${name}</p>
            <p><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>📞 Telefon:</strong> ${phone}</p>` : ''}
            ${organization ? `<p><strong>🏢 Organizasyon:</strong> ${organization}</p>` : ''}
            <p><strong>🏷️ Konu:</strong> ${subject || 'Belirtilmemiş'}</p>
            <p><strong>📅 Tarih:</strong> ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #ed64a6; margin: 20px 0;">
            <h3 style="color: #2d3748; margin-top: 0;">💬 Mesaj İçeriği</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="background-color: #e2e8f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #4a5568;">
              🤖 Bu mesaj Beyond2C web sitesi contact formu üzerinden otomatik olarak gönderilmiştir.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; font-size: 12px;">Beyond2C - İklim Değişikliği ile Mücadele</p>
          </div>
        </div>
      `,
    });

    console.log('✅ Email başarıyla gönderildi:', result);

    return res.status(200).json({
      success: true,
      message: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.',
    });

  } catch (error) {
    console.error('❌ Email gönderim hatası:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
    });
  }
}
