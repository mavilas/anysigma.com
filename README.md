# anysigma.com

Parking page for anysigma. Built with Astro, Tailwind CSS v4, and Lucide Icons.

## Tech Stack

- **Astro**: Static site generator.
- **Tailwind CSS v4**: Utility-first CSS framework.
- **Lucide Astro**: Icon library.
- **pnpm**: Package manager.
- **Cloudflare Pages**: Deployment platform.

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

## Deployment

The project is configured for Cloudflare Pages.

```bash
# Deploy to Cloudflare (requires wrangler)
pnpm run build && wrangler pages deploy ./dist
```

## License

MIT
