import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { api, type StudentRecord } from '@/lib/api';
import { toast } from 'sonner';

interface AddStudentDialogProps {
  onSuccess: () => void;
}

export default function AddStudentDialog({ onSuccess }: AddStudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hours_studied: '',
    sleep_hours: '',
    attendance_percent: '',
    previous_scores: '',
    exam_score: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate inputs
      const data = {
        hours_studied: parseFloat(formData.hours_studied),
        sleep_hours: parseFloat(formData.sleep_hours),
        attendance_percent: parseFloat(formData.attendance_percent),
        previous_scores: parseInt(formData.previous_scores),
        exam_score: parseFloat(formData.exam_score),
      };

      // Check for invalid numbers
      if (Object.values(data).some(val => isNaN(val))) {
        toast.error('Please enter valid numbers for all fields');
        setLoading(false);
        return;
      }

      // Validate ranges
      if (data.hours_studied < 0 || data.hours_studied > 24) {
        toast.error('Hours studied must be between 0 and 24');
        setLoading(false);
        return;
      }

      if (data.sleep_hours < 0 || data.sleep_hours > 24) {
        toast.error('Sleep hours must be between 0 and 24');
        setLoading(false);
        return;
      }

      if (data.attendance_percent < 0 || data.attendance_percent > 100) {
        toast.error('Attendance must be between 0 and 100');
        setLoading(false);
        return;
      }

      // Create record via API
      const newRecord = await api.createRecord(data);
      
      toast.success(`Student ${newRecord.student_id} added successfully!`);
      
      // Reset form
      setFormData({
        hours_studied: '',
        sleep_hours: '',
        attendance_percent: '',
        previous_scores: '',
        exam_score: '',
      });
      
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating record:', error);
      toast.error('Failed to add student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Student Record</DialogTitle>
            <DialogDescription>
              Enter the student's exam data. Student ID will be auto-generated.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hours_studied" className="text-right">
                Hours Studied
              </Label>
              <Input
                id="hours_studied"
                type="number"
                step="0.1"
                min="0"
                max="24"
                value={formData.hours_studied}
                onChange={(e) => handleChange('hours_studied', e.target.value)}
                className="col-span-3"
                required
                placeholder="e.g., 8.5"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sleep_hours" className="text-right">
                Sleep Hours
              </Label>
              <Input
                id="sleep_hours"
                type="number"
                step="0.1"
                min="0"
                max="24"
                value={formData.sleep_hours}
                onChange={(e) => handleChange('sleep_hours', e.target.value)}
                className="col-span-3"
                required
                placeholder="e.g., 7.5"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attendance_percent" className="text-right">
                Attendance %
              </Label>
              <Input
                id="attendance_percent"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.attendance_percent}
                onChange={(e) => handleChange('attendance_percent', e.target.value)}
                className="col-span-3"
                required
                placeholder="e.g., 85.5"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="previous_scores" className="text-right">
                Previous Score
              </Label>
              <Input
                id="previous_scores"
                type="number"
                min="0"
                max="100"
                value={formData.previous_scores}
                onChange={(e) => handleChange('previous_scores', e.target.value)}
                className="col-span-3"
                required
                placeholder="e.g., 75"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="exam_score" className="text-right">
                Exam Score
              </Label>
              <Input
                id="exam_score"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.exam_score}
                onChange={(e) => handleChange('exam_score', e.target.value)}
                className="col-span-3"
                required
                placeholder="e.g., 32.5"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Student'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

