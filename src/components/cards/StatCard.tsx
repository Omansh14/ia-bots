interface StatCardProps {
  value: number;
  label: string;
}

export const StatCard = ({ value, label }: StatCardProps) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <div className="text-3xl font-bold text-foreground mb-1 text-center">{value}</div>
      <div className="text-sm text-center text-muted-foreground">{label}</div>
    </div>
  );
};