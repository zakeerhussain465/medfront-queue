import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Phone,
  Mail,
  User,
  MoreVertical,
  Users,
  Calendar,
  Clock
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
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastVisit: string;
  totalVisits: number;
  status: "active" | "inactive";
  registrationDate: string;
}

const Patients = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      name: "John Smith",
      phone: "(555) 123-4567",
      email: "john.smith@email.com",
      lastVisit: "2024-01-10",
      totalVisits: 12,
      status: "active",
      registrationDate: "2023-06-15"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      phone: "(555) 234-5678",
      email: "sarah.johnson@email.com",
      lastVisit: "2024-01-08",
      totalVisits: 8,
      status: "active",
      registrationDate: "2023-08-22"
    },
    {
      id: "3",
      name: "Mike Davis",
      phone: "(555) 345-6789",
      email: "mike.davis@email.com",
      lastVisit: "2023-12-20",
      totalVisits: 5,
      status: "inactive",
      registrationDate: "2023-05-10"
    },
    {
      id: "4",
      name: "Emily Wilson",
      phone: "(555) 456-7890",
      email: "emily.wilson@email.com",
      lastVisit: "2024-01-12",
      totalVisits: 15,
      status: "active",
      registrationDate: "2022-11-08"
    },
    {
      id: "5",
      name: "Robert Brown",
      phone: "(555) 567-8901",
      email: "robert.brown@email.com",
      lastVisit: "2024-01-05",
      totalVisits: 22,
      status: "active",
      registrationDate: "2022-03-15"
    },
    {
      id: "6",
      name: "Amanda Taylor",
      phone: "(555) 678-9012",
      email: "amanda.taylor@email.com",
      lastVisit: "2023-11-18",
      totalVisits: 3,
      status: "inactive",
      registrationDate: "2023-09-28"
    }
  ]);

  const addNewPatient = () => {
    const newPatient: Patient = {
      id: String(patients.length + 1),
      name: "New Patient",
      phone: "(555) 000-0000",
      email: "new.patient@email.com",
      lastVisit: "Never",
      totalVisits: 0,
      status: "active",
      registrationDate: new Date().toISOString().split('T')[0]
    };
    setPatients(prev => [...prev, newPatient]);
    setIsDialogOpen(false);
    toast({
      title: "Patient Added",
      description: `${newPatient.name} has been registered`,
    });
  };

  const updatePatientStatus = (patientId: string, newStatus: Patient["status"]) => {
    setPatients(prev => 
      prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, status: newStatus }
          : patient
      )
    );
    toast({
      title: "Status Updated",
      description: `Patient status changed to ${newStatus}`,
    });
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const patientStats = {
    total: patients.length,
    active: patients.filter(p => p.status === "active").length,
    inactive: patients.filter(p => p.status === "inactive").length,
    newThisMonth: patients.filter(p => {
      const regDate = new Date(p.registrationDate);
      const now = new Date();
      return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
    }).length,
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Patient Management</h1>
            <p className="text-muted-foreground">Manage patient records and information</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Patients</p>
                    <p className="text-2xl font-bold">{patientStats.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Patients</p>
                    <p className="text-2xl font-bold text-success">{patientStats.active}</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-success" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Inactive</p>
                    <p className="text-2xl font-bold text-muted-foreground">{patientStats.inactive}</p>
                  </div>
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">New This Month</p>
                    <p className="text-2xl font-bold text-primary">{patientStats.newThisMonth}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Register Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Register New Patient</DialogTitle>
                  <DialogDescription>
                    Fill in the patient's information to register them in the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="patient-name" className="text-right">
                      Full Name
                    </Label>
                    <Input id="patient-name" placeholder="John Doe" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="patient-phone" className="text-right">
                      Phone
                    </Label>
                    <Input id="patient-phone" placeholder="(555) 123-4567" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="patient-email" className="text-right">
                      Email
                    </Label>
                    <Input id="patient-email" type="email" placeholder="john.doe@email.com" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={addNewPatient}>
                    Register Patient
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Patients List */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{patient.name}</h3>
                          <Badge variant={patient.status === "active" ? "default" : "secondary"} className="text-xs">
                            {patient.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{patient.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{patient.email}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Registered: {patient.registrationDate}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium mb-1">
                          {patient.totalVisits} visits
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Last: {patient.lastVisit}
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Edit Information
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Add to Queue
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Schedule Appointment
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updatePatientStatus(patient.id, patient.status === "active" ? "inactive" : "active")}>
                            Mark as {patient.status === "active" ? "Inactive" : "Active"}
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

export default Patients;