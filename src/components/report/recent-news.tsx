import type { StockNews } from "@/lib/schemas/financial-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, ExternalLink } from "lucide-react";

interface RecentNewsProps {
  news: StockNews[];
  limit?: number;
}

function SentimentBadge({ sentiment }: { sentiment?: string }) {
  if (!sentiment) return null;
  const s = sentiment.toLowerCase();
  const classMap: Record<string, string> = {
    positive: "bg-success/10 text-success",
    bullish: "bg-success/10 text-success",
    negative: "bg-destructive/10 text-destructive",
    bearish: "bg-destructive/10 text-destructive",
  };
  const cls = classMap[s] ?? "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${cls}`}>
      {sentiment}
    </span>
  );
}

export function RecentNews({ news, limit = 6 }: RecentNewsProps) {
  const displayNews = news.slice(0, limit);

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-muted-foreground" />
          Recent News
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {displayNews.map((item, i) => (
            <a
              key={i}
              href={item.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 px-6 py-3.5 transition-colors hover:bg-muted/50"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  className="w-14 h-10 object-cover rounded-md shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                  <ExternalLink className="inline-block ml-1.5 h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity align-middle" />
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-muted-foreground">{item.site}</span>
                  <span className="text-xs text-muted-foreground">&middot;</span>
                  <span className="text-xs text-muted-foreground">
                    {item.publishedDate.split("T")[0]}
                  </span>
                  {(item as any).sentiment && (
                    <SentimentBadge sentiment={(item as any).sentiment} />
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
