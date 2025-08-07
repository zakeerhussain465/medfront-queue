import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Calendar,
  Clock,
  User,
  MoreVertical,
  CalendarDays
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled" | "in-progress";
  type: "consultation" | "follow-up" | "urgent";
}

const Appointments = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      patientName: "John Smith",
      patientPhone: "(555) 123-4567",
      doctorName: "Dr. Sarah Wilson",
      doctorSpecialization: "Cardiology",
      date: "2024-01-15",
      time: "09:00 AM",
      status: "scheduled",
      type: "consultation"
    },
    {
      id: "2",
      patientName: "Emily Davis",
      patientPhone: "(555) 234-5678",
      doctorName: "Dr. Michael Johnson",
      doctorSpecialization: "Pediatrics",
      date: "2024-01-15",
      time: "10:30 AM",
      status: "in-progress",
      type: "follow-up"
    },
    {
      id: "3",
      patientName: "Robert Brown",
      patientPhone: "(555) 345-6789",
      doctorName: "Dr. Lisa Chen",
      doctorSpecialization: "Dermatology",
      date: "2024-01-15",
      time: "02:00 PM",
      status: "completed",
      type: "consultation"
    },
    {
      id: "4",
      patientName: "Amanda Taylor",
      patientPhone: "(555) 456-7890",
      doctorName: "Dr. James Miller",
      doctorSpecialization: "Orthopedics",
      date: "2024-01-16",
      time: "11:00 AM",
      status: "scheduled",
      type: "urgent"
    }
  ]);

  const updateAppointmentStatus = (appointmentId: string, newStatus: Appointment["status"]) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );
    toast({
      title: "Appointment Updated",
      description: `Appointment status changed to ${newStatus.replace("-", " ")}`,
    });
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctorSpecialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const appointmentStats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === "scheduled").length,
    inProgress: appointments.filter(a => a.status === "in-progress").length,
    completed: appointments.filter(a => a.status === "completed").length,
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Appointment Management</h1>
            <p className="text-muted-foreground">Schedule and manage patient appointments</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Appointments</p>
                    <p className="text-2xl font-bold">{appointmentStats.total}</p>
                  </div>
                  <CalendarDays className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Scheduled</p>
                    <p className="text-2xl font-bold text-primary">{appointmentStats.scheduled}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold text-warning">{appointmentStats.inProgress}</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-success">{appointmentStats.completed}</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-success" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments, patients, or doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Book Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Book New Appointment</DialogTitle>
                  <DialogDescription>
                    Fill in the details to schedule a new appointment.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="patient-name" className="text-right">
                      Patient Name
                    </Label>
                    <Input id="patient-name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="patient-phone" className="text-right">
                      Phone
                    </Label>
                    <Input id="patient-phone" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="doctor" className="text-right">
                      Doctor
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dr-wilson">Dr. Sarah Wilson - Cardiology</SelectItem>
                        <SelectItem value="dr-johnson">Dr. Michael Johnson - Pediatrics</SelectItem>
                        <SelectItem value="dr-chen">Dr. Lisa Chen - Dermatology</SelectItem>
                        <SelectItem value="dr-miller">Dr. James Miller - Orthopedics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="appointment-date" className="text-right">
                      Date
                    </Label>
                    <Input id="appointment-date" type="date" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="appointment-time" className="text-right">
                      Time
                    </Label>
                    <Input id="appointment-time" type="time" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                    Book Appointment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Appointments List */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{appointment.patientName}</h3>
                          {appointment.type === "urgent" && (
                            <Badge variant="destructive" className="text-xs">Urgent</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{appointment.patientPhone}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.doctorName} - {appointment.doctorSpecialization}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{appointment.time}</span>
                        </div>
                        <StatusBadge variant={appointment.status}>
                          {appointment.status.replace("-", " ")}
                        </StatusBadge>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateAppointmentStatus(appointment.id, "scheduled")}>
                            Mark as Scheduled
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateAppointmentStatus(appointment.id, "in-progress")}>
                            Mark as In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateAppointmentStatus(appointment.id, "completed")}>
                            Mark as Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}>
                            Cancel Appointment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Appointments;