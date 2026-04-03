import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  CheckCircle2, Clock, Eye, ArrowRight, 
  Flag, User, MoreVertical, Search,
  Filter, Plus, Info, Layout, PlusCircle
} from "lucide-react";
import type { WorkItemStatus, Priority, WorkItem } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CreateWorkItemModal from "@/components/CreateWorkItemModal";

const statusConfig: Record<WorkItemStatus, { icon: typeof Clock; bg: string; text: string; lightBg: string; description: string }> = {
  Todo: { 
    icon: Clock, 
    bg: "bg-muted", 
    text: "text-muted-foreground", 
    lightBg: "bg-muted/30",
    description: "The task has been created but no one has started working on it yet."
  },
  "In Progress": { 
    icon: ArrowRight, 
    bg: "bg-info/10", 
    text: "text-info", 
    lightBg: "bg-info/5",
    description: "Someone is actively working on the task right now. It's been assigned and work has begun."
  },
  Review: { 
    icon: Eye, 
    bg: "bg-warning/10", 
    text: "text-warning", 
    lightBg: "bg-warning/5",
    description: "The work is done but needs to be checked — a teammate, manager, or client needs to look it over and give feedback or approval before it's considered finished."
  },
  Done: { 
    icon: CheckCircle2, 
    bg: "bg-success/10", 
    text: "text-success", 
    lightBg: "bg-success/5",
    description: "The task is fully complete and approved. No further action needed."
  },
};

const priorityConfig: Record<Priority, { color: string; bg: string }> = {
  Low: { color: "text-muted-foreground", bg: "bg-muted/10" },
  Medium: { color: "text-info", bg: "bg-info/10" },
  High: { color: "text-destructive", bg: "bg-destructive/10" }, // Use high-impact color for High
};

const WorkItems = () => {
  const { workItems, requests, updateWorkItemStatus, updateWorkItem, addWorkItemNote } = useData();
  const { users, user } = useAuth();
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newNote, setNewNote] = useState("");

  const columns: WorkItemStatus[] = ["Todo", "In Progress", "Review", "Done"];

  // Filter based on role
  const displayItems = user?.role === "developer" 
    ? workItems.filter(item => item.assigneeId === user.id)
    : workItems;

  const handleAddNote = () => {
    if (!selectedItem || !newNote.trim()) return;
    addWorkItemNote(selectedItem.id, newNote);
    setNewNote("");
    // Close modal to refresh or keep open? Usually better to keep open
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col pt-2">
      {/* Header with Title and Add Button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Delivery Board</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {user?.role === "developer" ? "Track and update your assigned internal tasks" : "Manage all internal work items across projects"}
          </p>
        </div>
        {user?.role !== "developer" && (
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="font-bold gap-2 shadow-lg shadow-primary/20 rounded-xl h-11 px-6 transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-5 h-5" /> Add Internal Task
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
        <div className="flex gap-6 h-full min-w-[1000px]">
          {columns.map((status) => (
            <div key={status} className="flex-1 min-w-[280px] flex flex-col h-full bg-muted/20 rounded-2xl border border-border/50">
              {/* Column Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${statusConfig[status].text.replace('text-', 'bg-')}`} />
                  <h3 className="font-display font-bold text-sm uppercase tracking-widest">{status}</h3>
                  <span className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded-md text-muted-foreground">
                    {displayItems.filter(item => item.status === status).length}
                  </span>
                </div>
                <div title={statusConfig[status].description} className="cursor-help transition-opacity opacity-20 hover:opacity-100">
                  <Info className="w-4 h-4 text-primary" />
                </div>
              </div>

              {/* Column Content */}
              <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {displayItems
                    .filter((item) => item.status === status)
                    .map((item) => {
                      const request = requests.find(r => r.id === item.requestId);
                      const assignee = users.find(u => u.id === item.assigneeId);
                      
                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          onClick={() => setSelectedItem(item)}
                          className="card-elevated p-4 cursor-pointer group hover:border-primary/50 transition-all border-transparent"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityConfig[item.priority].bg} ${priorityConfig[item.priority].color} uppercase tracking-wider`}>
                              {item.priority}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground/80 font-bold">{item.displayId}</span>
                          </div>
                          
                          <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors mb-2">{item.title}</h4>
                          <p className="text-[10px] text-muted-foreground mb-4 font-medium uppercase tracking-tight">Project: {request?.title || "Unknown"}</p>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-border/50">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                                {assignee?.name.charAt(0)}
                              </div>
                              <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[80px]">{assignee?.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground/30">
                              <Info className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Details Modal */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-md bg-card border border-border rounded-[1.25rem] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2 text-[#1D2D44]">
              <Layout className="w-5 h-5 shrink-0" /> 
              {(user?.role !== "developer" && selectedItem?.status === "Todo") ? (
                <Input 
                  value={selectedItem?.title || ""} 
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setSelectedItem({...selectedItem!, title: newTitle});
                    updateWorkItem(selectedItem!.id, { title: newTitle });
                  }}
                  className="h-8 font-bold border-none shadow-none focus-visible:ring-0 px-1 text-lg bg-transparent hover:bg-muted/50 transition-colors"
                />
              ) : (
                <span>{selectedItem?.title}</span>
              )}
            </DialogTitle>
            <DialogDescription>Viewing delivery task — {selectedItem?.displayId}</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-[#1D2D44] mb-1 uppercase tracking-widest font-bold">Priority</p>
                  {(user?.role !== "developer" && selectedItem.status === "Todo") ? (
                    <Select value={selectedItem.priority} onValueChange={(v) => { updateWorkItem(selectedItem.id, { priority: v as Priority }); setSelectedItem({...selectedItem, priority: v as Priority}); }}>
                      <SelectTrigger className={`h-8 w-full bg-muted/50 border-none px-2 rounded-lg text-xs font-bold ${priorityConfig[selectedItem.priority].color}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Low", "Medium", "High"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className={`font-bold ${priorityConfig[selectedItem.priority].color}`}>{selectedItem.priority}</span>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[#1D2D44] mb-1 uppercase tracking-widest font-bold">Assignee</p>
                  {(user?.role !== "developer" && selectedItem.status === "Todo") ? (
                    <Select value={selectedItem.assigneeId} onValueChange={(v) => { updateWorkItem(selectedItem.id, { assigneeId: v }); setSelectedItem({...selectedItem, assigneeId: v}); }}>
                      <SelectTrigger className="h-8 w-full bg-muted/50 border-none px-2 rounded-lg text-xs font-bold text-[#1D2D44]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {users.filter(u => u.role === "developer").map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-bold text-[#1D2D44]">{
                      users.find(u => u.id === selectedItem.assigneeId)?.name || "Unassigned"
                    }</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[#1D2D44] mb-1 uppercase tracking-widest font-bold">Due Date</p>
                  {(user?.role !== "developer" && selectedItem.status === "Todo") ? (
                    <Input type="date" value={selectedItem.dueDate} onChange={(e) => { updateWorkItem(selectedItem.id, { dueDate: e.target.value }); setSelectedItem({...selectedItem, dueDate: e.target.value}); }} className="h-8 w-full bg-muted/50 border-none px-2 rounded-lg text-xs font-bold text-[#1D2D44]" />
                  ) : (
                    <p className="font-bold text-[#1D2D44]">{selectedItem.dueDate}</p>
                  )}
                </div>
                <div>
                   <p className="text-xs text-[#1D2D44] mb-1 uppercase tracking-widest font-bold">Status</p>
                   {user?.role === "developer" ? (
                     <Select value={selectedItem.status} onValueChange={(v) => { updateWorkItemStatus(selectedItem.id, v as WorkItemStatus); setSelectedItem({...selectedItem, status: v as WorkItemStatus}); }}>
                       <SelectTrigger className="h-8 w-full bg-muted/50 border-none px-2 rounded-lg text-xs font-bold text-[#1D2D44]">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent className="bg-card border border-border shadow-xl rounded-xl">
                         {columns.map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                       </SelectContent>
                     </Select>
                   ) : (
                     <p className="h-8 flex items-center px-2 bg-muted/20 border-none rounded-lg text-xs font-bold text-muted-foreground">{selectedItem.status}</p>
                   )}
                </div>
              </div>
              
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-[#1D2D44] mb-3 uppercase tracking-widest font-bold">Activity Logs</p>
                
                {/* Add Progress Note (New Feature) */}
                {user?.role === "developer" && (
                  <div className="flex gap-2 mb-4">
                    <Input 
                      placeholder="Add progress note..." 
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="h-9 text-xs bg-muted/30 border-none rounded-lg"
                    />
                    <Button 
                      size="sm" 
                      onClick={handleAddNote}
                      className="h-9 px-3 text-[10px] font-bold uppercase rounded-lg"
                      style={{ background: "#1D2D44", color: "#D4D4CE" }}
                    >
                      Post Update
                    </Button>
                  </div>
                )}

                {selectedItem.notes.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No progress notes recorded yet.</p>
                ) : (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                    {[...selectedItem.notes].reverse().map((note: any, i) => (
                      <div key={i} className="text-xs p-3 bg-muted/30 rounded-xl border border-border/10 text-[#1D2D44] font-medium leading-relaxed">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-primary/60">
                            {note.addedBy?.name || "System"}
                          </span>
                        </div>
                        {note.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Work Item Modal */}
      <CreateWorkItemModal 
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />
    </div>
  );
};

export default WorkItems;
