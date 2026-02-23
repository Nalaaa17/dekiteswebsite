"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { removeFromCart } from "@/lib/actions/cart";
import { toast } from "sonner";

export default function RemoveFromCartButton({ cartId }: { cartId: string }) {
    const [loading, setLoading] = useState(false);

    const handleRemove = async () => {
        setLoading(true);
        const res = await removeFromCart(cartId);
        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.message || "Gagal menghapus kamar");
        }
        setLoading(false);
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={loading}
            className="text-slate-400 hover:text-red-500 hover:bg-red-50"
        >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
        </Button>
    );
}
