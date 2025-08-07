-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  location TEXT NOT NULL,
  availability TEXT NOT NULL DEFAULT 'available' CHECK (availability IN ('available', 'busy', 'off-duty')),
  experience TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
  appointment_type TEXT NOT NULL DEFAULT 'consultation' CHECK (appointment_type IN ('consultation', 'follow-up', 'urgent')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create queue table
CREATE TABLE public.queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  queue_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'in-progress', 'completed', 'urgent')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent')),
  check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  estimated_wait_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue ENABLE ROW LEVEL SECURITY;

-- Create policies for doctors (accessible to all authenticated users)
CREATE POLICY "Doctors are viewable by authenticated users" 
ON public.doctors 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Doctors can be inserted by authenticated users" 
ON public.doctors 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Doctors can be updated by authenticated users" 
ON public.doctors 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Doctors can be deleted by authenticated users" 
ON public.doctors 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create policies for patients (accessible to all authenticated users)
CREATE POLICY "Patients are viewable by authenticated users" 
ON public.patients 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Patients can be inserted by authenticated users" 
ON public.patients 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Patients can be updated by authenticated users" 
ON public.patients 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Patients can be deleted by authenticated users" 
ON public.patients 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create policies for appointments (accessible to all authenticated users)
CREATE POLICY "Appointments are viewable by authenticated users" 
ON public.appointments 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Appointments can be inserted by authenticated users" 
ON public.appointments 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Appointments can be updated by authenticated users" 
ON public.appointments 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Appointments can be deleted by authenticated users" 
ON public.appointments 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create policies for queue (accessible to all authenticated users)
CREATE POLICY "Queue is viewable by authenticated users" 
ON public.queue 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Queue can be inserted by authenticated users" 
ON public.queue 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Queue can be updated by authenticated users" 
ON public.queue 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Queue can be deleted by authenticated users" 
ON public.queue 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_queue_updated_at
  BEFORE UPDATE ON public.queue
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.doctors (name, specialization, gender, location, availability, experience, phone) VALUES
('Dr. Sarah Wilson', 'Cardiology', 'female', 'Room 101', 'available', '15 years', '(555) 111-2222'),
('Dr. Michael Johnson', 'Pediatrics', 'male', 'Room 203', 'busy', '12 years', '(555) 333-4444'),
('Dr. Lisa Chen', 'Dermatology', 'female', 'Room 105', 'available', '8 years', '(555) 555-6666'),
('Dr. James Miller', 'Orthopedics', 'male', 'Room 301', 'off-duty', '20 years', '(555) 777-8888'),
('Dr. Amanda Rodriguez', 'Neurology', 'female', 'Room 205', 'available', '10 years', '(555) 999-0000');

INSERT INTO public.patients (name, phone, email) VALUES
('John Smith', '(555) 123-4567', 'john.smith@email.com'),
('Sarah Johnson', '(555) 234-5678', 'sarah.johnson@email.com'),
('Mike Davis', '(555) 345-6789', 'mike.davis@email.com'),
('Emily Wilson', '(555) 456-7890', 'emily.wilson@email.com'),
('Robert Brown', '(555) 567-8901', 'robert.brown@email.com'),
('Amanda Taylor', '(555) 678-9012', 'amanda.taylor@email.com');