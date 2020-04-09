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

# Create app directory
WORKDIR /app

# Copy app artifacts and dependencies
COPY ./core ./core 
COPY ./handlers ./handlers
COPY ./utils ./utils
COPY ./index.js .
COPY ./package.json .
COPY ./startService.sh .

RUN npm install

CMD ["sh", "startService.sh"]