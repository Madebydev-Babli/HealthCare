"use client";

type Patient = {
  _id: string;
  name: string;
  image?: string;
  email: string;
  phone: string;
  totalVisits: number;
};

type Props = {
  patients: Patient[];
};

export default function RecentPatients({ patients }: Props) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Recent Patients</h2>

          <p className="text-sm text-gray-500">Recently consulted patients</p>
        </div>

        <button className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100">
          View All
        </button>
      </div>

      {patients.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 py-14 text-center">
          <p className="font-medium text-gray-500">No patients found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {patients.map((patient) => (
            <div
              key={patient._id}
              className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 transition hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    patient.image ||
                    `https://ui-avatars.com/api/?name=${patient.name}`
                  }
                  alt={patient.name}
                  className="h-14 w-14 rounded-2xl object-cover"
                />

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {patient.name}
                  </h3>

                  <p className="text-sm text-gray-500">{patient.email}</p>

                  <p className="text-xs text-gray-400">{patient.phone}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Visits</p>

                <p className="text-2xl font-bold text-blue-600">
                  {patient.totalVisits}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
