import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

// Οι φωτογραφίες είναι τοπικές (public/), οπότε δεν χρειάζονται remotePatterns
const nextConfig: NextConfig = {}

export default withNextIntl(nextConfig)
