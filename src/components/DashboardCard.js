export default function DashboardCard({ label, value }) {
    return (
      <div style={{
        border: '1px solid #ddd',
        padding: '10px 15px',
        marginBottom: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <strong>{label}:</strong> {value}
      </div>
    );
  }
  