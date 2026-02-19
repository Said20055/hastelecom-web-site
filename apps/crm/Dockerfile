FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
COPY package.json ./
COPY apps/crm/package.json ./apps/crm/package.json
COPY packages/db/package.json ./packages/db/package.json
RUN npm install --include=dev


FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p apps/crm/public
RUN npm run prisma:generate -w @hastelecom/db && npm run build -w @hastelecom/crm

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/crm/.next/standalone ./
COPY --from=builder /app/apps/crm/.next/static ./apps/crm/.next/static
COPY --from=builder /app/apps/crm/public ./apps/crm/public
EXPOSE 3000
CMD ["node", "server.js"]
