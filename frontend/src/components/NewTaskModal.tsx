import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Save, Send } from "lucide-react";
import type { ServiceType } from "@/data/mockData";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";

interface NewTaskModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewTaskModal = ({ isOpen, onOpenChange }: NewTaskModalProps) => {
  const { addRequest } = useData();
  const [formData, setFormData] = useState({
    clientName: "", serviceType: "" as ServiceType | "", title: "", description: "", preferredDeadline: "",
  });

  const update = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));
  const deadlineInPast = formData.preferredDeadline && new Date(formData.preferredDeadline) < new Date();

  const handleSubmit = () => {
    addRequest({
      ...formData,
      serviceType: formData.serviceType as ServiceType,
      status: "Submitted",
    });
    toast.success("Service Request Created!", {
      description: `${formData.clientName}: ${formData.title}`,
    });
    setFormData({ clientName: "", serviceType: "" as ServiceType | "", title: "", description: "", preferredDeadline: "" });
    onOpenChange(false);
  };

  const handleSaveDraft = () => {
    addRequest({
      ...formData,
      serviceType: formData.serviceType as ServiceType || "Website",
      status: "Draft",
    });
    toast.info("Draft Saved", {
      description: "Your request has been saved as a draft locally."
    });
    setFormData({ clientName: "", serviceType: "" as ServiceType | "", title: "", description: "", preferredDeadline: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border border-border shadow-2xl p-0 overflow-hidden rounded-[1.25rem]">
        <div className="p-8 border-b border-border/50 bg-primary/5">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold tracking-tight">Create Service Request</DialogTitle>
            <DialogDescription>Fill in the details below to initiate a new service request.</DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#1D2D44] ml-1">Client Name</label>
              <Input 
                placeholder="e.g. Acme Corp" 
                value={formData.clientName} 
                onChange={(e) => update("clientName", e.target.value)} 
                className="h-11 bg-muted/30 border-none px-4 rounded-xl" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#1D2D44] ml-1">Service Type</label>
              <Select value={formData.serviceType} onValueChange={(v) => update("serviceType", v)}>
                <SelectTrigger className="h-11 bg-muted/30 border-none px-4 rounded-xl"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent className="bg-card border border-border shadow-xl rounded-xl">
                  {(["Website", "Marketing", "Branding"] as ServiceType[]).map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#1D2D44] ml-1">Request Title</label>
            <Input 
              placeholder="Brief title for the request" 
              value={formData.title} 
              onChange={(e) => update("title", e.target.value)} 
              className="h-11 bg-muted/30 border-none px-4 rounded-xl" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#1D2D44] ml-1">Requirements Description</label>
            <Textarea 
              placeholder="Describe the service requirements in detail..." 
              value={formData.description}
              onChange={(e) => update("description", e.target.value)} 
              rows={4}
              className="bg-muted/30 border-none px-4 py-3 rounded-xl resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#1D2D44] ml-1 flex items-center gap-2">
              <CalendarDays className="w-4 h-4" /> Preferred Deadline
            </label>
            <Input 
              type="date" 
              value={formData.preferredDeadline} 
              onChange={(e) => update("preferredDeadline", e.target.value)} 
              className="h-11 bg-muted/30 border-none px-4 rounded-xl w-full sm:w-auto" 
            />
            {deadlineInPast && (
              <p className="text-[10px] font-bold text-destructive mt-2 px-1 animate-pulse">⚠ Warning: Deadline is in the past</p>
            )}
          </div>

          <div className="flex gap-4 pt-6 border-t border-border/50">
            <Button variant="outline" className="flex-1 h-12 font-bold rounded-xl border-dashed hover:border-primary/50" onClick={handleSaveDraft}>
              <Save className="w-4 h-4 mr-2" /> Save Draft
            </Button>
            <Button 
              className="flex-1 h-12 font-bold rounded-xl shadow-xl shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98] !opacity-100 disabled:bg-[#1D2D44]/60 disabled:cursor-not-allowed" 
              onClick={handleSubmit}
              disabled={!!deadlineInPast || !formData.title || !formData.clientName}
              style={{ background: "#1D2D44", color: "#D4D4CE" }}
            >
              <Send className="w-4 h-4 mr-2" /> Submit Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskModal;
