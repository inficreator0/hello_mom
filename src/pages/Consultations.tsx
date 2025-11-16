import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Phone, Calendar, Stethoscope } from "lucide-react";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  consultations: number;
  phone: string;
  avatar: string;
}

const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Aditi Sharma",
    specialization: "Gynecologist",
    experience: 12,
    consultations: 1480,
    phone: "+91-9820012345",
    avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=aditi",
  },
  {
    id: 2,
    name: "Dr. Rhea Kapoor",
    specialization: "Pediatrician",
    experience: 9,
    consultations: 1120,
    phone: "+91-9830019999",
    avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=rhea",
  },
  {
    id: 3,
    name: "Dr. Meera Nair",
    specialization: "Lactation Consultant",
    experience: 7,
    consultations: 860,
    phone: "+91-9811122233",
    avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=meera",
  },
  {
    id: 4,
    name: "Dr. Kavya Singh",
    specialization: "Mental Health Therapist",
    experience: 11,
    consultations: 1320,
    phone: "+91-9770098877",
    avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=kavya",
  },
];

export const Consultations = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    // Replace with API later
    setDoctors(mockDoctors);
  }, []);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleAppointment = (doctor: Doctor) => {
    alert(`Booking appointment with ${doctor.name}...`);
  };

  return (
    <div className="container max-w-5xl px-4 py-8 pb-20">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Consult a Doctor
      </h1>

      <p className="text-muted-foreground text-sm mb-6">
        Book appointments or talk to trusted experts instantly.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card
            key={doctor.id}
            className="bg-card text-card-foreground shadow-sm rounded-lg"
          >
            <CardContent className="pt-6">
              {/* Avatar */}
              
              <div className="flex justify-center mb-4">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-20 h-20 rounded-full object-cover shadow"
                />
              </div>

              {/* Name */}
              <h2 className="text-lg font-semibold text-center">
                {doctor.name}
              </h2>

              <p className="text-center text-muted-foreground text-sm">
                {doctor.specialization}
              </p>

              {/* Experience + Consultations */}
              <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Stethoscope className="w-4 h-4" />
                  {doctor.experience} yrs exp.
                </span>
                <span>{doctor.consultations} consults</span>
              </div>

              {/* Buttons */}
              <div className="flex justify-center mt-6 flex-row gap-3">
                <Button
                  className="flex w-full"
                  onClick={() => handleCall(doctor.phone)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>

                <Button
                  className="flex w-full"
                  variant="secondary"
                  onClick={() => handleAppointment(doctor)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Consult
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

