import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Types for our database entities
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  gender: "male" | "female";
  location: string;
  availability: "available" | "busy" | "off-duty";
  experience: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  appointment_type: "consultation" | "follow-up" | "urgent";
  notes?: string;
  created_at: string;
  updated_at: string;
  patients?: Patient;
  doctors?: Doctor;
}

export interface QueueItem {
  id: string;
  patient_id: string;
  queue_number: number;
  status: "waiting" | "in-progress" | "completed" | "urgent";
  priority: "normal" | "urgent";
  check_in_time: string;
  estimated_wait_time?: string;
  created_at: string;
  updated_at: string;
  patients?: Patient;
}

// Doctors hooks
export const useDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Doctor[];
    },
  });
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (doctor: Omit<Doctor, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("doctors")
        .insert([doctor])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast({
        title: "Success",
        description: "Doctor added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add doctor: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Doctor> }) => {
      const { data, error } = await supabase
        .from("doctors")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast({
        title: "Success",
        description: "Doctor updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update doctor: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

// Patients hooks
export const usePatients = () => {
  return useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Patient[];
    },
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (patient: Omit<Patient, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("patients")
        .insert([patient])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({
        title: "Success",
        description: "Patient registered successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to register patient: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

// Appointments hooks
export const useAppointments = () => {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          patients (*),
          doctors (*)
        `)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });
      
      if (error) throw error;
      return data as Appointment[];
    },
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (appointment: Omit<Appointment, "id" | "created_at" | "updated_at" | "patients" | "doctors">) => {
      const { data, error } = await supabase
        .from("appointments")
        .insert([appointment])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({
        title: "Success",
        description: "Appointment scheduled successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to schedule appointment: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Appointment> }) => {
      const { data, error } = await supabase
        .from("appointments")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({
        title: "Success",
        description: "Appointment updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update appointment: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

// Queue hooks
export const useQueue = () => {
  return useQuery({
    queryKey: ["queue"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("queue")
        .select(`
          *,
          patients (*)
        `)
        .order("queue_number");
      
      if (error) throw error;
      return data as QueueItem[];
    },
  });
};

export const useCreateQueueItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (queueItem: Omit<QueueItem, "id" | "created_at" | "updated_at" | "patients">) => {
      const { data, error } = await supabase
        .from("queue")
        .insert([queueItem])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queue"] });
      toast({
        title: "Success",
        description: "Patient added to queue successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add patient to queue: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateQueueItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<QueueItem> }) => {
      const { data, error } = await supabase
        .from("queue")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queue"] });
      toast({
        title: "Success",
        description: "Queue status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update queue status: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};