"use client"

import { useState } from "react"
import { useFarm } from "@/contexts/farm-context"
import { ASSETS, MARKET_FEE, assetDef } from "@/lib/farm-types"
import { ShaheenCaptcha } from "./shaheen-captcha"

export function Marketplace() {
  const { state, buyAsset, unlistListing } = useFarm()
  const [tab, setTab] = useState<"buy" | "shop">("buy")
  const [pending, setPending] = useState<null | { defId: string; price: number; listingId?: string }>(null)
  const [toast, setToast] = useState("")

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2200)
  }

  const confirmBuy = () => {
    if (!pending) return
    const total = Math.ceil(pending.price * (1 + MARKET_FEE))
    const ok = buyAsset(pending.defId, total, pending.listingId)
    showToast(ok ? "تم الشراء عبر الضمان بنجاح!" : "رصيد غير كافٍ أو لا توجد أرض متاحة")
    setPending(null)
  }

  return (
    <div className="space-y-4">
      <header className="text-center">
        <h2 className="text-xl font-bold text-primary text-glow-gold">سوق المقايضة الآمن</h2>
        <p className="text-xs text-muted-foreground">تداول عبر سجل الضمان — سمسرة 2% على كل صفقة</p>
      </header>

      <div className="flex gap-2 bg-card rounded-xl p-1">
        <TabBtn active={tab === "buy"} onClick={() => setTab("buy")} label="عروض اللاعبين" />
        <TabBtn active={tab === "shop"} onClick={() => setTab("shop")} label="متجر الأصول" />
      </div>

      {tab === "buy" ? (
        <div className="space-y-2">
          {state.listings.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">لا توجد عروض حالياً</p>
          )}
          {state.listings.map((l) => {
            const total = Math.ceil(l.price * (1 + MARKET_FEE))
            return (
              <div key={l.id} className="flex items-center gap-3 bg-card rounded-xl border border-border p-3">
                <div className="text-3xl">{l.emoji}</div>
                <div className="flex-1">
                  <div className="font-bold text-foreground text-sm">{l.assetName}</div>
                  <div className="text-[11px] text-muted-foreground">البائع: {l.seller}</div>
                  <div className="text-[11px] text-secondary">
                    {l.price} + سمسرة = {total} عملة
                  </div>
                </div>
                {l.mine ? (
                  <button
                    onClick={() => unlistListing(l.id)}
                    className="text-xs font-bold text-destructive border border-destructive/40 rounded-lg px-3 py-2"
                  >
                    سحب
                  </button>
                ) : (
                  <button
                    onClick={() => setPending({ defId: l.defId, price: l.price, listingId: l.id })}
                    className="bg-primary text-primary-foreground text-xs font-bold rounded-lg px-3 py-2 active:scale-95"
                  >
                    شراء
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {ASSETS.map((a) => {
            const total = Math.ceil(a.basePrice * (1 + MARKET_FEE))
            return (
              <div key={a.id} className="bg-card rounded-xl border border-border p-3 text-center">
                <div className="text-4xl mb-1 animate-floaty">{a.emoji}</div>
                <div className="font-bold text-foreground text-sm">{a.name}</div>
                <div className="text-[11px] text-secondary mb-2">{total} عملة</div>
                <button
                  onClick={() => setPending({ defId: a.id, price: a.basePrice })}
                  className="w-full bg-primary text-primary-foreground text-xs font-bold rounded-lg py-2 active:scale-95"
                >
                  شراء
                </button>
              </div>
            )
          })}
        </div>
      )}

      {pending && (
        <ShaheenCaptcha onVerified={confirmBuy} onCancel={() => setPending(null)} />
      )}

      {toast && (
        <div className="fixed bottom-24 inset-x-0 flex justify-center z-[70] px-4">
          <div className="bg-secondary text-secondary-foreground text-sm font-bold rounded-full px-4 py-2 glow-mint">
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}

function TabBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-lg py-2 text-sm font-bold transition-colors ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
      }`}
    >
      {label}
    </button>
  )
}
