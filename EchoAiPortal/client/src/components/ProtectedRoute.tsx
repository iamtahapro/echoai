import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-echo-dark pt-20">
        <Card className="w-full max-w-md mx-4 bg-echo-surface border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="h-6 w-6 text-echo-orange animate-spin" />
              <span className="text-white">Loading...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}
