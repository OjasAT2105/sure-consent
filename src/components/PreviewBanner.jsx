import { useSettings } from "../contexts/SettingsContext";

const PreviewBanner = () => {
  const { getCurrentValue } = useSettings();
  const previewEnabled = getCurrentValue('preview_enabled');
  const messageHeading = getCurrentValue('message_heading') || 'Cookie Notice';
  const messageDescription = getCurrentValue('message_description') || 'This website uses cookies to improve your experience. We\'ll assume you\'re ok with this, but you can opt-out if you wish.';
  const noticeType = getCurrentValue('notice_type') || 'banner';
  const noticePosition = getCurrentValue('notice_position') || 'bottom';

  if (!previewEnabled) return null;

  const getPositionStyles = () => {
    if (noticeType === 'banner') {
      return noticePosition === 'top' 
        ? { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999999 }
        : { position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999999 };
    }
    
    if (noticeType === 'box') {
      const baseStyles = { position: 'fixed', zIndex: 999999, width: '320px', maxWidth: '90vw' };
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
    
    return { position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999999 };
  };

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
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', margin: '0 0 8px 0', color: 'white' }}>
              {messageHeading}
            </h3>
          )}
          <p style={{ fontSize: '14px', margin: 0 }}>{messageDescription}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
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

export default PreviewBanner;