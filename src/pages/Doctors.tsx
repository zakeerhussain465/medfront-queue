import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  MapPin,
  Clock,
  User,
  MoreVertical,
  Stethoscope,
  Calendar
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
import { useDoctors, useCreateDoctor, useUpdateDoctor, Doctor } from "@/hooks/useSupabase";

const Doctors = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    gender: "" as "male" | "female",
    location: "",
    phone: "",
    experience: ""
  });

  const { data: doctors = [], isLoading } = useDoctors();
  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor();

  const handleCreateDoctor = () => {
    if (!formData.name || !formData.specialization || !formData.gender || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createDoctor.mutate({
      name: formData.name,
      specialization: formData.specialization,
      gender: formData.gender,
      location: formData.location,
      phone: formData.phone || "",
      experience: formData.experience || "",
      availability: "available"
    }, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setFormData({
          name: "",
          specialization: "",
          gender: "" as "male" | "female",
          location: "",
          phone: "",
          experience: ""
        });
      }
    });
  };

  const updateDoctorAvailability = (doctorId: string, newAvailability: Doctor["availability"]) => {
    updateDoctor.mutate({
      id: doctorId,
      updates: { availability: newAvailability }
    });
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const doctorStats = {
    total: doctors.length,
    available: doctors.filter(d => d.availability === "available").length,
    busy: doctors.filter(d => d.availability === "busy").length,
    offDuty: doctors.filter(d => d.availability === "off-duty").length,
  };

  const getAvailabilityColor = (availability: Doctor["availability"]) => {
    switch (availability) {
      case "available":
        return "text-success";
      case "busy":
        return "text-warning";
      case "off-duty":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  const getAvailabilityBadgeVariant = (availability: Doctor["availability"]) => {
    switch (availability) {
      case "available":
        return "default";
      case "busy":
        return "secondary";
      case "off-duty":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Doctor Management</h1>
            <p className="text-muted-foreground">Manage doctor profiles and availability</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Doctors</p>
                    <p className="text-2xl font-bold">{doctorStats.total}</p>
                  </div>
                  <Stethoscope className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Available</p>
                    <p className="text-2xl font-bold text-success">{doctorStats.available}</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-success" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Busy</p>
                    <p className="text-2xl font-bold text-warning">{doctorStats.busy}</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Off Duty</p>
                    <p className="text-2xl font-bold text-muted-foreground">{doctorStats.offDuty}</p>
                  </div>
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors by name, specialization, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Doctor
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Doctor</DialogTitle>
                  <DialogDescription>
                    Fill in the doctor's information to add them to the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="doctor-name" className="text-right">
                      Name
                    </Label>
                    <Input 
                      id="doctor-name" 
                      placeholder="Dr. John Doe" 
                      className="col-span-3"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="specialization" className="text-right">
                      Specialization
                    </Label>
                    <Select value={formData.specialization} onValueChange={(value) => setFormData(prev => ({ ...prev, specialization: value }))}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="Dermatology">Dermatology</SelectItem>
                        <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="Neurology">Neurology</SelectItem>
                        <SelectItem value="General Medicine">General Medicine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gender" className="text-right">
                      Gender
                    </Label>
                    <Select value={formData.gender} onValueChange={(value: "male" | "female") => setFormData(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input 
                      id="location" 
                      placeholder="Room 101" 
                      className="col-span-3"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input 
                      id="phone" 
                      placeholder="(555) 123-4567" 
                      className="col-span-3"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="experience" className="text-right">
                      Experience
                    </Label>
                    <Input 
                      id="experience" 
                      placeholder="10 years" 
                      className="col-span-3"
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateDoctor} disabled={createDoctor.isPending}>
                    {createDoctor.isPending ? "Adding..." : "Add Doctor"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Doctors List */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Staff Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isLoading ? (
                  <div className="text-center py-8">Loading doctors...</div>
                ) : filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{doctor.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {doctor.specialization}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{doctor.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Stethoscope className="h-3 w-3" />
                            <span>{doctor.experience} exp</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{doctor.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge variant={getAvailabilityBadgeVariant(doctor.availability)} className="mb-2">
                          {doctor.availability.replace("-", " ")}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>ID: {doctor.id.slice(0, 8)}</span>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateDoctorAvailability(doctor.id, "available")}>
                            Mark as Available
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateDoctorAvailability(doctor.id, "busy")}>
                            Mark as Busy
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateDoctorAvailability(doctor.id, "off-duty")}>
                            Mark as Off Duty
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Remove Doctor
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

export default Doctors;