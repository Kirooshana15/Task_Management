import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Eye, ArrowRight, MessageSquare, Flag, Send } from "lucide-react";
import type { WorkItemStatus, Priority } from "@/data/mockData";
import { toast } from "sonner";

const statusConfig: Record<WorkItemStatus, { icon: typeof Clock; bg: string; text: string }> = {
  Todo: { icon: Clock, bg: "bg-muted", text: "text-muted-foreground" },
  "In Progress": { icon: ArrowRight, bg: "bg-info/10", text: "text-info" },
  Review: { icon: Eye, bg: "bg-warning/10", text: "text-warning" },
  Done: { icon: CheckCircle2, bg: "bg-success/10", text: "text-success" },
};

const priorityColor: Record<Priority, string> = {
  Low: "text-muted-foreground", Medium: "text-info", High: "text-destructive",
};

const DeveloperBoard = () => {
  const { user } = useAuth();
  const { requests, workItems, updateWorkItemStatus, addWorkItemNote } = useData();
  const [newNotes, setNewNotes] = useState<Record<string, string>>({});

  // Filter items assigned to current developer
  const myItems = workItems.filter((w) => w.assigneeId === user?.id);

  const handleStatusChange = (id: string, newStatus: WorkItemStatus) => {
    updateWorkItemStatus(id, newStatus);
    toast.success("Status Updated", { description: `Task ${id} moved to ${newStatus}` });
  };

  const handleAddNote = (id: string) => {
    const note = newNotes[id];
    if (!note) return;
    addWorkItemNote(id, note);
    setNewNotes({ ...newNotes, [id]: "" });
    toast.success("Note Added", { description: "Your progress has been recorded." });
  };

  return (
    <div className="pt-2">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold">My Work Board</h1>
        <p className="text-muted-foreground mt-1">Your assigned tasks and progress</p>
      </motion.div>

      {myItems.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="card-static p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-lg mb-1">All clear!</h3>
          <p className="text-muted-foreground text-sm">No work items assigned to you right now.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {myItems.map((item, i) => {
            const request = requests.find((r) => r.id === item.requestId);
            const config = statusConfig[item.status];
            const Icon = config.icon;

            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }} className="card-elevated p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground/90 font-bold">{item.displayId}</span>
                      <span className="text-xs text-muted-foreground">from {request?.title || "Unknown Request"}</span>
                    </div>
                    <h3 className="font-display font-bold text-lg leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
                  </div>
                  <div className={`status-badge ${config.bg} ${config.text}`}>
                    <Icon className="w-3.5 h-3.5" /> {item.status}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6 text-xs font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/30 border border-border/50">
                    <Flag className={`w-3.5 h-3.5 ${priorityColor[item.priority]}`} />
                    <span className="text-muted-foreground">{item.priority}</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/30 border border-border/50 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" /> Due: {item.dueDate}
                  </span>
                </div>

                {/* Status Update */}
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Progress:</span>
                  <Select value={item.status} onValueChange={(v) => handleStatusChange(item.id, v as WorkItemStatus)}>
                    <SelectTrigger className="w-[160px] h-9 bg-card border-none shadow-inner">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-none">
                      {(["Todo", "In Progress", "Review", "Done"] as WorkItemStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" /> Notes
                  </h4>
                  {item.notes.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {item.notes.map((note: any, ni) => (
                        <div key={ni} className="text-sm bg-muted/30 border border-border/10 rounded-xl px-4 py-3 shadow-sm relative group/note">
                          <div className="text-[10px] uppercase font-bold text-primary/40 mb-1">{note.addedBy?.name || "System Update"}</div>
                          <div className="italic text-muted-foreground leading-relaxed">"{note.text}"</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3 mt-4">
                    <Textarea 
                      placeholder="Share progress updates or blockers..." 
                      rows={2}
                      value={newNotes[item.id] || ""} 
                      onChange={(e) => setNewNotes({ ...newNotes, [item.id]: e.target.value })}
                      className="flex-1 bg-muted/30 border-none px-4 py-3 rounded-xl resize-none text-sm" 
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleAddNote(item.id)}
                      disabled={!newNotes[item.id]}
                      className="self-end h-11 px-4 font-bold shadow-lg shadow-primary/20"
                    >
                      <Send className="w-4 h-4 mr-2" /> Add
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DeveloperBoard;
