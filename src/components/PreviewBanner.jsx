import { useSettings } from "../contexts/SettingsContext";

const PreviewBanner = () => {
  const { getCurrentValue } = useSettings();
  const previewEnabled = getCurrentValue('preview_enabled');
  const messageHeading = getCurrentValue('message_heading') || 'Cookie Notice';
  const messageDescription = getCurrentValue('message_description') || 'This website uses cookies to improve your experience. We\'ll assume you\'re ok with this, but you can opt-out if you wish.';
  const noticeType = getCurrentValue('notice_type') || 'banner';
  const noticePosition = getCurrentValue('notice_position') || 'bottom';
  const bannerBgColor = getCurrentValue('banner_bg_color') || '#1f2937';
  const bgOpacity = getCurrentValue('bg_opacity') || '100';
  const textColor = getCurrentValue('text_color') || '#ffffff';
  const borderStyle = getCurrentValue('border_style') || 'solid';
  const borderWidth = getCurrentValue('border_width') || '1';
  const borderColor = getCurrentValue('border_color') || '#000000';
  const borderRadius = getCurrentValue('border_radius') || '8';
  const font = getCurrentValue('font') || 'Arial';
  const bgImage = getCurrentValue('bg_image') || '';
  const acceptBtnColor = getCurrentValue('accept_btn_color') || '#2563eb';
  const declineBtnColor = getCurrentValue('decline_btn_color') || 'transparent';

  if (!previewEnabled) return null;

  const getPositionStyles = () => {
    const highZIndex = 2147483647; // Maximum z-index value
    
    if (noticeType === 'banner') {
      return noticePosition === 'top' 
        ? { position: 'fixed', top: '32px', left: 0, right: 0, zIndex: highZIndex }
        : { position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: highZIndex };
    }
    
    if (noticeType === 'box') {
      const baseStyles = { position: 'fixed', zIndex: highZIndex, width: '320px', maxWidth: '90vw' };
      switch (noticePosition) {
        case 'top-left': return { ...baseStyles, top: '52px', left: '20px' };
        case 'top-right': return { ...baseStyles, top: '52px', right: '180px' };
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
          maxWidth: noticeType === 'box' ? 'none' : '72rem',
          margin: noticeType === 'box' ? '0' : '0 auto',
          display: 'flex',
          flexDirection: noticeType === 'box' ? 'column' : 'row',
          alignItems: noticeType === 'box' ? 'flex-start' : 'center',
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

export default PreviewBanner;