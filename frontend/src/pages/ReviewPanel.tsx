import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useData } from "@/contexts/DataContext";
import { type RequestStatus, type ServiceType } from "@/data/mockData";
import { Search, Filter, Pencil, FileText, Save, CheckCircle2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const statusColor: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  Submitted: "bg-info/10 text-info",
  "Under Review": "bg-warning/10 text-warning",
  Approved: "bg-success/10 text-success",
  Rejected: "bg-destructive/10 text-destructive",
  Completed: "bg-emerald-500/10 text-emerald-500",
};

// Transition Rule Map
const transitionMap: Record<RequestStatus, RequestStatus[]> = {
  Draft: ["Draft", "Submitted"],
  Submitted: ["Submitted", "Under Review"],
  "Under Review": ["Under Review", "Approved", "Rejected"],
  Approved: ["Approved", "Completed"],
  Rejected: ["Rejected", "Under Review"], // Allow re-review if needed
  Completed: ["Completed"],
};

const ReviewPanel = () => {
  const { requests, workItems, updateRequest, updateRequestStatus } = useData();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Edit State
  const [editFormData, setEditFormData] = useState({
    title: "", clientName: "", serviceType: "" as ServiceType, 
    status: "" as RequestStatus, preferredDeadline: "", description: "", reviewNote: ""
  });

  const selected = requests.find(r => r.id === selectedId) || null;

  useEffect(() => {
    if (selected) {
      setEditFormData({
        title: selected.title,
        clientName: selected.clientName,
        serviceType: selected.serviceType,
        status: selected.status,
        preferredDeadline: selected.preferredDeadline,
        description: selected.description,
        reviewNote: selected.reviewNote || "",
      });
    }
  }, [selectedId]);

  const filtered = requests.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (typeFilter !== "all" && r.serviceType !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.title.toLowerCase().includes(q) && !r.clientName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleUpdateStatus = (id: string, newStatus: RequestStatus) => {
    updateRequestStatus(id, newStatus, editFormData.reviewNote);
    toast.success(`Request ${newStatus}!`, { description: `Status of "${editFormData.title}" has been updated.` });
    setSelectedId(null);
  };

  const handleSaveChanges = () => {
    if (!selectedId) return;
    updateRequest(selectedId, editFormData);
    toast.success("Task Updated!", { description: "Changes have been saved and synchronized." });
    setSelectedId(null);
  };

  return (
    <div className="pt-2">
      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card-static p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search requests..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] h-10"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {(["Draft", "Submitted", "Under Review", "Approved", "Rejected", "Completed"] as RequestStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px] h-10"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {(["Website", "Marketing", "Branding"] as ServiceType[]).map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="card-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["ID", "Title", "Client", "Type", "Deadline", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((req, i) => (
                <motion.tr key={req.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * i }}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4 text-sm font-mono text-muted-foreground">{req.displayId}</td>
                  <td className="px-5 py-4 text-sm font-medium">{req.title}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{req.clientName}</td>
                  <td className="px-5 py-4"><span className="text-xs font-medium px-2.5 py-1 rounded-md bg-muted">{req.serviceType}</span></td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{req.preferredDeadline}</td>
                  <td className="px-5 py-4"><span className={`status-badge ${statusColor[req.status]}`}>{req.status}</span></td>
                  <td className="px-5 py-4">
                    <button onClick={() => setSelectedId(req.id)}
                      className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">No tasks found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-w-2xl bg-card border border-border shadow-2xl p-0 overflow-hidden rounded-[1.25rem]">
          <div className="p-8 border-b border-border/50 bg-primary/5">
            <DialogHeader>
              <DialogTitle className="font-display flex items-center gap-2 text-2xl font-bold tracking-tight">
                <Pencil className="w-5 h-5 text-primary" /> Edit Request — {selected?.displayId}
              </DialogTitle>
              <DialogDescription>Modify the details or status of this service request.</DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#1D2D44] dark:text-white">Request Title</label>
                <Input value={editFormData.title} onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))} className="bg-muted/30 border-none px-4 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#1D2D44] dark:text-white">Client Name</label>
                <Input value={editFormData.clientName} onChange={(e) => setEditFormData(prev => ({ ...prev, clientName: e.target.value }))} className="bg-muted/30 border-none px-4 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#1D2D44] dark:text-white">Service Type</label>
                <Select value={editFormData.serviceType} onValueChange={(v) => setEditFormData(prev => ({ ...prev, serviceType: v as ServiceType }))}>
                  <SelectTrigger className="bg-muted/30 border-none px-4 rounded-xl h-10"><SelectValue /></SelectTrigger>
                  <SelectContent className="glass-panel border-none">
                    {["Website", "Marketing", "Branding"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#1D2D44] dark:text-white">Update Status</label>
                <Select 
                  value={editFormData.status} 
                  onValueChange={(v) => setEditFormData(prev => ({ ...prev, status: v as RequestStatus }))}
                >
                  <SelectTrigger className="bg-muted/30 border-none px-4 rounded-xl h-10 font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent className="glass-panel border-none">
                    {selected && transitionMap[selected.status].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#1D2D44] dark:text-white">Deadline</label>
                <Input type="date" value={editFormData.preferredDeadline} onChange={(e) => setEditFormData(prev => ({ ...prev, preferredDeadline: e.target.value }))} className="bg-muted/30 border-none px-4 rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#1D2D44] dark:text-white">Description</label>
              <Textarea value={editFormData.description} onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))} rows={4} className="bg-muted/30 border-none px-4 py-3 rounded-xl resize-none" />
            </div>

            <div className="space-y-2 pt-4 border-t border-border/50">
              <label className="text-xs font-bold uppercase tracking-widest text-[#1D2D44] dark:text-white">Admin Review Notes</label>
              <Textarea value={editFormData.reviewNote} onChange={(e) => setEditFormData(prev => ({ ...prev, reviewNote: e.target.value }))} placeholder="Add instructions or feedback..." rows={3} className="bg-muted/30 border-none px-4 py-3 rounded-xl resize-none" />
            </div>

            <div className="flex gap-4 pt-6 border-t border-border/50">
              <Button 
                onClick={handleSaveChanges} 
                className="flex-1 h-12 font-bold rounded-xl shadow-xl shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98] focus-visible:ring-1"
                style={{ background: "#1D2D44", color: "#D4D4CE" }}
              >
                <Save className="w-4 h-4 mr-2" /> Save All Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewPanel;
