import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaApple } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FitnessData } from "@/lib/types";

interface AppleHealthConnectProps {
  onDataReceived: (data: FitnessData) => void;
}

export default function AppleHealthConnect({ onDataReceived }: AppleHealthConnectProps) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const initiateAppleHealthConnection = async () => {
    setIsConnecting(true);
    
    try {
      // In a real production environment, this would redirect to Apple's OAuth flow
      // and handle the authentication callback
      
      // For now, we'll simulate the process with our backend endpoint
      const response = await apiRequest('GET', '/api/connect/apple-health');
      const data = await response.json();
      
      if (response.ok) {
        setIsConnected(true);
        onDataReceived(data);
        toast({
          title: "Apple Health Connected!",
          description: "Your health data has been successfully imported.",
        });
      } else {
        throw new Error(data.message || "Could not connect to Apple Health");
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to Apple Health. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaApple className="text-neutral-700" />
          Connect Apple Health
        </CardTitle>
        <CardDescription>
          Import your activity data from Apple Health to personalize your fitness plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <Alert className="bg-green-50 border-green-200">
            <AlertTitle>Successfully Connected</AlertTitle>
            <AlertDescription>
              Your Apple Health data has been imported and will be used to create your personalized fitness plan.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-neutral-500">
              This will import the following data from your Apple Watch and iPhone:
            </p>
            <ul className="text-sm text-neutral-500 list-disc pl-5 space-y-1">
              <li>Step count</li>
              <li>Active energy burned</li>
              <li>Workout duration</li>
              <li>Heart rate data</li>
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={initiateAppleHealthConnection} 
          disabled={isConnecting || isConnected}
          className="w-full flex items-center gap-2"
        >
          {isConnecting ? (
            "Connecting..."
          ) : isConnected ? (
            "Connected"
          ) : (
            <>
              <FaApple /> Connect Apple Health
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}