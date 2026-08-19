export default function PatientTable() {
  const patients = [
    {
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      visits: 5,
    },
  ];

  return (
    <table className="w-full bg-white shadow rounded-xl">
      <thead>
        <tr className="text-left border-b">
          <th className="p-3">Name</th>
          <th>Email</th>
          <th>Visits</th>
        </tr>
      </thead>

      <tbody>
        {patients.map((p, i) => (
          <tr key={i} className="border-b">
            <td className="p-3">{p.name}</td>
            <td>{p.email}</td>
            <td>{p.visits}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
