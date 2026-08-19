"use client";

type Appointment = {
  _id: string;
  patientName: string;
  patientImage?: string;
  date: string;
  time: string;
  status: "pending" | "approved" | "completed" | "cancelled";
};

type Props = {
  appointments: Appointment[];
};

export default function TodayAppointments({ appointments }: Props) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Today's Appointments
          </h2>

          <p className="text-sm text-gray-500">Patients scheduled for today</p>
        </div>

        <button className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100">
          View All
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 py-14 text-center">
          <p className="font-medium text-gray-500">No appointments today</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 transition hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    appointment.patientImage ||
                    "https://ui-avatars.com/api/?name=Patient"
                  }
                  alt={appointment.patientName}
                  className="h-14 w-14 rounded-2xl object-cover"
                />

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {appointment.patientName}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {appointment.date} • {appointment.time}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                  appointment.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : appointment.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : appointment.status === "completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                }`}
              >
                {appointment.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
