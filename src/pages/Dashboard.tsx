import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  Users, 
  Clock, 
  Calendar, 
  TrendingUp,
  UserCheck,
  AlertCircle
} from "lucide-react";

const Dashboard = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const queueStats = {
    waiting: 8,
    inProgress: 3,
    completed: 12,
    urgent: 2,
  };

  const recentPatients = [
    { id: "Q001", name: "John Smith", status: "waiting", time: "09:30 AM" },
    { id: "Q002", name: "Sarah Johnson", status: "in-progress", time: "09:45 AM" },
    { id: "Q003", name: "Mike Davis", status: "completed", time: "10:00 AM" },
    { id: "Q004", name: "Emily Wilson", status: "urgent", time: "10:15 AM" },
  ];

  const upcomingAppointments = [
    { patient: "Alice Brown", doctor: "Dr. Smith", time: "11:00 AM", type: "Consultation" },
    { patient: "Robert Johnson", doctor: "Dr. Lee", time: "11:30 AM", type: "Follow-up" },
    { patient: "Maria Garcia", doctor: "Dr. Wilson", time: "12:00 PM", type: "Check-up" },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">{currentDate}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Patients Waiting</CardTitle>
                <Clock className="h-4 w-4 text-waiting" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-waiting">{queueStats.waiting}</div>
                <p className="text-xs text-muted-foreground">In queue currently</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <UserCheck className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{queueStats.inProgress}</div>
                <p className="text-xs text-muted-foreground">With doctors now</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{queueStats.completed}</div>
                <p className="text-xs text-muted-foreground">Patients served</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Urgent Cases</CardTitle>
                <AlertCircle className="h-4 w-4 text-urgent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-urgent">{queueStats.urgent}</div>
                <p className="text-xs text-muted-foreground">Need immediate attention</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Queue Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recent Queue Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                      <div className="flex items-center space-x-3">
                        <div className="font-medium text-sm">{patient.id}</div>
                        <div>
                          <p className="font-medium text-sm">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">{patient.time}</p>
                        </div>
                      </div>
                      <StatusBadge variant={patient.status as any}>
                        {patient.status.replace("-", " ")}
                      </StatusBadge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                      <div>
                        <p className="font-medium text-sm">{appointment.patient}</p>
                        <p className="text-xs text-muted-foreground">{appointment.doctor}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{appointment.time}</p>
                        <p className="text-xs text-muted-foreground">{appointment.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;