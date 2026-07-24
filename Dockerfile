FROM node:24-slim AS build

WORKDIR /app
RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .
RUN pnpm build
RUN pnpm run story:build && mv build/stories build/client/stories
RUN pnpm prune --prod --ignore-scripts

FROM node:24-slim

WORKDIR /app
ENV NODE_ENV=production

# Trust Cloudflare's origin root CA so Parliament Watch can call the politigraph origin
ADD https://developers.cloudflare.com/ssl/static/origin_ca_rsa_root.pem /etc/ssl/cloudflare-origin-ca.pem
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/cloudflare-origin-ca.pem

COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

EXPOSE 3000
CMD ["node", "build"]
