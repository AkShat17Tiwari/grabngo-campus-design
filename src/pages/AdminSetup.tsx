import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const AdminSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const setupAdmin = async () => {
    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const { data, error } = await supabase.functions.invoke('setup-admin', {
        body: {}
      });

      if (error) throw error;

      setStatus('success');
      setMessage(data.message || 'Admin user created successfully');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    } catch (error: any) {
      console.error('Setup error:', error);
      setStatus('error');
      setMessage(error.message || 'Failed to setup admin user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Setup</CardTitle>
          <CardDescription>
            Create the default admin user for your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'idle' && (
            <>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>This will create an admin user with:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Email: akshatr147@gmail.com</li>
                  <li>Password: 1234567</li>
                  <li>Role: Admin</li>
                </ul>
                <p className="text-xs mt-4 text-yellow-600 dark:text-yellow-500">
                  ⚠️ Change the password after first login!
                </p>
              </div>
              <Button 
                onClick={setupAdmin} 
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Setting up...' : 'Create Admin User'}
              </Button>
            </>
          )}

          {status === 'success' && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {message}
                <br />
                <span className="text-sm">Redirecting to login...</span>
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {message}
              </AlertDescription>
            </Alert>
          )}

          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => navigate('/auth')}
              className="w-full"
            >
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;
