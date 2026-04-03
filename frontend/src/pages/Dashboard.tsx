import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  AreaChart, Area
} from "recharts";
import { 
  FileText, CheckCircle2, Clock, 
  ShieldCheck, AlertCircle, 
  TrendingUp, Activity, Plus, Layout
} from "lucide-react";
import { useData } from "@/contexts/DataContext";

const Dashboard = () => {
  const { requests, workItems } = useData();

  const stats = [
    { label: "Total Requests", value: requests.length, icon: FileText, color: "text-primary", bg: "bg-primary/10", trend: "+12%" },
    { label: "Approved Requests", value: requests.filter((r) => r.status === "Approved").length, icon: ShieldCheck, color: "text-success", bg: "bg-success/10", trend: "+5%" },
    { label: "Pending Work Items", value: workItems.filter((w) => w.status !== "Done").length, icon: Clock, color: "text-warning", bg: "bg-warning/10", trend: "-2%" },
    { label: "Completed Work", value: requests.filter((r) => r.status === "Completed").length, icon: CheckCircle2, color: "text-info", bg: "bg-info/10", trend: "+18%" },
  ];

  const distributionData = [
    { name: "Approved", value: requests.filter(r => r.status === "Approved").length, color: "hsl(var(--clr-sage))" },
    { name: "Under Review", value: requests.filter(r => r.status === "Under Review").length, color: "hsl(var(--warning))" },
    { name: "Submitted", value: requests.filter(r => r.status === "Submitted").length, color: "hsl(var(--clr-navy))" },
    { name: "Completed", value: requests.filter(r => r.status === "Completed").length, color: "hsl(var(--success))" },
  ].filter(d => d.value > 0);

  const trendData = useMemo(() => {
    const data = [];
    const now = new Date();
    
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      
      const reqCount = requests.filter(r => r.createdAt && r.createdAt.startsWith(dateStr)).length;
      const doneCount = workItems.filter(w => w.status === "Done" && w.updatedAt && w.updatedAt.startsWith(dateStr)).length;
      
      data.push({ name: label, requested: reqCount, done: doneCount });
    }
    return data;
  }, [requests, workItems]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pt-2 pb-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-elevated p-6 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-2 py-1 rounded-full uppercase tracking-wider">
                <TrendingUp className="w-3 h-3" /> {stat.trend}
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black font-display tracking-tight leading-none">{stat.value}</h3>
              <span className="text-xs text-muted-foreground font-mono">items</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Area Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-static p-8 h-[400px] flex flex-col"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Delivery Velocity
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Comparison of requested services vs. completed work items</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-primary" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Requested</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-muted-foreground" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Done</span>
             </div>
          </div>
        </div>
        
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border)/0.3)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700}} 
              />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-elevated)',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="requested" 
                stroke="hsl(var(--primary))" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorReq)" 
                animationDuration={2000}
                name="Requested"
              />
              <Area 
                type="monotone" 
                dataKey="done" 
                stroke="hsl(var(--muted-foreground))" 
                strokeWidth={3}
                strokeDasharray="10 5"
                fillOpacity={1} 
                fill="url(#colorDone)" 
                animationDuration={2500}
                name="Completed"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

        {/* distribution chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card-static p-8 flex flex-col h-[400px]"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> Request Distribution
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Lifecycle status overview</p>
            </div>
          </div>
          
          <div className="flex-1 w-full relative">
            {distributionData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground italic text-sm">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '16px',
                      boxShadow: 'var(--shadow-elevated)',
                      color: 'hsl(var(--foreground))'
                    }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                    stroke="none"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        className="transition-all duration-300 hover:opacity-100 opacity-80 cursor-pointer"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;
