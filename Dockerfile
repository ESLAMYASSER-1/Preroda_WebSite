FROM node:18-bullseye

WORKDIR /APP

COPY ./package.json ./

RUN apt-get update && apt-get install -y python3 python3-pip
RUN npm install

# COPY ./models ./
# COPY ./public ./
# COPY ./uploads ./
# COPY ./views ./
# COPY ./app.js ./
# COPY ./logSignPage.html ./
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
