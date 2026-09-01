import type {
  Doctor,
  Feature,
  NavLink,
  Service,
  Testimonial,
} from "@/types/home";

export const clinicName = "Healthcare";
export const clinicTagline =
  "Modern healthcare management for patients and healthcare professionals.";

export const navLinks: NavLink[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/doctors",
    label: "Doctors",
  },
  {
    href: "/appointments",
    label: "Appointments",
  },
  {
    href: "/#about",
    label: "About",
  },
];
export const services: Service[] = [
  {
    title: "General Checkup",
    description:
      "Preventive consultations and complete physical assessments for all ages.",
    icon: "GC",
  },
  {
    title: "Dental Care",
    description:
      "Routine cleanings, oral health guidance, and advanced dental treatment.",
    icon: "DC",
  },
  {
    title: "Cardiology",
    description:
      "Specialist heart evaluations with modern diagnostics and treatment plans.",
    icon: "CR",
  },
  {
    title: "Pediatrics",
    description:
      "Child-focused healthcare with gentle support for growth and development.",
    icon: "PD",
  },
];

export const doctors: Doctor[] = [
  {
    name: "Dr. Ananya Sharma",
    specialization: "General Physician",
    bio: "12+ years of experience in preventive medicine and family healthcare.",
    imageUrl:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Dr. Rahul Mehta",
    specialization: "Cardiologist",
    bio: "Focused on evidence-based cardiac care and long-term heart wellness.",
    imageUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Dr. Priya Nair",
    specialization: "Dental Surgeon",
    bio: "Specialized in pain-free treatment with modern dental technology.",
    imageUrl:
      "https://images.unsplash.com/photo-1594824388853-d0c9ea0f99fc?auto=format&fit=crop&w=800&q=80",
  },
];

export const features: Feature[] = [
  {
    title: "Experienced Specialists",
    description: "Our team includes skilled doctors across major departments.",
  },
  {
    title: "24/7 Support Desk",
    description: "Round-the-clock patient assistance for urgent concerns.",
  },
  {
    title: "Modern Equipment",
    description: "Advanced diagnostics and treatment tools for accurate care.",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Aarav Khanna",
    review:
      "The doctors were attentive and explained every step clearly. Booking was quick and smooth.",
    rating: 5,
  },
  {
    name: "Meera Iyer",
    review:
      "Excellent staff and very clean facility. I felt genuinely cared for throughout my visit.",
    rating: 5,
  },
  {
    name: "Soham Verma",
    review:
      "Professional consultation and modern setup. Highly recommend for family healthcare.",
    rating: 4,
  },
];
