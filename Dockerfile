FROM ubuntu:xenial

# Creating bash configuration file
RUN touch ~/.bashrc

# Installing required system dependencies
RUN apt-get update -y
RUN apt-get install -y --allow-unauthenticated curl wget tor libx11-xcb1 libxcomposite1 libxi6 libxext6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libasound2 libpangocairo-1.0-0 libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0 gnupg 

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

# Installing node and npm
RUN . ~/.bashrc && \
  nvm install v12.16.0 && \
  nvm use v12.16.0

# Create app directory
WORKDIR /app

# Copy app artifacts and dependencies
COPY ./core ./core 
COPY ./handlers ./handlers
COPY ./utils ./utils
COPY ./index.js .
COPY ./package.json .
COPY ./startService.sh .

RUN . ~/.bashrc && npm install

CMD ["sh", "startService.sh"]