import type { StockNews } from "@/lib/schemas/financial-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, ExternalLink } from "lucide-react";

interface RecentNewsProps {
  news: StockNews[];
  limit?: number;
}

export function RecentNews({ news, limit = 6 }: RecentNewsProps) {
  const displayNews = news.slice(0, limit);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-muted-foreground" />
          Recent News
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayNews.map((item, i) => (
            <a
              key={i}
              href={item.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 group hover:bg-accent rounded-md p-2 -mx-2 transition-colors"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  className="w-14 h-10 object-cover rounded shrink-0"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{item.site}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    {item.publishedDate.split("T")[0]}
                  </span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
