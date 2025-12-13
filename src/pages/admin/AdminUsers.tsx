import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Shield, User, Mail, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  created_at: string | null;
  avatar_url: string | null;
  roles: string[];
}

const roleColors: Record<string, string> = {
  patient: 'bg-primary/10 text-primary border-primary/20',
  doctor: 'bg-health-info/10 text-health-info border-health-info/20',
  admin: 'bg-health-danger/10 text-health-danger border-health-danger/20'
};

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // Fetch profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!profiles) {
      setLoading(false);
      return;
    }

    // Fetch all user roles
    const { data: roles } = await supabase
      .from('user_roles')
      .select('user_id, role');

    // Map roles to users
    const usersWithRoles: UserProfile[] = profiles.map(profile => ({
      ...profile,
      roles: roles?.filter(r => r.user_id === profile.id).map(r => r.role) || []
    }));

    setUsers(usersWithRoles);
    setLoading(false);
  };

  const handleAddRole = async (userId: string, role: 'patient' | 'doctor' | 'admin') => {
    const { error } = await supabase.from('user_roles').insert({
      user_id: userId,
      role: role
    });

    if (error) {
      if (error.code === '23505') {
        toast({
          title: 'Role Already Exists',
          description: 'This user already has this role',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add role',
          variant: 'destructive'
        });
      }
    } else {
      toast({
        title: 'Role Added',
        description: `Successfully added ${role} role`
      });
      fetchUsers();
    }
  };

  const handleRemoveRole = async (userId: string, role: string) => {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role as 'patient' | 'doctor' | 'admin');

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove role',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Role Removed',
        description: `Successfully removed ${role} role`
      });
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter);
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage users and their roles</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="patient">Patients</SelectItem>
            <SelectItem value="doctor">Doctors</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{users.filter(u => u.roles.includes('patient')).length}</p>
            <p className="text-sm text-muted-foreground">Patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{users.filter(u => u.roles.includes('doctor')).length}</p>
            <p className="text-sm text-muted-foreground">Doctors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{users.filter(u => u.roles.includes('admin')).length}</p>
            <p className="text-sm text-muted-foreground">Admins</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {user.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.full_name || 'No name'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge key={role} className={roleColors[role] || ''}>
                          {role}
                        </Badge>
                      ))}
                      {user.roles.length === 0 && (
                        <span className="text-muted-foreground text-sm">No roles</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.created_at ? format(parseISO(user.created_at), 'MMM d, yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Management Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage User</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {selectedUser.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{selectedUser.full_name || 'No name'}</p>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Current Roles
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.roles.map((role) => (
                    <Badge
                      key={role}
                      className={`${roleColors[role]} cursor-pointer`}
                      onClick={() => handleRemoveRole(selectedUser.id, role)}
                    >
                      {role} ✕
                    </Badge>
                  ))}
                  {selectedUser.roles.length === 0 && (
                    <span className="text-muted-foreground text-sm">No roles assigned</span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Add Role</h4>
                <div className="flex gap-2">
                  {(['patient', 'doctor', 'admin'] as const).map((role) => (
                    <Button
                      key={role}
                      variant="outline"
                      size="sm"
                      disabled={selectedUser.roles.includes(role)}
                      onClick={() => handleAddRole(selectedUser.id, role)}
                      className="capitalize"
                    >
                      + {role}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>User ID: {selectedUser.id}</p>
                {selectedUser.created_at && (
                  <p>Joined: {format(parseISO(selectedUser.created_at), 'MMMM d, yyyy')}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
