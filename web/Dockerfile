FROM ubuntu:latest
MAINTAINER Adel Shahrezaei "shadel.shsh@gmail.com"
RUN apt-get update -y
RUN apt-get install -y python-pip python-dev build-essential
COPY . /app
WORKDIR /app
ENV FLASK_APP=app/backend_server.py 
ENV FLASK_DEBUG=1
RUN pip install -r requirements.txt
CMD flask run --host=0.0.0.0

