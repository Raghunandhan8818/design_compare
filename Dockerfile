FROM python:3.9

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY requirements.txt /usr/src/app/
RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y
RUN pip install --no-cache-dir -r requirements.txt
ADD DeepImageSearch.py /usr/local/lib/python3.9/site-packages/DeepImageSearch/
RUN rm -rf /usr/src/app/DeepImageSearch.py
COPY . /usr/src/app