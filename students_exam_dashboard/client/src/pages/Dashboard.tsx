import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api, type StudentRecord, type PaginatedResponse } from '@/lib/api';
import { Search, ChevronLeft, ChevronRight, BarChart3, TrendingUp, Trash2 } from 'lucide-react';
import ScoreVsAttendanceChart from '@/components/ScoreVsAttendanceChart';
import StudySleepScatterChart from '@/components/StudySleepScatterChart';
import AddStudentDialog from '@/components/AddStudentDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function Dashboard() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<keyof StudentRecord>('student_id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (searchQuery.trim()) {
        // Use search API when there's a search query
        const searchResults = await api.search(searchQuery);
        setData(searchResults);
      } else {
        // Use regular getRecords for pagination and sorting
        const result = await api.getRecords({
          page: currentPage,
          pageSize,
          sortBy,
          sortOrder,
        });
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchQuery, sortBy, sortOrder]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSort = (field: keyof StudentRecord) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;

    try {
      const success = await api.deleteRecord(studentToDelete);
      if (success) {
        toast.success(`Student ${studentToDelete} deleted successfully`);
        fetchData(); // Refresh the table
      } else {
        toast.error('Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('An error occurred while deleting');
    } finally {
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  const openDeleteDialog = (id: number) => {
    setStudentToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Student Exam Scores Dashboard</h1>
              <p className="text-slate-600 mt-1">Powered by CSV Gateway API</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 space-y-8">
        {/* Data Table Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Student Records</CardTitle>
            <CardDescription>
              Browse, search, and filter student exam scores with pagination
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add Student Button */}
            <div className="flex justify-end mb-4">
              <AddStudentDialog onSuccess={fetchData} />
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={String(pageSize)} onValueChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Rows per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="cursor-pointer hover:bg-slate-100" onClick={() => handleSort('student_id')}>
                      Student ID {sortBy === 'student_id' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-slate-100" onClick={() => handleSort('hours_studied')}>
                      Hours Studied {sortBy === 'hours_studied' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-slate-100" onClick={() => handleSort('sleep_hours')}>
                      Sleep Hours {sortBy === 'sleep_hours' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-slate-100" onClick={() => handleSort('attendance_percent')}>
                      Attendance % {sortBy === 'attendance_percent' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-slate-100" onClick={() => handleSort('previous_scores')}>
                      Previous Score {sortBy === 'previous_scores' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-slate-100" onClick={() => handleSort('exam_score')}>
                      Exam Score {sortBy === 'exam_score' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : data?.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                        No records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data.map((record) => (
                      <TableRow key={record.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium">{record.student_id}</TableCell>
                        <TableCell>{record.hours_studied.toFixed(1)}</TableCell>
                        <TableCell>{record.sleep_hours.toFixed(1)}</TableCell>
                        <TableCell>{record.attendance_percent.toFixed(1)}%</TableCell>
                        <TableCell>{record.previous_scores}</TableCell>
                        <TableCell>
                          <span className={`font-semibold ${
                            record.exam_score >= 35 ? 'text-green-600' :
                            record.exam_score >= 25 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {record.exam_score.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(record.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-slate-600">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, data.total)} of {data.total} records
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-2 px-4">
                    <span className="text-sm font-medium">
                      Page {currentPage} of {data.totalPages}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(data.totalPages, p + 1))}
                    disabled={currentPage === data.totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Score vs Attendance */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <CardTitle>Exam Score vs Attendance</CardTitle>
              </div>
              <CardDescription>
                Relationship between attendance percentage and exam performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScoreVsAttendanceChart />
            </CardContent>
          </Card>

          {/* Chart 2: Study & Sleep Scatter */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <CardTitle>Study & Sleep Impact</CardTitle>
              </div>
              <CardDescription>
                Average scores by hours studied and hours slept
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StudySleepScatterChart />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete student record {studentToDelete}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="container mx-auto py-6 text-center text-slate-600">
          <p className="text-sm">
            Demo application showcasing <span className="font-semibold text-blue-600">CSV Gateway</span> API capabilities
          </p>
          <p className="text-xs mt-2 text-slate-500">
            Transform your CSV files into production-ready REST APIs instantly
          </p>
        </div>
      </footer>
    </div>
  );
}

