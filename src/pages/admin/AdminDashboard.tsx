import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import StatCard from '@/components/admin/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Pill,
  MessageSquare,
  Plus,
  Eye,
  User,
  Clock,
  ArrowRight,
  Phone,
} from 'lucide-react';

interface DashboardStats {
  totalConsultations: number;
  todayConsultations: number;
  totalMedicines: number;
  newInquiries: number;
}

interface RecentConsultation {
  id: string;
  patient_name: string;
  health_issue: string;
  status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalConsultations: 0,
    todayConsultations: 0,
    totalMedicines: 0,
    newInquiries: 0,
  });
  const [recentConsultations, setRecentConsultations] = useState<RecentConsultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [consultationsRes, todayConsultationsRes, medicinesRes, inquiriesRes] = await Promise.all([
          supabase.from('consultation_requests').select('id', { count: 'exact', head: true }),
          supabase.from('consultation_requests').select('id', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
          supabase.from('medicines').select('id', { count: 'exact', head: true }),
          supabase.from('medicine_inquiries').select('id', { count: 'exact', head: true }).eq('status', 'New'),
        ]);

        setStats({
          totalConsultations: consultationsRes.count || 0,
          todayConsultations: todayConsultationsRes.count || 0,
          totalMedicines: medicinesRes.count || 0,
          newInquiries: inquiriesRes.count || 0,
        });

        // Fetch recent consultations
        const { data: consultations } = await supabase
          .from('consultation_requests')
          .select('id, patient_name, health_issue, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentConsultations(consultations || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      New: 'default',
      Contacted: 'secondary',
      Completed: 'outline',
      Cancelled: 'destructive',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your practice.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/consultations">
              <Eye className="h-4 w-4 mr-2" />
              View Consultations
            </Link>
          </Button>
          <Button asChild variant="hero" size="sm">
            <Link to="/admin/medicines">
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Consultations"
          value={stats.totalConsultations}
          icon={Calendar}
          description="All time consultation requests"
          variant="primary"
        />
        <StatCard
          title="Today's Consultations"
          value={stats.todayConsultations}
          icon={Clock}
          description="New requests today"
          variant="success"
        />
        <StatCard
          title="Medicines Listed"
          value={stats.totalMedicines}
          icon={Pill}
          description="Active medicines in catalog"
          variant="default"
        />
        <StatCard
          title="New Inquiries"
          value={stats.newInquiries}
          icon={MessageSquare}
          description="Pending WhatsApp inquiries"
          variant="warning"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/admin/medicines">
                <Pill className="h-4 w-4 mr-3" />
                Manage Medicines
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/admin/consultations">
                <Calendar className="h-4 w-4 mr-3" />
                View Consultations
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/admin/profile">
                <User className="h-4 w-4 mr-3" />
                Update Profile
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/admin/inquiries">
                <MessageSquare className="h-4 w-4 mr-3" />
                Check Inquiries
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Consultations */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-serif">Recent Consultations</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/consultations">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentConsultations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No consultation requests yet.
              </p>
            ) : (
              <div className="space-y-4">
                {recentConsultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {consultation.patient_name}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {consultation.health_issue}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(consultation.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(consultation.status)}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          // Open WhatsApp - this would use the patient's phone
                        }}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
