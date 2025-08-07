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
  Filter,
  Clock,
  Users,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface QueuePatient {
  id: string;
  queueNumber: number;
  name: string;
  phone: string;
  status: "waiting" | "in-progress" | "completed" | "urgent";
  checkInTime: string;
  estimatedWaitTime: string;
  priority: "normal" | "urgent";
}

const Queue = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<QueuePatient[]>([
    {
      id: "1",
      queueNumber: 1,
      name: "John Smith",
      phone: "(555) 123-4567",
      status: "waiting",
      checkInTime: "09:30 AM",
      estimatedWaitTime: "15 mins",
      priority: "normal"
    },
    {
      id: "2",
      queueNumber: 2,
      name: "Sarah Johnson",
      phone: "(555) 234-5678",
      status: "in-progress",
      checkInTime: "09:45 AM",
      estimatedWaitTime: "0 mins",
      priority: "normal"
    },
    {
      id: "3",
      queueNumber: 3,
      name: "Mike Davis",
      phone: "(555) 345-6789",
      status: "completed",
      checkInTime: "10:00 AM",
      estimatedWaitTime: "Completed",
      priority: "normal"
    },
    {
      id: "4",
      queueNumber: 4,
      name: "Emily Wilson",
      phone: "(555) 456-7890",
      status: "urgent",
      checkInTime: "10:15 AM",
      estimatedWaitTime: "Next",
      priority: "urgent"
    }
  ]);

  const updatePatientStatus = (patientId: string, newStatus: QueuePatient["status"]) => {
    setPatients(prev => 
      prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, status: newStatus }
          : patient
      )
    );
    toast({
      title: "Status Updated",
      description: `Patient status changed to ${newStatus.replace("-", " ")}`,
    });
  };

  const addNewPatient = () => {
    const newPatient: QueuePatient = {
      id: String(patients.length + 1),
      queueNumber: Math.max(...patients.map(p => p.queueNumber)) + 1,
      name: "New Patient",
      phone: "(555) 000-0000",
      status: "waiting",
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedWaitTime: "20 mins",
      priority: "normal"
    };
    setPatients(prev => [...prev, newPatient]);
    toast({
      title: "Patient Added",
      description: `Queue number ${newPatient.queueNumber} assigned`,
    });
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.queueNumber.toString().includes(searchTerm)
  );

  const queueStats = {
    total: patients.length,
    waiting: patients.filter(p => p.status === "waiting").length,
    inProgress: patients.filter(p => p.status === "in-progress").length,
    urgent: patients.filter(p => p.status === "urgent").length,
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Queue Management</h1>
            <p className="text-muted-foreground">Manage patient queue and status updates</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Patients</p>
                    <p className="text-2xl font-bold">{queueStats.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Waiting</p>
                    <p className="text-2xl font-bold text-waiting">{queueStats.waiting}</p>
                  </div>
                  <Clock className="h-8 w-8 text-waiting" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold text-warning">{queueStats.inProgress}</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Urgent</p>
                    <p className="text-2xl font-bold text-urgent">{queueStats.urgent}</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-urgent animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients or queue number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={addNewPatient} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Patient to Queue
            </Button>
          </div>

          {/* Queue List */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                        {patient.queueNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{patient.name}</h3>
                          {patient.priority === "urgent" && (
                            <Badge variant="destructive" className="text-xs">Urgent</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{patient.phone}</p>
                        <p className="text-sm text-muted-foreground">
                          Check-in: {patient.checkInTime}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <StatusBadge variant={patient.status}>
                          {patient.status.replace("-", " ")}
                        </StatusBadge>
                        <p className="text-sm text-muted-foreground mt-1">
                          Wait: {patient.estimatedWaitTime}
                        </p>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updatePatientStatus(patient.id, "waiting")}>
                            Mark as Waiting
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updatePatientStatus(patient.id, "in-progress")}>
                            Mark as In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updatePatientStatus(patient.id, "completed")}>
                            Mark as Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updatePatientStatus(patient.id, "urgent")}>
                            Mark as Urgent
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

export default Queue;