FROM alpine:edge

# Installs latest Chromium (77) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      npm \
      tor

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV NODE_ENV production

# Create app directory
WORKDIR /app

# Copy app artifacts and dependencies
COPY ./core ./core 
COPY ./handlers ./handlers
COPY ./helpers ./helpers
COPY ./services ./services
COPY ./utils ./utils
COPY ./index.js .
COPY ./package.json .
COPY ./urls.txt .

RUN npm install

CMD ["node", "index" ,"--color=16m"]