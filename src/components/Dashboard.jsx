import { Container, Badge } from "@bsf/force-ui";

const Dashboard = () => {
  return (
    <div className="bg-white border rounded-lg shadow-sm" style={{'--tw-border-opacity': 1, borderColor: 'rgb(229 231 235 / var(--tw-border-opacity))'}}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
      </div>
      <div className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 bg-white border rounded-lg p-4 shadow-sm" style={{'--tw-border-opacity': 1, borderColor: 'rgb(229 231 235 / var(--tw-border-opacity))'}}>
            <h3 className="font-semibold mb-2">Banner Status</h3>
            <div className="flex items-center gap-2">
              <Badge label="Active" size="sm" variant="success" />
              <span>Banner is Active</span>
            </div>
          </div>
          <div className="flex-1 bg-white border rounded-lg p-4 shadow-sm" style={{'--tw-border-opacity': 1, borderColor: 'rgb(229 231 235 / var(--tw-border-opacity))'}}>
            <h3 className="font-semibold mb-2">Compliance</h3>
            <div className="flex items-center gap-2">
              <Badge label="GDPR" size="sm" variant="neutral" />
              <span>Selected Law</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;