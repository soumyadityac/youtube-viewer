```

     '-.                 
        '-. _____     __   __          _         _           __     ___                         
 .-._      |     '.   \ \ / ___  _   _| |_ _   _| |__   ___  \ \   / (_) _____      _____ _ __  
:  ..      |      :    \ V / _ \| | | | __| | | | '_ \ / _ \  \ \ / /| |/ _ \ \ /\ / / _ | '__| 
'-._+      |    .-'     | | (_) | |_| | |_| |_| | |_) |  __/   \ V / | |  __/\ V  V |  __| |    
 /  \     .'i--i        |_|\___/ \__,_|\__|\__,_|_.__/ \___|    \_/  |_|\___| \_/\_/ \___|_|    
/    \ .-'_/____\___
    .-'  :          :
                        
```

## Introduction

A modern (and portable) approach to inflating view counts in Youtube - using [Puppeteer](https://pptr.dev/),  [TOR](https://www.torproject.org/) rotating proxies and [Docker](https://www.docker.com/).

> **Disclaimer:** This project is intended for informational/educational purposes only. I strictly recommend against using it to artificially inflate video view counts for monetary benefits and/or other use cases that goes against the Youtube Policies & Guidelines and/or the law of the land.

## Prerequisites

 1. Install [Docker Engine](https://docs.docker.com/engine/install/)
 2. Install [Docker Compose](https://docs.docker.com/compose/install/)
 3. Clone the repo (or download it).
 4. Copy the video urls to `urls.txt` file (**Note**: A line may contain a single URL only)

## Build & Run Steps

The following commands will help create a docker image, build the app and run it -

```console
~$ docker-compose build
~$ docker-compose up --scale ytview=5
```
    
  If you happen to have *npm* in your system, you can also choose to run the app via -

```console
~$ npm run build 
~$ npm start ytview=5
```

## Fine tuning for performance

### Concepts: 

 - **Batch**: Browser instances running in parallel.
 - **Batch Count**: Number of parallel browser instances to run.
 - **View Action**: This represents a single browser instance picking up a fixed number of urls from the pool and visiting them sequentially.
 - **View Action Count**: A single browsing session will watch these many videos sequentially.
 - **Total Count** - Total number of view actions. Ensure this number is exactly divisible by **Batch Count** for optimal resource utilisation.
 - **View Duration** - Average duration in seconds of a single view in view action. Actual view duration will be +/- 16.6% of this number.

You may choose to alter the above params in `utils/constants/index.js` for fine tuning according to your needs. 

Also, the above commands runs 5 docker containers in parallel (which will translate to 5 x **Batch Count** number of Chromium instances running simultaneously) . Adjust this according to how capable your system is.
