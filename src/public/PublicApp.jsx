import React, { useState, useEffect } from 'react';

const PublicApp = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerEnabled, setBannerEnabled] = useState(false);
  const [messageHeading, setMessageHeading] = useState('');
  const [messageDescription, setMessageDescription] = useState('This website uses cookies to improve your experience. We\'ll assume you\'re ok with this, but you can opt-out if you wish.');
  const [noticeType, setNoticeType] = useState('banner');
  const [noticePosition, setNoticePosition] = useState('bottom');
  const [bannerBgColor, setBannerBgColor] = useState('#1f2937');
  const [bgOpacity, setBgOpacity] = useState('100');
  const [textColor, setTextColor] = useState('#ffffff');
  const [borderStyle, setBorderStyle] = useState('solid');
  const [borderWidth, setBorderWidth] = useState('1');
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderRadius, setBorderRadius] = useState('8');
  const [font, setFont] = useState('Arial');
  const [bgImage, setBgImage] = useState('');
  const [acceptBtnColor, setAcceptBtnColor] = useState('#2563eb');
  const [declineBtnColor, setDeclineBtnColor] = useState('transparent');

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
        const bgColor = data.data.banner_bg_color || '#1f2937';
        const opacity = data.data.bg_opacity || '100';
        const txtColor = data.data.text_color || '#ffffff';
        const bStyle = data.data.border_style || 'solid';
        const bWidth = data.data.border_width || '1';
        const bColor = data.data.border_color || '#000000';
        const bRadius = data.data.border_radius || '8';
        const fontFamily = data.data.font || 'Arial';
        const bgImg = data.data.bg_image || '';
        const acceptColor = data.data.accept_btn_color || '#2563eb';
        const declineColor = data.data.decline_btn_color || 'transparent';
        
        setMessageHeading(heading);
        setMessageDescription(description);
        setNoticeType(type);
        setNoticePosition(position);
        setBannerEnabled(enabled);
        setShowBanner(enabled);
        setBannerBgColor(bgColor);
        setBgOpacity(opacity);
        setTextColor(txtColor);
        setBorderStyle(bStyle);
        setBorderWidth(bWidth);
        setBorderColor(bColor);
        setBorderRadius(bRadius);
        setFont(fontFamily);
        setBgImage(bgImg);
        setAcceptBtnColor(acceptColor);
        setDeclineBtnColor(declineColor);
        
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
    const highZIndex = 2147483647; // Maximum z-index value
    
    if (noticeType === 'banner') {
      return noticePosition === 'top' 
        ? { position: 'fixed', top: 0, left: 0, right: 0, zIndex: highZIndex }
        : { position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: highZIndex };
    }
    
    if (noticeType === 'box') {
      const baseStyles = { position: 'fixed', zIndex: highZIndex, width: '320px', maxWidth: '90vw' };
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
        zIndex: highZIndex,
        width: '400px',
        maxWidth: '90vw'
      };
    }
    
    return { position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: highZIndex };
  };

  const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  console.log('Rendering with:', { noticeType, noticePosition, styles: getPositionStyles() });
  
  return (
    <div 
      style={{
        ...getPositionStyles(),
        backgroundColor: hexToRgba(bannerBgColor, bgOpacity),
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: textColor,
        fontFamily: font,
        padding: '16px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        borderRadius: (noticeType === 'box' || noticeType === 'popup' ? borderRadius : '0') + 'px',
        borderStyle: borderStyle,
        borderWidth: borderWidth + 'px',
        borderColor: borderColor
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
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', margin: '0 0 8px 0', color: textColor }}>
              {messageHeading}
            </h3>
          )}
          <p style={{ fontSize: '14px', margin: 0, color: textColor }}>{messageDescription}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleDecline}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              border: '1px solid #6b7280',
              borderRadius: '4px',
              backgroundColor: declineBtnColor,
              color: 'white',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: acceptBtnColor,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicApp;