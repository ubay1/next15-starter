# --- Base ---
  FROM node:20-alpine AS base
  WORKDIR /app
  COPY package.json npm-lock.yaml ./
  RUN npm install -g npm && npm install
  
  # --- Build Stage ---
  FROM base AS build
  COPY . .
  RUN npm run build
  
  # --- Production Stage ---
  FROM node:20-alpine AS production
  WORKDIR /app
  COPY --from=build /app/.next .next
  COPY --from=build /app/public ./public
  COPY --from=build /app/package.json ./package.json
  COPY --from=build /app/npm-lock.yaml ./npm-lock.yaml
  RUN npm install -g npm && npm install --prod
  
  EXPOSE 3002
  CMD ["npm", "start"]
  