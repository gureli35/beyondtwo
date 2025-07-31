import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

const ContactForm: React.FC = () => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
    organization: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!formData.name.trim()) {
      newErrors.name = t('contact.validation.nameRequired');
    }
    if (!formData.email.trim()) {
      newErrors.email = t('contact.validation.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('contact.validation.emailInvalid');
    }
    if (!formData.subject) {
      newErrors.subject = t('contact.validation.subjectRequired');
    }
    if (!formData.message.trim()) {
      newErrors.message = t('contact.validation.messageRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact-notion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        console.log('✅ Mesaj email olarak gönderildi');
        
        // 3 saniye sonra formu sıfırla
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
            phone: '',
            organization: '',
          });
        }, 3000);
      } else {
        throw new Error(data.message || 'Mesaj gönderilemedi');
      }
    } catch (error) {
      console.error('❌ Form submission error:', error);
      setErrors({
        submit: error instanceof Error ? error.message : 'Bir hata oluştu. Lütfen tekrar deneyin.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-aos="fade-right" className="propaganda-box">
      <h3 className="font-montserrat font-bold text-2xl mb-6 text-accent-500">
        {t('contact.formTitle')}
      </h3>
      {isSubmitted ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="font-montserrat font-semibold text-xl mb-2 text-accent-500">
            {language === 'tr' ? 'Mesajınız Gönderildi!' : 'Your message has been sent!'}
          </h4>
          <p className="text-accent-500">
            {language === 'tr' ? 'En kısa sürede size dönüş yapacağız.' : 'We will get back to you as soon as possible.'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Submit Error Message */}
          {errors.submit && (
            <div className="bg-primary-500 bg-opacity-20 border-l-4 border-primary-500 text-primary-500 px-4 py-3">
              <strong className="font-bold">Hata: </strong>
              <span className="block sm:inline">{errors.submit}</span>
            </div>
          )}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-accent-500 mb-2">
              {language === 'tr' ? 'Adınız Soyadınız *' : 'Full Name *'}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`form-input ${errors.name ? 'border-primary-500' : ''}`}
              placeholder={language === 'tr' ? 'Adınızı ve soyadınızı girin' : 'Enter your full name'}
            />
            {errors.name && (
              <p className="text-primary-500 text-xs mt-1 font-bold">{errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-accent-500 mb-2">
              {language === 'tr' ? 'E-posta Adresiniz *' : 'Email Address *'}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`form-input ${errors.email ? 'border-primary-500' : ''}`}
              placeholder={language === 'tr' ? 'ornek@email.com' : 'example@email.com'}
            />
            {errors.email && (
              <p className="text-primary-500 text-xs mt-1 font-bold">{errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-accent-500 mb-2">
              {language === 'tr' ? 'Telefon Numarası' : 'Phone Number'}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              placeholder={language === 'tr' ? '+90 555 123 45 67' : '+90 555 123 45 67'}
            />
          </div>
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-accent-500 mb-2">
              {language === 'tr' ? 'Organizasyon/Kurum' : 'Organization/Institution'}
            </label>
            <input
              type="text"
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="form-input"
              placeholder={language === 'tr' ? 'Kurum adı (opsiyonel)' : 'Organization name (optional)'}
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-accent-500 mb-2">
              {language === 'tr' ? 'Konu *' : 'Subject *'}
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className={`form-input ${errors.subject ? 'border-primary-500' : ''}`}
            >
              <option value="">{language === 'tr' ? 'Konu seçin' : 'Select subject'}</option>
              <option value="genel">{language === 'tr' ? 'Genel Bilgi' : 'General Information'}</option>
              <option value="isbirligi">{language === 'tr' ? 'İşbirliği Teklifi' : 'Collaboration Offer'}</option>
              <option value="kaynak">{language === 'tr' ? 'Kaynak Önerisi' : 'Resource Suggestion'}</option>
              <option value="hikaye">{language === 'tr' ? 'Hikaye Paylaşımı' : 'Share a Story'}</option>
              <option value="medya">{language === 'tr' ? 'Medya ve Basın' : 'Media & Press'}</option>
              <option value="gonullu">{language === 'tr' ? 'Gönüllülük' : 'Volunteering'}</option>
              <option value="feedback">{language === 'tr' ? 'Geri Bildirim' : 'Feedback'}</option>
              <option value="teknik">{language === 'tr' ? 'Teknik Destek' : 'Technical Support'}</option>
              <option value="diger">{language === 'tr' ? 'Diğer' : 'Other'}</option>
            </select>
            {errors.subject && (
              <p className="text-primary-500 text-xs mt-1 font-bold">{errors.subject}</p>
            )}
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-accent-500 mb-2">
              {language === 'tr' ? 'Mesajınız *' : 'Message *'}
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className={`form-textarea ${errors.message ? 'border-primary-500' : ''}`}
              placeholder={language === 'tr' ? 'Mesajınızı buraya yazın...' : 'Write your message here...'}
            />
            {errors.message && (
              <p className="text-primary-500 text-xs mt-1 font-bold">{errors.message}</p>
            )}
          </div>
          <div className="flex items-start mb-4">
            <div className="flex items-center h-5">
              <input
                id="privacy"
                name="privacy"
                type="checkbox"
                required
                className="focus:ring-primary-500 h-4 w-4 text-primary-500 border-secondary-600 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="privacy" className="text-accent-500">
                {language === 'tr'
                  ? 'Kişisel verilerimin işlenmesine ve bana geri dönüş yapılması için kullanılmasına izin veriyorum.'
                  : 'I consent to the processing of my personal data and to being contacted for a response.'}
              </label>
            </div>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (language === 'tr' ? 'Gönderiliyor...' : 'Sending...') : (language === 'tr' ? 'Mesajı Gönder' : 'Send Message')}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
