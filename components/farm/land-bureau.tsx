"use client"

import { useFarm } from "@/contexts/farm-context"
import { LAND_TIERS, formatMs } from "@/lib/farm-types"
import { usePurchase } from "@/lib/pi-payment"
import { useState } from "react"

export function LandBureau() {
  const { state, leaseLand, isLandActive } = useFarm()
  const { makePurchase } = usePurchase()
  const [busy, setBusy] = useState<string | null>(null)
  const now = Date.now()

  const handleLease = async (tierId: string, costPi: number) => {
    if (costPi === 0) {
      leaseLand(tierId)
      return
    }
    setBusy(tierId)
    try {
      // Pi payment for paid land tiers (uses lifeline/land product as placeholder)
      await makePurchase("farm_revive")
      leaseLand(tierId)
    } catch (e) {
      // payment cancelled or unavailable — do not lease
      console.log("[v0] land lease payment failed", e)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-4">
      <header className="text-center">
        <h2 className="text-xl font-bold text-primary text-glow-gold">ديوان الأراضي</h2>
        <p className="text-xs text-muted-foreground">استأجر الأراضي لتوسعة مزرعتك الملكية</p>
      </header>

      <div className="space-y-3">
        {LAND_TIERS.map((tier) => {
          const lease = state.leases.find((l) => l.id === tier.id)
          const active = isLandActive(tier.id)
          const count = state.assets.filter((a) => a.landId === tier.id && !a.dead).length
          const expired = lease?.leased && !active

          return (
            <div
              key={tier.id}
              className={`rounded-xl border-2 p-4 ${
                active ? "border-secondary/50 glow-mint bg-card" : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    {tier.id === "royal" ? "👑" : tier.id === "pasha" ? "🏛️" : tier.id === "estate" ? "🌾" : "🏘️"}
                    {tier.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{tier.blurb}</p>
                  {active && (
                    <p className="text-[11px] text-secondary mt-1 font-semibold">
                      {count}/{tier.cap} أصل
                      {lease?.expiresAt
                        ? ` • تنتهي خلال ${formatMs(lease.expiresAt - now)}`
                        : " • دائم"}
                    </p>
                  )}
                  {expired && (
                    <p className="text-[11px] text-destructive mt-1 font-semibold">
                      انتهى الإيجار — الإنتاج متوقف! جدّد الآن.
                    </p>
                  )}
                </div>
                <div className="text-left shrink-0">
                  <div className="text-primary font-bold">
                    {tier.costPi === 0 ? "مجاني" : `${tier.costPi} π`}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{tier.period}</div>
                </div>
              </div>

              {active && !expired ? (
                <div className="mt-3 text-center text-xs font-bold text-secondary">✓ مُفعّلة</div>
              ) : (
                <button
                  disabled={busy === tier.id}
                  onClick={() => handleLease(tier.id, tier.costPi)}
                  className="mt-3 w-full bg-primary text-primary-foreground font-bold rounded-lg py-2.5 text-sm disabled:opacity-50 active:scale-95 transition-transform"
                >
                  {busy === tier.id
                    ? "جارٍ الدفع عبر باي..."
                    : expired
                      ? "تجديد الإيجار"
                      : tier.costPi === 0
                        ? "تفعيل مجاني"
                        : `استئجار بـ ${tier.costPi} باي`}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
