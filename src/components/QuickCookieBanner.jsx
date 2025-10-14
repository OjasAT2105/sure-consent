import { Container } from "@bsf/force-ui";

const QuickCookieBanner = () => {
  return (
    <div className="bg-white border rounded-lg shadow-sm" style={{'--tw-border-opacity': 1, borderColor: 'rgb(229 231 235 / var(--tw-border-opacity))'}}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Quick Cookie Banner</h2>
      </div>
      <div className="p-6">
        <p>Quick Cookie Banner configuration content goes here.</p>
      </div>
    </div>
  );
};

export default QuickCookieBanner;