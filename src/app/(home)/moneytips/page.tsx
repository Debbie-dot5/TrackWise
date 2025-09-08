"use client"

import { moneyTips } from "@/lib/moneydata"



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MoneyTipsPage() {
  

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-purple-bg to-deep-purple-bg p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Money Tips</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {moneyTips.length === 0 ? (
          <p className="text-muted-foreground">No tips available.</p>
        ) : (
          moneyTips.map((tip) => (
            <Card
              key={tip.id}
              className="shadow-lg rounded-xl bg-card text-card-foreground border border-border hover:bg-vibrant-pink transition-colors transform transition-transform duration-200 hover:scale-105 hover:shadow-xl"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground capitalize">{tip.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{tip.tip}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}