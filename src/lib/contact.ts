import { property } from "@/content/property"

const digits = property.contact.phoneE164.replace(/\D/g, "")

export const contactLinks = {
  tel: `tel:${property.contact.phoneE164}`,
  whatsapp: (text?: string) =>
    `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`,
  /** Το Viber δεν δέχεται προσυμπληρωμένο κείμενο σε συνομιλία — το αντιγράφουμε στο πρόχειρο */
  viber: `viber://chat?number=%2B${digits}`,
}
