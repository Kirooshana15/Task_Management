import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import type { RequestStatus, ServiceType } from "@/data/mockData";
import CreateWorkItemModal from "@/components/CreateWorkItemModal";

const statusColor: Record<string, string> = {
  Draft: "bg-secondary text-secondary-foreground",
  Submitted: "bg-blue-500/10 text-blue-500",
  "Under Review": "bg-amber-500/10 text-amber-500",
  Approved: "bg-emerald-500/10 text-emerald-500",
  Rejected: "bg-rose-500/10 text-rose-500",
  Completed: "bg-emerald-500/20 text-emerald-600 border-emerald-500/20",
};

const serviceIcon: Record<string, string> = {
  Website: "🌐", Marketing: "📣", Branding: "🎨",
};

const RequestsList = () => {
  const { requests } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReq, setSelectedReq] = useState<string | null>(null);

  const filteredRequests = requests.filter(req => 
    req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10 pt-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search requests..." 
            className="pl-10 h-11 w-80 bg-card/50" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRequests.map((req, i) => (
            <motion.div 
              key={req.id} 
              layout
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }} 
              className="card-static p-6 flex flex-col group hover:border-primary/50 transition-all duration-300 relative"
            >
              {req.status === "Approved" && (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute top-4 right-4 w-8 h-8 rounded-full border border-border/50 hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); setSelectedReq(req.id); }}
                  title="Add Delivery Task"
                >
                  <Plus size={16} />
                </Button>
              )}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                  {serviceIcon[req.serviceType]}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor[req.status]}`}>
                  {req.status}
                </span>
              </div>
              
              <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors leading-tight">{req.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">{req.description}</p>
              
              <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest font-mono">
                  <FileText className="w-3 h-3 text-primary/60" /> {req.displayId}
                </div>
                <div className="px-3 py-1 rounded-full bg-muted/30 border border-border/50 text-[10px] font-bold uppercase tracking-wider overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">
                  {req.clientName}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <CreateWorkItemModal 
        isOpen={!!selectedReq} 
        onOpenChange={(open) => !open && setSelectedReq(null)}
        defaultRequestId={selectedReq || undefined} 
      />
    </div>
  );
};

export default RequestsList;
