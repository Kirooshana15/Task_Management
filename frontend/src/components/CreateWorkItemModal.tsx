import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { type Priority } from "@/data/mockData";
import { toast } from "sonner";
import { Calendar } from "lucide-react";

interface CreateWorkItemModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRequestId?: string;
}

const CreateWorkItemModal = ({ isOpen, onOpenChange, defaultRequestId }: CreateWorkItemModalProps) => {
  const { users } = useAuth();
  const { requests, addWorkItem } = useData();
  const [formData, setFormData] = useState({
    requestId: defaultRequestId || "",
    title: "",
    assigneeId: "",
    priority: "Medium" as Priority,
    dueDate: "",
  });

  const selectedRequest = requests.find(r => r.id === (formData.requestId || defaultRequestId));
  const approvedRequests = requests.filter(r => r.status === "Approved");
  const deadlineInPast = formData.dueDate && new Date(formData.dueDate) < new Date();

  const handleSubmit = () => {
    const assignee = users.find(u => u.id === formData.assigneeId);
    
    addWorkItem({
      ...formData,
      requestId: formData.requestId || defaultRequestId || "",
    });

    toast.success("Delivery Task Assigned!", {
      description: `${formData.title} → ${assignee?.name}`,
    });
    setFormData({ requestId: defaultRequestId || "", title: "", assigneeId: "", priority: "Medium" as Priority, dueDate: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card border border-border shadow-2xl rounded-[1.25rem]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-bold tracking-tight">Add Internal Task</DialogTitle>
          <DialogDescription>Create a specific work item for an approved service request.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1D2D44] ml-1">Select Service</label>
            <Select 
              value={formData.requestId || defaultRequestId} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, requestId: v }))}
              disabled={!!defaultRequestId}
            >
              <SelectTrigger className="h-11 bg-muted/30 border-none px-4 rounded-xl">
                <SelectValue placeholder="Select approved service" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border shadow-xl rounded-xl">
                {approvedRequests.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.displayId} — {r.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* RELOCATED PROJECT DEADLINE DISPLAY */}
            {selectedRequest && (
              <motion.div 
                initial={{ opacity: 0, y: -4 }} 
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 ml-1"
              >
                <span className="text-[10px] font-bold text-primary flex items-center gap-1.5 bg-primary/5 px-3 py-1 rounded-full border border-primary/10 w-fit">
                  <Calendar className="w-3 h-3" /> Project Deadline: {selectedRequest.preferredDeadline}
                </span>
              </motion.div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1D2D44] ml-1">Task Title</label>
            <Input 
              placeholder="e.g. Design Homepage Mockup" 
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="h-11 bg-muted/30 border-none px-4 rounded-xl" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1D2D44] ml-1">Assignee</label>
              <Select 
                value={formData.assigneeId} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, assigneeId: v }))}
              >
                <SelectTrigger className="h-11 bg-muted/30 border-none px-4 rounded-xl">
                  <SelectValue placeholder="To Developer" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border shadow-xl rounded-xl">
                  {users.filter(u => u.role === "developer").map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1D2D44] ml-1">Priority</label>
              <Select 
                value={formData.priority} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, priority: v as Priority }))}
              >
                <SelectTrigger className="h-11 bg-muted/30 border-none px-4 rounded-xl">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border shadow-xl rounded-xl">
                  {(["Low", "Medium", "High"] as Priority[]).map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1D2D44] ml-1 mb-1 block">Internal Task Due Date</label>
            <Input 
              type="date" 
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="h-11 bg-muted/30 border-none px-4 rounded-xl" 
            />
            {deadlineInPast && (
              <p className="text-[10px] font-bold text-destructive mt-1 px-1 animate-pulse">⚠ Warning: Date is in the past</p>
            )}
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!formData.title || !formData.assigneeId || !formData.dueDate || !!deadlineInPast}
            className="w-full h-12 font-bold text-lg shadow-xl shadow-primary/20 mt-4 rounded-xl transition-all hover:opacity-90 active:scale-[0.98] !opacity-100 disabled:bg-[#1D2D44]/60 disabled:cursor-not-allowed"
            style={{ background: "#1D2D44", color: "#D4D4CE" }}
          >
            Create Internal Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkItemModal;
