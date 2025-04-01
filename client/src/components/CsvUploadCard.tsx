import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FitnessData } from "@/lib/types";

interface CsvUploadCardProps {
  onDataSaved: (data: FitnessData) => void;
}

export default function CsvUploadCard({ onDataSaved }: CsvUploadCardProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file extension
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file format",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }
    
    setFileName(file.name);
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      onDataSaved(data);
      
      toast({
        title: "Upload successful",
        description: "Your fitness data has been successfully uploaded and processed.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleBrowseClick = () => {
    document.getElementById('csv-file-input')?.click();
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <span className="material-icons text-primary-500 mr-2">upload_file</span>
          <h4 className="font-medium">Upload CSV File</h4>
        </div>
        <p className="text-sm text-neutral-400 mb-6">
          Export your data from your fitness app (Google Fit, Apple Health, Fitbit, etc.) and upload it here.
        </p>
        
        <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 mb-4 text-center">
          <span className="material-icons text-neutral-300 text-4xl mb-2">cloud_upload</span>
          <p className="text-sm text-neutral-400 mb-4">
            {fileName ? `Selected: ${fileName}` : "Drag and drop your CSV file or click to browse"}
          </p>
          <Button 
            onClick={handleBrowseClick}
            disabled={isUploading}
            className="bg-primary-500 text-white hover:bg-primary-600"
          >
            {isUploading ? "Uploading..." : "Choose File"}
          </Button>
          <input 
            id="csv-file-input"
            type="file" 
            className="hidden" 
            accept=".csv" 
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>

        <div className="text-xs text-neutral-400">
          <p>Supported formats: CSV files exported from fitness apps</p>
          <p>Maximum file size: 10MB</p>
        </div>
      </CardContent>
    </Card>
  );
}
