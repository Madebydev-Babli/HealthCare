export interface Doctor {
  _id: string;
  userId: string;

  // Personal
  name: string;
  image: string;
  gender: "Male" | "Female" | "Other";
  dob: string;
  phone: string;

  // Professional
  specialization: string;
  degree: string;
  experience: number;
  licenseNumber: string;
  bio: string;
  consultationFee: number;
  consultationMode: "Clinic" | "Online" | "Both";
  languages: string[];

  // Clinic
  clinic: {
    name: string;
    image: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark: string;
    phone: string;
    mapLink: string;
  };

  // Availability
  availability: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };

  // Dashboard
  totalAppointments: number;
  totalPatients: number;
  totalEarnings: number;
  rating: number;
  reviews: number;

  verified: boolean;
  status: "pending" | "approved" | "rejected";

  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalAppointments: number;
  totalPatients: number;
  totalEarnings: number;
  rating: number;
  reviews: number;
}

export interface AppointmentOverview {
  total: number;
  pending: number;
  approved: number;
  completed: number;
  cancelled: number;
}

export interface Appointment {
  _id: string;

  patientId: string;
  patientName: string;
  patientImage?: string;

  doctorId: string;
  doctorName: string;

  date: string;
  time: string;
  fee: number;

  status: "pending" | "approved" | "completed" | "cancelled";

  createdAt: string;
}

export interface Patient {
  _id: string;
  name: string;
  image?: string;
  email: string;
  phone: string;
  totalAppointments: number;
  totalVisits: number;
}

export interface DoctorDashboardOnboardingData {
  onboarding: true;
  status: "pending" | "rejected" | "approved";
  profileCompleted?: boolean;
  doctor: Doctor;
}

export interface DoctorDashboardData {
  onboarding: false;
  status: "pending" | "approved" | "rejected";
  profileCompleted: boolean;
  doctor: Doctor;

  stats: DashboardStats;

  appointmentOverview: AppointmentOverview;

  todayAppointments: Appointment[];

  upcomingAppointments: Appointment[];

  recentPatients: Patient[];
}

export type DoctorDashboardResponse =
  | DoctorDashboardOnboardingData
  | DoctorDashboardData;
