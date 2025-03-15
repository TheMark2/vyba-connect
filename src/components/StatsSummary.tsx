
import { cn } from "@/lib/utils";

interface StatsItemProps {
  count: string;
  label: string;
  className?: string;
}

const StatsItem = ({ count, label, className }: StatsItemProps) => {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <span className="text-5xl md:text-6xl lg:text-7xl font-black">{count}</span>
      <span className="text-lg md:text-xl font-medium mt-2">{label}</span>
    </div>
  );
};

interface StatsSummaryProps {
  className?: string;
}

const StatsSummary = ({ className }: StatsSummaryProps) => {
  return (
    <section>
      <div className="px-12 md:px-14 lg:px-16 bg-[#F1F0FB]">
        <div className="container mx-auto px-6 md:px-10">
          <div className="flex flex-wrap justify-center gap-10 md:gap-20 lg:gap-32">
            <StatsItem count="1.000" label="Artistas registrados" />
            <StatsItem count="10.000" label="Buscadores registrados" />
            <StatsItem count="5.000" label="Reseñas" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSummary;
