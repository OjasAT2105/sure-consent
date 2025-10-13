import { Container, Badge } from "@bsf/force-ui";

const Dashboard = () => {
  return (
    <Container className="flex gap-4 p-4">
      <div className="flex-1 bg-white border rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold mb-2">Banner Status</h3>
        <div className="flex items-center gap-2">
          <Badge label="Active" size="sm" variant="success" />
          <span>Banner is Active</span>
        </div>
      </div>
      <div className="flex-1 bg-white border rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold mb-2">Compliance</h3>
        <div className="flex items-center gap-2">
          <Badge label="GDPR" size="sm" variant="neutral" />
          <span>Selected Law</span>
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;