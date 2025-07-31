// Client-side email service using EmailJS
import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_beyond2c'; // You'll need to create this in EmailJS
const EMAILJS_TEMPLATE_ID = 'template_contact'; // You'll need to create this in EmailJS
const EMAILJS_PUBLIC_KEY = 'your_public_key'; // Your EmailJS public key

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  organization?: string;
}

export const sendContactEmail = async (formData: ContactFormData): Promise<{ success: boolean; message: string }> => {
  try {
    // Template parameters for EmailJS
    const templateParams = {
      to_name: 'Beyond2C Team',
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject || 'Contact Form Submission',
      message: formData.message,
      phone: formData.phone || 'Not provided',
      organization: formData.organization || 'Not provided',
      reply_to: formData.email,
      date: new Date().toLocaleDateString('tr-TR'),
      time: new Date().toLocaleTimeString('tr-TR')
    };

    // Send email via EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.'
      };
    } else {
      throw new Error('Email sending failed');
    }
  } catch (error) {
    console.error('Email service error:', error);
    return {
      success: false,
      message: 'Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
    };
  }
};

// Alternative: Netlify Forms (if you're hosting on Netlify)
export const sendContactFormNetlify = async (formData: ContactFormData): Promise<{ success: boolean; message: string }> => {
  try {
    const formDataForNetlify = new FormData();
    formDataForNetlify.append('form-name', 'contact');
    formDataForNetlify.append('name', formData.name);
    formDataForNetlify.append('email', formData.email);
    formDataForNetlify.append('subject', formData.subject);
    formDataForNetlify.append('message', formData.message);
    if (formData.phone) formDataForNetlify.append('phone', formData.phone);
    if (formData.organization) formDataForNetlify.append('organization', formData.organization);

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formDataForNetlify as any).toString()
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Mesajınız başarıyla gönderildi!'
      };
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    console.error('Netlify form error:', error);
    return {
      success: false,
      message: 'Mesaj gönderilirken bir hata oluştu.'
    };
  }
};

// Formspree service (another alternative)
export const sendContactFormFormspree = async (formData: ContactFormData): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch('https://formspree.io/f/your_form_id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        phone: formData.phone,
        organization: formData.organization,
      }),
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Mesajınız başarıyla gönderildi!'
      };
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    console.error('Formspree error:', error);
    return {
      success: false,
      message: 'Mesaj gönderilirken bir hata oluştu.'
    };
  }
};
