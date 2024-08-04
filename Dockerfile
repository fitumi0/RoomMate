# - - - - - - - - - - - - #
#        Backend          #
# - - - - - - - - - - - - #
FROM node:18 AS backend

WORKDIR /app/backend

COPY backend/package*.json ./
COPY types ../types

RUN npm install

COPY backend .

RUN npm run build

CMD ["npm", "start"]

# - - - - - - - - - - - - #
#        Frontend         #
# - - - - - - - - - - - - #

FROM node:18 AS frontend

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend .

RUN npm run build

# - - - - - - - - - - - - #
#        Full Image       #
# - - - - - - - - - - - - #

FROM node:18

WORKDIR /app

COPY --from=backend /app/backend .

COPY --from=frontend /app/frontend/build ./build

RUN npm install --production

CMD ["npm", "start"]