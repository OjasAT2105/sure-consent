import React, { useState, useEffect } from 'react';

const PublicApp = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerEnabled, setBannerEnabled] = useState(false);
  const [messageHeading, setMessageHeading] = useState('');
  const [messageDescription, setMessageDescription] = useState('This website uses cookies to improve your experience. We\'ll assume you\'re ok with this, but you can opt-out if you wish.');
  const [noticeType, setNoticeType] = useState('banner');
  const [noticePosition, setNoticePosition] = useState('bottom');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'sure_consent_get_public_settings'
        })
      });
      
      const data = await response.json();
      console.log('Frontend settings received:', data);
      if (data.success && data.data) {
        const heading = data.data.message_heading || '';
        const description = data.data.message_description || 'This website uses cookies to improve your experience. We\'ll assume you\'re ok with this, but you can opt-out if you wish.';
        const type = data.data.notice_type || 'banner';
        const position = data.data.notice_position || 'bottom';
        const enabled = data.data.banner_enabled || false;
        
        setMessageHeading(heading);
        setMessageDescription(description);
        setNoticeType(type);
        setNoticePosition(position);
        setBannerEnabled(enabled);
        setShowBanner(enabled);
        
        console.log('Frontend state set:', { noticeType: type, noticePosition: position, enabled });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleAccept = () => {
    setShowBanner(false);
    // Add cookie consent logic here
  };

  const handleDecline = () => {
    setShowBanner(false);
    // Add cookie decline logic here
  };

  if (!showBanner || !bannerEnabled) return null;

  const getPositionStyles = () => {
    if (noticeType === 'banner') {
      return noticePosition === 'top' 
        ? { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999999 }
        : { position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999999 };
    }
    
    if (noticeType === 'box') {
      const baseStyles = { position: 'fixed', zIndex: 9999999, width: '320px', maxWidth: '90vw' };
      switch (noticePosition) {
        case 'top-left': return { ...baseStyles, top: '20px', left: '20px' };
        case 'top-right': return { ...baseStyles, top: '20px', right: '20px' };
        case 'bottom-left': return { ...baseStyles, bottom: '20px', left: '20px' };
        case 'bottom-right': return { ...baseStyles, bottom: '20px', right: '20px' };
        default: return { ...baseStyles, bottom: '20px', right: '20px' };
      }
    }
    
    if (noticeType === 'popup') {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999999,
        width: '400px',
        maxWidth: '90vw'
      };
    }
    
    return { position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999999 };
  };

  console.log('Rendering with:', { noticeType, noticePosition, styles: getPositionStyles() });
  
  return (
    <div 
      style={{
        ...getPositionStyles(),
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '16px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        borderRadius: noticeType === 'box' || noticeType === 'popup' ? '8px' : '0'
      }}
    >
      <div 
        style={{
          maxWidth: noticeType === 'box' || noticeType === 'popup' ? 'none' : '72rem',
          margin: noticeType === 'box' || noticeType === 'popup' ? '0' : '0 auto',
          display: 'flex',
          flexDirection: noticeType === 'box' || noticeType === 'popup' ? 'column' : 'row',
          alignItems: noticeType === 'box' || noticeType === 'popup' ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div style={{ flex: 1 }}>
          {messageHeading && (
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', margin: '0 0 8px 0', color: 'white' }}>
              {messageHeading}
            </h3>
          )}
          <p style={{ fontSize: '14px', margin: 0 }}>{messageDescription}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleDecline}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              border: '1px solid #6b7280',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: 'white',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#374151'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicApp;